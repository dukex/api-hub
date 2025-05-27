import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-1 container mx-auto px-0 sm:px-4 py-4">
        <main className="flex-1 p-4 sm:p-6 ml-0 sm:ml-4 bg-card rounded-lg shadow-sm overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
