const STORAGE_KEY = "sj_data_v1";
const INDEX_STORAGE_KEY = "sj_index_v1";
const YANDEX_CLIENT_ID = "c705d30899b6423d8932f77e60023d50";

const views = {
  home: document.getElementById("view-home"),
  new: document.getElementById("view-new"),
  archive: document.getElementById("view-archive"),
  confession: document.getElementById("view-confession"),
  stats: document.getElementById("view-stats"),
  situations: document.getElementById("view-situations"),
  index: document.getElementById("view-index"),
  backup: document.getElementById("view-backup"),
};

const archiveList = document.getElementById("archive-list");
const archiveEmpty = document.getElementById("archive-empty");
const confessionList = document.getElementById("confession-list");
const confessionEmpty = document.getElementById("confession-empty");
const statsList = document.getElementById("stats-list");
const statsEmpty = document.getElementById("stats-empty");
const situationsList = document.getElementById("situations-list");
const situationsEmpty = document.getElementById("situations-empty");
const backupStatus = document.getElementById("backup-status");
const indexLastUpdated = document.getElementById("index-last-updated");
const INDEX_BLOCKS = ["F", "W", "D"];
const indexQuizForm = document.getElementById("index-quiz-form");
const indexQuestionsContainer = document.getElementById("index-questions");
const indexStatusMessage = document.getElementById("index-save-status");
const indexHistoryList = document.getElementById("index-history-list");
const indexHistoryEmpty = document.getElementById("index-history-empty");
const indexHistorySummary = document.getElementById("index-history-summary");
const indexHistorySummaryEmpty = document.getElementById("index-history-summary-empty");

const INDEX_OPTION_LABELS = {
  positive: [
    "0 — Почти всегда / Всегда",
    "1 — Часто",
    "2 — Редко",
    "3 — Почти никогда / Никогда",
  ],
  negative: [
    "0 — Никогда / Совсем нет",
    "1 — Редко",
    "2 — Часто",
    "3 — Постоянно / Всегда",
  ],
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
const MAX_INDEX_HISTORY = 60;
const INDEX_BLOCK_LABELS = { F: "Чувства", W: "Воля", D: "Желания" };

function buildDefaultIndexResponses() {
  const responses = {};
  INDEX_QUESTIONS.forEach((question) => {
    responses[question.id] = 0;
  });
  return responses;
}

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-entry-form");
const editCancel = document.getElementById("edit-cancel");

let editingId = null;
let currentEntryType = "sin"; // 'sin' или 'situation'
let indexState = loadIndexState();

let toggleSin, toggleSituation;

// Инициализация переключателей после загрузки DOM
function initToggleButtons() {
  toggleSin = document.querySelector("[data-type='sin']");
  toggleSituation = document.querySelector("[data-type='situation']");

  // Обработчики кликов по кнопкам переключения
  if (toggleSin && toggleSituation) {
    toggleSin.addEventListener("click", () => {
      currentEntryType = "sin";
      toggleSin.classList.add("active");
      toggleSituation.classList.remove("active");
    });

    toggleSituation.addEventListener("click", () => {
      currentEntryType = "situation";
      toggleSituation.classList.add("active");
      toggleSin.classList.remove("active");
    });
  }
}

// Вызываем инициализацию после загрузки страницы
document.addEventListener("DOMContentLoaded", initToggleButtons);

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { entries: [], confessed: {}, indexHistory: [] };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      confessed: parsed.confessed && typeof parsed.confessed === "object" ? parsed.confessed : {},
      indexHistory: Array.isArray(parsed.indexHistory) ? parsed.indexHistory : [],
    };
  } catch (err) {
    return { entries: [], confessed: {}, indexHistory: [] };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const INDEX_LEVELS = [
  { key: "green", min: 0, max: 7, label: "Зелёный", description: "В этой сфере всё гармонично." },
  { key: "yellow", min: 8, max: 15, label: "Жёлтый", description: "Умеренные трудности, нужно внимание." },
  { key: "orange", min: 16, max: 23, label: "Оранжевый", description: "Выраженные проблемы, стоит обратиться за поддержкой." },
  { key: "red", min: 24, max: 30, label: "Красный", description: "Тяжёлое состояние, требуется решительная работа." },
];

const INDEX_STATUS_TEXTS = {
  F: {
    green: "Ваше сердце в мире, вы способны к благодарности и прощению. Так держать!",
    yellow: "Тревога и раздражение заметны, уделите внимание молитве о мире.",
    orange: "Чувства напряжены, стоит поговорить с духовником и усилить молчание.",
    red: "Сердце в кризисе — нужна исповедь, аскеза и помощь духовного наставника.",
  },
  W: {
    green: "Вы легко принимаете решения и доводите дела до конца.",
    yellow: "Вам бывает трудно держаться курса, попросите Бога о твёрдости.",
    orange: "Сила воли ослабла, важно вернуть дисциплину через малые послушания.",
    red: "Воля почти отсутствует, нужная системная духовная работа и поддержка.",
  },
  D: {
    green: "Стремления направлены к Богу, желания чисты.",
    yellow: "Земные притяжения слышны, усилите пост и душевное внимание.",
    orange: "Привязанность к плотским помыслам сильна, нужна очищающая исповедь.",
    red: "Плотские помыслы переполняют, необходима интенсивная духовная помощь.",
  },
};

function loadIndexState() {
  const defaultResponses = buildDefaultIndexResponses();
  const raw = localStorage.getItem(INDEX_STORAGE_KEY);
  if (!raw) {
    return { scores: { F: 0, W: 0, D: 0 }, lastUpdated: "", responses: defaultResponses };
  }
  try {
    const parsed = JSON.parse(raw);
    const responses = { ...defaultResponses, ...(parsed?.responses || {}) };
    const scores = {};
    INDEX_BLOCKS.forEach((block) => {
      const value = Number(parsed?.scores?.[block]);
      scores[block] = Number.isFinite(value) ? Math.max(0, Math.min(30, value)) : 0;
    });
    return {
      scores,
      lastUpdated: parsed?.lastUpdated || "",
      responses,
    };
  } catch (err) {
    return { scores: { F: 0, W: 0, D: 0 }, lastUpdated: "", responses: defaultResponses };
  }
}

function saveIndexState(state) {
  localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(state));
}

