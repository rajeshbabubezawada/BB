# theblackbird.ai — Website

A single-page, Apple-style marketing site for Blackbird, built with plain **HTML, CSS and JavaScript** (no frameworks, no build step). The visual language — obsidian black, crimson red, faceted/geometric shapes — is drawn directly from the Blackbird logo.

## What's inside

```
BB/
├── index.html            The live website
├── admin.html             The content editor ("CMS")
├── css/
│   ├── styles.css         All site styling
│   └── admin.css          Editor styling
├── js/
│   ├── content.js         ⭐ All editable text lives here
│   ├── content-store.js   Shared load/save/merge logic
│   ├── main.js             Site rendering + interactions
│   └── admin.js            Editor logic
├── assets/
│   ├── logo.png            Full logo (transparent background)
│   └── logo-mark.png       Bird mark only (used in header/hero/footer)
└── WebsiteContentfortheblackbird.md   Your original content brief
```

## How to view the site

Just double-click `index.html` to open it in your browser — no installation needed.

For the smoothest experience (and to guarantee the content editor and live site share saved edits reliably across all browsers), it's best to serve the folder with any static server, for example:

```bash
# Python (already on most machines)
python -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## How to edit the content

Open **`admin.html`** (there's also an "Edit Content" button in the bottom-right corner of the live site that links straight to it).

1. Pick a section on the left (Hero, About, Services, How We Work, etc.).
2. Edit any field — the **live preview** on the right updates automatically.
3. Click **Save Changes**. Your edits are stored in your browser and will immediately appear on `index.html` whenever you open it in that same browser.
4. When you're happy with your edits and want them to be permanent — visible to every visitor, on every device/browser — click **Download content.js** and replace the existing `js/content.js` file with the downloaded one.

Other useful buttons in the editor:
- **Reset to Defaults** — discards your saved edits and restores the original copy.
- **Import** — load a previously downloaded `content.js` file back into the editor.
- **Open Live Site** — opens `index.html` in a new tab.

You can also open `js/content.js` directly in any text/code editor and change the text by hand — it's a plain, readable JavaScript object.

## Design notes

- **Colors**: obsidian black (`#08080a`), crimson red (`#e2192c`), and off-white (`#f5f5f7` / `#fbfbfa`) — taken from the Blackbird logo.
- **Layout**: alternating dark/light sections, a bento grid for services, a numbered timeline for "How We Work," and a bold red closing CTA band — all patterns common to modern SaaS/consultancy sites (Apple, Linear, Stripe).
- **Motion**: scroll-reveal fades, a parallax hero with floating faceted shapes, an auto-scrolling industries marquee, and a scroll-spy navigation bar that highlights the active section.
- **Accessibility**: semantic landmarks, skip-to-content link, visible focus states, `prefers-reduced-motion` support, and alt text on imagery.
- **Responsive**: fully adaptive from mobile to desktop, with a full-screen mobile navigation menu.

## Notes on placeholder content

Your content brief didn't include client logos, so the **"Where We Fly"** band uses generic industry tags (Financial Services, Healthcare, etc.) instead — feel free to change these to real client names/industries in the editor.

Everything else (About, Services, taglines) uses your original copy from `WebsiteContentfortheblackbird.md`, lightly organized into the page sections you specified.
