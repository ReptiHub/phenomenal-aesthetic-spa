/* ── concierge: answers from the same FAQ the AI receptionist is trained on ──
   The 31KB question set is fetched on first open, never on page load, so the
   widget costs nothing to a visitor who ignores it. */
(function(){
  var PHONE = '(424) 372-4033';
  var BOOK  = 'treatments.html';
  var FAQ   = null;                    /* filled on first open */
  var busy  = false;

  var STOP = ' a an and are as at be by can do does for from get have how i in is it like me my need of on or our take that the their there they this to us want was we what when where which why will with you your '.split(' ');

  /* ── matching ───────────────────────────────────────────────── */
  function norm(s){
    return s.toLowerCase().replace(/[^a-z0-9$ ]+/g,' ').replace(/\s+/g,' ').trim();
  }
  /* crude singular: "closes" and "close" must count as the same word */
  function stem(t){ return t.length > 3 && t.slice(-1) === 's' ? t.slice(0,-1) : t; }
  function tokens(s){
    return norm(s).split(' ').filter(function(t){
      return t.length > 1 && STOP.indexOf(t) === -1;
    }).map(stem);
  }

  /* how people actually ask, mapped to the words the menu uses */
  var ALIAS = {
    cheapest:'least expensive', cheap:'least expensive', affordable:'least expensive',
    budget:'least expensive', lowest:'least expensive',
    dearest:'most expensive', priciest:'most expensive',
    close:'hour open', closing:'hour open', time:'hour open', late:'hour open',
    laser:'laser resurfacing hair removal', ipl:'laser resurfacing',
    relaxing:'stressed exhausted head spa', relax:'stressed exhausted head spa',
    stress:'stressed exhausted head spa', destress:'stressed exhausted head spa',
    friend:'group two', group:'group two', couple:'group two', party:'group two',
    birthday:'group birthday', bridal:'group bridal',
    pregnant:'pregnant nursing', pregnancy:'pregnant nursing', expecting:'pregnant nursing',
    cost:'much price', price:'much price', pricing:'much price',
    kid:'age minimum', child:'age minimum', teen:'age minimum',
    hurt:'hurt pain', painful:'hurt pain',
    wrinkle:'line', saggy:'laxity sagging', sagging:'laxity',
    jowl:'jawline laxity', tired:'tired dull',
    refund:'refund', cancel:'cancellation', reschedule:'cancellation'
  };
  function expand(list){
    var out = list.slice();
    list.forEach(function(t){
      if (ALIAS[t]) ALIAS[t].split(' ').forEach(function(x){
        if (out.indexOf(x) === -1) out.push(x);
      });
    });
    return out;
  }

  function wordsOf(s){
    return norm(s).split(' ').filter(function(t){
      return t.length > 1 && STOP.indexOf(t) === -1;
    }).map(stem);
  }
  function score(qTokens, item){
    if (!item._q){ item._q = wordsOf(item.q); item._a = wordsOf(item.a); }
    var s = 0;
    qTokens.forEach(function(t){
      /* whole-word only: "time" must not match inside "downtime" */
      if (item._q.indexOf(t) > -1) s += 3;
      else if (item._a.indexOf(t) > -1) s += 0.6;
    });
    var qj = ' ' + item._q.join(' ') + ' ';
    for (var i = 0; i < qTokens.length - 1; i++){
      if (qj.indexOf(' ' + qTokens[i] + ' ' + qTokens[i+1] + ' ') > -1) s += 4;
    }
    /* "cheapest" must never land on "most expensive" */
    var qs = qTokens.join(' ');
    if (/least expensive/.test(qs) && /most expensive/.test(item._q.join(' '))) s -= 6;
    if (/most expensive/.test(qs) && /least expensive/.test(item._q.join(' '))) s -= 6;
    /* dividing by the token count punished multi-topic questions like
       "botox and filler", where only one word can ever match */
    return s / Math.sqrt(Math.max(qTokens.length, 1));
  }
  function answer(text){
    var t = expand(tokens(text));
    if (!t.length) return null;
    var best = null, bestScore = 0;
    FAQ.forEach(function(item){
      var s = score(t, item);
      if (s > bestScore){ bestScore = s; best = item; }
    });
    return bestScore >= 1.6 ? best.a : null;
  }

  var FALLBACK = 'That one I\'d like our team to answer for you properly rather than guess. ' +
                 'Leave it with me and we will come back to you — or call ' + PHONE + ', which is ' +
                 'answered at any hour. I can also point you to the full treatment menu.';

  var GREETING = /^(hi|hey|hello|good (morning|afternoon|evening)|yo|sup)\b/i;

  /* ── markup ─────────────────────────────────────────────────── */
  var launcher = document.createElement('button');
  launcher.className = 'chat-launch';
  launcher.type = 'button';
  launcher.setAttribute('aria-label','Chat with Sophia, our booking concierge');
  launcher.innerHTML = '<span class="cl-icon" aria-hidden="true"></span><span class="cl-text">Ask Sophia</span>';

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Chat with Sophia');
  panel.innerHTML =
    '<div class="chat-head">' +
      '<div><p class="chat-eyebrow">Phenomenal Aesthetic</p>' +
      '<p class="chat-title">Sophia</p>' +
      '<p class="chat-status"><i></i>Anniversary specials on now</p></div>' +
      '<button class="chat-close" type="button" aria-label="Close"></button>' +
    '</div>' +
    '<div class="chat-log" id="chatLog" role="log" aria-live="polite"></div>' +
    '<div class="chat-chips" id="chatChips"></div>' +
    '<form class="chat-form" id="chatForm">' +
      '<input class="chat-input" id="chatInput" type="text" autocomplete="off" ' +
        'placeholder="Ask about treatments, pricing or hours" aria-label="Your question">' +
      '<button class="chat-send" type="submit" aria-label="Send"></button>' +
    '</form>' +
    '<p class="chat-foot">Answered any hour &middot; Anything medical goes to a person</p>';

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var log   = panel.querySelector('#chatLog');
  var chips = panel.querySelector('#chatChips');
  var form  = panel.querySelector('#chatForm');
  var input = panel.querySelector('#chatInput');

  var CHIPS = ['What are your anniversary specials?','How much is Botox?','How much are your gift cards?','Can I book now?'];

  function bubble(who, text, opts){
    var el = document.createElement('div');
    el.className = 'chat-msg chat-' + who;
    el.innerHTML = '<p>' + text + '</p>';
    if (opts && opts.cta){
      el.innerHTML += '<a class="chat-cta" href="' + BOOK + '">See the full menu</a>';
    }
    if (opts && opts.specials){
      el.innerHTML += '<a class="chat-cta" href="specials.html">See the anniversary specials</a>';
    }
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderChips(){
    chips.innerHTML = '';
    CHIPS.forEach(function(c){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chat-chip'; b.textContent = c;
      b.addEventListener('click', function(){ ask(c); });
      chips.appendChild(b);
    });
  }

  function thinking(){
    var el = document.createElement('div');
    el.className = 'chat-msg chat-bot chat-typing';
    el.innerHTML = '<p><i></i><i></i><i></i></p>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function ask(text){
    if (busy) return;
    bubble('you', text.replace(/</g,'&lt;'));
    chips.innerHTML = '';
    busy = true;
    var dots = thinking();
    /* a beat before replying — an instant answer reads as a lookup, not a reply */
    setTimeout(function(){
      dots.remove();
      var reply;
      if (GREETING.test(text.trim())){
        reply = 'Good day, and thank you for reaching out. Are you looking to book, ' +
                'or would it help to talk through which treatment fits first?';
      } else {
        reply = answer(text);
      }
      bubble('bot', reply || FALLBACK, {cta: !reply});
      busy = false;
      input.focus();
    }, 480 + Math.random() * 320);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = '';
    ask(v);
  });

  /* ── open and close ─────────────────────────────────────────── */
  var started = false;
  function open(){
    document.body.classList.add('chat-open');
    launcher.setAttribute('aria-expanded','true');
    if (!FAQ){
      fetch('faq.json?v=e24fe4d').then(function(r){ return r.json(); }).then(function(d){
        FAQ = d;
        if (!started) start();
      }).catch(function(){
        FAQ = [];
        if (!started) start();
      });
    } else if (!started) start();
    setTimeout(function(){ if (innerWidth > 820) input.focus(); }, 400);
  }
  function start(){
    started = true;
    bubble('bot','Good day &mdash; I\'m Sophia, the concierge at Phenomenal Aesthetic. We are one year old ' +
                 'this week, and our anniversary specials are running now. Ask me about any treatment or ' +
                 'offer &mdash; I take bookings at any hour, even once the spa has closed.', {specials:true});
    renderChips();
  }
  function close(){
    document.body.classList.remove('chat-open');
    launcher.setAttribute('aria-expanded','false');
    launcher.focus();
  }

  launcher.addEventListener('click', function(){
    document.body.classList.contains('chat-open') ? close() : open();
  });
  panel.querySelector('.chat-close').addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && document.body.classList.contains('chat-open')) close();
  });

  /* ── reveal, once the cookie notice is out of the way ───────── */
  function reveal(){ launcher.classList.add('in'); }
  if (document.querySelector('.consent')){
    document.addEventListener('consentchange', function(){ setTimeout(reveal, 700); });
  } else {
    setTimeout(reveal, 900);
  }
})();
