"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/crops", label: "Crops" },
  { href: "/livestock", label: "Livestock" },
  { href: "/meals", label: "Meals" },
  { href: "/pantry", label: "Pantry" },
  { href: "/labor", label: "Labor" },
  { href: "/layout-tools", label: "Layout" },
  { href: "/settings", label: "Settings" },
];


export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-3 text-sm">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 rounded-full border transition",
              active
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-muted hover:bg-emerald-50 border-border"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
