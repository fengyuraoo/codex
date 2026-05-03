"use client";

import { useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  PanelLeft,
  PanelLeftOpen,
  PanelRightOpen,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { TreeView } from "@/components/TreeView";
import { NodeDetails } from "@/components/NodeDetails";
import { cn } from "@/lib/utils";
import { useResizablePanels } from "@/hooks/useResizablePanels";

function ResizeHandle({
  active,
  disabled = false,
  label,
  onPointerDown
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onPointerDown: () => void;
}) {
  if (disabled) return null;
  return (
    <button
      aria-label={label}
      className={cn(
        "group relative z-20 hidden w-2 shrink-0 cursor-col-resize touch-none items-stretch justify-center bg-transparent transition md:flex",
        active && "bg-[#eadfce]"
      )}
      onPointerDown={(event) => {
        event.preventDefault();
        onPointerDown();
      }}
      type="button"
    >
      <span
        className={cn(
          "h-full w-px bg-border transition group-hover:w-0.5 group-hover:bg-[#ccb99f]",
          active && "w-0.5 bg-[#b99f7e]"
        )}
      />
    </button>
  );
}

function CollapseRail({
  actionLabel,
  label,
  side,
  onClick
}: {
  actionLabel?: string;
  label: string;
  side: "left" | "middle" | "right";
  onClick: () => void;
}) {
  const Icon =
    side === "left" ? PanelLeftOpen : side === "right" ? PanelRightOpen : Columns3;

  return (
    <button
      aria-label={actionLabel ?? label}
      className="relative z-30 flex h-full w-full flex-col items-center gap-3 border-border bg-[#f3eadc] px-1 py-3 text-muted transition hover:bg-[#efe3d2] hover:text-foreground"
      onClick={onClick}
      title={actionLabel ?? label}
      type="button"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <span className="[writing-mode:vertical-rl] text-xs">{label}</span>
    </button>
  );
}

export function ResizableLayout() {
  const {
    containerRef,
    dragTarget,
    isNarrow,
    isTouchDevice,
    layout,
    minWidths,
    resetLayout,
    startDrag,
    toggleDetail,
    toggleSidebar,
    toggleTree,
    viewportWidth
  } = useResizablePanels();

  const [mobilePanel, setMobilePanel] = useState<"tree" | "detail">("tree");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tabletMode, setTabletMode] = useState<"split" | "tree" | "detail">("split");
  const [tabletSidebarOpen, setTabletSidebarOpen] = useState(false);
  const isTabletTouch = isTouchDevice && viewportWidth >= 768;
  const isTabletLayout =
    isTabletTouch || (viewportWidth >= 900 && viewportWidth <= 1280);
  const disableDrag = isTouchDevice;
  const resetTabletLayout = () => {
    setTabletMode("split");
    setTabletSidebarOpen(false);
    resetLayout();
  };
  const expandSidebar = () => setTabletSidebarOpen(true);
  const collapseSidebar = () => setTabletSidebarOpen(false);

  if (isNarrow) {
    return (
      <div className="quiet-scrollbar h-full overflow-auto bg-background">
        <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[#f3eadc]/95 px-3 py-2 backdrop-blur">
          <div className="min-w-0 text-sm font-medium">My Speaking Material Map</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="min-h-10"
              onClick={() => setMobileSidebarOpen((current) => !current)}
              size="sm"
              variant="secondary"
            >
              <PanelLeft className="h-4 w-4" />
              Sidebar
            </Button>
            <Button
              className="min-h-10"
              onClick={() => setMobilePanel("tree")}
              size="sm"
              variant={mobilePanel === "tree" ? "default" : "secondary"}
            >
              Tree View
            </Button>
            <Button
              className="min-h-10"
              onClick={() => setMobilePanel("detail")}
              size="sm"
              variant={mobilePanel === "detail" ? "default" : "secondary"}
            >
              Detail
            </Button>
            <Button
              className="min-h-10"
              onClick={resetLayout}
              size="sm"
              variant="secondary"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        {mobileSidebarOpen && (
          <Sidebar className="h-auto min-h-0 w-full border-b border-r-0" />
        )}
        <div className="min-h-[calc(100vh-64px)]">
          {mobilePanel === "tree" ? (
            <TreeView
              onNodeSelect={() => setMobilePanel("detail")}
              scrollInside={false}
            />
          ) : (
            <NodeDetails
              onBack={() => setMobilePanel("tree")}
              scrollInside={false}
            />
          )}
        </div>
      </div>
    );
  }

  if (isTabletLayout) {
    return (
      <div className="relative flex h-full min-w-0 bg-background">
        <section className="relative z-30 h-full w-14 shrink-0 overflow-hidden border-r border-border">
          <CollapseRail
            actionLabel="展开侧边栏 / Expand sidebar"
            label="Sidebar"
            onClick={expandSidebar}
            side="left"
          />
        </section>

        {tabletSidebarOpen && (
          <aside className="absolute inset-y-0 left-0 z-40 w-72 max-w-[82vw] border-r border-border bg-[#f3eadc] shadow-2xl">
            <Sidebar className="h-full w-full border-r-0" />
            <Button
              className="absolute right-3 top-3 min-h-11 min-w-11"
              onClick={collapseSidebar}
              size="icon"
              title="收起侧边栏 / Collapse sidebar"
              variant="ghost"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </aside>
        )}

        <main className="flex h-full min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[#f3eadc]/95 px-3 py-2">
            <div className="min-w-0 text-sm font-medium">
              My Speaking Material Map
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="min-h-10"
                onClick={() => setTabletMode("tree")}
                size="sm"
                variant={tabletMode === "tree" ? "default" : "secondary"}
              >
                素材树 / Tree
              </Button>
              <Button
                className="min-h-10"
                onClick={() => setTabletMode("detail")}
                size="sm"
                variant={tabletMode === "detail" ? "default" : "secondary"}
              >
                详情 / Detail
              </Button>
              <Button
                className="min-h-10"
                onClick={() => setTabletMode("split")}
                size="sm"
                variant={tabletMode === "split" ? "default" : "secondary"}
              >
                双栏 / Split
              </Button>
              <Button
                className="min-h-10"
                onClick={resetTabletLayout}
                size="sm"
                variant="secondary"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {tabletMode === "tree" && (
              <section className="h-full w-full min-w-0 overflow-hidden">
                <TreeView
                  onNodeSelect={() => setTabletMode("detail")}
                  scrollInside
                />
              </section>
            )}
            {tabletMode === "detail" && (
              <section className="h-full w-full min-w-0 overflow-hidden">
                <NodeDetails
                  onBack={() => setTabletMode("tree")}
                  scrollInside
                />
              </section>
            )}
            {tabletMode === "split" && (
              <div className="grid h-full min-w-0 grid-cols-[52%_48%] overflow-hidden">
                <section className="min-w-0 overflow-hidden border-r border-border">
                  <TreeView scrollInside />
                </section>
                <section className="min-w-0 overflow-hidden">
                  <NodeDetails scrollInside />
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const sidebarCollapsedForLayout = layout.sidebarCollapsed;
  const tabletDetailWidth = Math.min(
    layout.detailWidth,
    Math.max(minWidths.detail, viewportWidth - minWidths.collapsed - minWidths.tree)
  );
  const sidebarWidth = sidebarCollapsedForLayout
    ? minWidths.collapsed
    : layout.sidebarWidth;
  const detailWidth = layout.detailCollapsed
    ? minWidths.collapsed
    : isTabletTouch
      ? tabletDetailWidth
      : layout.detailWidth;
  const treeWidth = layout.treeCollapsed ? minWidths.collapsed : undefined;

  return (
    <div ref={containerRef} className="flex h-full min-w-0 bg-background">
      <section
        className="h-full shrink-0 overflow-hidden"
        style={{
          width: sidebarWidth,
          minWidth: sidebarCollapsedForLayout ? minWidths.collapsed : minWidths.sidebar
        }}
      >
        {sidebarCollapsedForLayout ? (
          <CollapseRail
            actionLabel="展开侧边栏 / Expand sidebar"
            label="Expand sidebar"
            onClick={toggleSidebar}
            side="left"
          />
        ) : (
          <div className="relative h-full">
            <Sidebar className="h-full w-full" />
            <Button
              className="absolute right-3 top-3"
              onClick={toggleSidebar}
              size="icon"
              title="鎶樺彔 Sidebar / Ctrl+B"
              variant="ghost"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      <ResizeHandle
        active={dragTarget === "sidebar"}
        disabled={disableDrag}
        label="Resize sidebar and tree"
        onPointerDown={() => startDrag("sidebar")}
      />

      <section
        className={cn(
          "h-full min-w-0 overflow-hidden",
          layout.treeCollapsed ? "shrink-0" : "flex-1"
        )}
        style={{
          width: treeWidth,
          minWidth: layout.treeCollapsed ? minWidths.collapsed : minWidths.tree
        }}
      >
        {layout.treeCollapsed ? (
          <CollapseRail label="Tree" onClick={toggleTree} side="middle" />
        ) : (
          <div className="relative h-full">
            <TreeView
              toolbar={
                <>
                  <Button
                    className="min-h-10"
                    onClick={toggleTree}
                    size="sm"
                    title="鎶樺彔 Tree View"
                    variant="secondary"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    className="min-h-10"
                    onClick={resetLayout}
                    size="sm"
                    title="Ctrl+Alt+R"
                    variant="secondary"
                  >
                    <RotateCcw className="h-4 w-4" />
                    閲嶇疆甯冨眬
                  </Button>
                </>
              }
            />
          </div>
        )}
      </section>

      <ResizeHandle
        active={dragTarget === "detail"}
        disabled={disableDrag}
        label="Resize tree and node detail"
        onPointerDown={() => startDrag("detail")}
      />

      <section
        className="h-full shrink-0 overflow-hidden"
        style={{ width: detailWidth, minWidth: layout.detailCollapsed ? minWidths.collapsed : minWidths.detail }}
      >
        {layout.detailCollapsed ? (
          <CollapseRail label="Detail" onClick={toggleDetail} side="right" />
        ) : (
          <div className="relative h-full">
            <Button
              className="absolute left-3 top-3 z-10"
              onClick={toggleDetail}
              size="icon"
              title="鎶樺彔 Node Detail / Ctrl+\\"
              variant="ghost"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <NodeDetails />
          </div>
        )}
      </section>
    </div>
  );
}



