/* ── homepage treatment accordion ─────────────────────────── */
(function(){
  var stage = document.getElementById('svcStage');
  var panel = document.getElementById('svcPanel');
  if (!stage || !panel) return;

  var BOOK = 'treatments.html';   /* our own menu, not a third-party page */
  var DATA = {
    facials: {label:'Facial Treatments', items:[
      ['Phenomenal Deep Glow Facial','$170'],['Hydrafacial Treatment','$175'],
      ['Golden Dew Hydration Facial','$270'],['Dermaplaning with Ultra Glow','$350'],
      ['Nano RevitaGlow Infusion','$290'],['Traditional Lymphatic Facial','$360'],
      ['Gua Sha Sculpting Facial','$180'],['Skin Clarity Chemical Peel','$180+']
    ], more:'facials', note:'Thirteen protocols in all'},
    lift: {label:'HIFU Lift & Sculpt', items:[
      ['Phenomenal HIFU Lift','$350'],['Lift & Sculpt Duo — HIFU + LDM','$550'],
      ['Plasma Pen Skin Tightening','$300']
    ], more:'lift', note:'No scalpel, no downtime, no second trip'},
    headspa: {label:'Head Spa Rituals', items:[
      ['Japanese Head Spa','$120'],['Korean Head Spa','$140'],
      ['Premium Asian Scalp Ritual','$180']
    ], more:'headspa', note:'Tokyo and Seoul traditions, ten minutes from you'},
    body: {label:'Body & The Lounge', items:[
      ['Luminous Body Scrub','$80'],['Clear Radiance Back Facial','$260'],
      ['Wood Therapy Sculpting','$150+'],['Afternoon Tea Party','$100']
    ], more:'body', note:'Includes our private tea lounge · ideal for two or more'}
  };

  var cards = Array.prototype.slice.call(stage.querySelectorAll('.svc'));

  function render(d){
    panel.innerHTML =
      '<button class="p-close" type="button" aria-label="Close"></button>' +
      '<p class="p-eyebrow">' + d.label + '</p>' +
      '<div class="p-scroll">' +
      d.items.map(function(i){
        /* no per-row fade: a staggered reveal leaves the panel looking empty
           if anything delays it, and the prices are the point */
        return '<div class="p-row"><b>' + i[0] + '</b><span>' + i[1] + '</span></div>';
      }).join('') +
      '</div>' +
      '<div class="p-foot"><p>' + d.note +
        (d.more ? ' &middot; <a class="p-more" href="treatments.html#' + d.more + '">See the full menu</a>' : '') + '</p>' +
      '<a class="btn btn-gold" href="' + BOOK + '" target="_blank" rel="noopener">See the full menu</a></div>';
  }

  function open(key){
    var d = DATA[key]; if (!d) return;

    /* column pinning and FLIP belong to the desktop layout only — on a phone
       the stage is one column and pinning invents phantom tracks */
    var wide = innerWidth > 900;
    var first = wide ? cards.map(function(c){ return c.getBoundingClientRect().left; }) : null;

    render(d);
    var col = 2, activeIndex = 0;
    cards.forEach(function(c, i){
      var active = c.dataset.key === key;
      if (active) activeIndex = i;
      c.classList.toggle('is-active', active);
      c.classList.toggle('is-out', !active);
      c.style.gridColumn = wide ? (active ? '1' : String(col++)) : '';
      c.style.gridRow = wide ? '1' : '';
      /* on a phone every card keeps its place and the panel slots in after
         the tapped one — hiding the others is what made the card jump */
      c.style.order = wide ? '' : String(i * 2);
    });
    panel.style.gridColumn = wide ? '2 / -1' : '';
    panel.style.gridRow = wide ? '1' : '';
    panel.style.order = wide ? '' : String(activeIndex * 2 + 1);
    stage.classList.add('is-open');

    if (!wide) return;
    /* measure the new positions, then play the difference back as motion */
    var last = cards.map(function(c){ return c.getBoundingClientRect().left; });
    cards.forEach(function(c, i){
      var dx = first[i] - last[i];
      if (!dx) return;
      c.style.transition = 'none';
      c.style.transform  = 'translateX(' + dx + 'px)';
    });
    void stage.offsetWidth;                 /* flush, so the next frame animates */
    requestAnimationFrame(function(){
      cards.forEach(function(c){
        c.style.transition = '';            /* hand back to the CSS easing */
        c.style.transform  = '';            /* .is-out supplies its own drift */
      });
    });
  }

  function close(){
    var wide = innerWidth > 900;
    var first = wide ? cards.map(function(c){ return c.getBoundingClientRect().left; }) : null;

    stage.classList.remove('is-open');
    panel.style.gridColumn = '';
    panel.style.gridRow = '';
    cards.forEach(function(c){
      c.classList.remove('is-active','is-out');
      c.style.gridColumn = '';
      c.style.gridRow = '';
      c.style.order = '';
      c.style.transform = '';
    });
    panel.style.order = '';

    if (!wide) return;
    var last = cards.map(function(c){ return c.getBoundingClientRect().left; });
    cards.forEach(function(c, i){
      var dx = first[i] - last[i];
      if (!dx) return;
      c.style.transition = 'none';
      c.style.transform  = 'translateX(' + dx + 'px)';
    });
    void stage.offsetWidth;
    requestAnimationFrame(function(){
      cards.forEach(function(c){ c.style.transition = ''; c.style.transform = ''; });
    });
  }

  stage.addEventListener('click', function(e){
    var cta = e.target.closest('.svc-open');
    if (cta){ e.preventDefault(); open(cta.dataset.key); return; }
    if (e.target.closest('.p-close')){ close(); return; }
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();

/* ── cookie consent ───────────────────────────────────────── */
(function(){
  var KEY = 'pa-consent';
  /* if storage is unavailable we still ask — we just can't remember the answer */
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch(e){}
  if (stored) return;

  var el = document.createElement('div');
  el.className = 'consent';
  el.setAttribute('role','dialog');
  el.setAttribute('aria-label','Cookie preferences');
  el.innerHTML =
    '<p>We use essential cookies to run this site, and optional ones to understand how it is used. ' +
    'You choose. Read our <a href="privacy.html">Privacy Policy</a>.</p>' +
    '<div class="consent-actions">' +
      '<button class="btn btn-quiet" type="button" data-consent="essential">Reject All</button>' +
      '<button class="btn btn-gold" type="button" data-consent="all">Accept All</button>' +
    '</div>';
  document.body.appendChild(el);
  /* let the hero land before asking anything — the banner covers it otherwise */
  setTimeout(function(){ el.classList.add('in'); }, 1400);

  el.addEventListener('click', function(e){
    var b = e.target.closest('[data-consent]');
    if (!b) return;
    try { localStorage.setItem(KEY, b.dataset.consent); } catch(err){}
    el.classList.remove('in');
    setTimeout(function(){ el.remove(); }, 600);
    /* analytics, when the client adds it, should check localStorage['pa-consent'] === 'all' */
    document.dispatchEvent(new CustomEvent('consentchange',{detail:b.dataset.consent}));
  });
})();

/* ── mobile menu ──────────────────────────────────────────── */
(function(){
  var btn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  function setOpen(open){
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function(){
    setOpen(!document.body.classList.contains('menu-open'));
  });
  /* a chosen destination closes the menu before the page turns */
  menu.addEventListener('click', function(e){ if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setOpen(false); });
  addEventListener('resize', function(){ if (innerWidth > 820) setOpen(false); });
})();

/* ── sticky bar: today's date ─────────────────────────────── */
(function(){
  var el = document.querySelector('[data-avail]');
  if (!el) return;
  var DAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var d = new Date();
  /* once we have closed, the next bookable day is tomorrow */
  if (d.getHours() >= 19) d = new Date(d.getTime() + 864e5);
  el.textContent = DAY[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()];
})();

/* ── accordions: one open at a time, closed gently ────────── */
(function(){
  var groups = [].concat(
    [].slice.call(document.querySelectorAll('.faq-list')),
    [].slice.call(document.querySelectorAll('#faq .wrap, .faq-sec .wrap'))
  );
  groups.forEach(function(group){
    var items = [].slice.call(group.querySelectorAll(':scope > details'));
    if (items.length < 2) return;
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if (!d.open) return;
        items.forEach(function(other){
          if (other !== d && other.open) other.open = false;   /* CSS eases the close */
        });
      });
    });
  });
})();

/* ── review rows: seamless drift ──────────────────────────── */
(function(){
  var tracks = document.querySelectorAll('.review-track');
  if (!tracks.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* clones exist only for the desktop loop; on a phone the rails are swiped
     by hand, so duplicating every review just doubles the distance travelled */
  if (innerWidth <= 860) return;

  /* each rail needs a second copy to travel through; the clones are hidden
     from assistive tech and from search so no review is counted twice */
  Array.prototype.forEach.call(tracks, function(track){
    var clone = track.cloneNode(true);
    Array.prototype.forEach.call(clone.children, function(c){ c.setAttribute('aria-hidden','true'); });
    while (clone.firstChild) track.appendChild(clone.firstChild);
  });
})();
