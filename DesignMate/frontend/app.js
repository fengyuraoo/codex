let materials = [];
let stats = {};
let drafts = [];
let selectedId = null;
let selectedIds = new Set();
let apiConnected = false;
let quickMode = "";
const API_BASE = "http://127.0.0.1:8765";
const LANGUAGE_KEY = "designmate_language";

const translations = {
  en: {
    appSubtitle: "Search Hub for local design portfolio materials",
    navDashboard: "Search Hub",
    navAdd: "Add Materials",
    navSearch: "Text Search",
    navImage: "Image Search",
    navLink: "Link Capture",
    navAsk: "Ask DesignMate",
    navReport: "Reports",
    showcase: "Showcase Mode",
    heroEyebrow: "Local-first design evidence search",
    heroTitle: "A Local AI Search Hub for Design Portfolio Materials",
    heroSubtitle: "Search sketches, research notes, feedback screenshots, references and project files. Turn scattered design materials into portfolio-ready stories.",
    heroSearchPlaceholder: "Search pain points, sketches, feedback, page themes...",
    addMaterials: "Add Materials",
    addMaterialsIntro: "This is the material input hub for DesignMate. Add sketches, references, feedback screenshots, research notes, project files and inspiration links, then turn them into searchable design evidence.",
    addMaterialsEntry: "Start here: add files, capture links, paste notes or import a folder before searching.",
    addEyebrow: "Material Input Hub",
    uploadFiles: "Upload Files",
    uploadFilesBody: "Drag in images, PDFs, Word, PPT, Markdown, TXT or screenshots from a design project.",
    uploadDrop: "Drop design materials here",
    uploadChoose: "images, PDF, DOCX, PPTX, Markdown, TXT and screenshots",
    uploadFallback: "File upload is prepared. In this version, place files into the user materials folder and run scan.",
    captureLinkBody: "Paste Xiaohongshu, Douyin, Bilibili, Behance, Pinterest, web articles or portfolio case links.",
    pasteNote: "Paste Note",
    pasteNoteBody: "Save a quick research note, critique, idea or page draft directly into the local library.",
    noteTitle: "Title",
    noteContent: "Content",
    materialType: "Material Type",
    saveNote: "Save Note",
    noteSaved: "Note saved as searchable design evidence.",
    noteContentRequired: "Please paste note content before saving.",
    importFolder: "Import Folder",
    importFolderBody: "DesignMate scans local folders and adds materials to the local database.",
    importStep1: "Put files into the DesignMate user materials folder",
    importStep2: "Run the scan script",
    importStep3: "Return to Search Hub to search them",
    scanCommand: "Scan command",
    search: "Search",
    textSearch: "Text Search",
    imageSearch: "Image Search",
    linkCapture: "Link Capture",
    askDesignMate: "Ask DesignMate",
    why: "Why DesignMate",
    whyTitle: "From scattered materials to portfolio-ready stories",
    whyBody: "Designers collect many sketches, references, research notes, feedback screenshots and project files. But these materials are often scattered across folders and hard to turn into a clear portfolio story. DesignMate helps search local design materials, organize evidence, and generate portfolio-ready narratives.",
    staticMode: "Static preview mode. Saving, link capture and editing require the API: python DesignMate/scripts/start_api.py",
    apiConnected: "API connected",
    source: "Source",
    project: "Project",
    stage: "Stage",
    type: "Type",
    relevance: "Relevance",
    placement: "Portfolio Placement",
    userNote: "User Note",
    openLink: "Open Link",
    openSourceLink: "Open source link",
    capturedFromWeb: "Captured from web",
    platform: "Platform",
    confidence: "confidence",
    noPreview: "No preview available.",
    empty: "Put your materials into DesignMate/data/inbox, then run python DesignMate/scripts/run_designmate.py.",
    linkTitle: "Turn external inspiration links into searchable evidence",
    linkIntro: "Paste a webpage, portfolio case, social post or short-video link. DesignMate will save the source link, detect the platform, extract public metadata when possible, and preserve your design note.",
    linkUrlLabel: "Paste a design inspiration link here.",
    designStage: "Design Stage",
    captureLink: "Capture Link",
    captureLinkDisabled: "Static preview mode. Saving, link capture and editing require the API: python DesignMate/scripts/start_api.py",
    linkWhy: "Why it matters",
    nextAction: "Suggested next action",
    nextActionText: "Review this card in Text Search, add stronger notes, then use it as inspiration evidence or a moodboard source.",
    linkLimit: "This platform may limit automatic extraction. The link is saved, and your note will help DesignMate understand why it matters.",
    askPlaceholder: "Example: Which materials prove the user pain points?",
    answer: "Answer",
    usedMaterials: "Used materials",
    askEmpty: "Please enter a portfolio-focused question.",
    askStatic: "Static preview mode. Ask DesignMate requires the API: python DesignMate/scripts/start_api.py",
    saving: "Saving...",
    saved: "Saved",
    failed: "failed",
  },
  zh: {
    appSubtitle: "设计作品集资料搜索助手",
    navDashboard: "搜索中心",
    navAdd: "添加资料",
    navSearch: "文本搜索",
    navImage: "图片搜索",
    navLink: "链接采集",
    navAsk: "问 DesignMate",
    navReport: "报告",
    showcase: "展示模式",
    heroEyebrow: "本地优先的设计证据搜索",
    heroTitle: "面向设计作品集资料的本地 AI 搜索中心",
    heroSubtitle: "搜索草图、调研笔记、反馈截图、参考资料和项目文件，把零散设计资料整理成可用于作品集的叙事。",
    heroSearchPlaceholder: "搜索用户痛点、草图、反馈、页面主题...",
    addMaterials: "添加资料",
    addMaterialsIntro: "这里是 DesignMate 的资料入口。你可以把草图、灵感图、反馈截图、调研笔记、项目文档和外部链接加入资料库，之后它们会变成可搜索、可提问、可导出的设计证据。",
    addMaterialsEntry: "从这里开始：添加文件、采集链接、粘贴笔记或导入文件夹，再进入搜索。",
    addEyebrow: "统一资料入口",
    uploadFiles: "上传文件",
    uploadFilesBody: "拖入图片、PDF、Word、PPT、Markdown、TXT 或项目截图等设计资料。",
    uploadDrop: "把设计资料拖到这里",
    uploadChoose: "图片、PDF、DOCX、PPTX、Markdown、TXT 和截图",
    uploadFallback: "文件上传入口已预留。当前版本请先把文件放入 DesignMate 的用户资料文件夹后运行扫描。",
    captureLinkBody: "粘贴小红书、抖音、B站、Behance、Pinterest、网页文章或作品集案例链接。",
    pasteNote: "粘贴笔记",
    pasteNoteBody: "把调研记录、老师反馈、设计想法或页面草稿直接保存进本地资料库。",
    noteTitle: "标题",
    noteContent: "内容",
    materialType: "资料类型",
    saveNote: "保存笔记",
    noteSaved: "笔记已保存为可搜索的设计证据。",
    noteContentRequired: "请先粘贴笔记内容。",
    importFolder: "导入文件夹",
    importFolderBody: "DesignMate 可以扫描本地文件夹，把资料加入本地数据库。",
    importStep1: "把资料放入 DesignMate 的用户资料文件夹",
    importStep2: "运行扫描脚本",
    importStep3: "回到 Search Hub 搜索",
    scanCommand: "扫描命令",
    search: "搜索",
    textSearch: "文本搜索",
    imageSearch: "图片搜索",
    linkCapture: "链接采集",
    askDesignMate: "问 DesignMate",
    why: "为什么需要 DesignMate",
    whyTitle: "把零散资料整理成作品集叙事",
    whyBody: "设计学生会收集很多草图、参考、调研笔记、反馈截图和项目文件，但这些资料常常分散在不同文件夹和收藏夹里，很难变成清晰的作品集故事。DesignMate 帮你搜索本地设计资料、整理证据，并生成可用于作品集的叙事线索。",
    staticMode: "当前处于静态预览模式。保存、链接采集和编辑需要先启动 API：python DesignMate/scripts/start_api.py",
    apiConnected: "API 已连接",
    source: "来源",
    project: "项目",
    stage: "阶段",
    type: "类型",
    relevance: "匹配度",
    placement: "作品集位置",
    userNote: "我的备注",
    openLink: "打开链接",
    capturedFromWeb: "来自网页采集",
    platform: "平台",
    confidence: "匹配度",
    noPreview: "暂无摘要。",
    empty: "请把资料放入 DesignMate/data/inbox，然后运行 python DesignMate/scripts/run_designmate.py。",
    linkTitle: "把外部灵感链接转化为可搜索的设计证据",
    linkIntro: "粘贴网页文章、作品集案例、社交图文或短视频链接。DesignMate 会保存原始链接，识别平台，在可公开访问时提取元信息，并保留你的设计备注。",
    linkUrlLabel: "在这里粘贴设计灵感链接。",
    designStage: "设计阶段",
    captureLink: "保存链接",
    captureLinkDisabled: "当前处于静态预览模式。保存、链接采集和编辑需要先启动 API：python DesignMate/scripts/start_api.py",
    linkWhy: "为什么值得保存",
    nextAction: "下一步建议",
    nextActionText: "在文本搜索中复查这张卡片，补充更具体的备注，再把它作为灵感证据或 Moodboard 来源。",
    linkLimit: "这个平台可能限制自动提取。链接已保存，你的备注会帮助 DesignMate 理解它为什么重要。",
    askPlaceholder: "例如：哪些资料能证明用户痛点？",
    answer: "回答",
    usedMaterials: "使用的资料",
    askEmpty: "请输入一个和作品集有关的问题。",
    askStatic: "当前处于静态预览模式。问 DesignMate 需要先启动 API：python DesignMate/scripts/start_api.py",
    saving: "保存中...",
    saved: "已保存",
    failed: "失败",
  },
};

