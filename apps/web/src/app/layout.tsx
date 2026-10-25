import { DirectionProvider } from "@shilan/ui/components/direction-provider";
import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { NagishliToolbar } from "@/components/layout/nagishli-toolbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { uiStrings } from "@/content/ui-strings";
import "./globals.css";

// Heebo: verified against the PDF glyph metrics (width and height match at one consistent scale).
const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://shilan.co.il"),
  title: {
    default: "שילן שירותי המרה",
    template: "%s | שילן שירותי המרה",
  },
};

export const viewport: Viewport = {
  themeColor: "#084616",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        <Script id="nagishli-config" strategy="beforeInteractive">
          {`window.nl_lang="he";window.nl_pos="bl";window.nl_color="green";window.nl_compact="1";window.nl_accordion="1";window.nl_link="/accessibility";window.nl_dir="/nagishli/nl-files/";`}
        </Script>
        <a
          href="#main"
          className="sr-only z-100 rounded-control bg-white px-4 py-2 text-green-900 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {uiStrings.skipToContent}
        </a>
        <DirectionProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </DirectionProvider>
        <NagishliToolbar />
      </body>
    </html>
  );
}
