import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  ...(process.env.FIGMA
    ? {
        allowedDevOrigins: [
          process.env.FIGMA_PUBLIC_URL
            ? new URL(process.env.FIGMA_PUBLIC_URL).hostname
            : "app-psqrybgwrz5ofsowo2l3xzchpadvxcwkwulm7ilxumwhkzqmw6oh.makeproxy-c.figma.site",
        ],
      }
    : {}),
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(withNextIntl(nextConfig))