function getLevelForScore(score) {
  return INDEX_LEVELS.find((level) => score >= level.min && score <= level.max) || INDEX_LEVELS[INDEX_LEVELS.length - 1];
}

function updateIndexBlock(block) {
  const blockEl = document.querySelector(`.index-block[data-block="${block}"]`);
  if (!blockEl) return;
  const score = indexState.scores[block] ?? 0;
  const level = getLevelForScore(score);
  blockEl.dataset.level = level.key;
  const scoreEl = blockEl.querySelector("[data-score]");
  if (scoreEl) {
    scoreEl.textContent = `${score} / 30`;
  }
  const statusText = resolveIndexStatusText(block, level);
  const statusEl = blockEl.querySelector("[data-status]");
  if (statusEl) {
    statusEl.textContent = `${level.label} — ${statusText}`;
  }
}

function resolveIndexStatusText(block, level) {
  const blockTexts = INDEX_STATUS_TEXTS[block] || {};
  return blockTexts[level.key] || level.description || "Состояние требует внимания.";
}

function updateIndexTimestamp() {
  if (!indexLastUpdated) return;
  if (indexState.lastUpdated) {
    indexLastUpdated.textContent = `Последнее обновление: ${indexState.lastUpdated}`;
  } else {
    indexLastUpdated.textContent = "Результаты ещё не фиксировались.";
  }
}

function updateIndexScoresFromResponses() {
  const scores = { F: 0, W: 0, D: 0 };
  INDEX_QUESTIONS.forEach((question) => {
    const rawValue = Number(indexState.responses?.[question.id]);
    const value = Number.isFinite(rawValue) ? rawValue : 0;
    scores[question.block] += value;
  });
  indexState.scores = scores;
  return scores;
}

