# AudEx product website

Standalone, mobile-first marketing website for **AudEx (Audit Excellence)**, designed and developed by Mr. H Digital. Source lives in this dedicated directory; no app or API code is changed.

## Preview and publish

This is a static HTML/CSS/JavaScript website with no build step or runtime dependencies. Preview with any local static web server from the parent website directory and visit `/audex/`. Opening `index.html` directly also works.

Publish the **entire `audex` directory**, including `assets`, alongside the main website's `index.html`. The public product URL is `https://www.mrhdigital.co.za/audex/`. Existing main navigation, mobile navigation, portfolio and footer links point to this directory. The parent sitemap includes the product page.

The working application remains separate at `https://audex.mrhdigital.co.za/`. The product website does not proxy or embed it and does not need an API connection.

## Content and interactions

- AudEx teal `#0b4d60` and amber `#f29934` come from the app's generated brand tokens. Logo and creator badge assets are copied from `audex-web/public/logo`.
- Purpose-built HTML/CSS interface models are illustrations, **not screenshots**. All displayed sites, scores and dashboard figures are labelled sample data. Do not represent these as customer evidence.
- The three-step product explorer supports mouse, touch and keyboard, with arrow keys, Home and End. Its mini checklist is an in-memory demonstration only: it never stores or sends responses and does not calculate a compliance result.
- FAQs use native disclosure elements and work without JavaScript. Core product content, contact links and the desktop navigation also remain available without JavaScript.
- Contact buttons open an email draft or WhatsApp using the main website's existing contact details. No lead form, analytics, cookies or backend has been added.
- Google Fonts supplies DM Sans and Manrope with system fallbacks. The site remains usable if those requests fail.
- Motion honours the device's reduced-motion setting.

## Maintaining product accuracy

Features were checked against `audex-web/README.md`, `shared/template.json`, the scoring implementation and the app branding. Keep this site's claims aligned with future app changes. In particular:

- Load the app online once before offline use.
- Drafts remain device-local; connected accounts can sync finalised audits, sites and training records across the same account's devices. There is no inter-account sharing.
- Account/server configuration is required for sync; offline storage is not a backup.
- PDF images need to be cached before offline export.
- AudEx supports housekeeping assessment, not regulatory certification.
- Do not add prices, endorsements, measured savings or guarantees without substantiation.

Keep the canonical URL, structured data, social metadata and parent sitemap consistent if the deployment address changes. `assets/social-preview.png` is the 1200 x 630 sharing image; PNG is intentional for broad social-crawler compatibility. Other brand artwork uses the app's existing WebP exports, except install/favicon PNGs.
