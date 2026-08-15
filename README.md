# Phenomenal Aesthetic Medical & Wellness Spa — Website

Concept site for Phenomenal Aesthetic Medical & Wellness Spa, 16101 Ventura Blvd,
Suite 155, Encino, CA 91436.

Built by **Reptify Media, LLC** — [reptifymedia.com](https://reptifymedia.com)

## Running it

Pure static HTML, CSS and JavaScript. No build step, no dependencies, no framework.
Open `index.html` in any browser, or serve the folder.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Home |
| `treatments.html` | Full treatment menu with pricing |
| `why-us.html` | Positioning, first visit, care team |
| `visit.html` | Location, hours, map |
| `faq.html` | Questions, with FAQPage schema |
| `privacy.html` / `terms.html` | Legal |
| `style.css` | All styling |
| `main.js` | Reveals, accordion, mobile menu, consent |
| `images/` | Self-hosted photography |
| `fonts/` | Self-hosted woff2 (Marcellus, Cormorant Garamond, Jost) |

## Before launch — required

1. **Medical Director** — replace the `MD` placeholder in the Medical Oversight
   section with the real physician's name, photograph and verified credentials.
   Marked with `DEMO PLACEHOLDER` comments.
2. **Care team** — replace the RN / LE / MT placeholder cards on `why-us.html`
   with real staff.
3. **Payment methods** — `paymentAccepted` in the homepage structured data is an
   assumption (cash, Visa, Mastercard, Amex, Discover, Apple Pay). Confirm with the
   owners or delete the line: search engines and AI assistants quote it as fact.
4. **Analytics** — any tracking must be gated on `localStorage['pa-consent'] === 'all'`
   so the cookie banner is honest rather than decorative.
5. **Canonicals** — `sitemap.xml`, `robots.txt` and the `<link rel="canonical">`
   tags point at `phenomenalaestheticspa.com`; confirm before going live.

## Performance

Measured on the homepage at 375px:

| | |
|---|---|
| Requests | 7 |
| Transferred | 345 KB |
| First contentful paint | ~100 ms (local) |

- The hero is served at 900px to phones and 1600px to desktops via a media query,
  so a phone never downloads the large plate.
- Photographs are sized to their display box; the closing CTA band sits under a
  76% dark gradient so it uses a low-detail crop.
- Fonts are preloaded above the structured data, which is otherwise ~15KB of head
  the preload scanner would read through first.
- Every image carries intrinsic `width`/`height`, so nothing reflows on load.

## Findability (SEO / AEO / GEO)

- `MedicalSpa` entity on every page sharing one `@id`, with address, geo, hours,
  services with prices, service area, aggregate rating and named reviews.
- `FAQPage` on the homepage (4 questions) and `faq.html` (8), `ItemList` of 13
  priced `Service` objects on `treatments.html`, `BreadcrumbList` on inner pages.
- `robots.txt` explicitly admits GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
  Google-Extended and Applebot-Extended.
- Titles are 39–55 characters and descriptions 139–153, so neither is truncated in
  a result. Prices appear as literal text, not images, so they can be quoted.

## Notes

- Pricing mirrors the GlossGenius booking menu as of August 2026.
- Photography is the client's own, self-hosted rather than hotlinked.
- Typefaces are self-hosted woff2, latin subset, 84KB total. No Google Fonts
  request, so no third-party dependency and no font swap on load.
- Stem cell copy is deliberately claim-free and consultation-gated.
