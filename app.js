// ============ Данные статей (только метаданные, контент в blog/*.html) ============
const ARTICLES = [
  {
    id: "neuro1",
    title: "Нейрофизиология греха и привычки: роль дофамина, стриатума и когнитивного диссонанса",
    excerpt: "Как формируются греховные привычки на уровне мозга? Роль дофаминовых путей, стриатума, когнитивного диссонанса. Научный взгляд на духовную борьбу.",
    date: "15 марта 2026",
    tags: ["нейронаука", "привычки", "грех"]
  },
  {
    id: "human",
    title: "Антропология святителя Феофана Затворника — трисоставная природа человека",
    excerpt: "Дух, душа и тело: иерархия человеческой природы по учению свт. Феофана. Как восстановить правильный порядок и достичь обожения.",
    date: "10 марта 2026",
    tags: ["антропология", "святоотеческое", "трисоставность"]
  }
];

// ============ Индекс душевного здоровья ============
const STORAGE_KEY = "sj_data_v1";
const INDEX_STORAGE_KEY = "sj_index_v1";
const INDEX_BLOCKS = ["F", "W", "D"];
const INDEX_BLOCK_LABELS = { F: "Чувства", W: "Воля", D: "Желания" };

const INDEX_OPTION_LABELS = {
  positive: ["0 — Почти всегда / Всегда", "1 — Часто", "2 — Редко", "3 — Почти никогда / Никогда"],
  negative: ["0 — Никогда / Совсем нет", "1 — Редко", "2 — Часто", "3 — Постоянно / Всегда"],
};

const INDEX_QUESTIONS = [
  { id: "F1", block: "F", text: "Я часто ощущаю внутренний мир и покой.", polarity: "positive" },
  { id: "F2", block: "F", text: "Меня мучает обида на кого-то из прошлого.", polarity: "negative" },
  { id: "F3", block: "F", text: "Я замечаю за собой раздражение по мелочам.", polarity: "negative" },
  { id: "F4", block: "F", text: "Я испытываю благодарность Богу за прожитый день.", polarity: "positive" },
  { id: "F5", block: "F", text: "Меня посещает уныние или тоска.", polarity: "negative" },
  { id: "F6", block: "F", text: "Я способен искренне радоваться успехам других.", polarity: "positive" },
  { id: "F7", block: "F", text: "Я тревожусь о будущем, здоровье и близких.", polarity: "negative" },
  { id: "F8", block: "F", text: "Моё сердце откликается на молитву и Писание.", polarity: "positive" },
  { id: "F9", block: "F", text: "Я помню обиды и не могу их простить.", polarity: "negative" },
  { id: "F10", block: "F", text: "Я чувствую, что Бог меня слышит.", polarity: "positive" },
  { id: "W1", block: "W", text: "Я легко принимаю важные решения, не колеблясь.", polarity: "positive" },
  { id: "W2", block: "W", text: "Я довожу до конца начатые дела (включая молитвенное правило).", polarity: "positive" },
  { id: "W3", block: "W", text: "Мне трудно сказать «нет» своим прихотям (еда, развлечения).", polarity: "negative" },
  { id: "W4", block: "W", text: "Когда нужно сделать скучное или трудное дело, я откладываю его.", polarity: "negative" },
  { id: "W5", block: "W", text: "Я способен заставить себя молиться, даже когда нет желания.", polarity: "positive" },
  { id: "W6", block: "W", text: "Если я решил не грешить в чём-то, я держусь твёрдо.", polarity: "positive" },
  { id: "W7", block: "W", text: "В трудных обстоятельствах я скорее мобилизуюсь, чем опускаю руки.", polarity: "positive" },
  { id: "W8", block: "W", text: "Я легко поддаюсь чужому влиянию и могу отказаться от доброго намерения.", polarity: "negative" },
  { id: "W9", block: "W", text: "Я соблюдаю посты и дисциплинарные правила Церкви.", polarity: "positive" },
  { id: "W10", block: "W", text: "Мне не хватает силы воли бороться с привычными грехами.", polarity: "negative" },
  { id: "D1", block: "D", text: "Я часто мечтаю о богатстве, славе, красивой жизни.", polarity: "negative" },
  { id: "D2", block: "D", text: "Меня влечёт к плотским помыслам и запретным удовольствиям.", polarity: "negative" },
  { id: "D3", block: "D", text: "Я испытываю искреннее желание молиться.", polarity: "positive" },
  { id: "D4", block: "D", text: "Мне интересно читать духовные книги и узнавать о вере.", polarity: "positive" },
  { id: "D5", block: "D", text: "Я хочу помогать другим, даже если это неудобно.", polarity: "positive" },
  { id: "D6", block: "D", text: "Мои мысли часто заняты земными заботами, а не Богом.", polarity: "negative" },
  { id: "D7", block: "D", text: "Я испытываю жажду исповеди и очищения совести.", polarity: "positive" },
  { id: "D8", block: "D", text: "Мне хочется уединиться и побыть с Богом в тишине.", polarity: "positive" },
  { id: "D9", block: "D", text: "Я привязан к вещам, еде и комфорту, трудно отказаться.", polarity: "negative" },
  { id: "D10", block: "D", text: "Мои желания направлены к добру и чистоте.", polarity: "positive" },
];

