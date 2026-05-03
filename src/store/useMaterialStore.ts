"use client";

import { create } from "zustand";
import { db } from "@/lib/db";
import { makeId } from "@/lib/utils";
import { seedMaterials } from "@/data/seedMaterials";
import type {
  AppExport,
  AppSettings,
  ExportRecordingItem,
  MaterialNode,
  RecordingItem
} from "@/types";

type MaterialState = {
  nodes: MaterialNode[];
  recordings: RecordingItem[];
  settings: AppSettings | null;
  selectedNodeId: string;
  isReady: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  selectNode: (id: string) => void;
  saveNode: (node: MaterialNode) => Promise<void>;
  addNode: (parentId: string | null) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  addRecording: (nodeId: string, audioBlob: Blob, duration: number) => Promise<void>;
  updateRecording: (recording: RecordingItem) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  exportJson: () => Promise<AppExport>;
  importJson: (data: AppExport) => Promise<void>;
  clearAll: () => Promise<void>;
};

function flattenNodes(nodes: MaterialNode[]): MaterialNode[] {
  return nodes.flatMap((node) => {
    const { children, ...plainNode } = node;
    return [plainNode, ...flattenNodes(children ?? [])];
  });
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string, fallbackType: string) {
  const [meta, data] = dataUrl.split(",");
  const type = /data:(.*?);base64/.exec(meta)?.[1] ?? fallbackType;
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type });
}

async function ensureSeedData() {
  const count = await db.materialNodes.count();
  if (count > 0) return;
  const now = new Date().toISOString();
  await db.transaction("rw", db.materialNodes, db.appSettings, async () => {
    await db.materialNodes.bulkPut(flattenNodes(seedMaterials));
    await db.appSettings.put({
      id: "default",
      ownerName: "冯雨娆 / Feng Yurao",
      targetBand: "IELTS Speaking Band 7",
      seededAt: now,
      updatedAt: now
    });
  });
}

async function readAll() {
  const [nodes, recordings, settings] = await Promise.all([
    db.materialNodes.orderBy("order").toArray(),
    db.recordings.orderBy("createdAt").reverse().toArray(),
    db.appSettings.get("default")
  ]);
  return { nodes, recordings, settings: settings ?? null };
}

