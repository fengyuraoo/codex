"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "my-speaking-material-map:panel-layout";
export { STORAGE_KEY as LAYOUT_STORAGE_KEY };

const DEFAULT_LAYOUT = {
  sidebarWidth: 280,
  detailWidth: 440,
  sidebarCollapsed: false,
  treeCollapsed: false,
  detailCollapsed: false
};

const MIN_WIDTHS = {
  sidebar: 220,
  tree: 360,
  detail: 360,
  collapsed: 48
};

type LayoutState = typeof DEFAULT_LAYOUT;
type DragTarget = "sidebar" | "detail" | null;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function readStoredLayout(): LayoutState {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = { ...DEFAULT_LAYOUT, ...JSON.parse(raw) };
    return {
      ...parsed,
      sidebarWidth: Math.max(MIN_WIDTHS.sidebar, parsed.sidebarWidth),
      detailWidth: Math.max(MIN_WIDTHS.detail, parsed.detailWidth)
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function useResizablePanels() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutState>(DEFAULT_LAYOUT);
  const [dragTarget, setDragTarget] = useState<DragTarget>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    setLayout(readStoredLayout());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }, [layout]);

  useEffect(() => {
    const updateWidth = () => {
      setViewportWidth(window.innerWidth);
      setIsNarrow(window.innerWidth < 768);
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches ||
          window.navigator.maxTouchPoints > 0
      );
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const resetLayout = useCallback(() => {
    setLayout(DEFAULT_LAYOUT);
  }, []);

  const toggleSidebar = useCallback(() => {
    setLayout((current) => ({
      ...current,
      sidebarCollapsed: !current.sidebarCollapsed
    }));
  }, []);

  const toggleTree = useCallback(() => {
    setLayout((current) => ({
      ...current,
      treeCollapsed: !current.treeCollapsed
    }));
  }, []);

  const toggleDetail = useCallback(() => {
    setLayout((current) => ({
      ...current,
      detailCollapsed: !current.detailCollapsed
    }));
  }, []);

  const startDrag = useCallback((target: Exclude<DragTarget, null>) => {
    setDragTarget(target);
  }, []);

  useEffect(() => {
    if (!dragTarget) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setLayout((current) => {
        const sidebarVisible = !current.sidebarCollapsed;
        const detailVisible = !current.detailCollapsed;
        const sidebarSpace = sidebarVisible
          ? current.sidebarWidth
          : MIN_WIDTHS.collapsed;
        const detailSpace = detailVisible
          ? current.detailWidth
          : MIN_WIDTHS.collapsed;

        if (dragTarget === "sidebar") {
          const maxSidebar =
            rect.width -
            (current.treeCollapsed ? MIN_WIDTHS.collapsed : MIN_WIDTHS.tree) -
            detailSpace;
          return {
            ...current,
            sidebarCollapsed: false,
            sidebarWidth: clamp(event.clientX - rect.left, MIN_WIDTHS.sidebar, maxSidebar)
          };
        }

        const maxDetail =
          rect.width -
          sidebarSpace -
          (current.treeCollapsed ? MIN_WIDTHS.collapsed : MIN_WIDTHS.tree);
        return {
          ...current,
          detailCollapsed: false,
          detailWidth: clamp(rect.right - event.clientX, MIN_WIDTHS.detail, maxDetail)
        };
      });
    };

    const stopDrag = () => setDragTarget(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [dragTarget]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dragTarget) {
        setDragTarget(null);
        return;
      }
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
        return;
      }
      if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key === "\\") {
        event.preventDefault();
        toggleDetail();
        return;
      }
      if (event.ctrlKey && event.altKey && !event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        resetLayout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dragTarget, resetLayout, toggleDetail, toggleSidebar]);

  return {
    containerRef,
    layout,
    dragTarget,
    isNarrow,
    isTouchDevice,
    viewportWidth,
    minWidths: MIN_WIDTHS,
    resetLayout,
    startDrag,
    toggleDetail,
    toggleSidebar,
    toggleTree
  };
}
