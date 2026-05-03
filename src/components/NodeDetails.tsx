"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Edit3, FilePlus2, Save, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NodeRecorder } from "@/components/NodeRecorder";
import { cn, formatDateTime } from "@/lib/utils";
import { useMaterialStore } from "@/store/useMaterialStore";
import type { MaterialNode } from "@/types";

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
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </h3>
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
  const selected = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );
  const [draft, setDraft] = useState<MaterialNode | null>(selected ?? null);
  const [tagText, setTagText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const isRoot = selected?.parentId === null;

  useEffect(() => {
    setDraft(selected ?? null);
    setTagText((selected?.tags ?? []).join(", "));
    setQuestionText(toLines(selected?.relatedQuestions ?? []));
    setIsEditing(false);
  }, [selected]);

  if (!selected || !draft) {
    return (
      <aside className="h-full w-full shrink-0 border-l border-border bg-[#fbf4ea] p-6">
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

  return (
    <aside
      className={cn(
        "quiet-scrollbar h-full w-full shrink-0 border-l border-border bg-[#fbf4ea]",
        scrollInside ? "overflow-auto" : "overflow-visible"
      )}
    >
      <div className="min-h-full px-6 py-7">
        {onBack && (
          <Button
            className="mb-4 min-h-10"
            onClick={onBack}
            size="sm"
            variant="secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            返回素材树 / Back to tree
          </Button>
        )}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-medium text-muted">
              Node detail / 素材详情
            </p>
            <h2 className="break-words text-3xl font-semibold leading-tight text-foreground">
              {isEditing ? draft.zhTitle : selected.zhTitle}
            </h2>
            <p className="mt-2 break-words text-base text-muted">
              {isEditing ? draft.enTitle : selected.enTitle}
            </p>
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
                title="编辑 / Edit"
                variant="secondary"
              >
                <Edit3 className="h-4 w-4" />
                编辑 / Edit
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
              <span className="mb-1 block text-xs text-muted">中文想法 zhContent</span>
              <Textarea
                onChange={(event) =>
                  setDraft({ ...draft, zhContent: event.target.value })
                }
                value={draft.zhContent}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">英文表达 enContent</span>
              <Textarea
                onChange={(event) =>
                  setDraft({ ...draft, enContent: event.target.value })
                }
                value={draft.enContent}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">可用话题 tags</span>
              <Input
                onChange={(event) => setTagText(event.target.value)}
                placeholder="用英文逗号分隔 / Separate with commas"
                value={tagText}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted">
                相关题目 relatedQuestions（附属信息）
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

            <ContentBlock title="英文表达 / English Expression">
              {selected.enContent || "To be completed."}
            </ContentBlock>

            <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                相关题目 / Related Questions
              </h3>
              {selected.relatedQuestions.length ? (
                <ul className="space-y-2 pl-4 text-sm leading-6 text-foreground">
                  {selected.relatedQuestions.map((question) => (
                    <li className="list-disc marker:text-[#c7b79f]" key={question}>
                      {question}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">待补充 / To be completed.</p>
              )}
            </section>
          </div>
        )}

        <div className="mt-5 rounded-lg border border-border bg-[#fffaf3] p-3 text-xs leading-5 text-muted">
          Created {formatDateTime(selected.createdAt)}
          <br />
          Updated {formatDateTime(selected.updatedAt)}
        </div>

        <div className="mt-5">
          <NodeRecorder nodeId={selected.id} />
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
