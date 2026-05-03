"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Download, RotateCcw, Settings, Upload } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { Button } from "@/components/ui/button";
import {
  createFullBackup,
  importFullBackup,
  timestampForBackupName,
  validateFullBackup,
  type ImportMode
} from "@/lib/backup";
import { useMaterialStore } from "@/store/useMaterialStore";
import type { AppExport } from "@/types";

export default function SettingsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fullBackupInputRef = useRef<HTMLInputElement | null>(null);
  const pendingBackupModeRef = useRef<ImportMode>("merge");
  const exportJson = useMaterialStore((state) => state.exportJson);
  const importJson = useMaterialStore((state) => state.importJson);
  const clearAll = useMaterialStore((state) => state.clearAll);
  const initialize = useMaterialStore((state) => state.initialize);
  const nodes = useMaterialStore((state) => state.nodes);
  const recordings = useMaterialStore((state) => state.recordings);
  const [message, setMessage] = useState("");

  const downloadJsonFile = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadExport = async () => {
    const data = await exportJson();
    downloadJsonFile(
      data,
      `my-speaking-material-map-${new Date().toISOString().slice(0, 10)}.json`
    );
    setMessage("已导出 JSON / Exported JSON.");
  };

  const downloadFullBackup = async () => {
    const data = await createFullBackup();
    downloadJsonFile(
      data,
      `speaking-map-full-backup-${timestampForBackupName()}.json`
    );
    setMessage("已导出完整备份 / Exported full backup.");
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importJson(JSON.parse(text) as AppExport);
      setMessage("已导入 JSON / Imported JSON.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `导入失败 / Import failed: ${error.message}`
          : "导入失败 / Import failed."
      );
    } finally {
      event.target.value = "";
    }
  };

  const openFullBackupImport = (mode: ImportMode) => {
    pendingBackupModeRef.current = mode;
    fullBackupInputRef.current?.click();
  };

  const handleFullBackupImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const mode = pendingBackupModeRef.current;

    try {
      const text = await file.text();
      const backup = JSON.parse(text) as unknown;
      validateFullBackup(backup);

      const confirmed =
        mode === "merge"
          ? window.confirm(
              "确认合并导入完整备份吗？现有素材和录音不会被删除。"
            )
          : window.confirm(
              "确认覆盖导入完整备份吗？这会替换当前素材、录音、复盘和本地设置。"
            ) &&
            window.confirm(
              "请再次确认：Replace import 会覆盖当前本地数据。建议先导出完整备份。"
            );

      if (!confirmed) return;

      await importFullBackup(backup, mode);
      await initialize();
      setMessage(
        mode === "merge"
          ? "已合并导入完整备份 / Full backup merged."
          : "已覆盖导入完整备份 / Full backup restored."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `完整备份导入失败 / Full backup import failed: ${error.message}`
          : "完整备份导入失败 / Full backup import failed."
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "清空前建议先导出完整备份。确认继续清空本地数据吗？"
      )
    ) {
      return;
    }

    if (
      recordings.length > 0 &&
      !window.confirm(
        `当前有 ${recordings.length} 条录音。清空后这些录音会从本浏览器删除。确认继续吗？`
      )
    ) {
      return;
    }

    const typed = window.prompt(
      "请输入 DELETE 才能清空本地数据并恢复 seed materials。"
    );
    if (typed !== "DELETE") {
      setMessage("已取消清空 / Clear cancelled.");
      return;
    }

    await clearAll();
    setMessage("已清空并恢复初始素材 / Seed data restored.");
  };

  return (
    <AppFrame>
      <div className="quiet-scrollbar h-full overflow-auto px-8 py-7">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <Settings className="h-4 w-4" />
            Local data settings
          </div>
          <h2 className="text-2xl font-semibold">设置 / Settings</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            所有素材、复盘和录音都保存在当前浏览器本地。导出文件只会保存到你的设备，不会上传服务器。
          </p>
        </div>

        <div className="grid max-w-3xl gap-4">
          <section className="rounded-lg border border-border bg-card p-5 shadow-notion">
            <h3 className="font-semibold">本地数据 / Local Data</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-border bg-[#fffaf3] p-3">
                <p className="text-xs text-muted">Material nodes</p>
                <p className="mt-1 text-xl font-semibold">{nodes.length}</p>
              </div>
              <div className="rounded-md border border-border bg-[#fffaf3] p-3">
                <p className="text-xs text-muted">Recordings</p>
                <p className="mt-1 text-xl font-semibold">{recordings.length}</p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-notion">
            <h3 className="font-semibold">导入 / 导出 JSON</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              用于迁移当前素材库数据。普通 JSON 会包含素材、复盘和录音数据。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => void downloadExport()}>
                <Download className="h-4 w-4" />
                导出 JSON
              </Button>
              <Button onClick={() => inputRef.current?.click()} variant="secondary">
                <Upload className="h-4 w-4" />
                导入 JSON
              </Button>
              <input
                accept="application/json"
                className="hidden"
                onChange={handleImport}
                ref={inputRef}
                type="file"
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-notion">
            <h3 className="font-semibold">完整备份 / Full Backup</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              导出素材、录音、复盘和本地设置。备份文件只保存在你的设备上，不会上传服务器。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => void downloadFullBackup()}>
                <Download className="h-4 w-4" />
                导出完整备份 / Export Full Backup
              </Button>
              <Button
                onClick={() => openFullBackupImport("merge")}
                variant="secondary"
              >
                <Upload className="h-4 w-4" />
                合并导入 / Merge Import
              </Button>
              <Button
                onClick={() => openFullBackupImport("replace")}
                variant="secondary"
              >
                <Upload className="h-4 w-4" />
                覆盖导入 / Replace Import
              </Button>
              <input
                accept="application/json"
                className="hidden"
                onChange={handleFullBackupImport}
                ref={fullBackupInputRef}
                type="file"
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-notion">
            <h3 className="font-semibold">清空并恢复初始数据</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              会删除当前浏览器里的自定义节点、复盘和录音，然后重新导入第一版 seed materials。清空前请先导出完整备份。
            </p>
            <Button
              className="mt-4"
              onClick={() => void handleClearAll()}
              variant="destructive"
            >
              <RotateCcw className="h-4 w-4" />
              清空本地数据
            </Button>
          </section>

          {message && (
            <div className="rounded-lg border border-border bg-[#fffaf3] p-4 text-sm text-muted">
              {message}
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