function renderIndexSummary() {
  INDEX_BLOCKS.forEach((block) => updateIndexBlock(block));
  updateIndexTimestamp();
}

function renderIndexQuestions() {
  if (!indexQuestionsContainer) return;
  indexQuestionsContainer.innerHTML = "";
  INDEX_QUESTIONS.forEach((question) => {
    const questionWrapper = document.createElement("div");
    questionWrapper.className = "index-question";
    const savedValue = String(indexState.responses?.[question.id] ?? 0);
    const labels = INDEX_OPTION_LABELS[question.polarity] || INDEX_OPTION_LABELS.negative;
    const optionsMarkup = labels
      .map((label, idx) => {
        const checked = savedValue === String(idx) ? "checked" : "";
        return `<label class="index-option"><input type="radio" name="${question.id}" value="${idx}" data-question="${question.id}" ${checked} /><span>${label}</span></label>`;
      })
      .join("");
    questionWrapper.innerHTML = `
      <div class="index-question-header">
        <span class="index-question-text">${question.id} — ${question.text}</span>
        <span class="index-question-block">${INDEX_BLOCK_LABELS[question.block] || question.block}</span>
      </div>
      <div class="index-option-group">${optionsMarkup}</div>
    `;
    indexQuestionsContainer.appendChild(questionWrapper);
  });
  updateIndexScoresFromResponses();
  renderIndexSummary();
}

function handleQuestionChange(questionId, value) {
  if (!questionId) return;
  indexState.responses = {
    ...indexState.responses,
    [questionId]: value,
  };
  updateIndexScoresFromResponses();
  saveIndexState(indexState);
  renderIndexSummary();
}

function renderIndexHistory() {
  if (!indexHistoryList) return;
  const state = loadState();
  const history = Array.isArray(state.indexHistory) ? state.indexHistory : [];
  const entries = history.slice(-6).reverse();
  indexHistoryList.innerHTML = "";
  if (indexHistoryEmpty) {
    indexHistoryEmpty.style.display = entries.length === 0 ? "block" : "none";
  }
  if (entries.length === 0) {
    return;
  }
  entries.forEach((entry) => {
    const scoreBlocks = INDEX_BLOCKS.map((block) => {
      const score = entry.scores?.[block] ?? 0;
      const level = getLevelForScore(score);
      return `<div class="index-history-score">
        <strong>${INDEX_BLOCK_LABELS[block] || block}</strong>
        <span>${score} / 30 · ${level.label}</span>
      </div>`;
    }).join("");
    const card = document.createElement("div");
    card.className = "index-history-card";
    card.innerHTML = `
      <div class="index-history-top">
        <strong>${entry.date}</strong>
      </div>
      <div class="index-history-scores">${scoreBlocks}</div>
    `;
    indexHistoryList.appendChild(card);
  });
}

function renderIndexProgressSummary(history) {
  if (!indexHistorySummary) return;
  const entries = (history || []).slice(-4).reverse();
  indexHistorySummary.innerHTML = "";
  if (indexHistorySummaryEmpty) {
    indexHistorySummaryEmpty.style.display = entries.length === 0 ? "block" : "none";
  }
  if (entries.length === 0) {
    return;
  }
  entries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "index-progress-row";
    const dateSpan = document.createElement("span");
    dateSpan.className = "index-progress-date";
    dateSpan.textContent = entry.date;
    row.appendChild(dateSpan);
    INDEX_BLOCKS.forEach((block) => {
      const score = entry.scores?.[block] ?? 0;
      const level = getLevelForScore(score);
      const chip = document.createElement("span");
      chip.className = `index-progress-chip level-${level.key}`;
      chip.textContent = `${INDEX_BLOCK_LABELS[block] || block}: ${score} (${level.label})`;
      row.appendChild(chip);
    });
    indexHistorySummary.appendChild(row);
  });
}

function renderIndex() {
  renderIndexSummary();
  renderIndexHistory();
}

