# Blank Schematic — Claude Project Notes

## Site Overview
Hugo static site deployed on Cloudflare Pages from a private GitHub repo.
- Build command: `npm install && hugo --minify && npx pagefind --site public`
- Live site: https://blankschematic.com
- Theme: `themes/blankschematic-theme` (custom, built in this project)

## Recurring Housekeeping Checklist

### Categories
- **Whenever a new project is added**, check that its `categories` values have:
  - A display name entry in `layouts/partials/cat-name.html`
  - An SVG icon in `layouts/partials/cat-icon.html`
  - A color accent in `static/css/main.css` (`.cat-card.cat-<slug>::after`)
  - A display name entry in `layouts/index.html` `$catNames` dict (now delegated to cat-name partial)

### Tags vs Categories — No Duplicates
- A value should not appear in both `categories:` and `tags:` on the same project
- Run this to check: `for f in content/projects/**/*.md; do cats=$(grep "^categories:" "$f" | sed 's/categories: \[//;s/\]//' | tr ',' '\n' | tr -d ' '); tags=$(grep "^tags:" "$f" | sed 's/tags: \[//;s/\]//' | tr ',' '\n' | tr -d ' '); for cat in $cats; do if echo "$tags" | grep -qx "$cat"; then echo "$(basename $f): '$cat' duplicate"; fi; done; done`

### Draft / In-Progress Projects
- `status: draft` — hidden from listings but still builds
- `status: in-progress` — visible in listings, shown with a WIP indicator
- `status: complete` — fully published
- `status: ongoing` — living projects that are always evolving (e.g. HA setup overview); shown in blue
- Current drafts: `furnace-monitor.md` (placeholder content — needs real write-up)
- Current in-progress: `mega-calculator-micropython.md`
- When ready: change status to `complete`

### Project Link Buttons
- The row of buttons under the cover image (`.project-links` in `layouts/_default/single.html`) is driven entirely by optional frontmatter fields — add the URL as the field's value and the button appears automatically, no template edit needed: `github`, `github2` (+ `github2label`), `hackaday`, `youtube`, `makerworld`, `thingiverse`, `docs`, `photos`
- **A 3D-printable case/part goes in `makerworld:` or `thingiverse:`, not an inline Markdown link in the body**
- Hover colors are defined per-field in `static/css/main.css` (search `.proj-link-`) for `github`, `hackaday`, `youtube`, `makerworld`, `photos`; `thingiverse` and `docs` don't have a dedicated color yet and fall back to the default border

### github2label
- When adding a `github2:` link to a project, also add `github2label: "descriptive name ↗"`
- Default fallback label is "github (2) ↗" which is not very informative

### Images
- Project cover images go in `static/images/projects/`
- Google Photos shared links (`photos.app.goo.gl`) cannot be used as `cover:` — must download the image
- Windows/WSL downloads create `filename.jpg:Zone.Identifier` sidecar files (colon-separated, NTFS alternate data stream)
- The `.gitignore` pattern is `*Zone.Identifier` (no dot prefix — the colon before `Zone` means `*.Zone.Identifier` won't match)
- If one appears in VS Code source control: `rm "path/to/file:Zone.Identifier"` to delete it
- Compress images before committing if possible (target < 500 KB); use squoosh.app if no CLI tools available

### Identity / Privacy
- Author name removed from footer (user prefers minimal identity exposure)
- Location removed from footer
- `author` param removed from hugo.toml
- GitHub repo is private

### Slug Conventions
- Category slugs use Hugo's `urlize` — spaces become hyphens, lowercase
- Display names are looked up via `layouts/partials/cat-name.html`
- When adding a new category, add it to cat-name.html, cat-icon.html, and the CSS accent color

## Current Categories
| Slug | Display Name | CSS Color |
|---|---|---|
| electronics | Electronics | `--bs-blue` |
| arduino | Arduino | `--bs-blue` |
| audio | Audio | `--bs-purple` |
| scouting | Scouting | `--bs-orange` |
| museum | Museum | `#5a82b4` |
| networking | Networking | `--bs-purple` |
| 3d-printing | 3D Printing | `--bs-red` |
| woodwork | Woodwork | `#8a6a50` |
| micropython | MicroPython | `--bs-green` |
| raspberry-pi | Raspberry Pi | `--bs-red` |
| home-assistant | Home Assistant | `#18bcf2` |
