# Collezione

The homepage section sits under `Artigianato Senza Tempo`. Its title is `Collezione` and the subtitle is centered under it. Each card shows the single image that sits next to `item.json`, the title, and the description clamped to three lines. The whole card links to `/collezione/<slug>`.

On the detail page the back link, the text, the cover, and the gallery fade in as they enter the viewport. See [Motion](motion.md).

The detail page places the card image beside the description, in the same two-column arrangement as `Artigianato Senza Tempo`: copy on the left, photograph on the right, cropped so it matches the height of the text. On a narrow screen the text stays above the photograph. That image is not a gallery slide. Under the pair, the gallery lists only the files from `gallery/`. `Torna alla collezione` links back to `/#collezione`.

The gallery frames the first photograph and lists the others as thumbnails under the heading `Fotografie`. Each photograph is a button. Activating one opens a dialog over the page: the large image, `Chiudi`, a count such as `1 di 2`, previous and next controls, and a thumbnail menu labeled `Menu delle fotografie`. The current thumbnail is marked. Arrow keys move through the photographs. Escape, `Chiudi`, and the dark backdrop close the dialog and return focus to the button that opened it. A piece with one photograph still opens the dialog, without the previous, next, and menu controls.

## Where to edit a piece

Add a folder under `content/collezione/`. The folder name is the URL slug: lowercase letters, digits, and single hyphens, for example `lampada-giove`.

```
content/collezione/lampada-giove/
  item.json
  copertina.jpg
  gallery/
    01.jpg
    02.jpg
```

`item.json` has two fields. There is no summary and no order.

| Field | Role |
| --- | --- |
| `title` | Card title and detail heading |
| `description` | List of paragraphs. The detail page shows every paragraph. The card shows the same text, joined, and clamps it to three lines. |

The cards follow the folder names. `applique-a-ventaglio` comes before `lampada-giove`, and `02-pezzo` comes before `10-pezzo`. Rename a folder to move its card.

Put exactly one image next to `item.json`. That file is the card image. The name can be anything. The examples use `copertina.jpg`. Accepted types are jpg, jpeg, png, and webp.

Put the detail photographs in `gallery/`. Every image file in that folder is used, whatever its name is. Accepted types are jpg, jpeg, png, webp, gif, and avif, in any letter case. Other files in the folder are ignored. The photographs are shown in filename order so the sequence stays stable. The card image is shown beside the description and is not added to the gallery. Copying that file into `gallery/` is the only way it also appears there. A piece needs at least one image in `gallery/`.

Zero card images, more than one card image, a missing gallery image, an image without `item.json`, an `order` field, or a missing field stops the build with an error. The Worker does not read these files at request time: Vite includes them in the bundle.

The example pieces are `lampada-giove` and `applique-a-ventaglio`. Each has `copertina.jpg` for the card. The files inside `gallery/` can use any image filename.
