/** Home page: brand header, then the glass atelier hero. */
export default function HomePage() {
  return (
    <>
      <header className="site-header">
        {/* The file already contains the mark and the wordmark, so the header does not repeat the name. */}
        <img
          className="site-logo"
          src="/logo.png"
          width={1024}
          height={346}
          alt="Studio Luce"
        />
      </header>
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
      </main>
    </>
  );
}
