import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sentiloop.ai"),
  title: {
    default: "Sentiloop — Feel every signal. Act in real time.",
    template: "%s — Sentiloop",
  },
  description:
    "Sentiloop turns millions of customer signals into clear, continuously learning decisions for product, support, and growth teams.",
  keywords: [
    "AI customer intelligence",
    "sentiment analysis",
    "voice of customer",
    "customer insights",
    "AI SaaS",
  ],
  authors: [{ name: "Sentiloop" }],
  creator: "Sentiloop",
  publisher: "Sentiloop",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sentiloop — Customer intelligence in motion",
    description:
      "Transform every conversation, review, and signal into decisions your teams can act on now.",
    url: "/",
    siteName: "Sentiloop",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sentiloop — Customer intelligence in motion",
    description:
      "Transform every customer signal into decisions your teams can act on now.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