const INDEX_LEVELS = [
  { key: "green", min: 0, max: 7, label: "Зелёный", description: "В этой сфере всё гармонично." },
  { key: "yellow", min: 8, max: 15, label: "Жёлтый", description: "Умеренные трудности, нужно внимание." },
  { key: "orange", min: 16, max: 23, label: "Оранжевый", description: "Выраженные проблемы, стоит обратиться за поддержкой." },
  { key: "red", min: 24, max: 30, label: "Красный", description: "Тяжёлое состояние, требуется решительная работа." },
];

const INDEX_STATUS_TEXTS = {
  F: {
    green: "Ваше сердце в мире, вы способны к благодарности и прощению.",
    yellow: "Тревога и раздражение заметны, уделите внимание молитве.",
    orange: "Чувства напряжены, стоит поговорить с духовником.",
    red: "Сердце в кризисе — нужна исповедь и помощь наставника.",
  },
  W: {
    green: "Вы легко принимаете решения и доводите дела до конца.",
    yellow: "Вам бывает трудно держаться курса, попросите Бога о твёрдости.",
    orange: "Сила воли ослабла, важно вернуть дисциплину.",
    red: "Воля отсутствует, нужна системная духовная работа.",
  },
  D: {
    green: "Стремления направлены к Богу, желания чисты.",
    yellow: "Земные притяжения слышны, усилите пост и внимание.",
    orange: "Привязанность к плотским помыслам сильна.",
    red: "Плотские помыслы переполняют, нужна интенсивная помощь.",
  },
};

const MAX_INDEX_HISTORY = 60;

let indexState = loadIndexState();

// ============ Навигация ============
function navigate(target) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-tab").forEach((b) => b.classList.remove("active"));
  const view = document.getElementById(`view-${target}`);
  if (view) view.classList.add("active");
  const navTab = document.querySelector(`.nav-tab[data-target="${target}"]`);
  if (navTab) {
    navTab.classList.add("active");
    moveNavIndicator(navTab);
  }
  if (target === "blog") renderBlog();
  if (target === "index") renderIndex();
}

function moveNavIndicator(el) {
  const indicator = document.querySelector(".nav-indicator");
  if (!indicator || !el) return;
  indicator.style.left = `${el.offsetLeft}px`;
  indicator.style.width = `${el.offsetWidth}px`;
}

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    navigate(e.currentTarget.dataset.target);
  });
});

