# Motion

Section content fades in the first time it enters the viewport. It does not fade out again. `app/reveal.tsx` watches each block with `IntersectionObserver` and adds `is-in`.

The movement depends on the block:

| Block | Motion |
| --- | --- |
| Hero title and the Collezione link | Fade only, so the line stays centered over the photograph. The link follows the title |
| Craft copy and detail copy | Fade in from the left |
| Murano box | Fade upward, a short moment after the copy |
| Craft photograph and detail cover | Fade in from the right |
| Collection title | Fade upward |
| Collection cards | Fade upward, each card a little after the previous one |
| Detail gallery | Fade upward after the cover |

A visitor who prefers reduced motion, or a browser without JavaScript, sees the content in place with no fade. The logo in the header does not animate.
