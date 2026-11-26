import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionItem, listCollection } from "../../../lib/collection";
import { PieceGallery } from "../piece-gallery";

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
    description: item.description.join(" "),
  };
}

/** Detail page: cover beside the text, then the gallery. The cover is not a gallery slide. */
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
      <section className="piece-lead" aria-labelledby="piece-title">
        <div className="piece-copy">
          <h1 id="piece-title">{item.title}</h1>
          <div className="piece-text">
            {item.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        {/* Same idea as the homepage craft photo: the frame matches the copy height. */}
        <figure className="piece-figure">
          <img src={item.card.src} alt={item.title} />
        </figure>
      </section>
      <PieceGallery
        title={item.title}
        images={item.images.map((image, index) => ({
          src: image.src,
          alt:
            item.images.length === 1
              ? item.title
              : `${item.title}, fotografia ${index + 1}`,
        }))}
      />
    </main>
  );
}
