import Link from "next/link";

/** Brand header. The logo file already contains the mark and the wordmark. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-logo-link">
        <img
          className="site-logo"
          src="/logo.png"
          width={1024}
          height={346}
          alt="Studio Luce"
        />
      </Link>
    </header>
  );
}
