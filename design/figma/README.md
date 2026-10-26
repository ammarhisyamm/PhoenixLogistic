# Figma design system scripts

Figma Plugin API scripts that build the Phoenix style guide and component library in a Figma file. Run them in order on the target page; each one is safe to re-run (it skips what already exists).

1. `1-foundations.js`: variables (Primitives, Color, Spacing, Radius), text styles, effect styles
2. `2-style-guide.js`: the "Phoenix · Style guide" board (cover, logo, colour, type, spacing, voice)
3. `3-components-atoms.js`: icons, Button, Text field, Chip, Tag, Status pill, Tab, Eyebrow
4. `4-components-molecules.js`: Service card, Stat, Process step, Tracking event, Site header, Quick tools card

Each script uses top-level `await` and ends with `return`, so wrap it in an async function if your runner needs that. After step 2, put `assets/img/logo.png` into the "Logo/On light" slot and `assets/img/logo-white.png` into the "On dark" and "On red" slots.
