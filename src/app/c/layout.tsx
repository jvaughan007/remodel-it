import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/manifest-card.json",
  icons: {
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Nick's Card",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2BB6C9",
};

export default function CardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="card-layout-root flex h-[100svh] items-center justify-center overflow-hidden p-3 landscape:items-center landscape:justify-center landscape:p-2 landscape:pt-[50px] landscape:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
