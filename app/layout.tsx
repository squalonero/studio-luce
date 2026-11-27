import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Luce",
  description: "Studio Luce: L’Anima del Vetro",
};

/** Root document shared by every route. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
