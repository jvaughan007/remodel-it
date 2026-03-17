import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
  description: "Transform your home with Trinity Remodeling. Professional kitchen, bathroom, and whole home renovations serving Dallas, Fort Worth, Plano, Frisco, and surrounding DFW areas.",
  keywords: "home remodeling, kitchen renovation, bathroom remodel, Dallas, Fort Worth, DFW, contractor, home renovation, interior design",
  authors: [{ name: "Trinity Remodeling" }],
  openGraph: {
    title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
    description: "Transform your home with professional remodeling services in the DFW area",
    url: "https://trinity-remodeling.com",
    siteName: "Trinity Remodeling",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trinity Remodeling - Premier Home Remodeling in Dallas/Fort Worth",
    description: "Transform your home with professional remodeling services in the DFW area",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
