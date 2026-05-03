"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  FilePlus2,
  FileText,
  Folder,
  FolderOpen,
  FolderTree
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMaterialStore } from "@/store/useMaterialStore";
import type { MaterialNode } from "@/types";

type NodeWithChildren = Omit<MaterialNode, "children"> & {
  children: NodeWithChildren[];
};

function buildTree(nodes: MaterialNode[]): NodeWithChildren[] {
  const map = new Map<string, NodeWithChildren>();
  nodes.forEach((node) => map.set(node.id, { ...node, children: [] }));
  const roots: NodeWithChildren[] = [];

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (items: NodeWithChildren[]) => {
    items.sort((a, b) => a.order - b.order || a.zhTitle.localeCompare(b.zhTitle));
    items.forEach((item) => sortTree(item.children));
  };
  sortTree(roots);
  return roots;
}

function TreeNodeRow({
  onNodeSelect,
  node,
  level,
  expanded,
  toggle
}: {
  onNodeSelect?: () => void;
  node: NodeWithChildren;
  level: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
}) {
  const selectedNodeId = useMaterialStore((state) => state.selectedNodeId);
  const selectNode = useMaterialStore((state) => state.selectNode);
  const addNode = useMaterialStore((state) => state.addNode);
  const isSelected = selectedNodeId === node.id;
  const isExpanded = expanded.has(node.id);
  const hasChildren = node.children.length > 0;
  const Icon = hasChildren ? (isExpanded ? FolderOpen : Folder) : FileText;

  return (
    <div className="relative">
      {level > 0 && (
        <span
          className="absolute bottom-1 top-1 w-px bg-[#eadfce]"
          style={{ left: `${18 + (level - 1) * 24}px` }}
        />
      )}
      <div
        className={cn(
          "group my-1 flex min-h-12 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
          "hover:bg-[#f6efe4]",
          isSelected && "bg-[#efe3d2] shadow-sm ring-1 ring-[#dccbb5] hover:bg-[#efe3d2]"
        )}
        style={{ paddingLeft: `${10 + level * 24}px` }}
      >
        <button
          aria-label={isExpanded ? "Collapse" : "Expand"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-card hover:text-foreground"
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) toggle(node.id);
          }}
          type="button"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-[#cdbfae]" />
          )}
        </button>

        <button
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          onClick={() => {
            selectNode(node.id);
            onNodeSelect?.();
          }}
          type="button"
        >
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              hasChildren ? "text-[#9b7a55]" : "text-[#afa292]"
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium leading-5 text-foreground">
              {node.zhTitle}
            </span>
            <span className="block truncate text-xs leading-5 text-muted">
              {node.enTitle}
            </span>
          </span>
        </button>

        <button
          aria-label="Add child node"
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-card hover:text-foreground group-hover:flex"
          onClick={(event) => {
            event.stopPropagation();
            void addNode(node.id);
          }}
          title="新增子节点 / Add child node"
          type="button"
        >
          <FilePlus2 className="h-4 w-4" />
        </button>
      </div>

      {isExpanded &&
        node.children.map((child) => (
          <TreeNodeRow
            expanded={expanded}
            key={child.id}
            level={level + 1}
            node={child}
            onNodeSelect={onNodeSelect}
            toggle={toggle}
          />
        ))}
    </div>
  );
}

export function TreeView({
  onNodeSelect,
  scrollInside = true,
  toolbar
}: {
  onNodeSelect?: () => void;
  scrollInside?: boolean;
  toolbar?: ReactNode;
}) {
  const nodes = useMaterialStore((state) => state.nodes);
  const addNode = useMaterialStore((state) => state.addNode);
  const tree = useMemo(() => buildTree(nodes), [nodes]);
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set([
        "feng-yurao",
        ...nodes.filter((node) => node.parentId === "feng-yurao").map((node) => node.id)
      ])
  );

  useEffect(() => {
    if (!nodes.length) return;
    setExpanded((current) => {
      const next = new Set(current);
      next.add("feng-yurao");
      nodes
        .filter((node) => node.parentId === "feng-yurao")
        .forEach((node) => next.add(node.id));
      return next;
    });
  }, [nodes]);

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="flex h-full min-w-0 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-[220px] flex-1">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <FolderTree className="h-4 w-4" />
            Local-first material tree
          </div>
          <h2 className="text-2xl font-semibold">树状笔记库 / Tree View</h2>
          <p className="mt-2 text-sm text-muted">
            以“冯雨娆 / Feng Yurao”为中心整理雅思口语素材
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          {toolbar}
          <Button
            className="min-h-10"
            onClick={() => void addNode("feng-yurao")}
            size="sm"
          >
            <FilePlus2 className="h-4 w-4" />
            新增素材
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "quiet-scrollbar min-h-0 rounded-xl border border-border bg-card p-3 shadow-notion sm:p-4",
          scrollInside ? "flex-1 overflow-auto" : "overflow-visible"
        )}
      >
        <div className="space-y-0.5">
          {tree.map((node) => (
            <TreeNodeRow
              expanded={expanded}
              key={node.id}
              level={0}
              node={node}
              onNodeSelect={onNodeSelect}
              toggle={toggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
