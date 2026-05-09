let materials = [];
let stats = {};
let selectedId = null;
let selectedIds = new Set();
let apiConnected = false;
let quickMode = "";
const API_BASE = "http://127.0.0.1:8765";

const PROJECTS = ["reader-design", "info-center", "thesis", "general", "unknown"];
const TYPES = ["sketch", "reference", "research", "competitor", "feedback", "draft", "presentation", "paper", "idea", "unknown"];
const STAGES = ["background", "research", "insight", "concept", "development", "final", "presentation", "reflection", "unknown"];
const SOURCES = ["demo", "user", "imported", "unknown"];

const els = {
  status: document.getElementById("status"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
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
  els.status.textContent = message;
  els.status.className = `status ${mode}`;
}

async function checkApi() {
  try {
    const response = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
    const payload = await response.json();
    apiConnected = Boolean(payload.ok);
    setStatus(apiConnected ? "API 已连接" : "静态模式", apiConnected ? "ok" : "warn");
  } catch {
    apiConnected = false;
    setStatus("静态模式：无法保存，请运行 python DesignMate/scripts/start_api.py", "warn");
  }
}

function fill(select, values, includeAll = true) {
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

function renderDashboard() {
  const importStats = (stats && stats.import) || (window.DESIGNMATE_DATA && window.DESIGNMATE_DATA.import_stats) || {};
  const high = materials.filter((item) => Number(item.material_score || 0) >= 70).length;
  const pending = materials.filter(needsConfirm).length;
  const unknown = materials.filter((item) => item.material_type === "unknown" || item.project_guess === "unknown").length;
  const failed = materials.filter((item) => !["parsed", "metadata_only"].includes(item.parse_status)).length;
  const bySource = countBy("source_mode");
  const docs = materials.filter((item) => ["md", "txt", "pdf", "docx", "pptx"].includes(item.extension)).length;
  const images = materials.filter((item) => ["jpg", "jpeg", "png"].includes(item.extension)).length;
  els.importStats.innerHTML = [
    statCard("Inbox 文件", importStats.inbox_file_count ?? 0),
    statCard("Library 文件", importStats.library_file_count ?? 0),
    statCard("上次扫描", importStats.last_scan_time || "暂无"),
    statCard("上次报告", importStats.last_report_time || "暂无"),
    statCard("真实资料", bySource.user || 0),
    statCard("Demo 资料", bySource.demo || 0),
    statCard("图片文件", images),
    statCard("文档文件", docs),
  ].join("");
  els.stats.innerHTML = [
    statCard("总资料数", materials.length),
    statCard("高价值资料", high),
    statCard("待确认资料", pending),
    statCard("未分类资料", unknown),
    statCard("解析失败", failed),
    statCard("Demo 数据", bySource.demo || 0),
    statCard("User Inbox", bySource.user || 0),
    statCard("Library", bySource.imported || 0),
    statCard("Unknown Source", bySource.unknown || 0),
  ].join("");
  els.projectCards.innerHTML = miniCards(countBy("project_guess"));
  els.typeCards.innerHTML = miniCards(countBy("material_type"));
  const highlights = [...materials].sort((a, b) => Number(b.material_score || 0) - Number(a.material_score || 0)).slice(0, 5);
  const recent = [...materials].sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || ""))).slice(0, 5);
  els.highlightList.innerHTML = [
    `<h3>今日建议</h3>`,
    `<div class="advice-card">${(bySource.user || 0) === 0 ? "当前主要是 Demo 数据。请放入你的真实作品集资料后重新运行扫描。" : "先处理待确认资料，再把高价值资料按项目批量确认；用 Source 筛选只查看自己的资料。"}</div>`,
    `<h3>高价值资料 Top 5</h3>`,
    highlights.length ? highlights.map(card).join("") : emptyState(),
    `<h3>最近更新资料</h3>`,
    recent.length ? recent.map(card).join("") : emptyState(),
  ].join("");
}