function saveIndexResult(event) {
  event.preventDefault();
  updateIndexScoresFromResponses();
  const snapshot = {
    id: `i_${Date.now()}`,
    date: nowString(),
    scores: { ...indexState.scores },
    responses: { ...indexState.responses },
  };
  const state = loadState();
  const history = Array.isArray(state.indexHistory) ? state.indexHistory : [];
  history.push(snapshot);
  if (history.length > MAX_INDEX_HISTORY) {
    history.splice(0, history.length - MAX_INDEX_HISTORY);
  }
  state.indexHistory = history;
  saveState(state);
  indexState.lastUpdated = snapshot.date;
  saveIndexState(indexState);
  renderIndexSummary();
  renderIndexHistory();
  renderStats();
  if (indexStatusMessage) {
    indexStatusMessage.textContent = `Результат сохранён: ${snapshot.date}`;
  }
}

function nowString() {
  const d = new Date();
  return formatDateTime(d);
}

function formatDateTime(d) {
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const min = pad(d.getMinutes());
  const sec = pad(d.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

function formatDateOnly(d) {
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

function parseDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const [_, y, m, d, h, min, s] = match;
  return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min), Number(s));
}

function weekStartString(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatDateOnly(d);
}

function weekStartFromEntry(entryDate) {
  const parsed = parseDateTime(entryDate) || new Date();
  return weekStartString(parsed);
}

function pad(value) {
  return value < 10 ? `0${value}` : String(value);
}

function navigate(target) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  if (views[target]) {
    views[target].classList.add("active");
  }
}

function renderArchive() {
  const state = loadState();
  const entries = [...state.entries].sort((a, b) => (a.date < b.date ? 1 : -1));
  archiveList.innerHTML = "";

  if (entries.length === 0) {
    archiveEmpty.style.display = "block";
    return;
  }
  archiveEmpty.style.display = "none";

  entries.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.style.animationDelay = `${Math.min(index * 40, 200)}ms`;
    card.innerHTML = `
      <div class="entry-meta">${entry.date}</div>
      <div><strong>${escapeHtml(entry.situation)}</strong></div>
      <div class="entry-field"><strong>Контекст:</strong> ${escapeHtml(entry.context || "-")}</div>
      <div class="entry-field"><strong>Последствие:</strong> ${escapeHtml(entry.consequence)}</div>
      <div class="entry-field"><strong>Инсайт:</strong> ${escapeHtml(entry.insight)}</div>
      <div class="entry-actions">
        <button class="btn" data-edit="${entry.id}">Редактировать</button>
        <button class="btn danger" data-delete="${entry.id}">Удалить</button>
      </div>
    `;
    archiveList.appendChild(card);
  });

  archiveList.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-edit");
      openEditModal(id);
    });
  });

  archiveList.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-delete");
      deleteEntry(id);
    });
  });
}

function renderStats() {
  const state = loadState();
  const counts = {};
  state.entries.forEach((entry) => {
    if (entry.type !== "sin") return; // Только грехи
    const label = entry.situation.trim().toLowerCase() || "без названия";
    counts[label] = (counts[label] || 0) + 1;
  });
  const items = Object.entries(counts)
    .map(([label, value]) => [label.charAt(0).toUpperCase() + label.slice(1), value])
    .sort((a, b) => b[1] - a[1]);

  statsList.innerHTML = "";
  if (items.length === 0) {
    statsEmpty.style.display = "block";
  } else {
    statsEmpty.style.display = "none";
    items.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = `
        <span>${escapeHtml(label)}</span>
        <strong>${value}</strong>
      `;
      statsList.appendChild(row);
    });
  }
  renderIndexProgressSummary(state.indexHistory);
}

