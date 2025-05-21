export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} API Hub. All rights reserved.
        </p>
        <p className="text-xs mt-1">Powered by Next.js & Tailwind CSS</p>
      </div>
    </footer>
  );
}
