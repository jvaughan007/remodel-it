import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <main className="overflow-x-hidden w-full">{children}</main>
      <Footer />
      <MobileCTA />
    </>
  );
}
