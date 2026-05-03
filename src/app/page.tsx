"use client";

import { AppFrame } from "@/components/AppFrame";
import { ResizableLayout } from "@/components/ResizableLayout";

export default function HomePage() {
  return (
    <AppFrame showSidebar={false}>
      <ResizableLayout />
    </AppFrame>
  );
}
