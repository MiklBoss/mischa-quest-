const API = 'https://script.google.com/macros/s/AKfycbyVpnT0fHKHOVBkEoI-k-diDhzF1jSSs8CaMNs3SMH8NvpT2adpRfYvnJDIvvWuweVeww/exec';
let activeTab = 'home';
let gameData = null;

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
  </div>

  ${activeTab === 'home' ? `
    <section>
      <h2>Level ${data.level}</h2>
      <p>Total XP: ${data.totalXp}</p>

      <div class="bar">
        <div class="fill" style="width:${data.xpPercent}%"></div>
      </div>

      <p>${data.xpPercent}% до нового рівня</p>
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

          ${b.note
            ? `<div class="note">${b.note}</div>`
            : ''
          }
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
          <div>

            <strong>
              ${q.done ? '✅' : '⬜'} ${q.name}
            </strong>

            <p>${q.category} · +${q.xp} XP</p>

            <button
              onclick="
                toggleQuest(
                  '${q.sheet}',
                  ${q.row},
                  ${!q.done}
                )
              ">
              ${q.done ? 'Скасувати' : 'Виконати'}
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
          <div>

            <strong>${q.name}</strong>

            <p>${q.category}</p>

            <p>${q.storedXp || 0} XP</p>

            <div class="bar">
              <div class="fill" style="width:${q.progress || 0}%"></div>
            </div>

          </div>
        `).join('')}

    </section>
  ` : ''}

  ${activeTab === 'rewards' ? `
    <section>
      <h2>🎁 Rewards</h2>

      ${data.rewards.map(r => `
        <div class="${
          data.level >= r.level && !r.claimed
            ? 'reward-available'
            : ''
        }">

          <strong>Level ${r.level}</strong>

          <p>${r.reward}</p>

        </div>
      `).join('')}

    </section>
  ` : ''}
`;

  document.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.disabled = true;
      btn.textContent = '...';

      if (btn.dataset.action === 'new-day') {
        startNewDay();
      }

      if (btn.dataset.action === 'toggle') {
        toggleQuest(
          btn.dataset.sheet,
          Number(btn.dataset.row),
          btn.dataset.done === 'true'
        );
      }

      if (btn.dataset.action === 'medium-add') {
        addMediumProgress(Number(btn.dataset.row), 'add');
      }

      if (btn.dataset.action === 'medium-remove') {
        addMediumProgress(Number(btn.dataset.row), 'remove');
      }
    });
  });
}

function loadGame() {
  const script = document.createElement('script');
  script.src = API + '?callback=render';
  document.body.appendChild(script);
}

loadGame();