function collectDescendantIds(nodes: MaterialNode[], id: string) {
  const ids = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    }
  }
  return Array.from(ids);
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  nodes: [],
  recordings: [],
  settings: null,
  selectedNodeId: "feng-yurao",
  isReady: false,
  error: null,
  initialize: async () => {
    set({ error: null });
    try {
      await ensureSeedData();
      const snapshot = await readAll();
      set({
        ...snapshot,
        selectedNodeId:
          snapshot.nodes.find((node) => node.id === get().selectedNodeId)?.id ??
          snapshot.nodes.find((node) => node.id === "feng-yurao")?.id ??
          snapshot.nodes[0]?.id ??
          "feng-yurao",
        isReady: true,
        error: null
      });
    } catch (error) {
      set({
        isReady: true,
        error:
          error instanceof Error
            ? error.message
            : "IndexedDB initialization failed"
      });
    }
  },
  selectNode: (id) => set({ selectedNodeId: id }),
  saveNode: async (node) => {
    const nextNode = { ...node, updatedAt: new Date().toISOString() };
    await db.materialNodes.put(nextNode);
    set({
      nodes: get().nodes.map((item) => (item.id === nextNode.id ? nextNode : item))
    });
  },
  addNode: async (parentId) => {
    const siblings = get().nodes.filter((node) => node.parentId === parentId);
    const now = new Date().toISOString();
    const node: MaterialNode = {
      id: makeId("node"),
      parentId,
      order: Math.max(0, ...siblings.map((item) => item.order)) + 1,
      zhTitle: "待补充素材",
      enTitle: "New Material",
      zhSummary: "待补充：请写一句中文摘要。",
      enSummary: "To be completed: add a one-sentence English summary.",
      zhContent: "待补充：写下真实经历、可复用细节和中文想法。",
      enContent: "To be completed: write English expressions based on real experience.",
      tags: ["待补充"],
      relatedQuestions: [],
      createdAt: now,
      updatedAt: now
    };
    await db.materialNodes.add(node);
    set({ nodes: [...get().nodes, node], selectedNodeId: node.id });
  },
  deleteNode: async (id) => {
    const ids = collectDescendantIds(get().nodes, id);
    await db.transaction("rw", db.materialNodes, db.recordings, async () => {
      await db.materialNodes.bulkDelete(ids);
      const recordings = await db.recordings.where("nodeId").anyOf(ids).toArray();
      await db.recordings.bulkDelete(recordings.map((recording) => recording.id));
    });
    const nextNodes = get().nodes.filter((node) => !ids.includes(node.id));
    const nextRecordings = get().recordings.filter(
      (recording) => !ids.includes(recording.nodeId)
    );
    set({
      nodes: nextNodes,
      recordings: nextRecordings,
      selectedNodeId: nextNodes[0]?.id ?? ""
    });
  },
  addRecording: async (nodeId, audioBlob, duration) => {
    const recording: RecordingItem = {
      id: makeId("rec"),
      nodeId,
      audioBlob,
      duration,
      reviewNote: "",
      createdAt: new Date().toISOString()
    };
    await db.recordings.add(recording);
    set({ recordings: [recording, ...get().recordings] });
  },
  updateRecording: async (recording) => {
    await db.recordings.put(recording);
    set({
      recordings: get().recordings.map((item) =>
        item.id === recording.id ? recording : item
      )
    });
  },
  deleteRecording: async (id) => {
    await db.recordings.delete(id);
    set({ recordings: get().recordings.filter((recording) => recording.id !== id) });
  },
  exportJson: async () => {
    const [materialNodes, recordings, appSettings] = await Promise.all([
      db.materialNodes.toArray(),
      db.recordings.toArray(),
      db.appSettings.toArray()
    ]);
    const exportRecordings: ExportRecordingItem[] = await Promise.all(
      recordings.map(async (recording) => {
        const { audioBlob, ...rest } = recording;
        return {
          ...rest,
          audioDataUrl: await blobToDataUrl(audioBlob),
          audioType: audioBlob.type
        };
      })
    );
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      materialNodes,
      recordings: exportRecordings,
      appSettings
    };
  },
  importJson: async (data) => {
    if (data.version !== 1 || !Array.isArray(data.materialNodes)) {
      throw new Error("Unsupported JSON format");
    }
    const recordings: RecordingItem[] = (data.recordings ?? []).map((recording) => {
      const { audioDataUrl, audioType, ...rest } = recording;
      return {
        ...rest,
        audioBlob: dataUrlToBlob(audioDataUrl, audioType)
      };
    });
    await db.transaction("rw", db.materialNodes, db.recordings, db.appSettings, async () => {
      await db.materialNodes.clear();
      await db.recordings.clear();
      await db.appSettings.clear();
      await db.materialNodes.bulkAdd(data.materialNodes);
      if (recordings.length) await db.recordings.bulkAdd(recordings);
      await db.appSettings.bulkAdd(
        data.appSettings?.length
          ? data.appSettings
          : [
              {
                id: "default",
                ownerName: "冯雨娆 / Feng Yurao",
                targetBand: "IELTS Speaking Band 7",
                updatedAt: new Date().toISOString()
              }
            ]
      );
    });
    const snapshot = await readAll();
    set({
      ...snapshot,
      selectedNodeId: snapshot.nodes[0]?.id ?? "",
      isReady: true,
      error: null
    });
  },
  clearAll: async () => {
    await db.transaction("rw", db.materialNodes, db.recordings, db.appSettings, async () => {
      await db.materialNodes.clear();
      await db.recordings.clear();
      await db.appSettings.clear();
    });
    await ensureSeedData();
    const snapshot = await readAll();
    set({
      ...snapshot,
      selectedNodeId: "feng-yurao",
      isReady: true,
      error: null
    });
  }
}));