function queryTokens(query) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function matches(item, query) {
  if (!query) return true;
  const text = [item.filename, item.content_preview, item.reason, item.notes, item.material_type, item.portfolio_stage, item.project_guess, ...(item.tags || [])].join(" ").toLowerCase();
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
    return Number(b.material_score || 0) - Number(a.material_score || 0);
  });
  return rows.slice(0, limit);
}

function chips(item) {
  return [item.project_guess, item.material_type, item.portfolio_stage, ...(item.tags || [])]
    .filter(Boolean)
    .map((value) => `<span class="chip">${esc(value)}</span>`)
    .join("");
}

function card(item) {
  const preview = (item.content_preview || "No preview available.").replace(/\s+/g, " ").slice(0, 220);
  const selected = item.id === selectedId ? " selected" : "";
  const checked = selectedIds.has(item.id) ? "checked" : "";
  const image = item.image_preview_path ? `<img class="thumb" src="${esc(item.image_preview_path.replace(/^frontend\//, ""))}" alt="" />` : `<div class="thumb placeholder">${esc((item.extension || "file").toUpperCase())}</div>`;
  return `
    <article class="material-card${selected}" data-id="${esc(item.id)}">
      <div class="title-row">
        <label class="select-line"><input class="select-material" type="checkbox" data-select-id="${esc(item.id)}" ${checked} />${image}<span class="filename">${esc(item.filename)}</span></label>
        <div class="score">${esc(item.material_score || 0)}</div>
      </div>
      <div class="chips">${chips(item)}<span class="chip ${item.review_status === "confirmed" ? "confirmed" : "pending"}">${item.review_status === "confirmed" ? "已确认" : "待确认"}</span></div>
      <p class="meta">${esc(preview)}</p>
      <p class="why">${esc(item.reason || "需要补充资料用途说明。")}</p>
    </article>
  `;
}

function emptyState() {
  return `<div class="empty">请把资料放入 DesignMate/data/inbox，然后运行 python DesignMate/scripts/run_designmate.py</div>`;
}

function filterSummary(count) {
  const bits = [];
  if (els.searchInput.value.trim()) bits.push(`query=${els.searchInput.value.trim()}`);
  if (els.projectFilter.value !== "all") bits.push(`project=${els.projectFilter.value}`);
  if (els.typeFilter.value !== "all") bits.push(`type=${els.typeFilter.value}`);
  if (els.stageFilter.value !== "all") bits.push(`stage=${els.stageFilter.value}`);
  if (els.sourceFilter.value !== "all") bits.push(`source=${els.sourceFilter.value}`);
  return `${count} 条结果${bits.length ? " / " + bits.join(" / ") : ""}`;
}