let currentLang = localStorage.getItem(LANGUAGE_KEY) || ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");

const PROJECTS = ["reader-design", "info-center", "thesis", "general", "unknown"];
const TYPES = ["sketch", "reference", "research", "competitor", "feedback", "draft", "presentation", "paper", "idea", "unknown"];
const STAGES = ["background", "research", "insight", "concept", "development", "final", "presentation", "reflection", "unknown"];

const els = {
  status: document.getElementById("status"),
  langZh: document.getElementById("langZh"),
  langEn: document.getElementById("langEn"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  hubSearchInput: document.getElementById("hubSearchInput"),
  hubSearchButton: document.getElementById("hubSearchButton"),
  addMaterialsHeroButton: document.getElementById("addMaterialsHeroButton"),
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
  addLinkUrl: document.getElementById("addLinkUrl"),
  addLinkProject: document.getElementById("addLinkProject"),
  addLinkDesignStage: document.getElementById("addLinkDesignStage"),
  addLinkPlacement: document.getElementById("addLinkPlacement"),
  addLinkNote: document.getElementById("addLinkNote"),
  addCaptureLinkButton: document.getElementById("addCaptureLinkButton"),
  addLinkResult: document.getElementById("addLinkResult"),
  noteTitle: document.getElementById("noteTitle"),
  noteProject: document.getElementById("noteProject"),
  noteDesignStage: document.getElementById("noteDesignStage"),
  noteMaterialType: document.getElementById("noteMaterialType"),
  notePlacement: document.getElementById("notePlacement"),
  noteContent: document.getElementById("noteContent"),
  saveNoteButton: document.getElementById("saveNoteButton"),
  noteSaveResult: document.getElementById("noteSaveResult"),
  latestReport: document.getElementById("latestReport"),
  needConfirm: document.getElementById("needConfirm"),
  nextActions: document.getElementById("nextActions"),
  draftList: document.getElementById("draftList"),
  showcaseToggle: document.getElementById("showcaseToggle"),
};

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
}

