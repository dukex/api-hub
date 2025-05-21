import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          <Aperture className="h-8 w-8" />
          <h1 className="text-2xl font-semibold">API Hub</h1>
        </Link>
        <nav className="flex items-center gap-4">
          {/* Future navigation links can go here */}
          {/* Example: <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">Settings</Link> */}
        </nav>
      </div>
    </header>
  );
}
