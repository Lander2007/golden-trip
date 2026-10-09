import type { Metadata } from "next"
import Script from "next/script"
import { Anybody, Instrument_Serif, Source_Sans_3 } from "next/font/google"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import DevFpsMeter from "@/components/DevFpsMeter"
import "./globals.css"

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-anybody",
  display: "swap",
  axes: ["wdth"],
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Golden Trip — Highway Transfers & Fleet Across Egypt",
  description:
    "Your trip starts at your door. Airport transfers, resort runs, and city-to-city trips across Egypt. Alexandria, Cairo, Sharm El-Sheikh, Hurghada, Luxor, Aswan.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Golden Trip — Egypt Private Fleet & Highway Transfers",
    description:
      "Your trip starts at your door. Airport transfers, resort runs, and city-to-city trips across Egypt.",
    url: "https://goldentrip.eg",
    siteName: "Golden Trip",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${anybody.variable} ${instrumentSerif.variable} ${sourceSans.variable}`}
    >
      <head>
        {process.env.FIGMA && process.env.NODE_ENV === "development" && (
          <Script
            id="preview-hydration-cleanup"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (() => {
                const attribute = "data--h-bstatus";
                const clean = (node) => {
                  if (!(node instanceof Element)) return;
                  node.removeAttribute(attribute);
                  node.querySelectorAll("[" + attribute + "]").forEach(
                    (element) => element.removeAttribute(attribute)
                  );
                };
                clean(document.documentElement);
                const observer = new MutationObserver((records) => {
                  for (const record of records) {
                    if (record.type === "attributes") {
                      if (record.target.hasAttribute(attribute)) {
                        record.target.removeAttribute(attribute);
                      }
                    } else {
                      record.addedNodes.forEach(clean);
                    }
                  }
                });
                observer.observe(document.documentElement, {
                  subtree: true,
                  childList: true,
                  attributes: true,
                  attributeFilter: [attribute]
                });
                window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
              })();
            `,
            }}
          />
        )}
      </head>
      <body className="bg-[var(--sky,#0B0A09)] text-[#F4F2EC] selection:bg-[#C9A227] selection:text-[#0B0A09]">
        <Header />
        {children}
        <Footer />
        <DevFpsMeter />
      </body>
    </html>
  )
}
