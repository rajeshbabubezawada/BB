# theblackbird.ai — Website

A single-page marketing site for Blackbird, built with plain **HTML, CSS, and JavaScript** (no frameworks, no build step).

## What's inside

```
BB/
├── index.html                         Live website
├── css/styles.css                     Site styling
├── js/content.js                      All editable page copy
├── js/main.js                         Rendering and interactions
├── assets/
│   ├── logo-mark.svg                  Bird mark (header, hero, footer)
│   ├── logo-mark.png                  Favicon / fallback
│   └── logo.png                       Full logo (brand file)
└── WebsiteContentfortheblackbird.md   Original content brief
```

## How to view the site locally

Serve the folder with any static server (needed for the contact form):

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## How to edit copy

Open `js/content.js` and change any text value. Save, then refresh the page.

The contact form sends messages to the address in `contact.email`.

## Host on GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch.
2. In the repo go to **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. The site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

After the first real form submission, FormSubmit emails `contact.email` a confirmation link. Click it once so later messages are delivered.

## Design notes

- **Colors**: obsidian black, crimson red, and off-white, taken from the Blackbird logo.
- **Layout**: alternating dark/light sections, a bento grid for services, a numbered timeline, and a closing CTA.
- **Accessibility**: semantic landmarks, skip-to-content, visible focus states, and `prefers-reduced-motion` support.
- **Responsive**: adaptive from mobile to desktop, with a full-screen mobile menu.
