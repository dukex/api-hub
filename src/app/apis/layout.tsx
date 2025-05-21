import type { ReactNode } from "react";

export default function ApisLayout({ children }: { children: ReactNode }) {
  // This layout can be used for specific styling or context providers for the /apis section.
  // For now, it just passes children through. If not needed, this file can be removed
  // and pages under /apis will use the root layout directly.
  return <div className="w-full">{children}</div>;
}
