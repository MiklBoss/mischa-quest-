const API = 'https://script.google.com/macros/s/AKfycbz7oZ56BUWS1z-ISMtUtps72v5ssxOpG487lVpmCu3QnSaIMvg5BcPvzDtbfApUwDWN5g/exec';

function toggleQuest(sheet, row, done) {
  const script = document.createElement('script');

  script.src =
    API +
    '?action=toggleQuest' +
    '&sheet=' + encodeURIComponent(sheet) +
    '&row=' + encodeURIComponent(row) +
    '&done=' + encodeURIComponent(done) +
    '&callback=render';

  document.body.appendChild(script);
}
function addMediumProgress(row, direction) {
  const script = document.createElement('script');
function startNewDay() {
  const script = document.createElement('script');

  script.src =
    API +
    '?action=startNewDay' +
    '&callback=render';

  document.body.appendChild(script);
}
  script.src =
    API +
    '?action=addMediumProgress' +
    '&row=' + encodeURIComponent(row) +
    '&direction=' + encodeURIComponent(direction) +
    '&callback=render';

  document.body.appendChild(script);
}
function render(data) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <h1>🎮 Mischa Quest</h1>

    <section>
      <h2>Level ${data.level}</h2>
      <p>Total XP: ${data.totalXp}</p>
      <p>Progress: ${data.xpPercent}%</p>
      <button data-action="new-day">🌅 Новий день</button>
    </section>

    <section>
      <h2>👹 Bosses</h2>
      ${data.bosses.map(b => `
        <div>
          <strong>${b.avatar} ${b.name}</strong>
          <p>${b.fact} / ${b.plan}</p>

<div class="bar smallbar">
  <div class="fill" style="width:${b.progress}%"></div>
</div>

<p>${b.progress}%</p>
        </div>
      `).join('')}
    </section>

    <section>
      <h2>⚡ Quests</h2>
      ${data.quests.map(q => `
        <div>
          <strong>${q.done ? '✅' : '⬜'} ${q.name}</strong>
          <p>${q.type} · ${q.category} · +${q.xp} XP</p>
${q.type === 'Середній'
  ? `
    <div class="bar smallbar">
      <div class="fill" style="width:${q.progress}%"></div>
    </div>
    <p>${q.storedXp} / ${q.xp} XP</p>
  `
  : ''
}
          ${q.type === 'Міні'
  ? `<button data-action="toggle" data-sheet="${q.sheet}" data-row="${q.row}" data-done="${!q.done}">
      ${q.done ? 'Скасувати' : 'Виконати'}
    </button>`
  : `
    <button data-action="medium-add" data-row="${q.row}">+ XP</button>
    <button data-action="medium-remove" data-row="${q.row}">− XP</button>
  `
}
        </div>
      `).join('')}
    </section>

    <section>
      <h2>🎁 Rewards</h2>
      ${data.rewards.map(r => {
  const available = data.level >= r.level && !r.claimed;

  return `
    <div class="${available ? 'reward-available' : ''}">
      <strong>${available ? '🎁🔥' : '🎁'} Level ${r.level}</strong>
      <p>${r.reward} ${r.claimed ? '✅ Забрано' : available ? '✨ Доступно!' : ''}</p>
    </div>
  `;
}).join('')}
    </section>
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
