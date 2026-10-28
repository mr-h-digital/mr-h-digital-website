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
- Contact links open email or WhatsApp at +27 84 541 4102. The AudEx enquiry form sends JSON to `https://audex-api.mrhdigital.co.za/api/contact` using the API's SMTP service; it never embeds mail credentials or uses a third-party form processor. No analytics, marketing subscription or tracking cookies are added. The social handle is not linked without a verified platform URL.
- Google Fonts supplies DM Sans and Manrope with system fallbacks. The site remains usable if those requests fail.
- Motion honours the device's reduced-motion setting.

## Maintaining product accuracy

Position AudEx as independent Mr. H Digital software for healthcare and senior living, serving facility operators, housekeeping managers, independent auditors and cleaning contractors. It is not restricted to a single customer's employees. WPC labels identify existing methodology provenance, not product ownership or an independently validated industry standard. Do not remove source attribution or imply reuse permission/clinical suitability has been established by rebranding. Individual accounts remain separate; do not market contractor/team oversight features that have not been implemented.

Features were checked against `audex-web/README.md`, `shared/template.json`, the scoring implementation and the app branding. Keep this site's claims aligned with future app changes. In particular:

- Load the app online once before offline use.
- Drafts remain device-local; connected accounts can sync finalised audits, sites and training records across the same account's devices. There is no inter-account sharing.
- Account/server configuration is required for sync; offline storage is not a backup.
- PDF images need to be cached before offline export.
- AudEx supports housekeeping assessment, not regulatory certification.
- Do not add unapproved prices, endorsements, measured savings or guarantees without substantiation.
- Approved planned individual pricing is displayed: Solo R199/month or R1,990/year (3 active sites, 1 GB photos), Professional R399/month or R3,990/year (15 active sites, 5 GB). The 14-day trial has 1 site and 100 MB. Prices exclude VAT because Mr. H Digital is not VAT registered. All plans include core features; organisations/teams remain enquiry-only.
- Pricing is explicitly labelled **rollout in preparation**, with enquiry CTAs. Do not replace these with signup/purchase CTAs or publish structured-data purchase offers until the corresponding deployed API/app has verified live email delivery, payment activation, renewal, cancellation and entitlement enforcement.
- Subscription editing works offline for up to seven days from a signed access refresh, bounded by trial/paid expiry. After expiry, data remains readable/exportable and drafts are preserved. Keep these conditions alongside offline claims.
- Acquisition is assisted and subject to availability: request access, confirm suitability/capacity and arrangements, receive account-setup instructions, then complete a profile and start an audit. Email/WhatsApp actions are enquiries only; they do not activate accounts, trials or payments. Existing users follow explicitly labelled sign-in links to the separate hosted app. Customers do not configure its server.
- Plans and roles are independent. Customers normally use Auditor accounts; Solo/Professional change individual site/storage capacity. Admin can view the user directory and suspend/restore Auditors. Only the single platform Owner appoints/removes Admins or manages Admin accounts; Owner is not a facility-owner signup option or purchasable plan. Neither role grants cross-account audit or billing access, team seats or shared reporting. Administration screens never expose passwords.
- Checklist copy deliberately asks visitors to confirm availability in their deployed app rather than promising a deployment not verified by this website. Reduced operational reviews are not certified compliance assessments; all applicable services must be selected and the full baseline remains an option. Historical audit scope is preserved.

Run `node --test tests\audex-content.test.cjs` from the parent directory for access-copy, role-boundary, navigation and enquiry-link regression checks. Also inspect desktop/mobile layouts, the preview, menu and expanded FAQs after content changes.

Keep the canonical URL, structured data, social metadata and parent sitemap consistent if the deployment address changes. `assets/social-preview.png` is the 1200 x 630 sharing image; PNG is intentional for broad social-crawler compatibility. Other brand artwork uses the app's existing WebP exports, except install/favicon PNGs.

### Contact form deployment

Facility types use visible, optional "select all that apply" checkboxes. Selecting Other reveals a required description; the site count is the total across all selected types. The form submits `facilityTypes` and `otherFacilityType`, and the API lists the selections in the enquiry email. Deploy the API version supporting these fields before publishing this website update; users do not need to describe their facility mix in the message.

Enable the API endpoint with `AUDEX_CONTACT_ENABLED=true`, configured SMTP and a verified `AUDEX_MAIL_FROM`; allow the website origin in `AUDEX_ALLOWED_ORIGINS` without removing the app origin. Follow the API README's public-enquiry instructions, including external rate/body limits and privacy/retention responsibilities. Never commit SMTP secrets. The API deliberately returns an error rather than logging enquiries as if delivered when SMTP is unavailable.

Deploy the API first and confirm an enquiry arrives at `info@mrhdigital.co.za` with the visitor's email as Reply-To. Then publish this static directory. The form clears only after a successful JSON acceptance; failures, timeouts, disabled configuration and rate limits keep entries and offer email/WhatsApp alternatives. SMTP acceptance does not guarantee inbox delivery, and retry after an ambiguous failure may duplicate mail. Without JavaScript, the submit action remains disabled and direct contact links are available. The floating WhatsApp link hides while the contact section is visible so it does not obscure form controls.
