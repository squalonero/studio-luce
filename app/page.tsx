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
      </main>
    </>
  );
}
