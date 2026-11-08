# Phoenix motion storyboard

The six Figma pages share one motion system. The existing photography, content, links and full-width layout remain the source of truth.

| Page | Sequence |
| --- | --- |
| Home | Fleet reveal and line-by-line headline → About heading and count-up → six service cards and image reveals → depot rows → industry cards with red hover fill → quote CTA → footer columns. |
| Services | Hero → inclusion list → carrier proof counters → three How We Work stories with separate image reveals → connected service tiles → CTA → footer. |
| Tracking | Hero and tracking tool → four delivery stages with a scrubbed route line and active stage → support CTA → footer. |
| Contact | Hero → direct contacts and quote form with field focus feedback → footer. The quote review dialog enters separately. |
| About | Hero → company story and scroll-driven truck parallax → team and quality cards → company priorities → CTA → footer. |
| Why Phoenix | Hero → directional process carousel with step number → company counters → support and contact → CTA → footer. |

The hero starts with the photograph, then reveals the title and shipment tools. On desktop its image and copy move in opposite directions while the next section's heading and red seam enter. The header and form controls keep their positions. Headlines and seams scrub from 94% to 58% of viewport height as each section enters. Desktop image masks scrub from 97% to 60%. Cards reveal individually when they enter the viewport, while linked cards also have a keyboard focus treatment. Reversing scroll reverses the scrubbed motions.

Tablet and phone use smaller heading movements and native scrolling. The original service grid stays in document order so every service remains available by scroll, touch and keyboard. Reduced motion shows the final state with no scrub, count-up or entry movement. The opening indicator lasts only as long as the app takes to load.
