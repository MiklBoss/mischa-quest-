const API = 'https://script.google.com/macros/s/AKfycbyVpnT0fHKHOVBkEoI-k-diDhzF1jSSs8CaMNs3SMH8NvpT2adpRfYvnJDIvvWuweVeww/exec';

let activeTab = 'home';
let gameData = null;
let focusQuestName = localStorage.getItem('focusQuestName') || '';
let dailyReflection =
  localStorage.getItem('dailyReflection') || '';

function saveReflection(value) {
  dailyReflection = value;
  localStorage.setItem('dailyReflection', value);
}

function setFocusQuest(name) {
  focusQuestName = name;
  localStorage.setItem('focusQuestName', name);
  render(gameData);
}
function continueFocusQuest() {
  const quest = gameData.quests.find(q => q.name === focusQuestName);

  if (!quest) return;

  if (quest.type === 'Міні') {
    activeTab = 'small';
  }

  if (quest.type === 'Середній') {
    activeTab = 'medium';
  }

  render(gameData);

  setTimeout(() => {
    const el = document.querySelector(`[data-quest="${CSS.escape(focusQuestName)}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pulse-focus');
    }
  }, 100);
}
function setTab(tab) {
  activeTab = tab;
  render(gameData);
}

function callApi(params) {
  const script = document.createElement('script');
  script.src = API + '?' + params + '&callback=render';
  document.body.appendChild(script);
}

function toggleQuest(sheet, row, done) {
  callApi(
    'action=toggleQuest' +
    '&sheet=' + encodeURIComponent(sheet) +
    '&row=' + encodeURIComponent(row) +
    '&done=' + encodeURIComponent(done)
  );
}

function addMediumProgress(row, direction) {
  callApi(
    'action=addMediumProgress' +
    '&row=' + encodeURIComponent(row) +
    '&direction=' + encodeURIComponent(direction)
  );
}

function startNewDay() {
  callApi('action=startNewDay');
}

function render(data) {
  const completedQuests =
  data.quests.filter(q => q.done).length;

const topBoss =
  [...data.bosses]
    .sort((a, b) => b.progress - a.progress)[0];
  gameData = data;
  const app = document.getElementById('app');

  app.innerHTML = `
    <h1>🎮 Mischa Quest</h1>

    <div class="tabs">
      <button onclick="setTab('home')">🏠 Home</button>
      <button onclick="setTab('bosses')">👹 Bosses</button>
      <button onclick="setTab('small')">✅ Mini</button>
      <button onclick="setTab('medium')">⚡ Medium</button>
      <button onclick="setTab('rewards')">🎁 Rewards</button>
      <button onclick="setTab('summary')">📊 Summary</button>
    </div>

    ${activeTab === 'home' ? `
      <section>
        <h2>Level ${data.level}</h2>
        <p>Total XP: ${data.totalXp}</p>

        <div class="bar">
          <div class="fill" style="width:${data.xpPercent}%"></div>
        </div>

        <p>${data.xpPercent}% до нового рівня</p>

        <div class="focus-box">
          <h3>🎯 Active Focus</h3>
          <p>${focusQuestName || 'Обери один квест як головний фокус зараз'}</p>
          ${focusQuestName
  ? `<button onclick="continueFocusQuest()">▶ Continue Quest</button>`
  : ''
}
        </div>

        <div class="notes-panel">
          <h3>📝 Boss Notes</h3>

          ${data.bosses
            .filter(b => b.note)
            .slice(0, 5)
            .map(b => `
              <div class="note-card">
                <strong>${b.avatar} ${b.name}</strong>
                <p>${b.note}</p>
              </div>
            `).join('')}
        </div>
      </section>
    ` : ''}

    ${activeTab === 'bosses' ? `
      <section>
        <h2>👹 Bosses</h2>

        ${data.bosses.map(b => `
          <div>
            <strong>${b.avatar} ${b.name}</strong>
            <p>${b.fact} / ${b.plan}</p>

            <div class="bar">
              <div class="fill" style="width:${b.progress}%"></div>
            </div>

            <p>${b.progress}%</p>

            ${b.note ? `<div class="note">${b.note}</div>` : ''}
          </div>
        `).join('')}
      </section>
    ` : ''}

    ${activeTab === 'small' ? `
      <section>
        <h2>✅ Mini Quests</h2>

        ${data.quests
          .filter(q => q.type === 'Міні')
          .map(q => `
            <div data-quest="${q.name}">
              <strong>${q.done ? '✅' : '⬜'} ${q.name}</strong>
              <p>${q.category} · +${q.xp} XP</p>

              <button onclick="toggleQuest('${q.sheet}', ${q.row}, ${!q.done})">
                ${q.done ? 'Скасувати' : 'Виконати'}
              </button>

              <button onclick="setFocusQuest('${q.name}')">
                🎯 Фокус
              </button>
            </div>
          `).join('')}
      </section>
    ` : ''}

    ${activeTab === 'medium' ? `
      <section>
        <h2>⚡ Medium Quests</h2>

        ${data.quests
          .filter(q => q.type === 'Середній')
          .map(q => `
           <div data-quest="${q.name}">
              <strong>${q.name}</strong>
              <p>${q.category}</p>
              <p>${q.storedXp || 0} XP</p>

              <div class="bar">
                <div class="fill" style="width:${q.progress || 0}%"></div>
              </div>

              <button onclick="addMediumProgress(${q.row}, 'add')">+ XP</button>
              <button onclick="addMediumProgress(${q.row}, 'remove')">−</button>
              <button onclick="setFocusQuest('${q.name}')">🎯 Фокус</button>
            </div>
          `).join('')}
      </section>
    ` : ''}
${activeTab === 'summary' ? `
  <section>
    <h2>📊 Daily Summary</h2>

    <div>
      <strong>⭐ Total XP</strong>
      <p>${data.totalXp}</p>
    </div>

    <div>
      <strong>✅ Completed Quests</strong>
      <p>${completedQuests}</p>
    </div>

    <div>
      <strong>🎯 Current Focus</strong>
      <p>${focusQuestName || 'No focus selected'}</p>
    </div>

    <div>
      <strong>👹 Top Boss</strong>
      <p>${topBoss.avatar} ${topBoss.name} — ${topBoss.progress}%</p>
    </div>

    <div class="reflection-box">
      <strong>📝 Reflection</strong>
      <textarea
        placeholder="How was today..."
        oninput="saveReflection(this.value)"
      >${dailyReflection}</textarea>
    </div>
  </section>
` : ''}
    ${activeTab === 'rewards' ? `
      <section>
        <h2>🎁 Rewards</h2>
        ${data.rewards.map(r => `
          <div class="${data.level >= r.level && !r.claimed ? 'reward-available' : ''}">
            <strong>Level ${r.level}</strong>
            <p>${r.reward}</p>
          </div>
        `).join('')}
      </section>
    ` : ''}
  `;
}

function loadGame() {
  const script = document.createElement('script');
  script.src = API + '?callback=render';
  document.body.appendChild(script);
}

loadGame();
