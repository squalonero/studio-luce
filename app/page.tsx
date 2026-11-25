import Link from "next/link";
import { listCollection } from "../lib/collection";

/** Home page: hero, the glass atelier story, then the collection. */
export default function HomePage() {
  const pieces = listCollection();

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Studio Luce: L’Anima del Vetro</h1>
      </section>
      <section className="craft" aria-labelledby="craft-title">
        <div className="craft-copy">
          <h2 id="craft-title">Artigianato Senza Tempo</h2>
          <p>
            La nostra passione per l&apos;illuminazione in vetro soffiato di
            Murano nasce dalla ricerca di un equilibrio tra tradizione e
            modernità. Ogni lampada vintage è un&apos;opera d&apos;arte che
            racconta una storia, e noi ci dedichiamo a donarle una seconda
            vita attraverso tecniche di pulizia e restauro conservativo
            artigianale. Il processo di cura e rigenerazione preserva
            l&apos;essenza del design di un tempo, trasformando pezzi
            dimenticati in capolavori luminosi.
          </p>
          {/* Nested in this section, with a heading below the section title. */}
          <aside className="murano-note" aria-labelledby="murano-title">
            <h3 id="murano-title">Il Segreto di Murano</h3>
            <p>
              La tecnica del soffio a mano richiede precisione millimetrica e
              un&apos;intuizione artistica. Noi selezioniamo solo pezzi in
              autentico vetro di Murano per garantire una qualità superiore e
              un&apos;estetica unica.
            </p>
          </aside>
        </div>
        {/* The photo fills the column, so it stays as tall as the copy beside it. */}
        <figure className="craft-figure">
          <img
            src="/lampada-sospensione.jpg"
            width={767}
            height={1024}
            alt="Lampada a sospensione in vetro soffiato, accesa sopra un divano"
          />
        </figure>
      </section>
      <section className="collection" id="collezione" aria-labelledby="collection-title">
        <header className="collection-intro">
          <h2 id="collection-title">Collezione</h2>
          <p>
            Pezzi in vetro di Murano, scelti e restaurati per tornare a
            illuminare.
          </p>
        </header>
        <ul className="collection-grid">
          {pieces.map((piece) => (
            <li key={piece.slug}>
              <Link className="collection-card" href={`/collezione/${piece.slug}`}>
                <img src={piece.images[0].src} alt="" />
                <h3>{piece.title}</h3>
                <p>{piece.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