function text(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
}

function placeholder(selector, value) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute("placeholder", value);
}

function applyI18nAttributes() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
}

function applyTranslations() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = `DesignMate v0.7.2 ${currentLang === "zh" ? "搜索中心" : "Search Hub"}`;
  applyI18nAttributes();
  text(".brand span", "v0.7.2");
  text(".topbar p", t("appSubtitle"));
  const navLabels = { dashboard: "navDashboard", add: "navAdd", search: "navSearch", image: "navImage", link: "navLink", ask: "navAsk", report: "navReport" };
  els.tabs.forEach((tab) => {
    tab.textContent = t(navLabels[tab.dataset.view] || "navDashboard");
  });
  els.langZh.classList.toggle("active", currentLang === "zh");
  els.langEn.classList.toggle("active", currentLang === "en");
  els.showcaseToggle.textContent = t("showcase");
  text(".search-hero .eyebrow", t("heroEyebrow"));
  text(".search-hero h2", t("heroTitle"));
  text(".hero-subtitle", t("heroSubtitle"));
  placeholder("#hubSearchInput", t("heroSearchPlaceholder"));
  els.hubSearchButton.textContent = t("search");
  if (els.addMaterialsHeroButton) els.addMaterialsHeroButton.textContent = t("addMaterials");
  const entries = document.querySelectorAll(".hub-entry");
  const entryKeys = [
    ["addMaterials", t("addMaterialsEntry")],
    ["textSearch", currentLang === "zh" ? "搜索项目名、关键词、用户痛点、设计阶段、文件内容和作品集页面主题。" : "Find project names, keywords, user pain points, design stages, file content and portfolio page topics."],
    ["imageSearch", currentLang === "zh" ? "用图片元信息和文件名匹配草图、参考图和反馈截图。" : "Use image metadata and filename matching for sketches, references and screenshots."],
    ["askDesignMate", currentLang === "zh" ? "用本地资料回答作品集结构、证据缺口和页面位置问题。" : "Ask portfolio-focused questions and get structured answers backed by local materials."],
    ["linkCapture", currentLang === "zh" ? "保存网页、作品集案例、社交图文和短视频链接为可搜索的设计证据。" : "Save web articles, portfolio cases, social posts and short-video references as searchable design evidence."],
  ];
  entries.forEach((entry, index) => {
    const pair = entryKeys[index];
    if (!pair) return;
    entry.querySelector("strong").textContent = t(pair[0]);
    entry.querySelector("p").textContent = pair[1];
  });
  text(".why-designmate .eyebrow", t("why"));
  text(".why-designmate h2", t("whyTitle"));
  text(".why-designmate > p", t("whyBody"));
  text("#linkView .link-capture-shell .eyebrow", t("linkCapture"));
  text("#linkView .link-capture-shell h1", t("linkTitle"));
  text("#linkView .link-capture-shell > div p:not(.eyebrow)", t("linkIntro"));
  text("#linkView label.wide span", t("linkUrlLabel"));
  const linkWide = document.querySelectorAll("#linkView label.wide span");
  if (linkWide[1]) linkWide[1].textContent = t("userNote");
  const linkFormLabels = document.querySelectorAll("#linkView .link-form-grid label span");
  if (linkFormLabels[0]) linkFormLabels[0].textContent = t("project");
  if (linkFormLabels[1]) linkFormLabels[1].textContent = t("designStage");
  if (linkFormLabels[2]) linkFormLabels[2].textContent = t("placement");
  text("#captureLinkButton", t("captureLink"));
  placeholder("#linkNote", currentLang === "zh" ? "这条链接为什么值得放进作品集资料库？" : "Why does this link matter for your portfolio story?");
  placeholder("#askQuestion", t("askPlaceholder"));
  text("#askView .ask-result h2", t("answer"));
  const searchLabels = document.querySelectorAll("#searchView .controls label span");
  const searchKeys = ["textSearch", "project", "type", "stage", "source"];
  searchKeys.forEach((key, index) => {
    if (searchLabels[index]) searchLabels[index].textContent = t(key);
  });
  if (!apiConnected) setStatus(t("staticMode"), "warn");
}

