"use client";

import { create } from "zustand";
import { seedVocabulary } from "@/data/seedVocabulary";
import { db } from "@/lib/db";
import { makeId } from "@/lib/utils";
import type { VocabularyItem } from "@/types";

type VocabularyInput = Omit<
  VocabularyItem,
  "id" | "source" | "createdAt" | "updatedAt"
> & {
  id?: string;
  source?: VocabularyItem["source"];
};

type VocabularyState = {
  items: VocabularyItem[];
  isReady: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addItem: (item: VocabularyInput) => Promise<VocabularyItem>;
  updateItem: (item: VocabularyItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

async function ensureSeedVocabulary() {
  const count = await db.vocabularyItems.count();
  if (count > 0) return;
  await db.vocabularyItems.bulkPut(seedVocabulary);
}

async function readVocabulary() {
  return db.vocabularyItems.orderBy("updatedAt").reverse().toArray();
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  items: [],
  isReady: false,
  error: null,
  initialize: async () => {
    set({ error: null });
    try {
      await ensureSeedVocabulary();
      set({
        items: await readVocabulary(),
        isReady: true,
        error: null
      });
    } catch (error) {
      set({
        isReady: true,
        error:
          error instanceof Error
            ? error.message
            : "Vocabulary initialization failed"
      });
    }
  },
  addItem: async (input) => {
    const now = new Date().toISOString();
    const item: VocabularyItem = {
      ...input,
      id: input.id ?? makeId("vocab"),
      source: input.source ?? "manual",
      createdAt: now,
      updatedAt: now
    };
    await db.vocabularyItems.put(item);
    set({ items: [item, ...get().items.filter((existing) => existing.id !== item.id)] });
    return item;
  },
  updateItem: async (item) => {
    const nextItem = { ...item, updatedAt: new Date().toISOString() };
    await db.vocabularyItems.put(nextItem);
    set({
      items: get().items.map((existing) =>
        existing.id === nextItem.id ? nextItem : existing
      )
    });
  },
  deleteItem: async (id) => {
    await db.vocabularyItems.delete(id);
    set({ items: get().items.filter((item) => item.id !== id) });
  }
}));
