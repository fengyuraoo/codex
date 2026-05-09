from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from . import ai_service, database, link_capture_service, report_service, search_engine
from .material_parser import scan_library
from .paths import REPORTS_DIR


def json_response(handler: BaseHTTPRequestHandler, payload: dict, status: int = 200) -> None:
    data = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Content-Length", str(len(data)))
    handler.end_headers()
    handler.wfile.write(data)


def error(handler: BaseHTTPRequestHandler, message: str, status: int = 500) -> None:
    json_response(handler, {"ok": False, "error": message}, status)


def material_payload(record) -> dict:
    return record.to_dict()


class DesignMateHandler(BaseHTTPRequestHandler):
    server_version = "DesignMateAPI/0.6.1"

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON body: {exc}") from exc
        if not isinstance(payload, dict):
            raise ValueError("JSON body must be an object")
        return payload

    def do_GET(self) -> None:
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"
            query = parse_qs(parsed.query)
            if path == "/api/health":
                json_response(self, {"ok": True, "version": "v0.6.1"})
            elif path == "/api/stats":
                database.init_db()
                json_response(self, {"ok": True, "stats": database.get_stats()})
            elif path == "/api/materials":
                limit = int(query.get("limit", ["100"])[0])
                items = database.list_materials(
                    project=query.get("project", [None])[0],
                    material_type=query.get("type", [None])[0],
                    stage=query.get("stage", [None])[0],
                    source_mode=query.get("source", [None])[0],
                    limit=limit,
                )
                json_response(self, {"ok": True, "count": len(items), "materials": [material_payload(item) for item in items]})
            elif path.startswith("/api/materials/"):
                material_id = path.split("/")[-1]
                item = database.get_material(material_id)
                if not item:
                    error(self, "Material not found", 404)
                else:
                    json_response(self, {"ok": True, "material": material_payload(item)})
            elif path == "/api/search":
                q = query.get("q", [""])[0]
                limit = int(query.get("limit", ["20"])[0])
                results = search_engine.search(
                    q,
                    project=query.get("project", [None])[0],
                    material_type=query.get("type", [None])[0],
                    stage=query.get("stage", [None])[0],
                    limit=limit,
                )
                json_response(self, {"ok": True, "query": q, "count": len(results), "results": results})
            elif path == "/api/report/latest":
                report_path = REPORTS_DIR / "latest_report.md"
                content = report_path.read_text(encoding="utf-8") if report_path.exists() else ""
                json_response(self, {"ok": True, "content": content})
            else:
                error(self, "Not found", 404)
        except Exception as exc:
            error(self, str(exc), 500)

    def do_POST(self) -> None:
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"
            if path == "/api/ask":
                try:
                    payload = self.read_json_body()
                    question = str(payload.get("question", "")).strip()
                    project = payload.get("project") or None
                    limit = int(payload.get("limit", 10) or 10)
                    if not question:
                        error(self, "question is required", 400)
                        return
                    results = search_engine.search(question, project=project, limit=limit)
                    material_ids = [row["id"] for row in results]
                    context = [item for item_id in material_ids if (item := database.get_material(item_id))]
                    ai_result = ai_service.ask_designmate(question, context)
                    json_response(
                        self,
                        {
                            "ok": True,
                            "question": question,
                            "answer": ai_result["answer"],
                            "answer_sections": ai_result.get("answer_sections", {}),
                            "used_materials": [item.to_dict() for item in context],
                            "mode": ai_result["mode"],
                            "suggestions": ai_result["suggestions"],
                            "need_confirm": ai_result["need_confirm"],
                            "confidence": ai_result.get("confidence", 0.5),
                        },
                    )
                except ValueError as exc:
                    error(self, str(exc), 400)
                return
            if path == "/api/link-capture":
                try:
                    payload = self.read_json_body()
                    result = link_capture_service.capture_link(
                        str(payload.get("url", "")),
                        user_note=str(payload.get("user_note", "")),
                        project=str(payload.get("project", "unknown") or "unknown"),
                        design_stage=str(payload.get("design_stage", "unknown") or "unknown"),
                        portfolio_placement=str(payload.get("portfolio_placement", "") or ""),
                    )
                    status = 200 if result.ok else 400
                    json_response(self, result.to_dict(), status)
                except ValueError as exc:
                    json_response(self, {"ok": False, "message": str(exc), "fallback_saved": False}, 400)
                return
            if path in {"/api/reindex", "/api/rebuild"}:
                database.init_db()
                records = scan_library()
                for record in records:
                    database.upsert_material(record)
                database.rebuild_fts_index()
                report_service.generate_reports()
                json_response(self, {"ok": True, "indexed": len(records), "stats": database.get_stats()})
            else:
                error(self, "Not found", 404)
        except Exception as exc:
            error(self, str(exc), 500)

    def do_PATCH(self) -> None:
        try:
            parsed = urlparse(self.path)
            path = parsed.path.rstrip("/") or "/"
            if path == "/api/materials/batch":
                try:
                    payload = self.read_json_body()
                    ids = payload.get("ids", [])
                    updates = payload.get("updates", {key: value for key, value in payload.items() if key != "ids"})
                    updated = database.update_materials_batch(ids, updates)
                except ValueError as exc:
                    error(self, str(exc), 400)
                    return
                json_response(
                    self,
                    {
                        "ok": True,
                        "count": len(updated),
                        "materials": [material_payload(item) for item in updated],
                    },
                )
                return
            if not path.startswith("/api/materials/"):
                error(self, "Not found", 404)
                return
            material_id = path.split("/")[-1]
            if not database.get_material(material_id):
                error(self, "Material not found", 404)
                return
            try:
                payload = self.read_json_body()
                updated = database.update_material(material_id, payload)
            except ValueError as exc:
                error(self, str(exc), 400)
                return
            if not updated:
                error(self, "Material not found", 404)
                return
            json_response(self, {"ok": True, "material": material_payload(updated)})
        except Exception as exc:
            error(self, str(exc), 500)

    def log_message(self, format: str, *args) -> None:
        return


def run(host: str = "127.0.0.1", port: int = 8765) -> None:
    database.init_db()
    server = ThreadingHTTPServer((host, port), DesignMateHandler)
    print(f"DesignMate API running at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
