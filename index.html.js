<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Daily 4-Part Note &amp; To-Do App</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body class="min-h-screen bg-slate-50 text-slate-800 antialiased">
  <div class="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
    <!-- Header -->
    <header class="mb-6 flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Daily Reflection Notes
          </h1>
          <p class="text-sm text-slate-500 mt-1">
            चार हिस्सों में अपने दिन के नोट्स लिखें — हर तारीख़ की हिस्ट्री अपने आप सेव होती है
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span id="save-status" class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Auto-saved
          </span>
          <button
            id="toggle-history-btn"
            type="button"
            class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
          >
            <span>History</span>
            <span id="history-count" class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-[11px]">0</span>
          </button>
        </div>
      </div>

      <!-- Date Navigation Bar -->
      <div class="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            id="prev-day-btn"
            type="button"
            aria-label="Previous day"
            class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-sm font-medium text-slate-700 transition"
          >&larr;</button>
          <input
            id="date-picker"
            type="date"
            aria-label="Select date"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            id="next-day-btn"
            type="button"
            aria-label="Next day"
            class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-sm font-medium text-slate-700 transition"
          >&rarr;</button>
        </div>

        <div class="flex items-center gap-2">
          <span id="today-date" class="text-sm font-medium text-slate-600">Today</span>
          <button
            id="go-today-btn"
            type="button"
            class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
          >Today</button>
        </div>
      </div>

      <!-- Collapsible Date-wise History Panel -->
      <section id="history-panel" class="hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Saved Date History (तारीख़ के अनुसार हिस्ट्री)</h2>
            <p class="text-xs text-slate-500">किसी भी तारीख़ पर क्लिक करके उस दिन के नोट्स देखें या एडिट करें</p>
          </div>
          <button
            id="close-history-btn"
            type="button"
            class="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100"
          >Close</button>
        </div>
        <div id="history-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto">
          <!-- History items rendered by JavaScript -->
        </div>
      </section>
    </header>

    <!-- 4-Part Grid -->
    <main id="quadrants-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Cards are rendered by JavaScript -->
    </main>
  </div>

  <script>
    const STORAGE_KEY = 'daily_reflection_notes_history_v1';

    // 1. App Data: 4 divided sections
    const SECTION_CONFIG = [
      {
        key: 'did',
        title: 'What I did today',
        subtitle: 'आज मैंने क्या किया',
        placeholder: 'Add something you completed...',
        accentBg: 'bg-sky-50',
        accentBorder: 'border-sky-200',
        badgeBg: 'bg-sky-100 text-sky-700',
        btnBg: 'bg-sky-600 hover:bg-sky-700',
        ringColor: 'focus:ring-sky-500',
        dotColor: 'bg-sky-500'
      },
      {
        key: 'willDo',
        title: 'What I will do today',
        subtitle: 'आज मैं क्या करूँगा',
        placeholder: 'Add a task for today...',
        accentBg: 'bg-indigo-50',
        accentBorder: 'border-indigo-200',
        badgeBg: 'bg-indigo-100 text-indigo-700',
        btnBg: 'bg-indigo-600 hover:bg-indigo-700',
        ringColor: 'focus:ring-indigo-500',
        dotColor: 'bg-indigo-500'
      },
      {
        key: 'regret',
        title: 'What is my regret today',
        subtitle: 'आज मुझे किस बात का अफ़सोस है',
        placeholder: 'Note something to improve...',
        accentBg: 'bg-amber-50',
        accentBorder: 'border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800',
        btnBg: 'bg-amber-600 hover:bg-amber-700',
        ringColor: 'focus:ring-amber-500',
        dotColor: 'bg-amber-500'
      },
      {
        key: 'achievement',
        title: 'What is my achievement today',
        subtitle: 'आज मेरी उपलब्धि क्या रही',
        placeholder: 'Write a win or milestone...',
        accentBg: 'bg-emerald-50',
        accentBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-700',
        btnBg: 'bg-emerald-600 hover:bg-emerald-700',
        ringColor: 'focus:ring-emerald-500',
        dotColor: 'bg-emerald-500'
      }
    ];

    function getLocalDateKey(dateObj = new Date()) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    function createEmptyDay() {
      return { did: [], willDo: [], regret: [], achievement: [] };
    }

    // Load all saved dates from localStorage safely
    function loadHistoryStore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      } catch (err) {
        // Fallback if localStorage is unavailable
      }
      const todayKey = getLocalDateKey();
      return {
        [todayKey]: {
          did: [{ id: 'did-1', text: 'Reviewed morning emails and planned my day', done: true }],
          willDo: [{ id: 'will-1', text: 'Complete 30 minutes of focused reading', done: false }],
          regret: [{ id: 'regret-1', text: 'Spent too much time scrolling on my phone', done: false }],
          achievement: [{ id: 'ach-1', text: 'Started building my first note-keeping app!', done: true }]
        }
      };
    }

    function saveHistoryStore() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyStore));
        const statusEl = document.getElementById('save-status');
        if (statusEl) {
          statusEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Saved for ' + currentDateKey;
        }
      } catch (err) {
        const statusEl = document.getElementById('save-status');
        if (statusEl) {
          statusEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Session only';
        }
      }
    }

    // 2. State: Holds all dates + active date key
    const historyStore = loadHistoryStore();
    let currentDateKey = getLocalDateKey();

    function getActiveDayData() {
      if (!historyStore[currentDateKey]) {
        historyStore[currentDateKey] = createEmptyDay();
      }
      return historyStore[currentDateKey];
    }

    function formatDisplayDate(dateKey) {
      const [y, m, d] = dateKey.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    // Show selected date in the header
    function renderDate() {
      const dateEl = document.getElementById('today-date');
      const picker = document.getElementById('date-picker');
      const isToday = currentDateKey === getLocalDateKey();
      dateEl.textContent = formatDisplayDate(currentDateKey) + (isToday ? ' (Today)' : '');
      if (picker && picker.value !== currentDateKey) {
        picker.value = currentDateKey;
      }
    }

    function switchDate(newDateKey) {
      if (!newDateKey) return;
      currentDateKey = newDateKey;
      renderDate();
      renderQuadrants();
      renderHistoryList();
    }

    function shiftDate(days) {
      const [y, m, d] = currentDateKey.split('-').map(Number);
      const dt = new Date(y, m - 1, d + days);
      switchDate(getLocalDateKey(dt));
    }

    // Add a new to-do note to a section
    function addItem(sectionKey, text) {
      const trimmed = text.trim();
      if (!trimmed) return;
      const dayData = getActiveDayData();
      dayData[sectionKey].push({
        id: sectionKey + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        text: trimmed,
        done: false
      });
      saveHistoryStore();
      renderQuadrants();
      renderHistoryList();
      const input = document.getElementById('input-' + sectionKey);
      if (input) input.focus();
    }

    // Toggle done/undone state of an item
    function toggleItem(sectionKey, itemId) {
      const dayData = getActiveDayData();
      const item = dayData[sectionKey].find((entry) => entry.id === itemId);
      if (item) {
        item.done = !item.done;
        saveHistoryStore();
        renderQuadrants();
        renderHistoryList();
      }
    }

    // Delete an item from a section
    function deleteItem(sectionKey, itemId) {
      const dayData = getActiveDayData();
      dayData[sectionKey] = dayData[sectionKey].filter((entry) => entry.id !== itemId);
      saveHistoryStore();
      renderQuadrants();
      renderHistoryList();
    }

    // Escape HTML to keep user text safe
    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Render all 4 sections on screen
    function renderQuadrants() {
      const grid = document.getElementById('quadrants-grid');
      const dayData = historyStore[currentDateKey] || createEmptyDay();
      grid.innerHTML = '';

      SECTION_CONFIG.forEach((sec) => {
        const items = dayData[sec.key] || [];
        const doneCount = items.filter((i) => i.done).length;

        const card = document.createElement('section');
        card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden';

        const listHtml = items.length === 0
          ? `<li class="text-sm text-slate-400 italic py-4 text-center">No notes yet for ${currentDateKey} — add one above!</li>`
          : items.map((item) => `
              <li class="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <input
                  type="checkbox"
                  ${item.done ? 'checked' : ''}
                  data-action="toggle"
                  data-section="${sec.key}"
                  data-id="${item.id}"
                  aria-label="Mark note complete"
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-800 cursor-pointer shrink-0"
                />
                <span
                  class="flex-1 text-sm leading-relaxed break-words ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}"
                >${escapeHtml(item.text)}</span>
                <button
                  type="button"
                  data-action="delete"
                  data-section="${sec.key}"
                  data-id="${item.id}"
                  aria-label="Delete note"
                  class="text-slate-400 hover:text-rose-600 text-base leading-none px-1.5 py-0.5 rounded-md hover:bg-rose-50 transition-colors shrink-0"
                >&times;</button>
              </li>
            `).join('');

        card.innerHTML = `
          <div class="px-5 py-4 ${sec.accentBg} border-b ${sec.accentBorder} flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="w-2.5 h-2.5 rounded-full ${sec.dotColor} shrink-0"></span>
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-slate-900 truncate">${sec.title}</h2>
                <p class="text-xs text-slate-500 truncate">${sec.subtitle}</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${sec.badgeBg} shrink-0">
              ${doneCount}/${items.length}
            </span>
          </div>

          <form class="px-5 pt-4 pb-2 flex gap-2" data-form-section="${sec.key}">
            <input
              id="input-${sec.key}"
              type="text"
              placeholder="${sec.placeholder}"
              class="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${sec.ringColor} transition"
            />
            <button
              type="submit"
              class="px-4 py-2 rounded-xl text-sm font-medium text-white ${sec.btnBg} transition shadow-sm shrink-0"
            >Add</button>
          </form>

          <ul class="px-5 pb-4 pt-1 space-y-1 flex-1 min-h-[140px]">
            ${listHtml}
          </ul>
        `;

        grid.appendChild(card);
      });
    }

    // Render date-wise history list
    function renderHistoryList() {
      const listEl = document.getElementById('history-list');
      const countEl = document.getElementById('history-count');

      const savedDates = Object.keys(historyStore)
        .filter((dateKey) => {
          const d = historyStore[dateKey];
          return d && (d.did.length + d.willDo.length + d.regret.length + d.achievement.length) > 0;
        })
        .sort((a, b) => b.localeCompare(a));

      countEl.textContent = savedDates.length;

      if (savedDates.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-slate-400 italic col-span-full py-2">No saved history yet.</p>';
        return;
      }

      listEl.innerHTML = savedDates.map((dateKey) => {
        const d = historyStore[dateKey];
        const total = d.did.length + d.willDo.length + d.regret.length + d.achievement.length;
        const isActive = dateKey === currentDateKey;
        return `
          <button
            type="button"
            data-history-date="${dateKey}"
            class="text-left p-3 rounded-xl border transition ${isActive ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'}"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold">${formatDisplayDate(dateKey)}</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-slate-700 text-slate-100' : 'bg-white text-slate-600 border border-slate-200'}">${total} notes</span>
            </div>
            <p class="text-[11px] mt-1.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}">
              Did: ${d.did.length} &bull; Will do: ${d.willDo.length} &bull; Regret: ${d.regret.length} &bull; Win: ${d.achievement.length}
            </p>
          </button>
        `;
      }).join('');
    }

    // Event Listeners
    document.getElementById('quadrants-grid').addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-form-section]');
      if (!form) return;
      e.preventDefault();
      const sectionKey = form.dataset.formSection;
      const input = form.querySelector('input');
      if (input) {
        addItem(sectionKey, input.value);
      }
    });

    document.getElementById('quadrants-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="delete"]');
      if (btn) {
        deleteItem(btn.dataset.section, btn.dataset.id);
      }
    });

    document.getElementById('quadrants-grid').addEventListener('change', (e) => {
      const checkbox = e.target.closest('input[data-action="toggle"]');
      if (checkbox) {
        toggleItem(checkbox.dataset.section, checkbox.dataset.id);
      }
    });

    document.getElementById('prev-day-btn').addEventListener('click', () => shiftDate(-1));
    document.getElementById('next-day-btn').addEventListener('click', () => shiftDate(1));
    document.getElementById('go-today-btn').addEventListener('click', () => switchDate(getLocalDateKey()));
    document.getElementById('date-picker').addEventListener('change', (e) => {
      if (e.target.value) switchDate(e.target.value);
    });

    document.getElementById('toggle-history-btn').addEventListener('click', () => {
      document.getElementById('history-panel').classList.toggle('hidden');
    });
    document.getElementById('close-history-btn').addEventListener('click', () => {
      document.getElementById('history-panel').classList.add('hidden');
    });
    document.getElementById('history-list').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-history-date]');
      if (btn) {
        switchDate(btn.dataset.historyDate);
      }
    });

    // Initialize the app
    saveHistoryStore();
    renderDate();
    renderQuadrants();
    renderHistoryList();
  </script>
</body>
</html>