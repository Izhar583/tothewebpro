import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf6]">
      <Header />
      <div className="flex-1 mx-auto max-w-[1440px] w-full px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}