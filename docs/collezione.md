# Collezione

The homepage section sits under `Artigianato Senza Tempo`. Its title is `Collezione` and the subtitle is centered under it. Each card shows the first gallery image, the title, and the short summary. The whole card links to `/collezione/<slug>`.

The detail page shows the title, every paragraph of the description, and the gallery. `Torna alla collezione` links back to `/#collezione`.

## Where to edit a piece

Add a folder under `content/collezione/`. The folder name is the URL slug: lowercase letters, digits, and single hyphens, for example `sfera-sospesa`.

```
content/collezione/sfera-sospesa/
  item.json
  01.jpg
  02.jpg
```

`item.json` has four fields:

| Field | Role |
| --- | --- |
| `title` | Card title and detail heading |
| `summary` | Short text on the card |
| `description` | List of paragraphs on the detail page |
| `order` | Integer. Lower numbers appear first. Each piece needs its own number. |

Place the photographs next to `item.json`. Accepted types are jpg, jpeg, png, and webp. Filenames decide the order (`01.jpg` before `02.jpg`). The first file is the card image. Every file is part of the gallery.

A folder needs `item.json` and at least one image. An image without `item.json`, a repeated `order`, or a missing field stops the build with an error. The Worker does not read these files at request time: Vite includes them in the bundle.

The two example pieces are `sfera-sospesa` and `applique-a-ventaglio`. Each folder has `01.jpg` (the wider view, also used on the card) and `02.jpg` (a closer view in the gallery).
