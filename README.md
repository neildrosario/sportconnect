# SportConnect — Mobile Promotional Website

A fast, zero-build static promotional website for **SportConnect**, designed mobile-first in a high-contrast dark athletic style and ready for GitHub + Netlify hosting.

## Project Structure

- `index.html` — Mobile-first entry page with SEO/Open Graph tags, 5 core views, interactive device mockups, and a Netlify Forms early-access form.
- `css/styles.css` — Modular dark athletic design system (custom properties, responsive grids, scroll-snap carousels, glassmorphic mobile bottom bar).
- `js/app.js` — Vanilla JS controller for hash-synced navigation, swipeable phone carousels, interactive app demos, white-label theme switcher, and Netlify Forms submission.
- `assets/favicon.svg` — SportConnect stopwatch-network brand icon.
- `manifest.webmanifest` — Web App Manifest for mobile "Add to Home Screen".
- `netlify.toml` — Netlify build, caching, and security header configuration.

## Local Preview

Run any static HTTP server inside this directory:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` (use browser DevTools mobile device view to test the thumb-friendly bottom bar and swipeable app screens).

## Deploying to GitHub & Netlify

1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project → GitHub** and select the repo.
3. Leave the build command empty and set **Publish directory** to `.` (automatically picked up from `netlify.toml`).
4. Netlify Forms automatically detects the `early-access` form in `index.html` and stores leads in your Netlify dashboard.
