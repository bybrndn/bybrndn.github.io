# Projects — data-driven system

Every project is described by a single config file and rendered by one shared
template. There is **no per-project HTML to write**.

## Adding a project

1. Create a folder: `projects/<slug>/`
2. Add a config file: `projects/<slug>/project.json`
3. Register the slug in `projects/projects.json` (controls order + what appears).

It now shows up automatically in the work list **and** has its own page at
`/projects/project/?p=<slug>`. Drop images in the same folder (or link to remote
URLs) and reference them from the config.

> `projects.json` is the one registry. Order in that array = order on the work
> page and the "next project" loop.

## Files

| File | Role |
|------|------|
| `projects.json` | Ordered list of project slugs (the registry). |
| `<slug>/project.json` | All of one project's data. |
| `project.html` | The single shared template page. |
| `project.css` | Shared, themeable styles for every project page. |
| `project.js` | Renderer: loads a config and builds the page. |
| `<slug>/<slug>.html` | Legacy redirect → canonical URL (existing projects only). |

## Config schema (`project.json`)

```jsonc
{
  "title": "Move Media NZ",            // plain title (used in <title> + work list)
  "titleHTML": "MOVE<br><span>MEDIA NZ</span>", // optional display title; <span> = accent colour
  "listTitle": "Move Media NZ",        // optional: override the work-list title only
  "nextTitle": "Move Media",           // optional: label used by other projects' "next" link
  "subtitle": "Brand Design",          // work-list second line
  "description": "One or two sentences for the hero.",

  "theme": {                           // all optional — fall back to the global dark theme
    "bg": "#222932",                   // page background
    "bgDark": "#181d23",               // darker panels (logo box, video bg)
    "ink": "#ECF5F4",                  // text colour
    "inkMid": "rgba(236,245,244,0.45)",// muted text
    "rule": "rgba(236,245,244,0.08)",  // hairline borders
    "accent": "#2ABBB2",               // labels, accent <span>, links
    "accent2": "#327C83",              // optional secondary accent
    "imageFilter": "sepia(15%)",       // optional filter on gallery images
    "titleFont": "'Cormorant Garamond', serif", // optional display font (default Grandspan Wide)
    "titleWeight": "300",              // optional display weight
    "bodyFont": "'DM Sans', sans-serif",         // optional body font (default Poppins)
    "googleFonts": "Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400" // optional @import
  },

  "hero": {
    "layout": "parallax",              // "parallax" (full-bleed bg) | "split" (cover + text)
    "background": "/projects/<slug>/bg.png",     // parallax background image
    "backgroundFilter": "brightness(0.4)",       // optional, applied when loaded
    "cover": "/projects/<slug>/cover.png"        // split-layout cover image (instead of background)
  },

  "meta": [                            // hero detail rows
    { "label": "Type", "value": "Brand Design" },
    { "label": "Year", "value": "2024" }
  ],
  "link": { "label": "View PDF", "url": "https://…" }, // optional hero call-to-action

  "sections": [ /* see below — rendered top to bottom */ ]
}
```

### Section types

```jsonc
// Text — one label, one or more paragraphs (HTML allowed). Optional colour dots.
{ "type": "text", "label": "Overview",
  "paragraphs": ["First paragraph.", "Second <em>paragraph</em>."],
  "swatchRow": ["#6b3fff", "#ff3c3c", "linear-gradient(135deg,#6b3fff,#ff3c3c)"] }

// Gallery — intro text + one or more image grids (1–4 columns).
{ "type": "gallery", "label": "Logo System",
  "paragraphs": ["Optional intro."],
  "columns": 3,                                  // single-grid shorthand
  "images": [ { "src": "…", "alt": "…", "caption": "Style 01",
                "contain": true, "maxHeight": 80 } ] }
// …or multiple grids in one section:
{ "type": "gallery", "label": "Panels",
  "grids": [ { "columns": 1, "maxWidth": 200, "images": [ … ] },
             { "columns": 2, "images": [ … ] } ] }

// Video — responsive 16:9 embed.
{ "type": "video", "label": "Watch", "embed": "https://www.youtube.com/embed/ID",
  "caption": "Optional caption" }

// Palette — colour swatches.
{ "type": "palette", "label": "Colour Palette",
  "swatches": [ { "name": "Teal", "hex": "#2ABBB2" },
                { "name": "Dark", "hex": "#222932", "border": true } ] }

// Values — 2-up grid of name + description.
{ "type": "values", "label": "Brand Values",
  "items": [ { "name": "Storytelling", "desc": "…" } ] }

// Logos — grid of logos; each may sit in a dark/light box.
{ "type": "logos", "label": "Logomark", "columns": 2,
  "paragraphs": ["Optional intro."],
  "items": [ { "src": "…", "caption": "Dark", "bg": "dark" },
             { "src": "…", "caption": "Light", "bg": "light" },
             { "src": "…", "caption": "Plain (no box)" } ] }

// Custom — escape hatch for bespoke markup inside a labelled section.
{ "type": "custom", "label": "Typography", "html": "<p class=\"ps-text\">…</p>" }
```

Unknown section types fall back to `custom`.
