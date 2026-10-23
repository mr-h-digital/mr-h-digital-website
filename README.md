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

The homepage retains Client Zone entry points, SEO metadata, structured data and AudEx product links. Its hero now uses owner-supplied, theme-specific footage instead of the original external coding-workspace video.

- **Hero video:** local files in `media/` follow the resolved Dark / Light / System theme, including OS and cross-tab changes. Both themes play at half speed (`defaultPlaybackRate` and `playbackRate` of `0.5`), including after source changes and retries. Only the matching video is loaded; changing theme unloads the previous clip, and a manual pause remains paused. Screens up to 900px select the mobile source on initial load; resizing does not force another download. Theme-matched WebP posters remain visible until playback starts, including on slow connections, with JavaScript disabled or if playback fails. Translucent, bordered glass panels protect text contrast without backdrop blur, and decorative grids/glows are disabled so the footage stays clear. A visible control pauses, plays or retries the video. Reduced-motion and browser data-saving preferences disable automatic video loading/playback; visitors can explicitly opt in. Playback pauses when the hero leaves view or the tab is hidden.
- **Client Zone:** desktop navigation, mobile navigation and footer link directly to `https://mr-h-digital.github.io/mrh-invoice-ui/`, the separate existing invoice application. The portal's functionality remains owned by that application; this website does not implement or duplicate it.

The contact form already matches the original site's WhatsApp enquiry flow and is preserved.

### Optimised media

The two owner-supplied source videos remain outside this repository. Following visual feedback, desktop files now preserve the original H.264 video streams without re-encoding: original resolution and approximately 30 fps, with no additional compression loss. Mobile clips use centre-cropped portrait compositions instead of enlarging low-resolution landscape encodes into tall screens. All files preserve the full clip duration, omit audio and use MP4 faststart so playback can begin before the complete download. Half-speed playback is applied by the browser, without duplicating frames or enlarging files. Sizes below are decimal MB:

| Theme | Desktop | Mobile | Poster |
|-------|---------|--------|--------|
| Dark | 2560 x 1440, 29.24 MB | 720 x 1280, 18.96 MB | Desktop 187 KB / mobile 137 KB |
| Light | 1920 x 1080, 16.05 MB | 606 x 1080, 5.72 MB | Desktop 15 KB / mobile 3 KB |

This intentionally prioritises visual fidelity over the earlier smaller, softer encodes; full desktop downloads are no longer reduced. Posters, loading only the selected variant, faststart and pausing offscreen still protect the initial experience, but slow connections may buffer. Desktop remuxing uses FFmpeg `-map 0:v:0 -c:v copy -an -movflags +faststart`. Mobile encoding uses `libx264`, preset `slow`, CRF 20, yuv420p and the original frame rate; mobile re-encoding is not lossless. Posters are high-quality WebP frames from one second into each clip, with separate desktop and portrait crops. The `-hq` asset names avoid reuse of earlier cached low-resolution versions. Keep all four MP4s and four posters together when deploying; do not preload both themes.

On-page Cardy's and WPC identities use 260px WebP derivatives for their 65px displays; the founder portrait also uses WebP. These three assets total about 54 KB instead of 625 KB, while existing optimised project captures are unchanged. Original PNG/JPEG files remain available; favicon, Apple icon and social-preview compatibility formats are preserved.

Run `node --test tests\*.test.cjs` for theme and hero playback-state checks. Also exercise actual media playback in both themes on desktop and mobile, including manual pause, offscreen resume, theme changes, reduced motion, data saving and visible retry after network errors.

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

### Portfolio styling and colour themes

The main website, work collection and all three case studies share `css/theme.css`: neutral Mr. H Digital frames, consistent lime actions, borders and text hierarchy. Project branding is contained within real screenshots, illustrative product panels and identity swatches; images are never inverted or recoloured. Keep product-preview colours explicit rather than inheriting the site's light/dark tokens.

Every main-site page has a labelled **Dark / Light / System** selector in its navigation. Dark is the default even on a light operating system. The synchronous `js/theme.js` applies the saved `mrh.theme` preference before body content renders, tracks OS changes only in System mode, and synchronizes preference changes between tabs. Storage failures are reported in a live status message without preventing the current page's theme change. Without JavaScript, the site retains its dark design and hides the unavailable selector. The dedicated `/audex/` product website remains independent and does not load these theme files.

The theme selector progressively enhances the native select with `appearance: base-select`: a rounded, theme-matched popup, 44px option targets, lime selected state and checkmark. Unsupported browsers retain their native picker and keyboard/touch behaviour. Keep the native select rather than replacing it with a scripted menu.

Run `node --test tests\theme.test.cjs` for dependency-free theme behaviour checks. When changing shared colours, inspect both themes on all five main-site pages, all ecosystem panels, mobile navigation, the contact form and project illustrations. In light mode, accessible dark-green text accents are separate from bright-lime button fills.

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