function setLanguage(lang) {
  currentLang = lang === "zh" ? "zh" : "en";
  localStorage.setItem(LANGUAGE_KEY, currentLang);
  applyTranslations();
  renderDashboard();
  renderSearch();
  renderImageSearch();
  if (selectedId) showDetail(selectedId);
}

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
    setStatus(apiConnected ? t("apiConnected") : t("staticMode"), apiConnected ? "ok" : "warn");
    if (els.captureLinkButton) els.captureLinkButton.disabled = !apiConnected;
    if (els.addCaptureLinkButton) els.addCaptureLinkButton.disabled = !apiConnected;
    if (els.saveNoteButton) els.saveNoteButton.disabled = !apiConnected;
  } catch {
    apiConnected = false;
    if (els.captureLinkButton) els.captureLinkButton.disabled = true;
    if (els.addCaptureLinkButton) els.addCaptureLinkButton.disabled = true;
    if (els.saveNoteButton) els.saveNoteButton.disabled = true;
    setStatus(t("staticMode"), "warn");
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
  if (currentLang === "zh") {
    return `命中${fields.join(" + ") || "文件名元信息"}，可作为作品集「${placement}」部分的设计证据。`;
  }
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
  const preview = (item.content_preview || t("noPreview")).replace(/\s+/g, " ").slice(0, 220);
  const selected = item.id === selectedId ? " selected" : "";
  const checked = selectedIds.has(item.id) ? "checked" : "";
  const image = item.image_preview_path ? `<img class="thumb" src="${esc(item.image_preview_path.replace(/^frontend\//, ""))}" alt="" />` : `<div class="thumb placeholder">${esc((item.extension || "file").toUpperCase())}</div>`;
  return `
    <article class="material-card evidence-card${selected}" data-id="${esc(item.id)}">
      <div class="title-row">
        <label class="select-line"><input class="select-material" type="checkbox" data-select-id="${esc(item.id)}" ${checked} />${image}<span class="filename">${esc(item.filename)}</span></label>
        <div class="confidence"><strong>${confidence(item)}</strong><span>${esc(t("confidence"))}</span></div>
      </div>
      <div class="evidence-meta">
        <span><b>${esc(t("source"))}</b>${esc(sourceLabel(item))}</span>
        <span><b>${esc(t("project"))}</b>${esc(item.project_guess || "unknown")}</span>
        <span><b>${esc(t("stage"))}</b>${esc(inferDesignStage(item))}</span>
        <span><b>${esc(t("type"))}</b>${esc(inferEvidenceType(item))}</span>
        <span><b>${esc(t("placement"))}</b>${esc(portfolioPlacement(item))}</span>
      </div>
      ${item.url ? `<p class="link-line"><span>${esc(t("capturedFromWeb"))}</span><span>${esc(t("platform"))}: ${esc(item.platform || "generic webpage")}</span><a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(t("openLink"))}</a></p>` : ""}
      <div class="chips">${chips(item)}<span class="chip ${item.review_status === "confirmed" ? "confirmed" : "pending"}">${item.review_status === "confirmed" ? "confirmed" : "need confirm"}</span></div>
      <p class="meta">${esc(preview)}</p>
      ${item.user_note ? `<p class="user-note">${esc(t("userNote"))}: ${esc(item.user_note)}</p>` : ""}
      <p class="why">${esc(evidenceWhy(item))}</p>
    </article>
  `;
}

