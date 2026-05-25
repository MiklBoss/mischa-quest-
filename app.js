const API = 'https://script.google.com/macros/s/AKfycbwV6BX3ttSF0F58v4mn3yZssYL3-L5TND0_I3lbqGEZAXt0rJQGr8FzGwNcWVVshNvTlQ/exec';

async function toggleQuest(sheet, row, done) {
  await fetch(API, {
    method: 'POST',
    body: JSON.stringify({
      action: 'toggleQuest',
      sheet,
      row,
      done
    })
  });

  loadGame();
}

async function loadGame() {
  const app = document.getElementById('app');

  try {
    const res = await fetch(API);
    const data = await res.json();

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
              ? `
                <button onclick="toggleQuest('${q.sheet}', ${q.row}, ${!q.done})">
                  ${q.done ? 'Скасувати' : 'Виконати'}
                </button>
              `
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
  } catch (err) {
    app.innerHTML = `
      <h1>⚠️ Error</h1>
      <pre>${err.message}</pre>
    `;
  }
}

loadGame();
