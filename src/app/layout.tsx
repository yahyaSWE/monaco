import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { absoluteUrl, isIndexable, site, siteUrl } from "@/lib/site";
import { businessSchema, serializeJsonLd } from "@/lib/seo";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl()),
  title: {
    default: "Hudvård & skönhetsbehandlingar i Eskilstuna | Monaco Clinic",
    template: "%s | Monaco Clinic",
  },
  applicationName: site.name,
  robots: { index: isIndexable, follow: isIndexable },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sv">
      <body className={`${serif.variable} ${sans.variable}`} id="sidans-topp">
        <a className="skip-link" href="#huvudinnehall">
          Hoppa till innehållet
        </a>
        <Header />
        <main id="huvudinnehall">{children}</main>
        <Footer />
        {siteUrl && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeJsonLd(businessSchema()),
            }}
          />
        )}
      </body>
    </html>
  );
}
