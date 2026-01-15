import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rhea Coffee",
    default: "Rhea Coffee - Premium Türk Kahvesi",
  },
  description:
    "En kaliteli kahve çekirdekleri ile hazırlanan özel harman kahveler. Türkiye'nin en iyi kahve markası. Eve sipariş verin.",
  keywords: [
    "kahve",
    "türk kahvesi",
    "espresso",
    "filtre kahve",
    "kahve çekirdeği",
    "online kahve",
    "kahve sipariş",
  ],
  authors: [{ name: "Rhea Coffee" }],
  creator: "Rhea Coffee",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Rhea Coffee",
    title: "Rhea Coffee - Premium Türk Kahvesi",
    description:
      "En kaliteli kahve çekirdekleri ile hazırlanan özel harman kahveler.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhea Coffee - Premium Türk Kahvesi",
    description:
      "En kaliteli kahve çekirdekleri ile hazırlanan özel harman kahveler.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
