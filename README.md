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
3. **Reviews** — swap the rating band for two or three real Google review quotes.
4. **Analytics** — any tracking must be gated on `localStorage['pa-consent'] === 'all'`
   so the cookie banner is honest rather than decorative.
5. **Canonicals** — `sitemap.xml`, `robots.txt` and the `<link rel="canonical">`
   tags point at `phenomenalaestheticspa.com`; confirm before going live.

## Notes

- Pricing mirrors the GlossGenius booking menu as of August 2026.
- Photography is the client's own, self-hosted rather than hotlinked.
- Typefaces are self-hosted woff2, latin subset, 84KB total. No Google Fonts
  request, so no third-party dependency and no font swap on load.
- Stem cell copy is deliberately claim-free and consultation-gated.
