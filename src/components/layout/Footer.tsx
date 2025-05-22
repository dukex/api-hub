export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-2 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} API Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
