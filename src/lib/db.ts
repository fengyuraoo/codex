import Dexie, { type Table } from "dexie";
import type { AppSettings, MaterialNode, RecordingItem } from "@/types";

export class SpeakingMapDatabase extends Dexie {
  materialNodes!: Table<MaterialNode, string>;
  recordings!: Table<RecordingItem, string>;
  appSettings!: Table<AppSettings, string>;

  constructor() {
    super("my-speaking-material-map");
    this.version(1).stores({
      materialNodes: "id, parentId, order, updatedAt",
      recordings: "id, nodeId, createdAt",
      appSettings: "id"
    });
  }
}

export const db = new SpeakingMapDatabase();
