# Collezione

The homepage section sits under `Artigianato Senza Tempo`. Its title is `Collezione` and the subtitle is centered under it. Each card shows the single image that sits next to `item.json`, the title, and the description clamped to three lines. The whole card links to `/collezione/<slug>`.

The detail page shows the title, every paragraph of the description, and the gallery. `Torna alla collezione` links back to `/#collezione`.

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

`item.json` has three fields. There is no summary.

| Field | Role |
| --- | --- |
| `title` | Card title and detail heading |
| `description` | List of paragraphs. The detail page shows every paragraph. The card shows the same text, joined, and clamps it to three lines. |
| `order` | Integer. Lower numbers appear first. Each piece needs its own number. |

Put exactly one image next to `item.json`. That file is the card image. The name can be anything. The examples use `copertina.jpg`. Accepted types are jpg, jpeg, png, and webp.

Put the detail photographs in `gallery/`. Every image file in that folder is used, whatever its name is. Accepted types are jpg, jpeg, png, webp, gif, and avif, in any letter case. Other files in the folder are ignored. The photographs are shown in filename order so the sequence stays stable. The card image is not part of the gallery unless the same file is also copied there. A piece needs at least one image in `gallery/`.

Zero card images, more than one card image, a missing gallery image, an image without `item.json`, a repeated `order`, or a missing field stops the build with an error. The Worker does not read these files at request time: Vite includes them in the bundle.

The example pieces are `lampada-giove` and `applique-a-ventaglio`. Each has `copertina.jpg` for the card. The files inside `gallery/` can use any image filename.