function emptyState() {
  return `<div class="empty">${esc(t("empty"))}</div>`;
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
        <dt>${esc(t("source"))}</dt><dd>${esc(sourceLabel(item))}</dd>
        <dt>Parse</dt><dd>${esc(item.parse_status)}</dd>
        <dt>Words</dt><dd>${esc(item.word_count || 0)}</dd>
        <dt>Updated</dt><dd>${esc(item.updated_at || "")}</dd>
        <dt>Image</dt><dd>${esc(item.image_width && item.image_height ? `${item.image_width}x${item.image_height}` : "not image / unavailable")}</dd>
        <dt>URL</dt><dd>${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.url)}</a>` : "not link"}</dd>
        <dt>${esc(t("platform"))}</dt><dd>${esc(item.platform || "n/a")}</dd>
        <dt>Source type</dt><dd>${esc(item.source_type || "n/a")}</dd>
      </dl>
    </section>
    <section class="detail-section">
      <h3>Portfolio Placement</h3>
      <p class="meta">${esc(portfolioPlacement(item))}: ${esc(evidenceWhy(item))}</p>
      ${item.user_note ? `<p class="meta">${esc(t("userNote"))}: ${esc(item.user_note)}</p>` : ""}
      <p class="meta">Need confirm: ${esc(confirmQuestion(item))}</p>
    </section>
    <section class="detail-section edit-section">
      <h3>Edit Classification</h3>
      <label>${esc(t("project"))}<select id="editProject">${options(PROJECTS, item.project_guess || "unknown")}</select></label>
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
      <p class="meta">${esc(item.content_preview || t("noPreview"))}</p>
    </section>
  `;
  document.getElementById("saveMaterial").addEventListener("click", () => saveMaterial(item.id));
}

