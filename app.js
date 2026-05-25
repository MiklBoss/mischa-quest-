const API = 'https://script.google.com/macros/s/AKfycbwBw4PgtCgmJZzsETs-VPcgqAY4YoS2jpvPpWhXhgAz-7uQuVOW8DvzPJfcfXsHNnzhZQ/exec';

async function loadGame() {
  const app = document.getElementById('app');

  try {
    const res = await fetch(API);
    const data = await res.json();

    app.innerHTML = `
      <h1>🎮 Mischa Quest</h1>

      <section>
        <h2>Level ${data.player.level}</h2>
        <p>XP: ${data.player.totalXp}</p>
      </section>

      <section>
        <h2>👹 Bosses</h2>
        ${data.bosses.map(boss => `
          <div>
            <strong>${boss.avatar || '👹'} ${boss.name}</strong>
            <p>${Math.round(boss.progress * 100)}%</p>
          </div>
        `).join('')}
      </section>

      <section>
        <h2>✅ Small Quests</h2>
        ${data.smallQuests.map(q => `
          <div>
            ${q.quest} — ${q.xp} XP
          </div>
        `).join('')}
      </section>

      <section>
        <h2>⚡ Medium Quests</h2>
        ${data.mediumQuests.map(q => `
          <div>
            ${q.quest} — ${q.storedXp || 0} XP
          </div>
        `).join('')}
      </section>
    `;
  } catch (err) {
    app.innerHTML = `
      <h1>⚠️ Error</h1>
      <p>Не вдалося завантажити дані.</p>
      <pre>${err.message}</pre>
    `;
  }
}

loadGame();
