"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, BookOpenText, Languages, Mic, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [
  { href: "/", label: "口语练习", icon: BookOpenText },
  { href: "/recordings", label: "我的录音", icon: Mic },
  { href: "/vocabulary", label: "词汇本", icon: Languages },
  { href: "/settings", label: "设置", icon: Settings }
];
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <div className={cn("shrink-0 border-b border-border bg-card px-4 py-3 sm:px-7", className)}>
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Speaking Map 首页">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white"><AudioLines className="h-5 w-5" /></span>
          <span><span className="block text-lg font-semibold tracking-tight">Speaking Map<span className="text-accent">.</span></span><span className="block text-[11px] text-muted">一点积累，一点进步</span></span>
        </Link>
        <nav aria-label="主导航" className="flex w-full gap-1 sm:w-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={cn("flex min-h-10 min-w-0 flex-1 flex-col whitespace-nowrap items-center justify-center gap-1 rounded-lg px-1 text-xs sm:flex-row sm:gap-2 sm:text-sm transition hover:bg-soft sm:flex-none sm:px-4", pathname === href ? "bg-soft font-semibold text-accent" : "text-muted")}><Icon className="h-4 w-4 shrink-0" /><span>{label}</span></Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

