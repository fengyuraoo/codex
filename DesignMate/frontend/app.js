let materials = [];
let stats = {};
let drafts = [];
let selectedId = null;
let selectedIds = new Set();
let apiConnected = false;
let quickMode = "";
const API_BASE = "http://127.0.0.1:8765";

const PROJECTS = ["reader-design", "info-center", "thesis", "general", "unknown"];
const TYPES = ["sketch", "reference", "research", "competitor", "feedback", "draft", "presentation", "paper", "idea", "unknown"];
const STAGES = ["background", "research", "insight", "concept", "development", "final", "presentation", "reflection", "unknown"];

const els = {
  status: document.getElementById("status"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  hubSearchInput: document.getElementById("hubSearchInput"),
  hubSearchButton: document.getElementById("hubSearchButton"),
  demoStatus: document.getElementById("demoStatus"),
  stats: document.getElementById("stats"),
  importStats: document.getElementById("importStats"),
  projectCards: document.getElementById("projectCards"),
  typeCards: document.getElementById("typeCards"),
  highlightList: document.getElementById("highlightList"),
  searchInput: document.getElementById("searchInput"),
  projectFilter: document.getElementById("projectFilter"),
  typeFilter: document.getElementById("typeFilter"),
  stageFilter: document.getElementById("stageFilter"),
  sourceFilter: document.getElementById("sourceFilter"),
  limitFilter: document.getElementById("limitFilter"),
  sortFilter: document.getElementById("sortFilter"),
  clearFilters: document.getElementById("clearFilters"),
  batchToolbar: document.getElementById("batchToolbar"),
  selectedCount: document.getElementById("selectedCount"),
  batchProject: document.getElementById("batchProject"),
  batchType: document.getElementById("batchType"),
  batchStage: document.getElementById("batchStage"),
  batchTags: document.getElementById("batchTags"),
  applyBatch: document.getElementById("applyBatch"),
  clearSelection: document.getElementById("clearSelection"),
  askProject: document.getElementById("askProject"),
  askQuestion: document.getElementById("askQuestion"),
  askButton: document.getElementById("askButton"),
  askResult: document.getElementById("askResult"),
  materialList: document.getElementById("materialList"),
  detailPanel: document.getElementById("detailPanel"),
  resultTitle: document.getElementById("resultTitle"),
  imageFilenameQuery: document.getElementById("imageFilenameQuery"),
  imageMetadataSearch: document.getElementById("imageMetadataSearch"),
  imageSearchResults: document.getElementById("imageSearchResults"),
  linkUrl: document.getElementById("linkUrl"),
  linkProject: document.getElementById("linkProject"),
  linkDesignStage: document.getElementById("linkDesignStage"),
  linkPlacement: document.getElementById("linkPlacement"),
  linkNote: document.getElementById("linkNote"),
  captureLinkButton: document.getElementById("captureLinkButton"),
  linkCaptureResult: document.getElementById("linkCaptureResult"),
  latestReport: document.getElementById("latestReport"),
  needConfirm: document.getElementById("needConfirm"),
  nextActions: document.getElementById("nextActions"),
  draftList: document.getElementById("draftList"),
  showcaseToggle: document.getElementById("showcaseToggle"),
};

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function setStatus(message, mode = "") {
  if (!els.status) return;
  els.status.textContent = message;
  els.status.className = `status ${mode}`;
}

async function checkApi() {
  try {
    const response = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    const payload = await response.json();
    apiConnected = Boolean(payload.ok);
    setStatus(apiConnected ? "API connected" : "Static mode", apiConnected ? "ok" : "warn");
  } catch {
    apiConnected = false;
    setStatus("Static mode: run python DesignMate/scripts/start_api.py to save edits", "warn");
  }
}

function fill(select, values, includeAll = true) {
  if (!select) return;
  const all = includeAll ? ["all", ...values] : values;
  select.innerHTML = all.map((value) => `<option value="${esc(value)}">${value === "all" ? "All" : esc(value)}</option>`).join("");
}

function countBy(key) {
  return materials.reduce((acc, item) => {
    const value = item[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function statCard(label, value) {
  return `<div class="stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;
}

function miniCards(counts) {
  const max = Math.max(1, ...Object.values(counts));
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => `
    <div class="mini-card">
      <strong>${esc(count)}</strong><span>${esc(name)}</span>
      <i style="width:${Math.round((count / max) * 100)}%"></i>
    </div>
  `).join("");
}

function needsConfirm(item) {
  return item.review_status !== "confirmed" || item.material_type === "unknown" || item.project_guess === "unknown" || Number(item.material_score || 0) < 55;
}

function sourceLabel(item) {
  const value = item.source_mode || "unknown";
  return { demo: "Demo", user: "User", imported: "Imported", unknown: "Unknown" }[value] || "Unknown";
}

function inferDesignStage(item) {
  if (item.material_type === "sketch") return "sketch";
  if (item.material_type === "feedback") return "feedback";
  if (item.portfolio_stage === "research" || item.material_type === "research") return "research";
  if (["concept", "development"].includes(item.portfolio_stage) || item.material_type === "idea") return "ideation";
  if (["final", "presentation"].includes(item.portfolio_stage)) return "final";
  return item.portfolio_stage || "unknown";
}

function inferEvidenceType(item) {
  if ((item.source_type || "").includes("video")) return "link";
  if (item.extension === "link" || item.url) return "link";
  const ext = (item.extension || "").toLowerCase();
  const name = (item.filename || "").toLowerCase();
  if (["jpg", "jpeg", "png"].includes(ext)) return name.includes("screenshot") || name.includes("feedback") ? "screenshot" : "image";
  if (ext === "pdf") return "pdf";
  if (["docx", "pptx"].includes(ext)) return "doc";
  if (["md", "txt"].includes(ext)) return "note";
  return "unknown";
}

function portfolioPlacement(item) {
  if (item.portfolio_placement) return item.portfolio_placement;
  if (item.material_type === "feedback" || item.portfolio_stage === "reflection") return "Reflection";
  if (item.material_type === "research" || item.portfolio_stage === "research") return "User Research";
  if (item.portfolio_stage === "insight") return "Pain Points";
  if (["sketch", "idea", "reference", "competitor"].includes(item.material_type) || ["concept", "development"].includes(item.portfolio_stage)) return "Design Process";
  if (["final", "presentation"].includes(item.portfolio_stage)) return "Final Solution";
  return "Unknown";
}

function confidence(item) {
  const base = Number(item.material_score || 0);
  const bonus = item.review_status === "confirmed" ? 6 : 0;
  return Math.max(0, Math.min(100, base + bonus));
}

function evidenceWhy(item) {
  const fields = [];
  if (item.content_preview) fields.push("content preview");
  if ((item.tags || []).length) fields.push("tags");
  if (item.project_guess && item.project_guess !== "unknown") fields.push("project context");
  if (item.url) fields.push("source link");
  if (item.user_note) fields.push("user note");
  if (item.material_score >= 70) fields.push("high material score");
  const placement = portfolioPlacement(item);
  return `Matches ${fields.join(" + ") || "filename metadata"} and can support the ${placement} part of a portfolio narrative.`;
}

function renderDashboard() {
  const importStats = (stats && stats.import) || (window.DESIGNMATE_DATA && window.DESIGNMATE_DATA.import_stats) || {};
  const bySource = countBy("source_mode");
  const high = materials.filter((item) => Number(item.material_score || 0) >= 70).length;
  const pending = materials.filter(needsConfirm).length;
  const unknown = materials.filter((item) => item.material_type === "unknown" || item.project_guess === "unknown").length;
  const failed = materials.filter((item) => !["parsed", "metadata_only"].includes(item.parse_status)).length;
  const docs = materials.filter((item) => ["md", "txt", "pdf", "docx", "pptx"].includes(item.extension)).length;
  const images = materials.filter((item) => ["jpg", "jpeg", "png"].includes(item.extension)).length;
  const exportReady = Boolean(window.DESIGNMATE_DATA?.showcase_status?.export_status);
  els.demoStatus.innerHTML = [
    statCard("total materials", materials.length),
    statCard("user materials", bySource.user || 0),
    statCard("demo materials", bySource.demo || 0),
    statCard("drafts generated", drafts.length),
    statCard("export status", exportReady ? "ready" : "not built"),
  ].join("");
  els.importStats.innerHTML = [
    statCard("inbox files", importStats.inbox_file_count ?? 0),
    statCard("library files", importStats.library_file_count ?? 0),
    statCard("last scan", importStats.last_scan_time || "none"),
    statCard("last report", importStats.last_report_time || "none"),
    statCard("parsed files", materials.filter((item) => item.parse_status === "parsed").length),
    statCard("parse failed", failed),
    statCard("image files", images),
    statCard("document files", docs),
  ].join("");
  els.stats.innerHTML = [
    statCard("total materials", materials.length),
    statCard("high value", high),
    statCard("need confirm", pending),
    statCard("unknown", unknown),
    statCard("parse failed", failed),
    statCard("Demo", bySource.demo || 0),
    statCard("User", bySource.user || 0),
    statCard("Imported", bySource.imported || 0),
    statCard("Unknown source", bySource.unknown || 0),
  ].join("");
  els.projectCards.innerHTML = miniCards(countBy("project_guess"));
  els.typeCards.innerHTML = miniCards(countBy("material_type"));
  const highlights = [...materials].sort((a, b) => Number(b.material_score || 0) - Number(a.material_score || 0)).slice(0, 5);
  els.highlightList.innerHTML = highlights.length ? highlights.map(card).join("") : emptyState();
}

function queryTokens(query) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function matches(item, query) {
  if (!query) return true;
  const text = [
    item.filename,
    item.content_preview,
    item.reason,
    item.notes,
    item.material_type,
    item.portfolio_stage,
    item.project_guess,
    item.source_mode,
    portfolioPlacement(item),
    ...(item.tags || []),
  ].join(" ").toLowerCase();
  return queryTokens(query).every((token) => text.includes(token));
}

function filtered() {
  const query = els.searchInput.value.trim();
  const project = els.projectFilter.value;
  const type = els.typeFilter.value;
  const stage = els.stageFilter.value;
  const source = els.sourceFilter.value;
  const sort = els.sortFilter.value;
  const limit = Number(els.limitFilter.value || 20);
  const rows = materials
    .filter((item) => project === "all" || item.project_guess === project)
    .filter((item) => type === "all" || item.material_type === type)
    .filter((item) => stage === "all" || item.portfolio_stage === stage)
    .filter((item) => source === "all" || item.source_mode === source)
    .filter((item) => matches(item, query))
    .filter((item) => {
      if (quickMode === "high") return Number(item.material_score || 0) >= 70;
      if (quickMode === "confirm") return needsConfirm(item);
      if (quickMode === "unknown") return item.project_guess === "unknown" || item.material_type === "unknown" || item.portfolio_stage === "unknown";
      return true;
    });
  rows.sort((a, b) => {
    if (sort === "filename") return String(a.filename).localeCompare(String(b.filename));
    if (sort === "updated_at") return String(b.updated_at || "").localeCompare(String(a.updated_at || ""));
    return confidence(b) - confidence(a);
  });
  return rows.slice(0, limit);
}

function chips(item) {
  return [sourceLabel(item), item.project_guess, inferDesignStage(item), inferEvidenceType(item), ...(item.tags || [])]
    .filter(Boolean)
    .slice(0, 8)
    .map((value) => `<span class="chip">${esc(value)}</span>`)
    .join("");
}

function card(item) {
  const preview = (item.content_preview || "No preview available.").replace(/\s+/g, " ").slice(0, 220);
  const selected = item.id === selectedId ? " selected" : "";
  const checked = selectedIds.has(item.id) ? "checked" : "";
  const image = item.image_preview_path ? `<img class="thumb" src="${esc(item.image_preview_path.replace(/^frontend\//, ""))}" alt="" />` : `<div class="thumb placeholder">${esc((item.extension || "file").toUpperCase())}</div>`;
  return `
    <article class="material-card evidence-card${selected}" data-id="${esc(item.id)}">
      <div class="title-row">
        <label class="select-line"><input class="select-material" type="checkbox" data-select-id="${esc(item.id)}" ${checked} />${image}<span class="filename">${esc(item.filename)}</span></label>
        <div class="confidence"><strong>${confidence(item)}</strong><span>confidence</span></div>
      </div>
      <div class="evidence-meta">
        <span><b>Source</b>${esc(sourceLabel(item))}</span>
        <span><b>Project</b>${esc(item.project_guess || "unknown")}</span>
        <span><b>Stage</b>${esc(inferDesignStage(item))}</span>
        <span><b>Type</b>${esc(inferEvidenceType(item))}</span>
        <span><b>Placement</b>${esc(portfolioPlacement(item))}</span>
      </div>
      ${item.url ? `<p class="link-line"><span>Captured from web</span><span>Platform: ${esc(item.platform || "generic webpage")}</span><a href="${esc(item.url)}" target="_blank" rel="noopener">Open source link</a></p>` : ""}
      <div class="chips">${chips(item)}<span class="chip ${item.review_status === "confirmed" ? "confirmed" : "pending"}">${item.review_status === "confirmed" ? "confirmed" : "need confirm"}</span></div>
      <p class="meta">${esc(preview)}</p>
      ${item.user_note ? `<p class="user-note">User note: ${esc(item.user_note)}</p>` : ""}
      <p class="why">${esc(evidenceWhy(item))}</p>
    </article>
  `;
}

function emptyState() {
  return `<div class="empty">Put your materials into DesignMate/data/inbox, then run python DesignMate/scripts/run_designmate.py.</div>`;
}

function filterSummary(count) {
  const bits = [];
  if (els.searchInput.value.trim()) bits.push(`query=${els.searchInput.value.trim()}`);
  if (els.projectFilter.value !== "all") bits.push(`project=${els.projectFilter.value}`);
  if (els.typeFilter.value !== "all") bits.push(`type=${els.typeFilter.value}`);
  if (els.stageFilter.value !== "all") bits.push(`stage=${els.stageFilter.value}`);
  if (els.sourceFilter.value !== "all") bits.push(`source=${els.sourceFilter.value}`);
  return `${count} Design Evidence Cards${bits.length ? " / " + bits.join(" / ") : ""}`;
}

function renderSearch() {
  const results = filtered();
  els.resultTitle.textContent = filterSummary(results.length);
  els.materialList.innerHTML = results.length ? results.map(card).join("") : emptyState();
  renderBatchToolbar();
  document.querySelectorAll("#materialList [data-id], #highlightList [data-id], #imageSearchResults [data-id]").forEach((node) => node.addEventListener("click", (event) => {
    if (event.target.closest(".select-material")) return;
    showDetail(node.dataset.id);
  }));
  document.querySelectorAll("[data-select-id]").forEach((node) => node.addEventListener("click", (event) => {
    event.stopPropagation();
    const id = node.dataset.selectId;
    if (node.checked) selectedIds.add(id);
    else selectedIds.delete(id);
    renderBatchToolbar();
  }));
}

function renderBatchToolbar() {
  els.selectedCount.textContent = `Selected ${selectedIds.size}`;
  els.batchToolbar.classList.toggle("active", selectedIds.size > 0);
}

function renderImageSearch() {
  const query = els.imageFilenameQuery.value.trim() || "image sketch reference screenshot";
  const rows = materials
    .filter((item) => ["image", "screenshot"].includes(inferEvidenceType(item)) || matches(item, query))
    .slice(0, 12);
  els.imageSearchResults.innerHTML = rows.length ? rows.map(card).join("") : emptyState();
  renderSearch();
}

function options(values, current) {
  return values.map((value) => `<option value="${esc(value)}" ${value === current ? "selected" : ""}>${esc(value)}</option>`).join("");
}

function confirmQuestion(item) {
  if (item.material_type === "unknown" || item.project_guess === "unknown") return "Confirm material type or project ownership.";
  if (Number(item.material_score || 0) < 55) return "Add notes, evidence source or portfolio placement before using it.";
  return "Confirm whether this evidence should enter the portfolio storyline.";
}

function showDetail(id) {
  selectedId = id;
  const item = materials.find((entry) => entry.id === id);
  if (!item) return;
  renderSearch();
  els.detailPanel.innerHTML = `
    <h2>${esc(item.filename)}</h2>
    ${item.image_preview_path ? `<img class="detail-image" src="${esc(item.image_preview_path.replace(/^frontend\//, ""))}" alt="${esc(item.filename)}" />` : ""}
    <section class="detail-section">
      <h3>Evidence Summary</h3>
      <dl>
        <dt>Path</dt><dd>${esc(item.path)}</dd>
        <dt>Source</dt><dd>${esc(sourceLabel(item))}</dd>
        <dt>Parse</dt><dd>${esc(item.parse_status)}</dd>
        <dt>Words</dt><dd>${esc(item.word_count || 0)}</dd>
        <dt>Updated</dt><dd>${esc(item.updated_at || "")}</dd>
        <dt>Image</dt><dd>${esc(item.image_width && item.image_height ? `${item.image_width}x${item.image_height}` : "not image / unavailable")}</dd>
        <dt>URL</dt><dd>${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.url)}</a>` : "not link"}</dd>
        <dt>Platform</dt><dd>${esc(item.platform || "n/a")}</dd>
        <dt>Source type</dt><dd>${esc(item.source_type || "n/a")}</dd>
      </dl>
    </section>
    <section class="detail-section">
      <h3>Portfolio Placement</h3>
      <p class="meta">${esc(portfolioPlacement(item))}: ${esc(evidenceWhy(item))}</p>
      ${item.user_note ? `<p class="meta">User note: ${esc(item.user_note)}</p>` : ""}
      <p class="meta">Need confirm: ${esc(confirmQuestion(item))}</p>
    </section>
    <section class="detail-section edit-section">
      <h3>Edit Classification</h3>
      <label>Project<select id="editProject">${options(PROJECTS, item.project_guess || "unknown")}</select></label>
      <label>Type<select id="editType">${options(TYPES, item.material_type || "unknown")}</select></label>
      <label>Stage<select id="editStage">${options(STAGES, item.portfolio_stage || "unknown")}</select></label>
      <label>Tags<input id="editTags" value="${esc((item.tags || []).join(", "))}" /></label>
      <label>Score<input id="editScore" type="number" min="0" max="100" value="${esc(item.material_score || 0)}" /></label>
      <label>Notes<textarea id="editNotes" rows="4">${esc(item.notes || "")}</textarea></label>
      ${item.image_note ? `<p class="meta">${esc(item.image_note)} Add manual image description in Notes.</p>` : ""}
      <button id="saveMaterial" class="primary">Save changes</button>
      <p class="save-message" id="saveMessage"></p>
    </section>
    <section class="detail-section">
      <h3>Preview</h3>
      <p class="meta">${esc(item.content_preview || "No preview available.")}</p>
    </section>
  `;
  document.getElementById("saveMaterial").addEventListener("click", () => saveMaterial(item.id));
}

async function captureLink() {
  const url = els.linkUrl.value.trim();
  if (!url) {
    els.linkCaptureResult.innerHTML = `<div class="empty">Paste a design inspiration link first.</div>`;
    return;
  }
  if (!apiConnected) {
    els.linkCaptureResult.innerHTML = `<div class="empty">Static mode cannot capture links. Run python DesignMate/scripts/start_api.py, then try again.</div>`;
    return;
  }
  try {
    setStatus("Capturing link...", "");
    const response = await fetch(`${API_BASE}/api/link-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        user_note: els.linkNote.value,
        project: els.linkProject.value || "unknown",
        design_stage: els.linkDesignStage.value || "unknown",
        portfolio_placement: els.linkPlacement.value || "",
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || data.error || "Link capture failed");
    }
    const material = data.material;
    const index = materials.findIndex((item) => item.id === material.id);
    if (index >= 0) materials[index] = material;
    else materials.unshift(material);
    els.linkCaptureResult.innerHTML = `
      ${card(material)}
      ${data.source_type === "short_video" || data.source_type === "social_post" ? `<div class="empty">This platform may limit automatic extraction. The link is saved, and your note will help DesignMate understand why it matters.</div>` : ""}
    `;
    renderDashboard();
    renderSearch();
    setStatus(`Captured ${data.platform} link`, "ok");
  } catch (error) {
    els.linkCaptureResult.innerHTML = `<div class="empty">Capture failed: ${esc(error.message)}. If this is a restricted platform, save the URL and add a manual note after the API is available.</div>`;
    setStatus("Link capture failed", "error");
  }
}

async function askDesignMate() {
  const question = els.askQuestion.value.trim();
  if (!question) {
    els.askResult.innerHTML = `<h2>Answer</h2><p class="empty">Please enter a portfolio-focused question.</p>`;
    return;
  }
  if (!apiConnected) {
    els.askResult.innerHTML = `<h2>Answer</h2><p class="empty">Static mode cannot ask the API. Run python DesignMate/scripts/start_api.py.</p>`;
    return;
  }
  try {
    setStatus("Ask DesignMate is thinking...", "");
    const response = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, project: els.askProject.value === "all" ? null : els.askProject.value, limit: 10 }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Ask failed");
    els.askResult.innerHTML = `
      <h2>Answer <span class="mode">${esc(data.mode)}</span> <span class="mode">confidence ${esc(data.confidence ?? "n/a")}</span></h2>
      <div class="answer">${renderAnswerSections(data.answer_sections || {})}</div>
      <h3>Used materials</h3>
      <div class="material-list">${(data.used_materials || []).slice(0, 6).map(card).join("") || emptyState()}</div>
    `;
    setStatus("Ask DesignMate answered", "ok");
  } catch (error) {
    els.askResult.innerHTML = `<h2>Answer</h2><p class="empty">Ask failed: ${esc(error.message)}</p>`;
    setStatus("Ask DesignMate failed", "error");
  }
}

function renderAnswerSections(sections) {
  return Object.entries(sections).map(([title, value]) => `<section class="answer-section"><h3>${esc(title)}</h3>${Array.isArray(value) ? `<ul>${value.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p>${esc(value)}</p>`}</section>`).join("");
}

async function applyBatchUpdate() {
  if (!selectedIds.size) return;
  if (!apiConnected) {
    setStatus("Static mode cannot batch save. Run python DesignMate/scripts/start_api.py", "warn");
    return;
  }
  const updates = {};
  if (els.batchProject.value) updates.project_guess = els.batchProject.value;
  if (els.batchType.value) updates.material_type = els.batchType.value;
  if (els.batchStage.value) updates.portfolio_stage = els.batchStage.value;
  if (els.batchTags.value.trim()) updates.tags = els.batchTags.value.trim();
  if (!Object.keys(updates).length) {
    setStatus("Choose at least one batch field.", "warn");
    return;
  }
  try {
    setStatus("Saving batch...", "");
    const response = await fetch(`${API_BASE}/api/materials/batch`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selectedIds), updates }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Batch save failed");
    (data.materials || []).forEach((updated) => {
      const index = materials.findIndex((item) => item.id === updated.id);
      if (index >= 0) materials[index] = updated;
    });
    selectedIds.clear();
    els.batchTags.value = "";
    els.batchProject.value = "";
    els.batchType.value = "";
    els.batchStage.value = "";
    setStatus(`Batch saved: ${data.count} materials`, "ok");
    renderDashboard();
    renderSearch();
    if (selectedId) showDetail(selectedId);
  } catch (error) {
    setStatus(`Batch save failed: ${error.message}`, "error");
  }
}

async function saveMaterial(id) {
  const message = document.getElementById("saveMessage");
  if (!apiConnected) {
    message.textContent = "Static mode cannot save. Run python DesignMate/scripts/start_api.py";
    setStatus("Static mode cannot save", "warn");
    return;
  }
  const payload = {
    project_guess: document.getElementById("editProject").value,
    material_type: document.getElementById("editType").value,
    portfolio_stage: document.getElementById("editStage").value,
    tags: document.getElementById("editTags").value,
    material_score: Number(document.getElementById("editScore").value || 0),
    notes: document.getElementById("editNotes").value,
    review_status: "confirmed",
  };
  try {
    setStatus("Saving...", "");
    const response = await fetch(`${API_BASE}/api/materials/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Save failed");
    const index = materials.findIndex((item) => item.id === id);
    materials[index] = data.material;
    message.textContent = "Saved";
    setStatus("Saved", "ok");
    renderDashboard();
    showDetail(id);
  } catch (error) {
    message.textContent = `Save failed: ${error.message}`;
    setStatus("Save failed", "error");
  }
}

function switchView(view) {
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  els.views.forEach((node) => node.classList.toggle("active", node.id === `${view}View`));
  if (view === "image") renderImageSearch();
}

function renderMarkdown(markdown) {
  if (!markdown.trim()) return `<p class="empty">Report is empty. Run python DesignMate/scripts/run_designmate.py.</p>`;
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  let inCode = false;
  let table = [];
  function flushList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }
  function flushTable() {
    if (!table.length) return;
    html.push("<table>");
    table.forEach((row, index) => {
      if (/^\|\s*-+/.test(row)) return;
      const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
      html.push("<tr>" + cells.map((cell) => index === 0 ? `<th>${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("") + "</tr>");
    });
    html.push("</table>");
    table = [];
  }
  lines.forEach((line) => {
    if (line.startsWith("```")) {
      flushList(); flushTable();
      html.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      return;
    }
    if (inCode) { html.push(esc(line)); return; }
    if (/^\|.*\|$/.test(line)) { flushList(); table.push(line); return; }
    flushTable();
    if (line.startsWith("### ")) { flushList(); html.push(`<h3>${esc(line.slice(4))}</h3>`); }
    else if (line.startsWith("## ")) { flushList(); html.push(`<h2>${esc(line.slice(3))}</h2>`); }
    else if (line.startsWith("# ")) { flushList(); html.push(`<h1>${esc(line.slice(2))}</h1>`); }
    else if (line.startsWith("- ")) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${esc(line.slice(2))}</li>`);
    } else if (line.trim()) {
      flushList(); html.push(`<p>${esc(line)}</p>`);
    }
  });
  flushList(); flushTable();
  return html.join("\n");
}

async function loadText(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("fetch failed");
    return await response.text();
  } catch {
    return fallback || "";
  }
}

async function loadData() {
  if (window.DESIGNMATE_DATA) {
    materials = window.DESIGNMATE_DATA.materials.materials || [];
    stats = window.DESIGNMATE_DATA.materials.stats || {};
    drafts = window.DESIGNMATE_DATA.drafts || [];
    els.latestReport.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_report || "");
    els.needConfirm.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_need_confirm || "");
    els.nextActions.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_next_actions || "");
    renderDraftList(drafts);
    return;
  }
  const response = await fetch("data/materials.json");
  const payload = await response.json();
  materials = payload.materials || [];
  stats = payload.stats || {};
  drafts = payload.drafts || [];
  els.latestReport.innerHTML = renderMarkdown(await loadText("data/latest_report.txt"));
  els.needConfirm.innerHTML = renderMarkdown(await loadText("data/latest_need_confirm.txt"));
  els.nextActions.innerHTML = renderMarkdown(await loadText("data/latest_next_actions.txt"));
  renderDraftList(drafts);
}

function renderDraftList(items) {
  if (!els.draftList) return;
  els.draftList.innerHTML = items.length
    ? items.map((item) => `<p><code>${esc(item.path)}</code><span class="meta"> ${esc(item.modified_time || "")}</span></p>`).join("")
    : `<p class="meta">No draft index yet. Run generate_portfolio_draft.py and refresh.</p>`;
}

async function init() {
  try {
    await loadData();
    fill(els.projectFilter, PROJECTS);
    fill(els.askProject, PROJECTS);
    fill(els.typeFilter, TYPES);
    fill(els.stageFilter, STAGES);
    fill(els.batchProject, PROJECTS, false);
    fill(els.batchType, TYPES, false);
    fill(els.batchStage, STAGES, false);
    els.batchProject.insertAdjacentHTML("afterbegin", `<option value="">Project unchanged</option>`);
    els.batchType.insertAdjacentHTML("afterbegin", `<option value="">Type unchanged</option>`);
    els.batchStage.insertAdjacentHTML("afterbegin", `<option value="">Stage unchanged</option>`);
    els.batchProject.value = "";
    els.batchType.value = "";
    els.batchStage.value = "";
    renderDashboard();
    renderSearch();
    renderImageSearch();
    await checkApi();
    if (materials[0]) showDetail(materials[0].id);
  } catch (error) {
    setStatus("Failed to load local data", "error");
    if (els.materialList) els.materialList.innerHTML = emptyState();
    console.error(error);
  }
}

els.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
[els.searchInput, els.projectFilter, els.typeFilter, els.stageFilter, els.sourceFilter, els.limitFilter, els.sortFilter].forEach((node) => node.addEventListener("input", renderSearch));
els.clearFilters.addEventListener("click", () => {
  quickMode = "";
  els.searchInput.value = "";
  els.projectFilter.value = "all";
  els.typeFilter.value = "all";
  els.stageFilter.value = "all";
  els.sourceFilter.value = "all";
  els.limitFilter.value = "20";
  els.sortFilter.value = "score";
  renderSearch();
});
els.hubSearchButton.addEventListener("click", () => {
  els.searchInput.value = els.hubSearchInput.value.trim();
  switchView("search");
  renderSearch();
});
els.hubSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") els.hubSearchButton.click();
});
document.querySelectorAll(".hub-entry").forEach((cardNode) => cardNode.addEventListener("click", () => switchView(cardNode.dataset.hubTarget)));
els.applyBatch.addEventListener("click", applyBatchUpdate);
els.askButton.addEventListener("click", askDesignMate);
els.showcaseToggle.addEventListener("click", () => document.body.classList.toggle("showcase"));
els.clearSelection.addEventListener("click", () => {
  selectedIds.clear();
  renderSearch();
});
els.imageMetadataSearch.addEventListener("click", renderImageSearch);
els.imageFilenameQuery.addEventListener("input", renderImageSearch);
els.captureLinkButton.addEventListener("click", captureLink);
document.querySelectorAll(".jump").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.target)));
document.getElementById("quickFilters").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  quickMode = button.dataset.quick;
  els.searchInput.value = "";
  els.projectFilter.value = "all";
  els.typeFilter.value = "all";
  els.stageFilter.value = "all";
  if (button.dataset.quick === "reader") els.projectFilter.value = "reader-design";
  if (button.dataset.quick === "info") els.projectFilter.value = "info-center";
  if (button.dataset.quick === "feedback") els.typeFilter.value = "feedback";
  if (button.dataset.quick === "research") els.typeFilter.value = "research";
  renderSearch();
});

init();