function renderConfession() {
  const state = loadState();
  const weekMap = {};
  state.entries.forEach((entry) => {
    if (entry.type !== "sin") return; // Только грехи
    const weekStart = weekStartFromEntry(entry.date);
    weekMap[weekStart] = weekMap[weekStart] || [];
    weekMap[weekStart].push(entry);
  });

  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const items = Object.keys(weekMap)
    .map((weekStart) => {
      const confessedAt = state.confessed[weekStart] || "";
      const confessed = confessedAt !== "";
      return {
        weekStart,
        entries: weekMap[weekStart],
        confessed,
        confessedAt,
      };
    })
    .sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1))
    .filter((item) => {
      if (!item.confessedAt) {
        return true;
      }
      const date = parseDateTime(item.confessedAt);
      if (!date) {
        return true;
      }
      return date >= cutoff;
    });

  confessionList.innerHTML = "";
  if (items.length === 0) {
    confessionEmpty.style.display = "block";
    return;
  }
  confessionEmpty.style.display = "none";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "week-card";
    const entriesSummary = item.entries
      .map((entry) => {
        const ctx = entry.context && entry.context.trim() ? entry.context : "-";
        return `<div class="week-entry"><strong>Грех:</strong> ${escapeHtml(entry.situation)}<br><span>Контекст: ${escapeHtml(ctx)}</span></div>`;
      })
      .join("");
    card.innerHTML = `
      <div class="week-header">
        <div><strong>Неделя с ${item.weekStart}</strong></div>
        <div class="week-flag" style="background:${item.confessed ? "#3aa45c" : "#d34a3f"}"></div>
      </div>
      <div>Записей: ${item.entries.length}</div>
      <div class="week-entries">${entriesSummary}</div>
      <button class="btn" data-toggle="${item.weekStart}">
        ${item.confessed ? "Отметить как не исповедано" : "Отметить как исповедано"}
      </button>
    `;
    confessionList.appendChild(card);
  });

  confessionList.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const week = event.currentTarget.getAttribute("data-toggle");
      toggleConfessed(week);
    });
  });
}

