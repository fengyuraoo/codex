"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenText, FilePlus2, Save, Trash2, X } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { SpeakButton } from "@/components/SpeakButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMaterialStore } from "@/store/useMaterialStore";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import type {
  VocabularyDifficulty,
  VocabularyItem,
  VocabularyStatus
} from "@/types";

type Draft = {
  id?: string;
  nodeId: string;
  word: string;
  phrase: string;
  meaningZh: string;
  meaningEn: string;
  exampleSentence: string;
  exampleTranslation: string;
  tags: string;
  difficulty: VocabularyDifficulty;
  status: VocabularyStatus;
};

const emptyDraft: Draft = {
  nodeId: "",
  word: "",
  phrase: "",
  meaningZh: "",
  meaningEn: "",
  exampleSentence: "",
  exampleTranslation: "",
  tags: "",
  difficulty: "medium",
  status: "new"
};

function toDraft(item: VocabularyItem): Draft {
  return {
    id: item.id,
    nodeId: item.nodeId ?? "",
    word: item.word,
    phrase: item.phrase ?? "",
    meaningZh: item.meaningZh,
    meaningEn: item.meaningEn,
    exampleSentence: item.exampleSentence,
    exampleTranslation: item.exampleTranslation ?? "",
    tags: item.tags.join(", "),
    difficulty: item.difficulty,
    status: item.status
  };
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function VocabularyPage() {
  const nodes = useMaterialStore((state) => state.nodes);
  const items = useVocabularyStore((state) => state.items);
  const initializeVocabulary = useVocabularyStore((state) => state.initialize);
  const addItem = useVocabularyStore((state) => state.addItem);
  const updateItem = useVocabularyStore((state) => state.updateItem);
  const deleteItem = useVocabularyStore((state) => state.deleteItem);
  const [statusFilter, setStatusFilter] = useState<"all" | VocabularyStatus>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | VocabularyDifficulty>(
    "all"
  );
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  useEffect(() => {
    void initializeVocabulary();
  }, [initializeVocabulary]);

  const nodeTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    nodes.forEach((node) => map.set(node.id, `${node.zhTitle} / ${node.enTitle}`));
    return map;
  }, [nodes]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const statusOk = statusFilter === "all" || item.status === statusFilter;
        const difficultyOk =
          difficultyFilter === "all" || item.difficulty === difficultyFilter;
        return statusOk && difficultyOk;
      }),
    [difficultyFilter, items, statusFilter]
  );

  const resetForm = () => {
    setDraft(emptyDraft);
    setShowForm(false);
  };

  const saveDraft = async () => {
    if (!draft.word.trim()) return;
    const base = {
      nodeId: draft.nodeId || undefined,
      word: draft.word.trim(),
      phrase: draft.phrase.trim() || undefined,
      meaningZh: draft.meaningZh.trim(),
      meaningEn: draft.meaningEn.trim(),
      exampleSentence: draft.exampleSentence.trim(),
      exampleTranslation: draft.exampleTranslation.trim() || undefined,
      tags: splitTags(draft.tags),
      difficulty: draft.difficulty,
      status: draft.status
    };

    if (draft.id) {
      const existing = items.find((item) => item.id === draft.id);
      if (!existing) return;
      await updateItem({
        ...existing,
        ...base
      });
    } else {
      await addItem(base);
    }
    resetForm();
  };

  return (
    <AppFrame>
      <div className="quiet-scrollbar h-full overflow-auto bg-background px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <BookOpenText className="h-4 w-4" />
              Vocabulary / 词汇
            </div>
            <h2 className="text-2xl font-semibold">单词卡片 / Vocabulary Cards</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              手动整理英文素材里的重点词和短语，并用浏览器朗读进行复习。
            </p>
          </div>
          <Button
            className="min-h-10"
            onClick={() => {
              setDraft(emptyDraft);
              setShowForm(true);
            }}
          >
            <FilePlus2 className="h-4 w-4" />
            新增单词 / Add Word
          </Button>
        </div>

        <section className="mb-4 rounded-lg border border-border bg-card p-4 shadow-notion">
          <div className="flex flex-wrap gap-2">
            {(["all", "new", "learning", "mastered"] as const).map((status) => (
              <Button
                className="min-h-10"
                key={status}
                onClick={() => setStatusFilter(status)}
                size="sm"
                variant={statusFilter === status ? "default" : "secondary"}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
            {(["all", "easy", "medium", "hard"] as const).map((difficulty) => (
              <Button
                className="min-h-10"
                key={difficulty}
                onClick={() => setDifficultyFilter(difficulty)}
                size="sm"
                variant={difficultyFilter === difficulty ? "default" : "secondary"}
              >
                {difficulty === "all" ? "All levels" : difficulty}
              </Button>
            ))}
          </div>
        </section>

        {showForm && (
          <section className="mb-4 rounded-lg border border-border bg-card p-4 shadow-notion">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold">
                {draft.id ? "编辑单词 / Edit Word" : "新增单词 / Add Word"}
              </h3>
              <Button onClick={resetForm} size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                onChange={(event) => setDraft({ ...draft, word: event.target.value })}
                placeholder="word / phrase"
                value={draft.word}
              />
              <Input
                onChange={(event) => setDraft({ ...draft, meaningZh: event.target.value })}
                placeholder="中文含义"
                value={draft.meaningZh}
              />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Input
                onChange={(event) => setDraft({ ...draft, phrase: event.target.value })}
                placeholder="phrase alias (optional)"
                value={draft.phrase}
              />
              <select
                className="h-10 rounded-md border border-border bg-card px-3 text-sm"
                onChange={(event) => setDraft({ ...draft, nodeId: event.target.value })}
                value={draft.nodeId}
              >
                <option value="">No linked node</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.zhTitle} / {node.enTitle}
                  </option>
                ))}
              </select>
            </div>
            <Input
              className="mt-3"
              onChange={(event) => setDraft({ ...draft, meaningEn: event.target.value })}
              placeholder="English definition"
              value={draft.meaningEn}
            />
            <Textarea
              className="mt-3 min-h-24"
              onChange={(event) =>
                setDraft({ ...draft, exampleSentence: event.target.value })
              }
              placeholder="Example sentence"
              value={draft.exampleSentence}
            />
            <Input
              className="mt-3"
              onChange={(event) =>
                setDraft({ ...draft, exampleTranslation: event.target.value })
              }
              placeholder="例句翻译（可选）"
              value={draft.exampleTranslation}
            />
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <Input
                onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                placeholder="tags, separated by commas"
                value={draft.tags}
              />
              <select
                className="h-10 rounded-md border border-border bg-card px-3 text-sm"
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    difficulty: event.target.value as VocabularyDifficulty
                  })
                }
                value={draft.difficulty}
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              <select
                className="h-10 rounded-md border border-border bg-card px-3 text-sm"
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as VocabularyStatus })
                }
                value={draft.status}
              >
                <option value="new">new</option>
                <option value="learning">learning</option>
                <option value="mastered">mastered</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={resetForm} variant="secondary">
                取消 / Cancel
              </Button>
              <Button onClick={() => void saveDraft()}>
                <Save className="h-4 w-4" />
                保存 / Save
              </Button>
            </div>
          </section>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredItems.map((item) => (
            <article
              className="rounded-lg border border-border bg-card p-4 shadow-notion"
              key={item.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{item.word}</h3>
                  {item.phrase && (
                    <p className="mt-1 text-sm text-muted">{item.phrase}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <SpeakButton label="Speak word" text={item.word} />
                  <SpeakButton label="Speak example" text={item.exampleSentence} />
                </div>
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">{item.meaningZh}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.meaningEn}</p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {item.exampleSentence}
              </p>
              {item.exampleTranslation && (
                <p className="mt-1 text-sm leading-6 text-muted">
                  {item.exampleTranslation}
                </p>
              )}
              <p className="mt-3 text-xs text-muted">
                Node: {item.nodeId ? nodeTitleMap.get(item.nodeId) ?? item.nodeId : "None"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{item.difficulty}</Badge>
                <Badge>{item.status}</Badge>
                {item.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex flex-wrap gap-2">
                  {(["new", "learning", "mastered"] as const).map((status) => (
                    <Button
                      className="min-h-10"
                      key={status}
                      onClick={() => void updateItem({ ...item, status })}
                      size="sm"
                      variant={item.status === status ? "default" : "secondary"}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    className="min-h-10"
                    onClick={() => {
                      setDraft(toDraft(item));
                      setShowForm(true);
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    编辑 / Edit
                  </Button>
                  <Button
                    className="min-h-10"
                    onClick={() => {
                      if (window.confirm("确认删除这个词汇卡片吗？")) {
                        void deleteItem(item.id);
                      }
                    }}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    删除
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppFrame>
  );
}
