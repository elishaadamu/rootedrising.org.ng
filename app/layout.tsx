import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";
import Preloader from "@/components/common/Preloader";
import ClientWrappers from "@/components/common/ClientWrappers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rooted Rising | Rooted in Truth, Rising for Justice",
    template: "%s | Rooted Rising"
  },
  description: "Rooted Rising is a dynamic media advocacy initiative, harnessing the power of storytelling, art, and grassroots activism to ignite climate action and gender equality across Sub-Saharan Africa.",
  keywords: ["Climate Resilience", "Sustainability", "Rural Development", "Youth Leadership", "Climate Tech", "Humanitarian Response", "Media Advocacy", "Storytelling", "Gender Equality", "Africa"],
  authors: [{ name: "Rooted Rising Initiative" }],
  creator: "Rooted Rising Initiative",
  publisher: "Rooted Rising Initiative",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'),
  openGraph: {
    title: "Rooted Rising | Rooted in Truth, Rising for Justice",
    description: "Harnessing storytelling, art, and grassroots activism for climate action and gender equality.",
    url: 'https://rootedrising.org.ng',
    siteName: 'Rooted Rising',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'Rooted Rising Initiative - Media Advocacy for Climate Justice',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rooted Rising | Rooted in Truth, Rising for Justice',
    description: 'Harnessing storytelling, art, and grassroots activism for climate action and gender equality.',
    images: ['/images/hero.png'],
    creator: '@rootedrising',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "c-8xdO0w7t0pIYjsoQz6LDS0lUpb6veGwx92Hrua1DA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K9WQH1PGGF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K9WQH1PGGF');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Preloader />
        <ClientWrappers />
        {children}
      </body>
    </html>
  );
}
