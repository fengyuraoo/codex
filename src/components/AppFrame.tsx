"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useMaterialStore } from "@/store/useMaterialStore";

export function AppFrame({
  children,
  showSidebar = true
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  const initialize = useMaterialStore((state) => state.initialize);
  const isReady = useMaterialStore((state) => state.isReady);
  const error = useMaterialStore((state) => state.error);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <div className="flex min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main className="h-screen min-w-0 flex-1 overflow-hidden">{children}</main>
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted shadow-notion">
            正在载入本地素材库 / Loading local materials...
          </div>
        </div>
      )}
      {isReady && error && (
        <div className="fixed inset-x-6 bottom-6 z-50 mx-auto max-w-2xl rounded-lg border border-[#ead6ca] bg-card p-4 text-sm leading-6 text-[#8a5a42] shadow-notion">
          <p className="font-medium text-foreground">
            本地素材库加载失败 / Local material library failed to load
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}
