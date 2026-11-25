import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionItem, listCollection } from "../../../lib/collection";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listCollection().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getCollectionItem(slug);
  if (!item) {
    notFound();
  }
  return {
    title: `${item.title} | Studio Luce`,
    description: item.summary,
  };
}

/** Detail page for one piece: title, full text, and the folder's gallery. */
export default async function CollectionItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getCollectionItem(slug);
  if (!item) {
    notFound();
  }

  return (
    <main className="piece">
      <Link className="piece-back" href="/#collezione">
        Torna alla collezione
      </Link>
      <h1>{item.title}</h1>
      <div className="piece-text">
        {item.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ul className="piece-gallery">
        {item.images.map((image, index) => (
          <li key={image.file}>
            <img
              src={image.src}
              alt={
                item.images.length === 1
                  ? item.title
                  : `${item.title}, fotografia ${index + 1}`
              }
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
