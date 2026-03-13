const STORAGE_KEY = "sj_data_v1";
const YANDEX_CLIENT_ID = "c705d30899b6423d8932f77e60023d50";

const views = {
  home: document.getElementById("view-home"),
  new: document.getElementById("view-new"),
  archive: document.getElementById("view-archive"),
  confession: document.getElementById("view-confession"),
  stats: document.getElementById("view-stats"),
  situations: document.getElementById("view-situations"),
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

const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-entry-form");
const editCancel = document.getElementById("edit-cancel");

let editingId = null;
let currentEntryType = "sin"; // 'sin' или 'situation'

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
    return { entries: [], confessed: {} };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      confessed: parsed.confessed && typeof parsed.confessed === "object" ? parsed.confessed : {},
    };
  } catch (err) {
    return { entries: [], confessed: {} };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    return;
  }
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
  saveState({ entries: [], confessed: {} });
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
    saveState(parsed);
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
    navigate(target);
  });
});

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

renderArchive();
renderStats();
renderConfession();
renderSituations();

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
