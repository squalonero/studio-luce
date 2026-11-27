import Link from "next/link";
import { listCollection } from "../lib/collection";
import { Reveal } from "./reveal";

/** Home page: hero, the glass atelier story, then the collection. */
export default function HomePage() {
  const pieces = listCollection();

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <Reveal as="h1" id="hero-title" variant="fade">
          Studio Luce: L’Anima del Vetro
        </Reveal>
      </section>
      <section className="craft" aria-labelledby="craft-title">
        <div className="craft-copy">
          <Reveal variant="side">
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
          </Reveal>
          {/* Nested in this section, with a heading below the section title. */}
          <Reveal as="aside" className="murano-note" labelledBy="murano-title" delay={160}>
            <h3 id="murano-title">Il Segreto di Murano</h3>
            <p>
              La tecnica del soffio a mano richiede precisione millimetrica e
              un&apos;intuizione artistica. Noi selezioniamo solo pezzi in
              autentico vetro di Murano per garantire una qualità superiore e
              un&apos;estetica unica.
            </p>
          </Reveal>
        </div>
        {/* The photo fills the column, so it stays as tall as the copy beside it. */}
        <Reveal as="figure" className="craft-figure" variant="photo" delay={120}>
          <img
            src="/lampada-sospensione.jpg"
            width={767}
            height={1024}
            alt="Lampada a sospensione in vetro soffiato, accesa sopra un divano"
          />
        </Reveal>
      </section>
      <section className="collection" id="collezione" aria-labelledby="collection-title">
        <Reveal as="header" className="collection-intro">
          <h2 id="collection-title">Collezione</h2>
          <p>
            Pezzi in vetro di Murano, scelti e restaurati per tornare a
            illuminare.
          </p>
        </Reveal>
        <ul className="collection-grid">
          {pieces.map((piece, index) => (
            <Reveal as="li" key={piece.slug} delay={Math.min(index, 6) * 80}>
              <Link className="collection-card" href={`/collezione/${piece.slug}`}>
                <img src={piece.card.src} alt="" />
                <h3>{piece.title}</h3>
                <p>{piece.description.join(" ")}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </main>
  );
}
