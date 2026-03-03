import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { getSettings } from "@/app/admin/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const storeName = (settings as any)?.storeName || "Premium Store";
  const storeDescription = (settings as any)?.storeDescription || "A melhor experiência de compra";

  return {
    title: storeName,
    description: storeDescription,
    openGraph: {
      title: storeName,
      description: storeDescription,
      siteName: storeName,
      type: "website",
    }
  };
}

import { Providers } from "@/components/Providers";

import Header from "@/components/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const storeName = (settings as any)?.storeName || "Premium Store";

  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <title>{storeName}</title>
        <meta name="description" content={storeName} />
        <meta property="og:title" content={storeName} />
        <meta property="og:description" content={storeName} />
        <meta property="og:type" content="website" />
      </head>
      <body className="antialiased">
        <Providers>
          <Header storeName={storeName} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
