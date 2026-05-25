const API = 'https://script.google.com/macros/s/AKfycbxvb_rpDW7nr8KHfY9oiiMtgIUcWEcFfIDwn7ewbZCcHA2NeOv7b5WRD9kEXA01eh1pxw/exec';

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

function render(data) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <h1>🎮 Mischa Quest</h1>

    <section>
      <h2>Level ${data.level}</h2>
      <p>Total XP: ${data.totalXp}</p>
      <p>Progress: ${data.xpPercent}%</p>
    </section>

    <section>
      <h2>👹 Bosses</h2>
      ${data.bosses.map(b => `
        <div>
          <strong>${b.avatar} ${b.name}</strong>
          <p>${b.fact} / ${b.plan} — ${b.progress}%</p>
        </div>
      `).join('')}
    </section>

    <section>
      <h2>⚡ Quests</h2>
      ${data.quests.map(q => `
        <div>
          <strong>${q.done ? '✅' : '⬜'} ${q.name}</strong>
          <p>${q.type} · ${q.category} · +${q.xp} XP</p>

          ${q.type === 'Міні'
            ? `<button data-sheet="${q.sheet}" data-row="${q.row}" data-done="${!q.done}">
                ${q.done ? 'Скасувати' : 'Виконати'}
              </button>`
            : ''
          }
        </div>
      `).join('')}
    </section>

    <section>
      <h2>🎁 Rewards</h2>
      ${data.rewards.map(r => `
        <div>
          <strong>Level ${r.level}</strong>
          <p>${r.reward} ${r.claimed ? '✅' : ''}</p>
        </div>
      `).join('')}
    </section>
  `;

  document.querySelectorAll('button[data-sheet]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleQuest(
        btn.dataset.sheet,
        Number(btn.dataset.row),
        btn.dataset.done === 'true'
      );
    });
  });
}

async function loadGame() {
  const app = document.getElementById('app');

  try {
    const res = await fetch(API);
    const data = await res.json();
    render(data);
  } catch (err) {
    app.innerHTML = `
      <h1>⚠️ Error</h1>
      <pre>${err.message}</pre>
    `;
  }
}

loadGame();
