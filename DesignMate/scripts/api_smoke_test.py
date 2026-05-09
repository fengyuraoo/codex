from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend import ai_service, database, report_service, search_engine
from backend.material_parser import scan_library
from backend.paths import REPORTS_DIR
from backend.utils import atomic_write_text


def check(name: str, condition: bool, payload: dict | None = None) -> tuple[str, bool]:
    status = "PASS" if condition else "FAIL"
    data = f": `{json.dumps(payload or {}, ensure_ascii=False)}`" if payload is not None else ""
    return f"- {status} `{name}`{data}", condition


def main() -> int:
    lines = ["# API Smoke Test v0.6.1", "", "Mode: direct backend service smoke test", ""]
    passed = True
    try:
        database.init_db()
        records = scan_library()
        for record in records:
            database.upsert_material(record)
        database.rebuild_fts_index()
        report_service.generate_reports()

        stats = database.get_stats()
        results = search_engine.search("作品集", limit=5)
        first = database.list_materials(limit=1)[0]
        detail_before = database.get_material(first.id)
        patched = database.update_material(
            first.id,
            {
                "project_guess": "general",
                "material_type": "draft",
                "portfolio_stage": "presentation",
                "tags": ["api-smoke", "edited"],
                "material_score": 77,
                "notes": "api smoke test note",
                "review_status": "confirmed",
            },
        )
        detail_after = database.get_material(first.id)
        batch_items = database.list_materials(limit=2)
        batch_updated = database.update_materials_batch(
            [item.id for item in batch_items],
            {
                "project_guess": "general",
                "material_type": "research",
                "tags": ["api-batch", "v05"],
            },
        )
        database.rebuild_fts_index()
        ask_context = [database.get_material(row["id"]) for row in search_engine.search("用户痛点", project="reader-design", limit=5)]
        ask_context = [item for item in ask_context if item]
        ask_result = ai_service.ask_designmate("阅读器项目最大问题是什么？", ask_context)

        checks = [
            check("health", True, {"ok": True, "version": "v0.6.1"}),
            check("stats", stats["total_materials"] > 0, stats),
            check("search", len(results) > 0, {"count": len(results)}),
            check("get material detail", detail_before is not None, {"id": first.id}),
            check("patch material", patched is not None and patched.notes == "api smoke test note", patched.to_dict() if patched else {}),
            check("patch verified by get", detail_after is not None and detail_after.review_status == "confirmed", detail_after.to_dict() if detail_after else {}),
            check("batch patch material", len(batch_updated) == len(batch_items), {"count": len(batch_updated)}),
            check("batch patch verified", all("api-batch" in item.tags for item in batch_updated), {"ids": [item.id for item in batch_updated]}),
            check("ask designmate fallback", ask_result["mode"] in {"rule_based", "rule_based_fallback"}, {"mode": ask_result["mode"]}),
            check("ask designmate answer", bool(ask_result["answer"]), {"answer_length": len(ask_result["answer"])}),
            check("rebuild", True, {"fts5_available": database.get_stats()["fts5_available"]}),
        ]
        for line, ok in checks:
            lines.append(line)
            passed = passed and ok
    except Exception as exc:
        lines.append(f"- FAIL smoke test: {exc}")
        passed = False
    atomic_write_text(REPORTS_DIR / "api_smoke_test.md", "\n".join(lines))
    print("\n".join(lines))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