function renderSituations() {
  const state = loadState();
  const entries = state.entries
    .filter(entry => entry.type === "situation")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  situationsList.innerHTML = "";

  if (entries.length === 0) {
    situationsEmpty.style.display = "block";
    return;
  }
  situationsEmpty.style.display = "none";

  entries.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "entry-card";
    card.style.animationDelay = `${Math.min(index * 40, 200)}ms`;
    card.innerHTML = `
      <div class="entry-meta">${entry.date}</div>
      <div><strong>${escapeHtml(entry.situation)}</strong></div>
      <div class="entry-field"><strong>Контекст:</strong> ${escapeHtml(entry.context || "-")}</div>
      <div class="entry-field"><strong>Последствие:</strong> ${escapeHtml(entry.consequence)}</div>
      <div class="entry-field"><strong>Инсайт:</strong> ${escapeHtml(entry.insight)}</div>
      <div class="entry-actions">
        <button class="btn" data-edit="${entry.id}">Редактировать</button>
        <button class="btn danger" data-delete="${entry.id}">Удалить</button>
      </div>
    `;
    situationsList.appendChild(card);
  });

  // Одинаковые обработчики редактирования и удаления как в архиве
  situationsList.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-edit");
      openEditModal(id);
    });
  });

  situationsList.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-delete");
      deleteEntry(id);
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function addEntry(formData) {
  const state = loadState();
  const situation = formData.get("situation").trim();
  const context = formData.get("context").trim();
  const consequence = formData.get("consequence").trim();
  const insight = formData.get("insight").trim();

  if (!situation || !consequence || !insight) {
    alert("Заполните обязательные поля.");
    return;
  }

  const entry = {
    id: `e_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    userId: 1,
    date: nowString(),
    situation,
    context: context || "",
    consequence,
    insight,
    type: currentEntryType, // Записываем тип
  };

  state.entries.push(entry);
  saveState(state);
  navigate("archive");
  renderArchive();
  
  // Автобэкап на Яндекс Диск
  autoBackupToYandex();
}

function deleteEntry(id) {
  if (!confirm("Удалить запись? Это действие нельзя отменить.")) {
    return;
  }
  const state = loadState();
  state.entries = state.entries.filter((entry) => entry.id !== id);
  saveState(state);
  renderArchive();
  renderStats();
  renderConfession();
  renderSituations();
}

function openEditModal(id) {
  const state = loadState();
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) {
    return;
  }
  editingId = id;
  editForm.situation.value = entry.situation;
  editForm.context.value = entry.context || "";
  editForm.consequence.value = entry.consequence;
  editForm.insight.value = entry.insight;
  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editingId = null;
  editModal.classList.add("hidden");
}

function saveEdit(formData) {
  if (!editingId) {
    return;
  }
  const situation = formData.get("situation").trim();
  const context = formData.get("context").trim();
  const consequence = formData.get("consequence").trim();
  const insight = formData.get("insight").trim();

  if (!situation || !consequence || !insight) {
    alert("Заполните обязательные поля.");
    return;
  }

  const state = loadState();
  const index = state.entries.findIndex((entry) => entry.id === editingId);
  if (index === -1) {
    closeEditModal();
    return;
  }
  state.entries[index] = {
    ...state.entries[index],
    situation,
    context,
    consequence,
    insight,
  };
  saveState(state);
  closeEditModal();
  renderArchive();
  renderStats();
  renderConfession();
  renderSituations();
  
  // Автобэкап на Яндекс Диск
  autoBackupToYandex();
}

function toggleConfessed(weekStart) {
  const state = loadState();
  if (state.confessed[weekStart]) {
    delete state.confessed[weekStart];
  } else {
    state.confessed[weekStart] = nowString();
  }
  saveState(state);
  renderConfession();
}

function resetData() {
  if (!confirm("Сбросить все данные? Это действие нельзя отменить.")) {
    return;
  }
  saveState({ entries: [], confessed: {}, indexHistory: [] });
  renderArchive();
  renderStats();
  renderConfession();
  renderSituations();
  backupStatus.textContent = "Данные удалены.";
}

function exportCsv() {
  const state = loadState();
  if (state.entries.length === 0) {
    backupStatus.textContent = "Нет данных для экспорта.";
    return;
  }
  const lines = [
    "date;situation;context;consequence;insight;type;week_confessed_at",
  ];
  state.entries.forEach((entry) => {
    const weekStart = weekStartFromEntry(entry.date);
    const confessedAt = state.confessed[weekStart] || "";
    const row = [
      entry.date,
      entry.situation,
      entry.context || "",
      entry.consequence,
      entry.insight,
      entry.type || "sin", // экспорт типа записи
      confessedAt,
    ]
      .map(csvEscape)
      .join(";");
    lines.push(row);
  });
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spiritual-journal-backup-" + formatDateOnly(new Date()) + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // 🔥 Сохраняем дату последнего бэкапа
  const lastBackup = nowString();
  const backupState = JSON.parse(localStorage.getItem("backupState") || "{}");
  backupState.lastBackup = lastBackup;
  localStorage.setItem("backupState", JSON.stringify(backupState));

  backupStatus.textContent = "Экспорт завершен.";
  updateBackupReminder(); // Обновляем напоминание
}

function csvEscape(value) {
  const escaped = String(value).replaceAll("\"", "\"\"");
  return `"${escaped}"`;
}

function updateBackupReminder() {
  const reminder = document.getElementById("backup-reminder");
  if (!reminder) return;

  const backupState = JSON.parse(localStorage.getItem("backupState") || "{}");
  const lastBackup = backupState.lastBackup ? parseDateTime(backupState.lastBackup) : null;
  const now = new Date();

  if (!lastBackup) {
    reminder.style.display = "block";
    reminder.innerHTML = "⚠️ Сделайте первый бэкап, чтобы сохранить свои записи!";
    reminder.onclick = () => navigate("backup");
    return;
  }

  const diffTime = now - lastBackup;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 6) {
    reminder.style.display = "block";
    reminder.innerHTML = `⚠️ Пора сделать резервную копию!<br>Последний бэкап: ${formatDateOnly(lastBackup)} (${diffDays} дней назад). Нажмите, чтобы перейти.`;
    reminder.onclick = () => navigate("backup");
  } else {
    reminder.style.display = "none";
  }
}

function importCsv(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    const parsed = parseCsv(text);
    if (!confirm("Импорт заменит текущие данные. Продолжить?")) {
      return;
    }
    const current = loadState();
    const merged = {
      entries: parsed.entries,
      confessed: parsed.confessed,
      indexHistory: current.indexHistory,
    };
    saveState(merged);
    renderArchive();
    renderStats();
    renderConfession();
    renderSituations();
    backupStatus.textContent = "Импорт завершен.";
  };
  reader.readAsText(file);
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length <= 1) {
    return { entries: [], confessed: {} };
  }
  const entries = [];
  const confessed = {};
  lines.slice(1).forEach((line) => {
    const cells = parseCsvLine(line);
    if (cells.length < 5) {
      return;
    }
    const date = cells[0] || nowString();
    const entry = {
      id: `e_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      userId: 1,
      date,
      situation: cells[1] || "",
      context: cells[2] || "",
      consequence: cells[3] || "",
      insight: cells[4] || "",
      type: cells[5] === "situation" ? "situation" : "sin", // парсинг типа из CSV
    };
    entries.push(entry);
    const confessedAt = cells[6] || "";
    if (confessedAt) {
      const weekStart = weekStartFromEntry(date);
      confessed[weekStart] = confessedAt;
    }
  });
  return { entries, confessed };
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ";" && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

