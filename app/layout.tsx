import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";
import Preloader from "@/components/common/Preloader";
import ClientWrappers from "@/components/common/ClientWrappers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rooted Rising Initiative | Roots of Resilience, Rising for our Future",
  description: "A youth-led organization advancing climate resilience, humanitarian response, and sustainable development in underserved and rural communities.",
  keywords: ["Climate Resilience", "Sustainability", "Rural Development", "Youth Leadership", "Climate Tech", "Humanitarian Response"],
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
