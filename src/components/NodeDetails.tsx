"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Edit3, FilePlus2, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NodeRecorder } from "@/components/NodeRecorder";
import { SpeakButton } from "@/components/SpeakButton";
import { cn, formatDateTime } from "@/lib/utils";
import { useMaterialStore } from "@/store/useMaterialStore";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import type { MaterialNode, VocabularyDifficulty } from "@/types";

function toLines(items: string[]) {
  return items.join("\n");
}

function fromLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ContentBlock({
  action,
  title,
  children
}: {
  action?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </h3>
        {action}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">
        {children}
      </div>
    </section>
  );
}

export function NodeDetails({
  onBack,
  scrollInside = true
}: {
  onBack?: () => void;
  scrollInside?: boolean;
}) {
  const nodes = useMaterialStore((state) => state.nodes);
  const selectedNodeId = useMaterialStore((state) => state.selectedNodeId);
  const saveNode = useMaterialStore((state) => state.saveNode);
  const addNode = useMaterialStore((state) => state.addNode);
  const deleteNode = useMaterialStore((state) => state.deleteNode);
  const vocabularyItems = useVocabularyStore((state) => state.items);
  const initializeVocabulary = useVocabularyStore((state) => state.initialize);
  const addVocabularyItem = useVocabularyStore((state) => state.addItem);
  const selected = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );
  const [draft, setDraft] = useState<MaterialNode | null>(selected ?? null);
  const [tagText, setTagText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showVocabularyForm, setShowVocabularyForm] = useState(false);
  const [vocabularyDraft, setVocabularyDraft] = useState({
    word: "",
    meaningZh: "",
    meaningEn: "",
    exampleSentence: "",
    exampleTranslation: "",
    tags: "",
    difficulty: "medium" as VocabularyDifficulty
  });
  const isRoot = selected?.parentId === null;
  const nodeVocabulary = useMemo(
    () => vocabularyItems.filter((item) => item.nodeId === selected?.id),
    [selected?.id, vocabularyItems]
  );
  const recentVocabulary = nodeVocabulary.slice(0, 5);

  useEffect(() => {
    setDraft(selected ?? null);
    setTagText((selected?.tags ?? []).join(", "));
    setQuestionText(toLines(selected?.relatedQuestions ?? []));
    setIsEditing(false);
  }, [selected]);

  useEffect(() => {
    void initializeVocabulary();
  }, [initializeVocabulary]);

  if (!selected || !draft) {
    return (
      <aside className="h-full w-full shrink-0 bg-background p-6">
        <p className="text-sm text-muted">请选择一个素材节点 / Select a material node.</p>
      </aside>
    );
  }

  const save = async () => {
    await saveNode({
      ...draft,
      tags: tagText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      relatedQuestions: fromLines(questionText)
    });
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(selected);
    setTagText(selected.tags.join(", "));
    setQuestionText(toLines(selected.relatedQuestions));
    setIsEditing(false);
  };

  const resetVocabularyDraft = () => {
    setVocabularyDraft({
      word: "",
      meaningZh: "",
      meaningEn: "",
      exampleSentence: "",
      exampleTranslation: "",
      tags: "",
      difficulty: "medium"
    });
  };

  const saveVocabulary = async () => {
    if (!selected || !vocabularyDraft.word.trim()) return;
    await addVocabularyItem({
      nodeId: selected.id,
      word: vocabularyDraft.word.trim(),
      meaningZh: vocabularyDraft.meaningZh.trim(),
      meaningEn: vocabularyDraft.meaningEn.trim(),
      exampleSentence: vocabularyDraft.exampleSentence.trim(),
      exampleTranslation: vocabularyDraft.exampleTranslation.trim() || undefined,
      tags: vocabularyDraft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      difficulty: vocabularyDraft.difficulty,
      status: "new"
    });
    resetVocabularyDraft();
    setShowVocabularyForm(false);
  };

  return (
    <aside
      className={cn(
        "quiet-scrollbar h-full w-full shrink-0 bg-background",
        scrollInside ? "overflow-auto" : "overflow-visible"
      )}
    >
      <div className="mx-auto min-h-full max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        {onBack && (
          <Button
            className="mb-4 min-h-10"
            onClick={onBack}
            size="sm"
            variant="secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            返回素材库
          </Button>
        )}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-medium text-muted">
              READ · SPEAK · REFLECT
            </p>
            <h2 className="break-words text-3xl font-semibold leading-tight text-foreground">
              {isEditing ? draft.zhTitle : selected.zhTitle}
            </h2>
            <p className="mt-2 break-words text-base text-muted">
              {isEditing ? draft.enTitle : selected.enTitle}
            </p>
            {!isEditing && (
              <div className="mt-3">
                <SpeakButton label="听标题" text={selected.enTitle} />
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              onClick={() => void addNode(selected.id)}
              size="icon"
              title="新增子节点 / Add child node"
              variant="secondary"
            >
              <FilePlus2 className="h-4 w-4" />
            </Button>
            {isEditing ? (
              <>
                <Button onClick={() => void save()} size="icon" title="保存 / Save">
                  <Save className="h-4 w-4" />
                </Button>
                <Button onClick={cancel} size="icon" title="取消 / Cancel" variant="secondary">
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                title="编辑素材"
                variant="secondary"
              >
                <Edit3 className="h-4 w-4" />
                编辑素材
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted">中文标题</span>
                <Input
                  onChange={(event) =>
                    setDraft({ ...draft, zhTitle: event.target.value })
                  }
                  value={draft.zhTitle}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted">English title</span>
                <Input
                  onChange={(event) =>
                    setDraft({ ...draft, enTitle: event.target.value })
                  }
                  value={draft.enTitle}
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">中文摘要 / Summary</span>
              <Input
                onChange={(event) =>
                  setDraft({ ...draft, zhSummary: event.target.value })
                }
                value={draft.zhSummary}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">English summary</span>
              <Input
                onChange={(event) =>
                  setDraft({ ...draft, enSummary: event.target.value })
                }
                value={draft.enSummary}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">中文想法</span>
              <Textarea
                onChange={(event) =>
                  setDraft({ ...draft, zhContent: event.target.value })
                }
                value={draft.zhContent}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">英文表达</span>
              <Textarea
                onChange={(event) =>
                  setDraft({ ...draft, enContent: event.target.value })
                }
                value={draft.enContent}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">可用话题</span>
              <Input
                onChange={(event) => setTagText(event.target.value)}
                placeholder="用英文逗号分隔 / Separate with commas"
                value={tagText}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">
                相关题目（每行一题）
              </span>
              <Textarea
                className="min-h-24"
                onChange={(event) => setQuestionText(event.target.value)}
                placeholder="每行一个问题 / One question per line"
                value={questionText}
              />
            </label>

            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button onClick={cancel} variant="secondary">
                取消 / Cancel
              </Button>
              <Button onClick={() => void save()}>
                <Save className="h-4 w-4" />
                保存 / Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-sm leading-7 text-muted">{selected.zhSummary}</p>
              <p className="mt-1 text-sm leading-7 text-muted">{selected.enSummary}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <ContentBlock title="中文想法 / Chinese Notes">
              {selected.zhContent || "待补充"}
            </ContentBlock>

            <ContentBlock
              action={
                <SpeakButton
                  label="听英文示范"
                  size="md"
                  text={selected.enContent}
                />
              }
              title="英文表达 / English Expression"
            >
              {selected.enContent || "To be completed."}
            </ContentBlock>

            <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  相关题目 / Related Questions
                </h3>
                <SpeakButton
                  label="朗读全部 / Speak all"
                  text={selected.relatedQuestions.join(". ")}
                />
              </div>
              {selected.relatedQuestions.length ? (
                <ul className="space-y-2 pl-4 text-sm leading-6 text-foreground">
                  {selected.relatedQuestions.map((question) => (
                    <li className="list-disc marker:text-[#c7b79f]" key={question}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{question}</span>
                        <SpeakButton label="Speak" text={question} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">待补充 / To be completed.</p>
              )}
            </section>
          </div>
        )}

        <div className="mt-5">
          <NodeRecorder nodeId={selected.id} />
        </div>

        <section className="mt-5 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">节点词汇 / Node Vocabulary</h3>
              <p className="mt-1 text-xs text-muted">
                {nodeVocabulary.length} words linked to this node.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="min-h-10"
                onClick={() => setShowVocabularyForm((current) => !current)}
                size="sm"
                variant="secondary"
              >
                <FilePlus2 className="h-4 w-4" />
                添加词汇 / Add Vocabulary
              </Button>
              <Button asChild className="min-h-10" size="sm" variant="secondary">
                <Link href="/vocabulary">查看全部 / View All</Link>
              </Button>
            </div>
          </div>

          {recentVocabulary.length ? (
            <div className="mb-3 grid gap-2">
              {recentVocabulary.map((item) => (
                <div
                  className="rounded-md border border-border bg-[#fffaf3] p-3 text-sm"
                  key={item.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.word}</p>
                      <p className="mt-1 text-xs text-muted">{item.meaningZh}</p>
                    </div>
                    <SpeakButton label="Speak" text={item.word} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-3 text-sm text-muted">
              No vocabulary yet. Add useful words from this material.
            </p>
          )}

          {showVocabularyForm && (
            <div className="grid gap-3 rounded-lg border border-border bg-[#fffaf3] p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  onChange={(event) =>
                    setVocabularyDraft({
                      ...vocabularyDraft,
                      word: event.target.value
                    })
                  }
                  placeholder="word / phrase"
                  value={vocabularyDraft.word}
                />
                <Input
                  onChange={(event) =>
                    setVocabularyDraft({
                      ...vocabularyDraft,
                      meaningZh: event.target.value
                    })
                  }
                  placeholder="中文含义"
                  value={vocabularyDraft.meaningZh}
                />
              </div>
              <Input
                onChange={(event) =>
                  setVocabularyDraft({
                    ...vocabularyDraft,
                    meaningEn: event.target.value
                  })
                }
                placeholder="English definition"
                value={vocabularyDraft.meaningEn}
              />
              <Textarea
                className="min-h-24"
                onChange={(event) =>
                  setVocabularyDraft({
                    ...vocabularyDraft,
                    exampleSentence: event.target.value
                  })
                }
                placeholder="Example sentence"
                value={vocabularyDraft.exampleSentence}
              />
              <Input
                onChange={(event) =>
                  setVocabularyDraft({
                    ...vocabularyDraft,
                    exampleTranslation: event.target.value
                  })
                }
                placeholder="例句翻译（可选）"
                value={vocabularyDraft.exampleTranslation}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  onChange={(event) =>
                    setVocabularyDraft({
                      ...vocabularyDraft,
                      tags: event.target.value
                    })
                  }
                  placeholder="tags, separated by commas"
                  value={vocabularyDraft.tags}
                />
                <select
                  className="h-10 rounded-md border border-border bg-card px-3 text-sm"
                  onChange={(event) =>
                    setVocabularyDraft({
                      ...vocabularyDraft,
                      difficulty: event.target.value as VocabularyDifficulty
                    })
                  }
                  value={vocabularyDraft.difficulty}
                >
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => {
                    resetVocabularyDraft();
                    setShowVocabularyForm(false);
                  }}
                  variant="secondary"
                >
                  取消 / Cancel
                </Button>
                <Button onClick={() => void saveVocabulary()}>
                  保存词汇 / Save Vocabulary
                </Button>
              </div>
            </div>
          )}
        </section>

        <div className="mt-5 rounded-lg border border-border bg-[#fffaf3] p-3 text-xs leading-5 text-muted">
          Created {formatDateTime(selected.createdAt)}
          <br />
          Updated {formatDateTime(selected.updatedAt)}
        </div>


        {!isRoot && (
          <Button
            className="mt-5 w-full"
            onClick={() => {
              if (window.confirm("确认删除这个节点及其子节点和录音吗？")) {
                void deleteNode(selected.id);
              }
            }}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
            删除节点 / Delete node
          </Button>
        )}
      </div>
    </aside>
  );
}