document.querySelectorAll("[data-nav]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const target = event.currentTarget.getAttribute("data-nav");
    if (target === "archive") {
      renderArchive();
    }
    if (target === "confession") {
      renderConfession();
    }
    if (target === "stats") {
      renderStats();
    }
    if (target === "situations") {
      renderSituations();
    }
    if (target === "backup") {
      backupStatus.textContent = "";
    }
    if (target === "index") {
      renderIndex();
    }
    navigate(target);
  });
});

if (indexQuestionsContainer) {
  indexQuestionsContainer.addEventListener("change", (event) => {
    const target = event.target;
    if (!target || !target.dataset) return;
    const questionId = target.dataset.question;
    if (!questionId) return;
    const value = Number(target.value);
    handleQuestionChange(questionId, Number.isFinite(value) ? value : 0);
  });
}

indexQuizForm?.addEventListener("submit", saveIndexResult);

document.getElementById("new-entry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  addEntry(new FormData(event.target));
  event.target.reset();
  // Сбрасываем тип на "Грех"
  currentEntryType = "sin";
  toggleSin.classList.add("active");
  toggleSituation.classList.remove("active");
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveEdit(new FormData(event.target));
});

editCancel.addEventListener("click", closeEditModal);

document.getElementById("help-btn").addEventListener("click", () => {
  document.getElementById("help-modal").classList.remove("hidden");
});

document.getElementById("help-close").addEventListener("click", () => {
  document.getElementById("help-modal").classList.add("hidden");
});

document.getElementById("reset-data").addEventListener("click", resetData);

document.getElementById("export-csv").addEventListener("click", exportCsv);

document.getElementById("import-csv").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    importCsv(file);
  }
  event.target.value = "";
});

renderIndexQuestions();
if (indexStatusMessage) {
  indexStatusMessage.textContent = "";
}

renderArchive();
renderStats();
renderConfession();
renderSituations();
renderIndex();

// Вызываем при запуске
updateYandexStatus();

// Обработка ручного ввода кода
document.getElementById("submit-yandex-code")?.addEventListener("click", () => {
  const codeInput = document.getElementById("yandex-code");
  const code = codeInput?.value.trim();
  if (!code) {
    alert("Введите код");
    return;
  }
  
  backupStatus.textContent = "Подключение...";
  exchangeCodeForToken(code)
    .then(() => {
      backupStatus.textContent = "Яндекс Диск подключён!";
      if (codeInput) codeInput.value = "";
      updateYandexStatus();
      // Запускаем первый автобэкап
      autoBackupToYandex();
    })
    .catch(err => {
      backupStatus.textContent = "Ошибка: " + err.message;
    });
});

