import Link from "next/link";

/** Shown when a route does not match a page or a collection piece. */
export default function NotFound() {
  return (
    <main className="piece">
      <h1>Pagina non trovata</h1>
      <p className="piece-missing">Questo indirizzo non corrisponde a una pagina del sito.</p>
      <Link className="piece-back" href="/">
        Torna alla home
      </Link>
    </main>
  );
}