function linkCaptureSummary(material) {
  return `
    <article class="material-card link-success-card">
      <h2>${esc(currentLang === "zh" ? "链接已保存" : "Link captured")}</h2>
      <dl class="link-summary">
        <dt>${esc(currentLang === "zh" ? "链接标题" : "Title")}</dt><dd>${esc(material.title || material.filename || "Untitled link")}</dd>
        <dt>${esc(t("platform"))}</dt><dd>${esc(material.platform || "generic webpage")}</dd>
        <dt>${esc(currentLang === "zh" ? "原始链接" : "Source URL")}</dt><dd><a href="${esc(material.url)}" target="_blank" rel="noopener">${esc(material.url)}</a></dd>
        <dt>${esc(t("userNote"))}</dt><dd>${esc(material.user_note || material.notes || (currentLang === "zh" ? "待补充" : "To be added"))}</dd>
        <dt>${esc(t("designStage"))}</dt><dd>${esc(material.design_stage || material.portfolio_stage || "unknown")}</dd>
        <dt>${esc(t("placement"))}</dt><dd>${esc(material.portfolio_placement || portfolioPlacement(material))}</dd>
        <dt>${esc(t("linkWhy"))}</dt><dd>${esc(evidenceWhy(material))}</dd>
        <dt>${esc(t("nextAction"))}</dt><dd>${esc(t("nextActionText"))}</dd>
      </dl>
    </article>
    ${card(material)}
  `;
}

async function captureLink() {
  const url = els.linkUrl.value.trim();
  if (!url) {
    els.linkCaptureResult.innerHTML = `<div class="empty">${esc(t("linkUrlLabel"))}</div>`;
    return;
  }
  await submitLinkCapture({
    url,
    user_note: els.linkNote.value,
    project: els.linkProject.value || "unknown",
    design_stage: els.linkDesignStage.value || "unknown",
    portfolio_placement: els.linkPlacement.value || "",
  }, els.linkCaptureResult);
}

async function captureAddLink() {
  const url = els.addLinkUrl.value.trim();
  if (!url) {
    els.addLinkResult.innerHTML = `<div class="empty">${esc(t("linkUrlLabel"))}</div>`;
    return;
  }
  await submitLinkCapture({
    url,
    user_note: els.addLinkNote.value,
    project: els.addLinkProject.value || "unknown",
    design_stage: els.addLinkDesignStage.value || "unknown",
    portfolio_placement: els.addLinkPlacement.value || "",
  }, els.addLinkResult);
}

async function submitLinkCapture(payload, targetNode) {
  if (!apiConnected) {
    targetNode.innerHTML = `<div class="empty">${esc(t("captureLinkDisabled"))}</div>`;
    return;
  }
  try {
    setStatus("Capturing link...", "");
    const response = await fetch(`${API_BASE}/api/link-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.message || data.error || "Link capture failed");
    }
    const material = data.material;
    const index = materials.findIndex((item) => item.id === material.id);
    if (index >= 0) materials[index] = material;
    else materials.unshift(material);
    targetNode.innerHTML = `${linkCaptureSummary(material)}${data.source_type === "short_video" || data.source_type === "social_post" ? `<div class="empty">${esc(t("linkLimit"))}</div>` : ""}`;
    renderDashboard();
    renderSearch();
    setStatus(currentLang === "zh" ? `已保存 ${data.platform} 链接` : `Captured ${data.platform} link`, "ok");
  } catch (error) {
    targetNode.innerHTML = `<div class="empty">${esc(t("linkCapture"))} ${esc(t("failed"))}: ${esc(error.message)}</div>`;
    setStatus(`${t("linkCapture")} ${t("failed")}`, "error");
  }
}

async function savePastedNote() {
  if (!els.noteContent.value.trim()) {
    els.noteSaveResult.innerHTML = `<div class="empty">${esc(t("noteContentRequired"))}</div>`;
    return;
  }
  if (!apiConnected) {
    els.noteSaveResult.innerHTML = `<div class="empty">${esc(t("staticMode"))}</div>`;
    setStatus(t("staticMode"), "warn");
    return;
  }
  try {
    setStatus(t("saving"), "");
    const response = await fetch(`${API_BASE}/api/paste-note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: els.noteTitle.value || t("pasteNote"),
        content: els.noteContent.value,
        project: els.noteProject.value || "unknown",
        design_stage: els.noteDesignStage.value || "unknown",
        material_type: els.noteMaterialType.value || "draft",
        portfolio_placement: els.notePlacement.value || "",
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || data.error || "Note save failed");
    const material = data.material;
    const index = materials.findIndex((item) => item.id === material.id);
    if (index >= 0) materials[index] = material;
    else materials.unshift(material);
    els.noteSaveResult.innerHTML = `<div class="empty">${esc(t("noteSaved"))}</div>${card(material)}`;
    els.noteContent.value = "";
    renderDashboard();
    renderSearch();
    setStatus(t("noteSaved"), "ok");
  } catch (error) {
    els.noteSaveResult.innerHTML = `<div class="empty">${esc(t("saveNote"))} ${esc(t("failed"))}: ${esc(error.message)}</div>`;
    setStatus(`${t("saveNote")} ${t("failed")}`, "error");
  }
}