// ===== Функции для Яндекс Диска =====

function getYandexToken() {
  return localStorage.getItem("yandexToken");
}

function updateYandexStatus() {
  const statusDiv = document.getElementById("yandex-status");
  const manualDiv = document.getElementById("yandex-manual");
  if (!statusDiv) return;

  const token = getYandexToken();
  if (token) {
    statusDiv.innerHTML = `
      <p class="status" style="color: #3aa45c; margin: 8px 0;">
        ✅ Яндекс Диск подключён. Бэкапы сохраняются автоматически.
      </p>
      <button class="btn" id="disconnect-yandex">Отключить</button>
    `;
    if (manualDiv) manualDiv.classList.add("hidden");
    document.getElementById("disconnect-yandex").addEventListener("click", () => {
      if (confirm("Отключить Яндекс Диск?")) {
        localStorage.removeItem("yandexToken");
        updateYandexStatus();
      }
    });
  } else {
    statusDiv.innerHTML = `
      <p class="hint" style="margin: 8px 0;">Подключите Яндекс Диск для автоматических бэкапов</p>
      <button class="btn" id="connect-yandex">Подключить Яндекс Диск</button>
    `;
    document.getElementById("connect-yandex").addEventListener("click", () => {
      if (manualDiv) manualDiv.classList.remove("hidden");
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${YANDEX_CLIENT_ID}&redirect_uri=https://oauth.yandex.ru/verification_code&display=page`;
      window.open(authUrl, "_blank", "width=600,height=700");
    });
  }
}

const YANDEX_CLIENT_SECRET = "b7c12e0e9fde4221a863e9e6539da01e";

// Обмен кода на токен
function exchangeCodeForToken(code) {
  return fetch("https://oauth.yandex.ru/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=authorization_code&code=${code}&client_id=${YANDEX_CLIENT_ID}&client_secret=${YANDEX_CLIENT_SECRET}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem("yandexToken", data.access_token);
      return data.access_token;
    } else {
      throw new Error(data.error_description || "Ошибка получения токена");
    }
  });
}

function uploadToYandexDisk(csvContent, filename) {
  return new Promise((resolve, reject) => {
    const token = getYandexToken();
    if (!token) {
      reject("Токен не найден");
      return;
    }

    const uploadUrl = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(filename)}&overwrite=true`;
    
    fetch(uploadUrl, {
      method: "GET",
      headers: { "Authorization": `OAuth ${token}` }
    })
    .then(response => response.json())
    .then(uploadInfo => {
      return fetch(uploadInfo.href, {
        method: "PUT",
        headers: { "Content-Type": "text/csv; charset=utf-8" },
        body: csvContent
      });
    })
    .then(response => {
      if (response.ok) {
        resolve("Сохранено на Яндекс Диск");
      } else {
        reject("Ошибка загрузки");
      }
    })
    .catch(error => reject(error));
  });
}

function autoBackupToYandex() {
  const token = getYandexToken();
  if (!token) return;

  const state = loadState();
  if (state.entries.length === 0) return;

  const lines = ["date;situation;context;consequence;insight;type;week_confessed_at"];
  state.entries.forEach((entry) => {
    const weekStart = weekStartFromEntry(entry.date);
    const confessedAt = state.confessed[weekStart] || "";
    const row = [
      entry.date,
      entry.situation,
      entry.context || "",
      entry.consequence,
      entry.insight,
      entry.type || "sin",
      confessedAt,
    ].map(csvEscape).join(";");
    lines.push(row);
  });
  
  const csv = lines.join("\n");
  const filename = "spiritual-journal-backup-" + formatDateOnly(new Date()) + ".csv";
  
  uploadToYandexDisk(csv, filename)
    .then(() => console.log("✅ Автобэкап на Яндекс Диск выполнен"))
    .catch(err => console.log("Ошибка автобэкапа:", err));
}