// ============ Блог ============
function renderBlog() {
  const blogList = document.getElementById("blog-list");
  const blogEmpty = document.getElementById("blog-empty");
  if (!blogList) return;
  blogList.innerHTML = "";
  if (ARTICLES.length === 0) {
    blogEmpty.style.display = "block";
    return;
  }
  blogEmpty.style.display = "none";
  ARTICLES.forEach((article) => {
    const card = document.createElement("a");
    card.className = "blog-card";
    card.href = `blog/${article.id}.html`;
    let tagsHtml = "";
    if (article.tags && article.tags.length) {
      tagsHtml = `<div class="blog-tags">${article.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join("")}</div>`;
    }
    card.innerHTML = `
      <h3>${escapeHtml(article.title)}</h3>
      <div class="blog-meta">
        <span class="blog-date">${escapeHtml(article.date || "")}</span>
        ${tagsHtml}
      </div>
      <p class="blog-excerpt">${escapeHtml(article.excerpt)}</p>
      <span class="blog-readmore">Читать далее</span>`;
    blogList.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ============ Индекс душевного здоровья ============
function buildDefaultIndexResponses() {
  const responses = {};
  INDEX_QUESTIONS.forEach((q) => (responses[q.id] = 0));
  return responses;
}

function loadIndexState() {
  const defaultResponses = buildDefaultIndexResponses();
  try {
    const rawState = localStorage.getItem(INDEX_STORAGE_KEY);
    if (rawState) {
      const parsed = JSON.parse(rawState);
      const responses = { ...defaultResponses, ...(parsed.responses || {}) };
      const scores = {};
      INDEX_BLOCKS.forEach((block) => {
        scores[block] = Number.isFinite(parsed.scores?.[block]) ? Math.max(0, Math.min(30, parsed.scores[block])) : 0;
      });
      return { scores, lastUpdated: parsed.lastUpdated || "", responses };
    }
  } catch (e) { /* ignore */ }
  return { scores: { F: 0, W: 0, D: 0 }, lastUpdated: "", responses: defaultResponses };
}

function saveIndexState(state) {
  localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        entries: Array.isArray(parsed.entries) ? parsed.entries : [],
        confessed: parsed.confessed && typeof parsed.confessed === "object" ? parsed.confessed : {},
        indexHistory: Array.isArray(parsed.indexHistory) ? parsed.indexHistory : [],
      };
    }
  } catch (e) { /* ignore */ }
  return { entries: [], confessed: {}, indexHistory: [] };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getLevelForScore(score) {
  return INDEX_LEVELS.find((l) => score >= l.min && score <= l.max) || INDEX_LEVELS[INDEX_LEVELS.length - 1];
}

function updateIndexBlock(block) {
  const blockEl = document.querySelector(`.index-block[data-block="${block}"]`);
  if (!blockEl) return;
  const score = indexState.scores[block] ?? 0;
  const level = getLevelForScore(score);
  blockEl.dataset.level = level.key;
  const scoreEl = blockEl.querySelector("[data-score]");
  if (scoreEl) scoreEl.textContent = `${score} / 30`;
  const statusEl = blockEl.querySelector("[data-status]");
  if (statusEl) {
    const blockTexts = INDEX_STATUS_TEXTS[block] || {};
    statusEl.textContent = `${level.label} — ${blockTexts[level.key] || level.description}`;
  }
}

function updateIndexTimestamp() {
  const el = document.getElementById("index-last-updated");
  if (el) el.textContent = indexState.lastUpdated ? `Последнее обновление: ${indexState.lastUpdated}` : "Результаты ещё не фиксировались.";
}

function updateIndexScoresFromResponses() {
  const scores = { F: 0, W: 0, D: 0 };
  INDEX_QUESTIONS.forEach((q) => {
    scores[q.block] += Number(indexState.responses?.[q.id] ?? 0);
  });
  indexState.scores = scores;
  return scores;
}

function renderIndexSummary() {
  INDEX_BLOCKS.forEach((b) => updateIndexBlock(b));
  updateIndexTimestamp();
}

function renderIndexQuestions() {
  const container = document.getElementById("index-questions");
  if (!container) return;
  container.innerHTML = "";
  INDEX_QUESTIONS.forEach((q) => {
    const savedValue = String(indexState.responses?.[q.id] ?? 0);
    const labels = INDEX_OPTION_LABELS[q.polarity] || INDEX_OPTION_LABELS.negative;
    const optionsHTML = labels
      .map((label, idx) => {
        const checked = savedValue === String(idx) ? "checked" : "";
        return `<label class="index-option"><input type="radio" name="${q.id}" value="${idx}" data-question="${q.id}" ${checked} /><span>${label}</span></label>`;
      })
      .join("");
    const wrapper = document.createElement("div");
    wrapper.className = "index-question";
    wrapper.innerHTML = `<div class="index-question-header">
        <span class="index-question-text">${q.id} — ${q.text}</span>
        <span class="index-question-block">${INDEX_BLOCK_LABELS[q.block] || q.block}</span>
      </div>
      <div class="index-option-group">${optionsHTML}</div>`;
    container.appendChild(wrapper);
  });
  updateIndexScoresFromResponses();
  renderIndexSummary();
}

function handleQuestionChange(questionId, value) {
  indexState.responses[questionId] = value;
  updateIndexScoresFromResponses();
  saveIndexState(indexState);
  renderIndexSummary();
}

function renderIndexHistory() {
  const list = document.getElementById("index-history-list");
  const empty = document.getElementById("index-history-empty");
  if (!list) return;
  const state = loadState();
  const history = (state.indexHistory || []).slice(-6).reverse();
  list.innerHTML = "";
  if (empty) empty.style.display = history.length === 0 ? "block" : "none";
  if (history.length === 0) return;
  history.forEach((entry) => {
    const scoreBlocks = INDEX_BLOCKS
      .map((block) => {
        const score = entry.scores?.[block] ?? 0;
        const level = getLevelForScore(score);
        return `<div class="index-history-score"><strong>${INDEX_BLOCK_LABELS[block]}</strong><span>${score} / 30 · ${level.label}</span></div>`;
      })
      .join("");
    const card = document.createElement("div");
    card.className = "index-history-card";
    card.innerHTML = `<div class="index-history-top"><strong>${entry.date}</strong></div><div class="index-history-scores">${scoreBlocks}</div>`;
    list.appendChild(card);
  });
}

function renderIndex() {
  renderIndexSummary();
  renderIndexHistory();
}

function saveIndexResult(event) {
  event.preventDefault();
  updateIndexScoresFromResponses();
  const now = nowString();
  const snapshot = { id: `i_${Date.now()}`, date: now, scores: { ...indexState.scores }, responses: { ...indexState.responses } };
  const state = loadState();
  const history = state.indexHistory || [];
  history.push(snapshot);
  if (history.length > MAX_INDEX_HISTORY) history.splice(0, history.length - MAX_INDEX_HISTORY);
  state.indexHistory = history;
  saveState(state);
  indexState.lastUpdated = now;
  saveIndexState(indexState);
  renderIndexSummary();
  renderIndexHistory();
  const msg = document.getElementById("index-save-status");
  if (msg) msg.textContent = `Результат сохранён: ${now}`;
}

function nowString() {
  const d = new Date();
  const pad = (v) => String(v).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ============ Инициализация ============
document.addEventListener("DOMContentLoaded", () => {
  renderBlog();
  renderIndexQuestions();
  if (document.getElementById("index-save-status")) {
    document.getElementById("index-save-status").textContent = "";
  }
  document.getElementById("index-questions")?.addEventListener("change", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.question) {
      handleQuestionChange(target.dataset.question, Number(target.value));
    }
  });
  document.getElementById("index-quiz-form")?.addEventListener("submit", saveIndexResult);
  const activeTab = document.querySelector(".nav-tab.active");
  if (activeTab) moveNavIndicator(activeTab);
  window.addEventListener("resize", () => {
    const tab = document.querySelector(".nav-tab.active");
    if (tab) moveNavIndicator(tab);
  });
});
