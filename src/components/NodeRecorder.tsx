"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useMaterialStore } from "@/store/useMaterialStore";
import type { RecordingItem } from "@/types";

function isUsableAudioBlob(recording: RecordingItem) {
  const blob = recording.audioBlob;
  return blob instanceof Blob && blob.size > 0;
}

export function NodeRecorder({ nodeId }: { nodeId: string }) {
  const allRecordings = useMaterialStore((state) => state.recordings);
  const recordings = useMemo(
    () => allRecordings.filter((recording) => recording.nodeId === nodeId),
    [allRecordings, nodeId]
  );
  const addRecording = useMaterialStore((state) => state.addRecording);
  const updateRecording = useMaterialStore((state) => state.updateRecording);
  const deleteRecording = useMaterialStore((state) => state.deleteRecording);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<Record<string, string>>({});
  const loggedRecordingIdsRef = useRef<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const latestRecording = recordings[0];
  const visibleRecordings = recordings.slice(0, 5);

  useEffect(() => {
    const nextIds = new Set(recordings.map((recording) => recording.id));

    setAudioUrls((current) => {
      const next: Record<string, string> = {};

      for (const recording of recordings) {
        if (process.env.NODE_ENV === "development" && !loggedRecordingIdsRef.current.has(recording.id)) {
          console.debug("recording blob", {
            id: recording.id,
            isBlob: recording.audioBlob instanceof Blob,
            size: recording.audioBlob instanceof Blob ? recording.audioBlob.size : 0,
            type: recording.audioBlob instanceof Blob ? recording.audioBlob.type : typeof recording.audioBlob
          });
          loggedRecordingIdsRef.current.add(recording.id);
        }

        if (current[recording.id]) {
          next[recording.id] = current[recording.id];
        } else if (isUsableAudioBlob(recording)) {
          next[recording.id] = URL.createObjectURL(recording.audioBlob);
        }
      }

      for (const [id, url] of Object.entries(current)) {
        if (!nextIds.has(id)) URL.revokeObjectURL(url);
      }

      audioUrlsRef.current = next;
      return next;
    });
  }, [recordings]);

  useEffect(() => {
    return () => {
      Object.values(audioUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
      audioUrlsRef.current = {};
    };
  }, []);

  const playRecording = useCallback(
    async (recording: RecordingItem) => {
      const audio = audioRef.current;
      const url = audioUrls[recording.id];
      if (!audio || !url || !isUsableAudioBlob(recording)) return;

      if (playingId === recording.id && !audio.paused) {
        audio.pause();
        setPlayingId(null);
        return;
      }

      audio.pause();
      audio.src = url;
      audio.currentTime = 0;
      setCurrentTime(0);
      setPlayingId(recording.id);

      try {
        await audio.play();
      } catch {
        setPlayingId(null);
        setError("录音播放失败 / Audio playback failed.");
      }
    },
    [audioUrls, playingId]
  );

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm"
        });
        const duration = Math.max(1, (Date.now() - startedAtRef.current) / 1000);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        void addRecording(nodeId, blob, duration);
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("无法访问麦克风。请确认浏览器权限已允许 / Microphone permission is required.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const renderPlaybackButton = (recording: RecordingItem, label: string) => {
    const unavailable = !isUsableAudioBlob(recording) || !audioUrls[recording.id];
    const isPlaying = playingId === recording.id;

    return (
      <Button
        disabled={unavailable}
        onClick={() => void playRecording(recording)}
        size="sm"
        variant="secondary"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "暂停 / Pause" : label}
      </Button>
    );
  };

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <audio
        className="hidden"
        onEnded={() => {
          setPlayingId(null);
          setCurrentTime(0);
        }}
        onPause={() => {
          if (audioRef.current?.ended) setPlayingId(null);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        ref={audioRef}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">开口练一遍</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            对照上面的表达练习，再听听自己的进步。录音保存在此浏览器。
          </p>
        </div>
        <Badge>{recordings.length} local</Badge>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button disabled={isRecording} onClick={() => void startRecording()} size="sm">
          <Mic className="h-4 w-4" />
          开始录音
        </Button>
        <Button
          disabled={!isRecording}
          onClick={stopRecording}
          size="sm"
          variant="secondary"
        >
          <Square className="h-4 w-4" />
          结束并保存
        </Button>
        {latestRecording ? (
          renderPlaybackButton(latestRecording, "听最近一次")
        ) : (
          <Button disabled size="sm" variant="secondary">
            <Play className="h-4 w-4" />
            听最近一次
          </Button>
        )}
      </div>

      {isRecording && (
        <div className="mb-4 rounded-md border border-[#ead6ca] bg-[#fff4ed] px-3 py-2 text-xs text-[#8a5a42]">
          正在录音…说完后点击「结束并保存」。
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-md border border-[#ead6ca] bg-[#fff4ed] px-3 py-2 text-sm text-[#8a5a42]">
          {error}
        </p>
      )}

      {latestRecording && (
        <div className="mb-4 rounded-lg border border-border bg-[#fffaf3] p-3">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-muted">
            <span>最近录音 / Latest</span>
            <span>
              {formatDuration(latestRecording.duration)} ·{" "}
              {formatDateTime(latestRecording.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {renderPlaybackButton(latestRecording, "播放 / Play")}
            <div className="min-w-0 flex-1 text-xs text-muted">
              {playingId === latestRecording.id
                ? `${formatDuration(currentTime)} / ${formatDuration(latestRecording.duration)}`
                : `0:00 / ${formatDuration(latestRecording.duration)}`}
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          录音历史 / Recent History
        </h4>
        <div className="space-y-3">
          {visibleRecordings.map((recording) => {
            const unavailable = !isUsableAudioBlob(recording);
            const progress =
              playingId === recording.id && recording.duration > 0
                ? Math.min(100, (currentTime / recording.duration) * 100)
                : 0;

            return (
              <div
                className="rounded-lg border border-border bg-[#fffdf9] p-3"
                key={recording.id}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs leading-5 text-muted">
                    {formatDuration(recording.duration)} ·{" "}
                    {formatDateTime(recording.createdAt)}
                  </div>
                  <Button
                    onClick={() => void deleteRecording(recording.id)}
                    size="icon"
                    title="删除录音 / Delete recording"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {unavailable ? (
                  <div className="rounded-md border border-dashed border-border bg-[#fffaf3] px-3 py-2 text-sm text-muted">
                    录音文件不可用 / Audio unavailable
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {renderPlaybackButton(recording, "播放 / Play")}
                      <span className="text-xs text-muted">
                        {playingId === recording.id
                          ? `${formatDuration(currentTime)} / ${formatDuration(recording.duration)}`
                          : `0:00 / ${formatDuration(recording.duration)}`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#efe3d2]">
                      <div
                        className="h-full rounded-full bg-[#b99f7e] transition-[width]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Textarea
                  className="mt-3 min-h-20 bg-[#fffaf3]"
                  onChange={(event) =>
                    void updateRecording({ ...recording, reviewNote: event.target.value })
                  }
                  placeholder="添加或编辑复盘 note / Add or edit review note"
                  value={recording.reviewNote}
                />
              </div>
            );
          })}
          {!recordings.length && (
            <div className="rounded-lg border border-dashed border-border bg-[#fffaf3] p-4 text-sm leading-6 text-muted">
              还没有录音。请在当前素材节点里开始第一次练习。
              <br />
              No recordings yet. Start your first practice inside this node.
            </div>
          )}
          {recordings.length > visibleRecordings.length && (
            <p className="text-xs text-muted">
              仅显示最近 5 条；完整历史可在 Recordings 页面查看。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
