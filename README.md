# Phoenix Global Logistics

Responsive marketing website for an Australian family-owned freight and logistics business, based on the existing Phoenix Figma design system.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open `/prototypes/phoenix/` for the six-page Figma prototype. Use `?page=why&compare=motion` to compare carousel transitions.

## Production build

```sh
npm run build
npm run preview
```

`dist/` contains 14 prerendered pages, a 404 page, local fonts and assets, a sitemap and robots.txt. A static host can serve the generated directory indexes directly. Use `404.html` for missing routes; preserve the generated service subdirectories rather than rewriting all paths to the homepage.

## Included

- Homepage with the Phoenix quick-tools component, services, process, FBA, quality, coverage and FAQs.
- Seven service pages, About, Contact, Tracking, Mandarin overview and website privacy.
- Responsive navigation, keyboard-accessible tabs, native form validation and reduced-motion support.
- Quote enquiries prepared as emails, with a review screen, correct transport/import recipient and copy fallback.
- Tracking-link assistance using a consignment reference. No fabricated shipment events.
- Page titles, descriptions, canonical URLs and static HTML for search engines.

## Design source

[Phoenix Figma design system](https://www.figma.com/design/AgfefB97t2koQ3XcFNZV6W/Logistic-Website---Phoenix-Design?node-id=0-1).

Tokens: `src/tokens.css`. Source style guide: `17:78`; header: `17:521`; quick tools: `17:537`; service card: `17:467`. Exported logo variants and eight icons are in `public/assets/`. Photography comes from the supplied Phoenix brief, converted to WebP for the website.

## Before public launch

- Supply the Phoenix-specific public Transvirtual link/widget configuration to enable direct shipment-status lookup. Current tracking guides users to their existing link or prepares a support email.
- To send enquiries inside the website, connect a server-side email service. The current flow opens the visitor's email app and clearly states that the enquiry has not yet been sent.
- Confirm published business information, service descriptions, contact addresses, ABN and any future numeric performance claims.
- Review the Mandarin overview with the business and approve the website privacy wording for the eventual hosting and email setup.
- Set the final canonical origin in `src/metadata.ts` and the social-image URL in `index.html` if the production domain changes.
- Inventory old URLs and add redirects before replacing an existing website. No domain, DNS, hosting or third-party account changes have been made.

No credentials from source documents are included in this repository.
