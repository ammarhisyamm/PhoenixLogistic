# Phoenix Global Logistics website

Marketing website for Phoenix Global Logistics, an Australian family-owned freight and logistics company (Sydney and Melbourne).

It's a plain static site: HTML, one stylesheet and one small script, no build step. Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages or ordinary web hosting) and it works.

## Pages

| Path | What it is |
| --- | --- |
| `index.html` | English site: services, process, tracking, Amazon FBA, quality, capacity, about, China partners, quote form and contact |
| `zh/index.html` | Simplified Chinese version for partners and customers in China |

## Run it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Before going live

These are set in `assets/js/main.js` under `CONFIG`:

- **`trackingUrl`**: the public Transvirtual tracking page for a consignment, with `{consignment}` where the number goes. Until it's set, the Track buttons tell customers to email their consignment number instead.
- **`quoteEndpoint`**: a form service that accepts a JSON POST (for example Formspree). Until it's set, the quote form prepares an email to `import@phoenixgloballogistics.com.au` with the details filled in.

Content to confirm with the business:

- Client names and logos: none are published yet. There's a marked spot in the "Who we work with" section for approved logos.
- Phone number, WeChat ID and Melbourne address: not in the brief, so they're not on the site.
- The Amazon wording describes Phoenix as a carrier Amazon *lists* for small-parcel deliveries, which matches Amazon's Seller Central notice. Amazon states it doesn't endorse carriers, so avoid "official" or "recommended" claims.

## Brand

- Colours: Phoenix red `#e31b24`, charcoal `#232022` / `#3f3c3d`, warm stone `#f5f2f1`, white.
- Type: two fonts only. Oswald Bold for headlines and big numbers, Inter for everything else (Regular for body, Medium for buttons and labels). Both load from Google Fonts. Chinese text falls back to the system CJK font (PingFang SC, Microsoft YaHei), since neither font has Chinese glyphs.
- Motion: one entrance style (fade + 24px rise on a strong ease-out), photos unveil on scroll, big numbers count up once. All of it switches off for visitors who ask for reduced motion.
- Logo: `assets/img/logo.png` (light backgrounds) and `assets/img/logo-white.png` (dark backgrounds), both cut from the supplied logo PDF.

## Structure

```
index.html
zh/index.html
favicon.ico
assets/
  css/styles.css
  js/main.js
  img/           photos from the company deck and brief, logos
  favicon.png
  apple-touch-icon.png
```
