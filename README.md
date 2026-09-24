# Portfolio — Vinit Agarwal

A single, minimalist page: headline figures, engineering notes, experience,
toolbox and contact. Server-rendered throughout; the only client component is
the theme toggle.

Live: [vinitagarwal.vercel.app](https://vinitagarwal.vercel.app)

## Run it

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  data/site.js                  all copy: profile, stats, notes, experience, skills
  app/
    layout.js                   fonts, SEO metadata, no-flash theme script
    globals.css                 design tokens (dark/light via data-theme) + type
    page.js                     the whole page, as a server component
    page.module.css             section layout
    ThemeToggle.js              the one client component
    structured-data.js          schema.org Person graph
```

The only dependencies are Next.js and React. Fonts (Newsreader, JetBrains Mono)
are self-hosted through `next/font`.

## Editing content

Nearly all copy lives in [`src/data/site.js`](src/data/site.js). Services in the
architecture map use descriptive names and neutral slugs rather than internal
repository names; change `name`/`slug` there if that should ever differ.
