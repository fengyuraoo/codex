"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Mic } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useMaterialStore } from "@/store/useMaterialStore";

function AudioPlayer({ blob }: { blob: Blob }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  useEffect(() => {
    return () => URL.revokeObjectURL(url);
  }, [url]);
  return <audio className="w-full" controls src={url} />;
}

export default function RecordingsPage() {
  const nodes = useMaterialStore((state) => state.nodes);
  const recordings = useMaterialStore((state) => state.recordings);
  const updateRecording = useMaterialStore((state) => state.updateRecording);
  const deleteRecording = useMaterialStore((state) => state.deleteRecording);

  return (
    <AppFrame>
      <div className="quiet-scrollbar h-full overflow-auto px-8 py-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted">
              <Mic className="h-4 w-4" />
              Recording archive
            </div>
            <h2 className="text-2xl font-semibold">录音历史 / Recordings</h2>
            <p className="mt-2 text-sm text-muted">
              这里可以查看所有节点录音；新录音仍需在素材节点详情里创建。
            </p>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              回到素材树
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {recordings.map((recording) => {
            const node = nodes.find((item) => item.id === recording.nodeId);
            return (
              <article
                className="rounded-lg border border-border bg-card p-4 shadow-notion"
                key={recording.id}
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {node?.zhTitle ?? "已删除节点"} / {node?.enTitle ?? "Deleted node"}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {formatDuration(recording.duration)} ·{" "}
                      {formatDateTime(recording.createdAt)}
                    </p>
                  </div>
                  <Button
                    onClick={() => void deleteRecording(recording.id)}
                    size="sm"
                    variant="ghost"
                  >
                    删除录音
                  </Button>
                </div>
                <AudioPlayer blob={recording.audioBlob} />
                <Textarea
                  className="mt-3 min-h-20"
                  onChange={(event) =>
                    void updateRecording({
                      ...recording,
                      reviewNote: event.target.value
                    })
                  }
                  placeholder="复盘记录 / Review note"
                  value={recording.reviewNote}
                />
              </article>
            );
          })}
          {!recordings.length && (
            <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
              还没有录音。回到 Map，选择一个素材节点后开始录音。
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
