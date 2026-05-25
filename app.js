const API = 'https://script.google.com/macros/s/AKfycbwV6BX3ttSF0F58v4mn3yZssYL3-L5TND0_I3lbqGEZAXt0rJQGr8FzGwNcWVVshNvTlQ/exec';

async function toggleQuest(sheet, row, done) {
  const res = await fetch(API, {
    method: 'POST',
    body: JSON.stringify({
      action: 'toggleQuest',
      sheet,
      row,
      done
    })
  });

  const data = await res.json();
  render(data);
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
