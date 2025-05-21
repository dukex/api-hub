import Link from 'next/link';
import { Home, LayoutList, Settings } from 'lucide-react'; // Assuming Settings for future use

export default function Sidebar() {
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/apis', label: 'APIs', icon: LayoutList },
    // Add more navigation items here as needed
    // { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border p-4 shadow-md">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
