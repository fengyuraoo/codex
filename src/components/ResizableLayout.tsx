"use client";
import { useState } from "react";
import { ArrowLeft, BookOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { TreeView } from "@/components/TreeView";
import { NodeDetails } from "@/components/NodeDetails";
import { cn } from "@/lib/utils";
export function ResizableLayout() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="speaking-workspace flex h-full min-w-0 flex-col">
      <Sidebar />
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-7">
        <div><p className="text-xs font-medium tracking-widest text-accent">YOUR DAILY SPEAKING SPACE</p><p className="mt-1 text-sm text-muted">选一个话题，开始今天的表达。</p></div>
        <Button className="hidden md:inline-flex" variant="secondary" size="sm" onClick={() => setFocused(!focused)} aria-pressed={focused}>
          {focused ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}{focused ? "显示素材库" : "专注练习"}
        </Button>
        <Button className="md:hidden" variant="secondary" size="sm" onClick={() => setDetailOpen(!detailOpen)}>
          {detailOpen ? <ArrowLeft className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}{detailOpen ? "选素材" : "继续练习"}
        </Button>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className={cn("min-h-0 min-w-0 w-full shrink-0 border-r border-border md:w-[38%] md:max-w-[440px]", detailOpen && "hidden md:block", focused && "md:hidden")}><TreeView onNodeSelect={() => setDetailOpen(true)} /></div>
        <div className={cn("min-h-0 min-w-0 flex-1", !detailOpen && "hidden md:block")}><NodeDetails /></div>
      </div>
    </div>
  );
}
