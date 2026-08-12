import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf6]">
      <Header />
      <main id="main-content" className="flex-1 w-[1440px] mx-auto min-w-0">
        {children}

      </main>
      
      <Footer />
    </div>
  );
}
