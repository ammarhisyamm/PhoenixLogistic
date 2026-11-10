# 001 — Make Phoenix motion respond to the visitor

- **Status:** Implemented
- **Commit audited:** ddff428
- **Severity:** High
- **Categories:** Frequency, accessibility, interruptibility, performance

| Priority | Evidence at ddff428 | Change |
| --- | --- | --- |
| High | `index.html:53` sets `minimum = seen ? 0 : 1800` and adds another delay before dismissing the boot layer. | Remove simulated progress and the minimum wait. Dismiss when the app mounts, with at most a 200 ms opacity fade on the first visit. Restore interaction immediately and dismiss instantly on repeat visits or with reduced motion. |
| High | `prototypes/phoenix/polish.css:85` uses `opacity: 0` before observer arrival. Section, card and photo reveals then compete with ScrollTrigger. | Remove generic reveal selectors, keyframes and observer bookkeeping. Keep GSAP handoffs and the explicitly requested metrics. |
| Medium | `prototypes/phoenix/style.css:58` and `design.jsx:239` replay slide entrances on keyboard navigation and animate both previews. | Switch instantly for keyboard. Keep one 200 ms directional entrance for pointer or swipe. Keep fixed slide geometry. |
| Medium | `prototypes/phoenix/polish.css:59–67` moves, scales and shades cards on hover. | Keep the requested red fill, remove title and icon movement and service-card lift. Keep link and focus feedback. |

The project already uses `--ease-out: cubic-bezier(.23,1,.32,1)` for directional UI entries. Keep the existing assets, routes, wide layout and dependencies. Verify that direct anchors display content, the loader stops blocking after mount, keyboard and pointer still change slides, and the layout has no horizontal overflow at 390 px and 1700 px. On touch hardware, check swipe direction and handoff feel.
