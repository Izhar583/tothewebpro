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
      <main id="main-content" className="flex-1 w-full min-w-0 flex flex-col">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
