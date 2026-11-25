/// <reference types="vite/client" />

/**
 * Collection catalog.
 *
 * Each piece is a folder under content/collezione/<slug>/.
 * The folder holds item.json (title, summary, description, order)
 * and the gallery images (jpg, jpeg, png, webp). The first image in
 * filename order is the card cover. Every image is shown on the detail page.
 * Vite bundles the files at build time, so the Worker does not read the disk.
 */

export type CollectionImage = {
  src: string;
  file: string;
};

export type CollectionItem = {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  order: number;
  images: CollectionImage[];
};

type ItemFile = {
  title: string;
  summary: string;
  description: string[];
  order: number;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const itemModules = import.meta.glob("/content/collezione/*/item.json", {
  eager: true,
  import: "default",
});

const imageModules = import.meta.glob(
  "/content/collezione/*/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" },
);

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
    summary: requireString(record.summary, path, "summary"),
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

function loadCollection(): CollectionItem[] {
  const imagesBySlug = new Map<string, CollectionImage[]>();

  for (const [path, src] of Object.entries(imageModules)) {
    if (typeof src !== "string" || src.trim() === "") {
      throw new Error(`Collection image has no public URL: ${path}`);
    }
    const file = path.split(/[/\\]/).at(-1);
    if (!file) {
      throw new Error(`Collection image path has no filename: ${path}`);
    }
    const slug = slugFromPath(path);
    const images = imagesBySlug.get(slug) ?? [];
    images.push({ src, file });
    imagesBySlug.set(slug, images);
  }

  const items: CollectionItem[] = [];
  const orders = new Set<number>();

  for (const [path, value] of Object.entries(itemModules)) {
    const slug = slugFromPath(path);
    const file = readItemFile(path, value);
    if (orders.has(file.order)) {
      throw new Error(`Two collection pieces use order ${file.order}`);
    }
    orders.add(file.order);
    const images = imagesBySlug.get(slug);
    if (!images || images.length === 0) {
      throw new Error(`${path} needs at least one image next to item.json`);
    }
    imagesBySlug.delete(slug);
    images.sort((a, b) => a.file.localeCompare(b.file, "en"));
    items.push({ slug, ...file, images });
  }

  const orphan = imagesBySlug.keys().next().value;
  if (orphan) {
    throw new Error(`content/collezione/${orphan} has images but no item.json`);
  }
  if (items.length === 0) {
    throw new Error("content/collezione has no pieces. Add <slug>/item.json and at least one image.");
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
