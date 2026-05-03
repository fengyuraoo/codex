"use client";

import { db } from "@/lib/db";
import type { AppSettings, MaterialNode, RecordingItem } from "@/types";

const BACKUP_VERSION = 1;
const APP_NAME = "Speaking Map";
export const LAYOUT_STORAGE_KEY = "my-speaking-material-map:panel-layout";

type BackupRecording = {
  id: string;
  nodeId: string;
  audioData: string;
  mimeType: string;
  duration: number;
  reviewNote: string;
  createdAt: string;
};

export type FullBackup = {
  backupVersion: number;
  exportedAt: string;
  appName: string;
  materialNodes: MaterialNode[];
  recordings: BackupRecording[];
  appSettings: AppSettings[];
  layoutSettings?: unknown;
};

export type ImportMode = "merge" | "replace";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string, mimeType: string) {
  const parts = dataUrl.split(",");
  if (parts.length !== 2) throw new Error("Invalid audio data");
  const binary = atob(parts[1]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function readLayoutSettings() {
  if (typeof window === "undefined") return undefined;
  const layoutRaw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
  if (!layoutRaw) return undefined;
  try {
    return JSON.parse(layoutRaw) as unknown;
  } catch {
    return layoutRaw;
  }
}

export function timestampForBackupName(date = new Date()) {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

export function validateFullBackup(value: unknown): asserts value is FullBackup {
  if (!value || typeof value !== "object") throw new Error("Invalid backup file");
  const backup = value as Partial<FullBackup>;
  if (backup.backupVersion !== BACKUP_VERSION || backup.appName !== APP_NAME) {
    throw new Error("This is not a Speaking Map full backup");
  }
  if (!Array.isArray(backup.materialNodes) || !Array.isArray(backup.recordings)) {
    throw new Error("Backup is missing required data");
  }
  for (const recording of backup.recordings) {
    if (
      !recording ||
      typeof recording !== "object" ||
      typeof recording.id !== "string" ||
      typeof recording.nodeId !== "string" ||
      typeof recording.audioData !== "string"
    ) {
      throw new Error("Backup contains invalid recording data");
    }
  }
}

export async function createFullBackup(): Promise<FullBackup> {
  const [materialNodes, recordings, appSettings] = await Promise.all([
    db.materialNodes.toArray(),
    db.recordings.toArray(),
    db.appSettings.toArray()
  ]);
  return {
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    appName: APP_NAME,
    materialNodes,
    recordings: await Promise.all(
      recordings.map(async (recording) => ({
        id: recording.id,
        nodeId: recording.nodeId,
        audioData: await blobToDataUrl(recording.audioBlob),
        mimeType: recording.audioBlob.type || "audio/webm",
        duration: recording.duration,
        reviewNote: recording.reviewNote,
        createdAt: recording.createdAt
      }))
    ),
    appSettings,
    layoutSettings: readLayoutSettings()
  };
}

export async function importFullBackup(backup: FullBackup, mode: ImportMode) {
  validateFullBackup(backup);
  const recordings: RecordingItem[] = backup.recordings.map((recording) => ({
    id: recording.id,
    nodeId: recording.nodeId,
    audioBlob: dataUrlToBlob(recording.audioData, recording.mimeType),
    duration: recording.duration,
    reviewNote: recording.reviewNote,
    createdAt: recording.createdAt
  }));

  await db.transaction("rw", db.materialNodes, db.recordings, db.appSettings, async () => {
    if (mode === "replace") {
      await db.materialNodes.clear();
      await db.recordings.clear();
      await db.appSettings.clear();
    }
    await db.materialNodes.bulkPut(backup.materialNodes);
    if (recordings.length) await db.recordings.bulkPut(recordings);
    if (backup.appSettings?.length) await db.appSettings.bulkPut(backup.appSettings);
  });

  if (backup.layoutSettings && typeof window !== "undefined") {
    window.localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify(backup.layoutSettings)
    );
  }
}
