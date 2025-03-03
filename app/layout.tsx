import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { siteConfig } from "@/config/site-config"

const CalSans = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-calsans",
})

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  creator: siteConfig.name,
  authors: [
    {
      name: siteConfig.name,
      url: new URL(siteConfig.authorUrl),
    },
  ],
  applicationName: siteConfig.title,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL(siteConfig.url),
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
  keywords: siteConfig.keywords,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={[GeistSans.variable, CalSans.variable].join(" ")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