async function askDesignMate() {
  const question = els.askQuestion.value.trim();
  if (!question) {
    els.askResult.innerHTML = `<h2>${esc(t("answer"))}</h2><p class="empty">${esc(t("askEmpty"))}</p>`;
    return;
  }
  if (!apiConnected) {
    els.askResult.innerHTML = `<h2>${esc(t("answer"))}</h2><p class="empty">${esc(t("askStatic"))}</p>`;
    return;
  }
  try {
    setStatus("Ask DesignMate is thinking...", "");
    const response = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, project: els.askProject.value === "all" ? null : els.askProject.value, limit: 10, language: currentLang }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Ask failed");
    els.askResult.innerHTML = `
      <h2>${esc(t("answer"))} <span class="mode">${esc(data.mode)}</span> <span class="mode">${esc(t("confidence"))} ${esc(data.confidence ?? "n/a")}</span></h2>
      <div class="answer">${renderAnswerSections(data.answer_sections || {})}</div>
      <h3>${esc(t("usedMaterials"))}</h3>
      <div class="material-list">${(data.used_materials || []).slice(0, 6).map(card).join("") || emptyState()}</div>
    `;
    setStatus("Ask DesignMate answered", "ok");
  } catch (error) {
    els.askResult.innerHTML = `<h2>${esc(t("answer"))}</h2><p class="empty">Ask ${esc(t("failed"))}: ${esc(error.message)}</p>`;
    setStatus("Ask DesignMate failed", "error");
  }
}

function renderAnswerSections(sections) {
  return Object.entries(sections).map(([title, value]) => `<section class="answer-section"><h3>${esc(title)}</h3>${Array.isArray(value) ? `<ul>${value.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : `<p>${esc(value)}</p>`}</section>`).join("");
}

async function applyBatchUpdate() {
  if (!selectedIds.size) return;
  if (!apiConnected) {
    setStatus(t("staticMode"), "warn");
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
    setStatus(t("saving"), "");
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
    setStatus(`Batch ${t("failed")}: ${error.message}`, "error");
  }
}

async function saveMaterial(id) {
  const message = document.getElementById("saveMessage");
  if (!apiConnected) {
    message.textContent = t("staticMode");
    setStatus(t("staticMode"), "warn");
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
    setStatus(t("saving"), "");
    const response = await fetch(`${API_BASE}/api/materials/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Save failed");
    const index = materials.findIndex((item) => item.id === id);
    materials[index] = data.material;
    message.textContent = t("saved");
    setStatus(t("saved"), "ok");
    renderDashboard();
    showDetail(id);
  } catch (error) {
    message.textContent = `${t("failed")}: ${error.message}`;
    setStatus(`${t("failed")}`, "error");
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
    applyTranslations();
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
els.langZh.addEventListener("click", () => setLanguage("zh"));
els.langEn.addEventListener("click", () => setLanguage("en"));
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
if (els.addCaptureLinkButton) els.addCaptureLinkButton.addEventListener("click", captureAddLink);
if (els.saveNoteButton) els.saveNoteButton.addEventListener("click", savePastedNote);
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