function renderSearch() {
  const results = filtered();
  els.resultTitle.textContent = filterSummary(results.length);
  els.materialList.innerHTML = results.length ? results.map(card).join("") : emptyState();
  renderBatchToolbar();
  document.querySelectorAll("[data-id]").forEach((node) => node.addEventListener("click", (event) => {
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
  els.selectedCount.textContent = `已选择 ${selectedIds.size} 条`;
  els.batchToolbar.classList.toggle("active", selectedIds.size > 0);
}

function options(values, current) {
  return values.map((value) => `<option value="${esc(value)}" ${value === current ? "selected" : ""}>${esc(value)}</option>`).join("");
}

function confirmQuestion(item) {
  if (item.material_type === "unknown" || item.project_guess === "unknown") return "需要确认资料类型或项目归属。";
  if (Number(item.material_score || 0) < 55) return "需要补充正文、证据来源或作品集用途。";
  return "建议人工确认是否进入作品集草稿。";
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
      <h3>基础信息</h3>
      <dl>
        <dt>文件路径</dt><dd>${esc(item.path)}</dd>
        <dt>解析状态</dt><dd>${esc(item.parse_status)}</dd>
        <dt>字数</dt><dd>${esc(item.word_count || 0)}</dd>
        <dt>更新</dt><dd>${esc(item.updated_at || "")}</dd>
        <dt>Hash</dt><dd>${esc(item.file_hash || "未记录")}</dd>
        <dt>图片尺寸</dt><dd>${esc(item.image_width && item.image_height ? `${item.image_width}x${item.image_height}` : "非图片或未读取")}</dd>
        <dt>数据来源</dt><dd>${esc(item.source_mode || "unknown")}</dd>
      </dl>
    </section>
    <section class="detail-section ask-sections">
      <h3>分类编辑</h3>
      <label>Project<select id="editProject">${options(PROJECTS, item.project_guess || "unknown")}</select></label>
      <label>Type<select id="editType">${options(TYPES, item.material_type || "unknown")}</select></label>
      <label>Stage<select id="editStage">${options(STAGES, item.portfolio_stage || "unknown")}</select></label>
      <label>Tags<input id="editTags" value="${esc((item.tags || []).join(", "))}" /></label>
      <label>Score<input id="editScore" type="number" min="0" max="100" value="${esc(item.material_score || 0)}" /></label>
      <label>Notes<textarea id="editNotes" rows="4">${esc(item.notes || "")}</textarea></label>
      ${item.image_note ? `<p class="meta">${esc(item.image_note)} 可在 Notes 中手动填写图片说明。</p>` : ""}
      <button id="saveMaterial" class="primary">保存修改</button>
      <p class="save-message" id="saveMessage"></p>
    </section>
    <section class="detail-section">
      <h3>摘要</h3>
      <p class="meta">${esc(item.content_preview || "No summary available.")}</p>
    </section>
    <section class="detail-section">
      <h3>作品集用途</h3>
      <p class="meta">阶段：${esc(item.portfolio_stage || "unknown")}。${esc(item.reason || "需要补充上下文。")}</p>
      <p class="meta">需要确认：${esc(confirmQuestion(item))}</p>
      <p class="meta">生成页面草稿：运行 <code>python scripts/generate_portfolio_draft.py --project ${esc(item.project_guess || "general")}</code></p>
    </section>
  `;
  document.getElementById("saveMaterial").addEventListener("click", () => saveMaterial(item.id));
}

async function askDesignMate() {
  const question = els.askQuestion.value.trim();
  if (!question) {
    els.askResult.innerHTML = `<h2>回答</h2><p class="empty">请输入一个问题。</p>`;
    return;
  }
  if (!apiConnected) {
    els.askResult.innerHTML = `<h2>回答</h2><p class="empty">当前为静态模式。请运行 python DesignMate/scripts/start_api.py 后使用 Ask DesignMate。</p>`;
    return;
  }
  try {
    setStatus("Ask DesignMate 思考中...", "");
    const response = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, project: els.askProject.value === "all" ? null : els.askProject.value, limit: 10 }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Ask failed");
    els.askResult.innerHTML = `
      <h2>回答 <span class="mode">${esc(data.mode)}</span></h2>
      <div class="answer">${data.answer_sections ? renderAnswerSections(data.answer_sections) : renderMarkdown(data.answer || "")}</div>
      <h3>使用资料</h3>
      <div class="material-list">${(data.used_materials || []).slice(0, 6).map(card).join("") || emptyState()}</div>
      <h3>后续建议</h3>
      <ul>${(data.suggestions || []).map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      <h3>需要确认</h3>
      <ul>${(data.need_confirm || []).map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    `;
    setStatus("Ask DesignMate 已回答", "ok");
  } catch (error) {
    els.askResult.innerHTML = `<h2>回答</h2><p class="empty">提问失败：${esc(error.message)}</p>`;
    setStatus("Ask DesignMate 失败", "error");
  }
}

function renderAnswerSections(sections) {
  return Object.entries(sections).map(([title, value]) => `<section class="answer-section"><h3>${esc(title)}</h3>${Array.isArray(value) ? `<ul>${value.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p>${esc(value)}</p>`}</section>`).join("");
}

async function applyBatchUpdate() {
  if (!selectedIds.size) return;
  if (!apiConnected) {
    setStatus("静态模式：无法批量保存，请运行 python DesignMate/scripts/start_api.py", "warn");
    return;
  }
  const updates = {};
  if (els.batchProject.value) updates.project_guess = els.batchProject.value;
  if (els.batchType.value) updates.material_type = els.batchType.value;
  if (els.batchStage.value) updates.portfolio_stage = els.batchStage.value;
  if (els.batchTags.value.trim()) updates.tags = els.batchTags.value.trim();
  if (!Object.keys(updates).length) {
    setStatus("请选择至少一个批量修改字段", "warn");
    return;
  }
  try {
    setStatus("批量保存中...", "");
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
    setStatus(`批量保存成功：${data.count} 条`, "ok");
    renderDashboard();
    renderSearch();
    if (selectedId) showDetail(selectedId);
  } catch (error) {
    setStatus(`批量保存失败：${error.message}`, "error");
  }
}

async function saveMaterial(id) {
  const message = document.getElementById("saveMessage");
  if (!apiConnected) {
    message.textContent = "当前为静态模式，无法保存。请运行 python DesignMate/scripts/start_api.py";
    setStatus("静态模式：无法保存", "warn");
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
    setStatus("保存中...", "");
    const response = await fetch(`${API_BASE}/api/materials/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Save failed");
    const index = materials.findIndex((item) => item.id === id);
    materials[index] = data.material;
    message.textContent = "保存成功";
    setStatus("保存成功", "ok");
    renderDashboard();
    showDetail(id);
  } catch (error) {
    message.textContent = `保存失败：${error.message}`;
    setStatus("保存失败", "error");
  }
}

function switchView(view) {
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  els.views.forEach((node) => node.classList.toggle("active", node.id === `${view}View`));
}

function renderMarkdown(markdown) {
  if (!markdown.trim()) return `<p class="empty">报告为空。请运行 python DesignMate/scripts/run_designmate.py</p>`;
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
    return fallback || "暂无内容。";
  }
}

async function loadData() {
  if (window.DESIGNMATE_DATA) {
    materials = window.DESIGNMATE_DATA.materials.materials || [];
    stats = window.DESIGNMATE_DATA.materials.stats || {};
    els.latestReport.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_report || "");
    els.needConfirm.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_need_confirm || "");
    els.nextActions.innerHTML = renderMarkdown(window.DESIGNMATE_DATA.latest_next_actions || "");
    renderDraftList(window.DESIGNMATE_DATA.drafts || []);
    return;
  }
  const response = await fetch("data/materials.json");
  const payload = await response.json();
    materials = payload.materials || [];
    stats = payload.stats || {};
  els.latestReport.innerHTML = renderMarkdown(await loadText("data/latest_report.txt"));
  els.needConfirm.innerHTML = renderMarkdown(await loadText("data/latest_need_confirm.txt"));
  els.nextActions.innerHTML = renderMarkdown(await loadText("data/latest_next_actions.txt"));
  renderDraftList(payload.drafts || []);
}

function renderDraftList(drafts) {
  if (!els.draftList) return;
  els.draftList.innerHTML = drafts.length
    ? drafts.map((item) => `<p><code>${esc(item.path)}</code><span class="meta"> ${esc(item.modified_time || "")}</span></p>`).join("")
    : `<p class="meta">暂无草稿列表。运行 generate_portfolio_draft.py 后刷新。</p>`;
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
    els.batchProject.insertAdjacentHTML("afterbegin", `<option value="">Project 不修改</option>`);
    els.batchType.insertAdjacentHTML("afterbegin", `<option value="">Type 不修改</option>`);
    els.batchStage.insertAdjacentHTML("afterbegin", `<option value="">Stage 不修改</option>`);
    els.batchProject.value = "";
    els.batchType.value = "";
    els.batchStage.value = "";
    renderDashboard();
    renderSearch();
    await checkApi();
    if (materials[0]) showDetail(materials[0].id);
  } catch (error) {
    setStatus("Failed to load local data", "error");
    els.materialList.innerHTML = emptyState();
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
els.applyBatch.addEventListener("click", applyBatchUpdate);
els.askButton.addEventListener("click", askDesignMate);
els.showcaseToggle.addEventListener("click", () => document.body.classList.toggle("showcase"));
els.clearSelection.addEventListener("click", () => {
  selectedIds.clear();
  renderSearch();
});
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
