import type { Metadata } from "next"
import Script from "next/script"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import PerfLab from "@/components/PerfLab"
import { AppProvider } from "@/context/AppContext"
import ToastContainer from "@/components/shared/ToastContainer"
import "@/app/globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === "ar"
  const title = isAr
    ? "جولدن تريب — رحلات الطرق السريعة والأسطول الفاخر في مصر"
    : "Golden Trip — Highway Transfers & Fleet Across Egypt"
  const description = isAr
    ? "رحلتك تبدأ من بابك. التوصيل من وإلى المطار، رحلات المنتجعات، ورحلات السفر بين المدن في مصر. الإسكندرية، القاهرة، شرم الشيخ، الغردقة، الأقصر، أسوان."
    : "Your trip starts at your door. Airport transfers, resort runs, and city-to-city trips across Egypt. Alexandria, Cairo, Sharm El-Sheikh, Hurghada, Luxor, Aswan."

  return {
    metadataBase: new URL("https://goldentrip.eg"),
    title,
    description,
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      title: isAr
        ? "جولدن تريب — أسطول مصر الخاص ورحلات الطرق السريعة"
        : "Golden Trip — Egypt Private Fleet & Highway Transfers",
      description,
      url: `https://goldentrip.eg/${locale}`,
      siteName: isAr ? "جولدن تريب" : "Golden Trip",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      type: "website",
    },
    alternates: {
      canonical: `https://goldentrip.eg/${locale}`,
      languages: {
        en: "https://goldentrip.eg/en",
        ar: "https://goldentrip.eg/ar",
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  let fontClass = ""
  if (locale === "ar") {
    const { reemKufi, ibmPlexArabic, amiri } = await import("@/lib/fonts/ar")
    fontClass = `${reemKufi.variable} ${ibmPlexArabic.variable} ${amiri.variable}`
  } else {
    const { anybody, instrumentSerif, sourceSans } = await import("@/lib/fonts/en")
    fontClass = `${anybody.variable} ${instrumentSerif.variable} ${sourceSans.variable}`
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={fontClass}
      suppressHydrationWarning
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
        <Script
          id="perf-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(()=>{const q=new URLSearchParams(location.search);const lite=matchMedia("(max-width: 767px), (pointer: coarse)").matches||(navigator.hardwareConcurrency||4)<=4||matchMedia("(prefers-reduced-motion: reduce)").matches||q.has("lite");if(lite)document.documentElement.classList.add("lite");const off=q.get("off");if(off)off.split(",").forEach(f=>{const k=f.trim();if(k)document.documentElement.setAttribute("data-off-"+k,"");});})();`,
          }}
        />
        <div className="film-grain" aria-hidden="true" />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppProvider>
            <Header />
            {children}
            <Footer />
            <ToastContainer />
          </AppProvider>
          <PerfLab />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
