# theblackbird.ai — Website

A single-page, Apple-style marketing site for Blackbird, built with plain **HTML, CSS and JavaScript** (no frameworks, no build step). The visual language — obsidian black, crimson red, faceted/geometric shapes — is drawn directly from the Blackbird logo.

## What's inside

```
BB/
├── index.html            The live website
├── css/
│   └── styles.css         All site styling
├── js/
│   ├── content.js         ⭐ All editable text lives here
│   └── main.js             Site rendering + interactions
├── assets/
│   ├── logo.png            Full logo (transparent background)
│   └── logo-mark.png       Bird mark only (used in header/hero/footer)
└── WebsiteContentfortheblackbird.md   Your original content brief
```

## How to view the site

Just double-click `index.html` to open it in your browser — no installation needed.

For the smoothest experience, it's best to serve the folder with any static server, for example:

```bash
# Python (already on most machines)
python -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## How to edit the content

Open `js/content.js` in any text/code editor — it's a plain, readable JavaScript object holding every piece of copy on the site (headings, paragraphs, button labels, nav links, etc.). Change any text value, save the file, and refresh `index.html` to see your edit.

## Design notes

- **Colors**: obsidian black (`#08080a`), crimson red (`#e2192c`), and off-white (`#f5f5f7` / `#fbfbfa`) — taken from the Blackbird logo.
- **Layout**: alternating dark/light sections, a bento grid for services, a numbered timeline for "How We Work," and a bold red closing CTA band — all patterns common to modern SaaS/consultancy sites (Apple, Linear, Stripe).
- **Motion**: scroll-reveal fades, a parallax hero with floating faceted shapes, an auto-scrolling industries marquee, and a scroll-spy navigation bar that highlights the active section.
- **Accessibility**: semantic landmarks, skip-to-content link, visible focus states, `prefers-reduced-motion` support, and alt text on imagery.
- **Responsive**: fully adaptive from mobile to desktop, with a full-screen mobile navigation menu.

## Notes on placeholder content

Your content brief didn't include client logos, so the **"Where We Fly"** band uses generic industry tags (Financial Services, Healthcare, etc.) instead — feel free to change these to real client names/industries in `js/content.js`.

Everything else (About, Services, taglines) uses your original copy from `WebsiteContentfortheblackbird.md`, lightly organized into the page sections you specified.
