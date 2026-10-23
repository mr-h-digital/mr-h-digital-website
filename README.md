# MRH Digital Website

Welcome to the MRH Digital website project! This repository contains the source code and assets for the official website of MRH Digital, designed to showcase our digital solutions, services, and portfolio.

## 🚀 Project Overview
This project is a modern, responsive website built with HTML, CSS, and JavaScript. It features a clean design, interactive elements, and optimized assets for fast loading and a great user experience.

## 📁 Project Structure
```
index.html           # Main HTML file
assets/              # Fonts, icons, and other assets
css/
  styles.css         # Main stylesheet
images/              # Image assets
js/
  script.js          # Main JavaScript file
```

## ✨ Features
- Responsive design for all devices
- Modern UI/UX
- Fast loading and optimized assets
- Easy to customize and extend
- Organized project structure

## 🛠️ Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mrhdigital-website.git
   ```
2. **Navigate to the project folder:**
   ```bash
   cd mrhdigital-website/mrhdigital
   ```
3. **Open `index.html` in your browser** to view the website locally.

## 📦 Dependencies
This project uses only vanilla HTML, CSS, and JavaScript. No external dependencies are required.

## AudEx product website

The dedicated AudEx (Audit Excellence) product website lives in `audex/` and is linked from the main site's desktop/mobile navigation, portfolio and footer. Publish that directory with the rest of this website to serve it at `https://www.mrhdigital.co.za/audex/`. The application itself remains at `https://audex.mrhdigital.co.za/`.

See `audex/README.md` for preview instructions, content boundaries and maintenance notes.

## Features retained from the hosted website

The homepage includes the original coding-workspace hero video and Client Zone entry points, while retaining this repository's SEO metadata, structured data and AudEx product links.

- **Hero video:** streams the same original Pexels footage from external URLs; it is not bundled in this repository. At first load, screens up to 900px use the 640 x 360 version (approximately 1.7 MB), and larger screens use 1280 x 720 (approximately 8.9 MB), instead of the original 29.3 MB UHD file. Resizing does not force another download. The dark overlay, grid and glow keep the text readable and remain in place if playback is unavailable. A visible control pauses, plays or retries the background video. Reduced-motion and browser data-saving preferences disable automatic loading/playback; visitors can explicitly opt in. Playback pauses when the hero leaves view or the tab is hidden. JavaScript is required for video loading; without it, the static hero remains usable.
- **Client Zone:** desktop navigation, mobile navigation and footer link directly to `https://mr-h-digital.github.io/mrh-invoice-ui/`, the separate existing invoice application. The portal's functionality remains owned by that application; this website does not implement or duplicate it.

The contact form already matches the original site's WhatsApp enquiry flow and is preserved. The homepage video remains dependent on the external media provider's availability and transfer size; check the footage's current usage terms before changing its distribution.

## Selected-work showroom and case studies

The homepage leads with three flagship stories: TVECO, the Rock Mission ecosystem, and AudEx. `work/index.html` is the filterable project collection. Dedicated case studies live in `work/tveco/`, `work/rock-mission/`, and `work/audex/`. Publish the entire `work` directory with `css/work.css`, `js/work.js` and `images/work/`; no build step, API, iframe or server-side routing is needed on GitHub Pages.

Branding, design and development credits for TVECO, its portal, the five Rock Mission projects and AudEx reflect the creator's confirmed scope. Descriptions intentionally avoid unverified technologies, private functionality, testimonials or performance outcomes. “Ecosystem” describes the shared organisation and product family, not shared authentication or backend integration.

`images/work/` contains optimized WebP captures of real public pages from October 2026: TVECO, Rock Mission, Kingdom Drip, Rockidz and The Armory. Refresh these when a public design changes. The Armory's correct address is `https://learn.rockmission.co.za/`. Any figures or example progress visible inside captures are part of those sites' own public content, not measured portfolio outcomes.

TVECO portal, Rock Ledger and AudEx UI illustrations are explicitly labelled, contain no private data, and are not passed off as screenshots. No sign-in or private account was accessed to produce this showcase. Retain these boundaries when replacing visuals; use only authorised, sanitised previews of private tools.

The homepage ecosystem selector supports arrow keys, Home and End; without JavaScript the ministry preview and direct links remain available, and the complete five-product story is readable on its case-study page. Gallery filters progressively enhance eight static project cards. Native links, contact actions and case studies work without JavaScript. Reduced-motion settings preserve static presentation. Cardy's and WPC remain in a separate “more work” collection, with WPC labelled in development.

### Responsive layout maintenance

Check all six pages (`/`, `/work/`, the three case studies and `/audex/`) with the actual Google display fonts loaded, as well as fallback fonts. Wide Syne headings need wrapping and grid children must be allowed to shrink; hidden body overflow alone does not prevent clipped text. Flagship previews stack at 1000px, and the AudEx story avoids double-padded mobile content. On phones, illustrative AudEx notes and disclaimers flow below the phone rather than overlapping it. Keep primary mobile navigation controls and footer links at least 44px tall, and allow product footer links and hero proof points to wrap.

Include 320px phones, tablet breakpoint boundaries (700/701px and 900/901px), desktop layouts, enlarged text and short landscape screens when checking changes. Exercise both mobile menus, all ecosystem/product tabs, gallery filters, open FAQs and the contact form; check text inside cards as well as document-level horizontal scrolling. The static site has no build step.

Reduced-motion styles explicitly reveal `.fade-up` content: disabling its reveal animation must not leave services, pricing or contact sections transparent. The product site's expanded mobile menu scrolls within short viewports rather than trapping its final links below the screen.

## 🖼️ Screenshots
<!-- Add screenshots or GIFs of your website here -->

## 🤝 Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact
For questions or collaboration, reach out at [contact@mrhdigital.com](mailto:contact@mrhdigital.com).

---

> Made with ❤️ by MRH Digital
