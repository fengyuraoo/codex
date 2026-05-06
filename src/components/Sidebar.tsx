"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, FolderTree, Languages, Mic, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Map", icon: FolderTree },
  { href: "/recordings", label: "Recordings", icon: Mic },
  { href: "/vocabulary", label: "Vocabulary / 词汇", icon: Languages },
  { href: "/settings", label: "Settings", icon: Settings }
];

const categories = [
  "名字 / Name",
  "家乡 / Hometown",
  "学习 / Study",
  "居住 / Accommodation",
  "天气 / Weather",
  "日常 / Routine",
  "兴趣 / Interests",
  "生活 / Lifestyle"
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-72 shrink-0 flex-col border-r border-border bg-[#f3eadc] px-4 py-5",
        className
      )}
    >
      <div className="mb-7 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
          <BookOpenText className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            Speaking Map
          </h1>
          <p className="mt-1 text-xs leading-5 text-muted">
            IELTS Speaking Band 7 · 中英双语素材整理
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted transition hover:bg-card hover:text-foreground",
                active && "bg-card text-foreground shadow-sm"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Categories
        </p>
        <div className="space-y-1">
          {categories.map((category) => (
            <div
              className="rounded-md px-3 py-1.5 text-sm text-muted"
              key={category}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted shadow-sm">
        <p className="text-foreground">持续积累，清晰表达。</p>
        <p>Practice. Record. Reflect.</p>
      </div>
    </aside>
  );
}
