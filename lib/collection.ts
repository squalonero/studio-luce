/// <reference types="vite/client" />

/**
 * Collection catalog.
 *
 * Each piece is a folder under content/collezione/<slug>/.
 * The folder holds item.json (title, description, order) and exactly one
 * image, which is the card. Every image file inside gallery/ is a detail
 * photograph, whatever its filename is.
 * The card text is the description, clamped to three lines. There is no summary.
 * Vite bundles the files at build time, so the Worker does not read the disk.
 */

export type CollectionImage = {
  src: string;
  file: string;
};

export type CollectionItem = {
  slug: string;
  title: string;
  description: string[];
  order: number;
  /** The single image that sits next to item.json. */
  card: CollectionImage;
  /** Every image file from gallery/, in filename order. */
  images: CollectionImage[];
};

type ItemFile = {
  title: string;
  description: string[];
  order: number;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const itemModules = import.meta.glob("/content/collezione/*/item.json", {
  eager: true,
  import: "default",
});

const cardModules = import.meta.glob(
  "/content/collezione/*/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" },
);

const galleryModules = import.meta.glob("/content/collezione/*/gallery/**/*", {
  eager: true,
  import: "default",
  query: "?url",
});

/** Image files only. The basename is not part of the rule. */
const GALLERY_IMAGE = /\.(avif|gif|jpe?g|png|webp)$/i;

function requireString(value: unknown, path: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${path} is missing a non-empty "${field}"`);
  }
  return value.trim();
}

function readItemFile(path: string, value: unknown): ItemFile {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${path} must be a JSON object`);
  }
  const record = value as Record<string, unknown>;
  if ("summary" in record) {
    throw new Error(`${path} must not include "summary". The card uses the description.`);
  }
  const description = record.description;
  if (!Array.isArray(description) || description.length === 0) {
    throw new Error(`${path} "description" must be a list of paragraphs`);
  }
  if (!description.every((paragraph) => typeof paragraph === "string" && paragraph.trim() !== "")) {
    throw new Error(`${path} "description" has an empty paragraph`);
  }
  if (typeof record.order !== "number" || !Number.isInteger(record.order)) {
    throw new Error(`${path} "order" must be an integer`);
  }
  return {
    title: requireString(record.title, path, "title"),
    description: description.map((paragraph) => paragraph.trim()),
    order: record.order,
  };
}

function slugFromPath(path: string): string {
  const parts = path.split(/[/\\]/);
  const marker = parts.lastIndexOf("collezione");
  const slug = parts[marker + 1];
  if (marker === -1 || !slug || !SLUG.test(slug)) {
    throw new Error(`Collection folder name must be a lowercase slug: ${path}`);
  }
  return slug;
}

function readImage(path: string, src: unknown): CollectionImage {
  if (typeof src !== "string" || src.trim() === "") {
    throw new Error(`Collection image has no public URL: ${path}`);
  }
  const file = path.split(/[/\\]/).at(-1);
  if (!file) {
    throw new Error(`Collection image path has no filename: ${path}`);
  }
  return { src, file };
}

function groupImages(
  modules: Record<string, unknown>,
  imagesOnly: boolean,
): Map<string, CollectionImage[]> {
  const grouped = new Map<string, CollectionImage[]>();
  for (const [path, src] of Object.entries(modules)) {
    if (imagesOnly && !GALLERY_IMAGE.test(path)) {
      continue;
    }
    const slug = slugFromPath(path);
    const images = grouped.get(slug) ?? [];
    images.push(readImage(path, src));
    grouped.set(slug, images);
  }
  return grouped;
}

function loadCollection(): CollectionItem[] {
  const cardsBySlug = groupImages(cardModules, false);
  const galleriesBySlug = groupImages(galleryModules, true);
  const items: CollectionItem[] = [];
  const orders = new Set<number>();

  for (const [path, value] of Object.entries(itemModules)) {
    const slug = slugFromPath(path);
    const file = readItemFile(path, value);
    if (orders.has(file.order)) {
      throw new Error(`Two collection pieces use order ${file.order}`);
    }
    orders.add(file.order);
    const cards = cardsBySlug.get(slug) ?? [];
    if (cards.length !== 1) {
      throw new Error(`${path} needs exactly one image next to item.json, found ${cards.length}`);
    }
    const images = galleriesBySlug.get(slug) ?? [];
    if (images.length === 0) {
      throw new Error(`${path} needs at least one image in gallery/`);
    }
    cardsBySlug.delete(slug);
    galleriesBySlug.delete(slug);
    images.sort((a, b) => a.file.localeCompare(b.file, "en", { numeric: true, sensitivity: "base" }));
    items.push({ slug, ...file, card: cards[0], images });
  }

  const orphan = cardsBySlug.keys().next().value ?? galleriesBySlug.keys().next().value;
  if (orphan) {
    throw new Error(`content/collezione/${orphan} has images but no item.json`);
  }
  if (items.length === 0) {
    throw new Error("content/collezione has no pieces. Add <slug>/item.json, one card image, and gallery/.");
  }

  items.sort((a, b) => a.order - b.order);
  return items;
}

const collection = loadCollection();

/** Pieces in display order. */
export function listCollection(): CollectionItem[] {
  return collection;
}

/** One piece by its folder name, or undefined when the slug is unknown. */
export function getCollectionItem(slug: string): CollectionItem | undefined {
  return collection.find((item) => item.slug === slug);
}
