<!doctype html>
<html>
<head>
  <base target="_top">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root {
      --bg: #0f172a;
      --card: #111827;
      --card2: #1f2937;
      --text: #e5e7eb;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --good: #22c55e;
      --warn: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top, #1e293b, var(--bg));
      color: var(--text);
      padding: 18px;
    }
    .app { max-width: 920px; margin: 0 auto; }
    .hero {
      background: linear-gradient(135deg, #111827, #1e293b);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 22px;
      padding: 22px;
      box-shadow: 0 18px 60px rgba(0,0,0,.35);
    }
    h1 { margin: 0 0 6px; font-size: 30px; }
    .muted { color: var(--muted); }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
    .stat, .card {
      background: rgba(15,23,42,.75);
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 18px;
      padding: 16px;
    }
    .label { color: var(--muted); font-size: 13px; }
    .value { font-size: 26px; font-weight: 800; margin-top: 4px; }
    .bar { width: 100%; height: 14px; background: #334155; border-radius: 999px; overflow: hidden; margin-top: 12px; }
    .fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--good)); border-radius: 999px; transition: width .25s; }
    .grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 14px; margin-top: 14px; }
    .quest, .boss {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .quest:last-child, .boss:last-child { border-bottom: 0; }
    button {
      border: 0;
      border-radius: 999px;
      padding: 9px 13px;
      font-weight: 700;
      cursor: pointer;
      background: var(--accent);
      color: #031923;
    }
    button.done { background: var(--good); color: #052e16; }
    .tag { font-size: 12px; color: var(--muted); }
    .bossbar { flex: 1; min-width: 110px; }
    .smallbar { height: 9px; margin-top: 6px; }
    @media (max-width: 760px) {
      .stats, .grid { grid-template-columns: 1fr; }
      h1 { font-size: 25px; }
    }
  </style>
</head>
<body>
  <div class="app">
    <section class="hero">
      <h1>🎮 Mischa Quest</h1>
      <div class="muted">Не таблиця. Один екран для сьогоднішнього ходу.</div>
      <button onclick="startNewDay()" style="margin-top:14px;">
  🌅 Почати новий день
</button>

      <div class="stats">
        <div class="stat">
          <div class="label">Рівень</div>
          <div class="value" id="level">—</div>
        </div>
        <div class="stat">
          <div class="label">Загальний XP</div>
          <div class="value" id="xp">—</div>
        </div>
        <div class="stat">
          <div class="label">Прогрес рівня</div>
          <div class="value" id="xpPercent">—</div>
          <div class="bar"><div class="fill" id="xpFill"></div></div>
        </div>
      </div>
    </section>

    <div class="grid">
  <section class="card">
    <h2>⚡ Квести</h2>
    <div id="quests"></div>
  </section>

  <section class="card">
    <h2>🎁 Боси</h2>
    <div id="bosses"></div>
  </section>

   <section class="card">
    <h2>🎁 Rewards</h2>
    <div id="rewards"></div>
  </section>
</div>

</div> 

<script>
function load() {
  google.script.run
    .withSuccessHandler(render)
    .withFailureHandler(function(err) {
      alert('Помилка завантаження: ' + err.message);
    })
    .getGameData();
}

function render(data) {
  document.getElementById('level').textContent = data.level;
  document.getElementById('xp').textContent = data.totalXp;
  document.getElementById('xpPercent').textContent = data.xpPercent + '%';
  document.getElementById('xpFill').style.width = data.xpPercent + '%';

  var questsHtml = '';

  data.quests.forEach(function(q) {
    var buttonsHtml = '';

    if (q.type === 'Середній') {
      buttonsHtml =
        '<button onclick="mediumProgress(' + q.row + ', \'add\')">+ XP</button>' +
        '<button onclick="mediumProgress(' + q.row + ', \'remove\')">−</button>';
    } else {
      buttonsHtml =
        '<button class="' + (q.done ? 'done' : '') + '"' +
        ' data-sheet="' + q.sheet + '"' +
        ' data-row="' + q.row + '"' +
        ' data-done="' + (!q.done) + '"' +
        ' onclick="toggle(this)">' +
        (q.done ? 'Скасовано' : 'Виконано') +
        '</button>';
    }

    questsHtml +=
      '<div class="quest">' +
        '<div>' +
          '<strong>' + (q.done ? '✅' : '⬜') + ' ' + q.name + '</strong>' +
          '<div class="tag">' + q.type + ' · ' + q.category + ' · +' + q.xp + ' XP</div>' +
        '</div>' +
        '<div>' + buttonsHtml + '</div>' +
      '</div>';
  });

  document.getElementById('quests').innerHTML = questsHtml;

  var bossesHtml = '';

  (data.bosses || []).forEach(function(b) {
    bossesHtml +=
      '<div class="boss">' +
        '<div style="min-width:95px">' +
          '<strong>' + (b.defeated ? '🏆' : b.avatar) + ' ' + b.name + '</strong>' +
          '<div class="tag">' + b.fact + ' / ' + b.plan + '</div>' +
        '</div>' +
        '<div class="bossbar">' +
          '<div class="tag">HP знято: ' + b.progress + '%</div>' +
          '<div class="bar smallbar">' +
            '<div class="fill" style="width:' + Math.min(100, b.progress) + '%"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  document.getElementById('bosses').innerHTML = bossesHtml;

  var rewardsHtml = '';

  (data.rewards || []).forEach(function(r) {
    var unlocked = Number(data.level) >= Number(r.level);
    var status = '';

    if (r.claimed) {
      status = '<span class="tag">✅ Забрано</span>';
    } else if (unlocked) {
      status = '<span class="tag">🔥 READY</span>';
    } else {
      status = '<span class="tag">Locked</span>';
    }

    rewardsHtml +=
      '<div class="quest" style="padding:18px 0;">' +
        '<div>' +
          '<div style="font-size:28px;">' + (unlocked ? '🎁' : '🔒') + '</div>' +
          '<strong style="font-size:22px;">Level ' + r.level + '</strong>' +
          '<div style="font-size:18px; margin-top:6px;">' + r.reward + '</div>' +
        '</div>' +
        '<div>' + status + '</div>' +
      '</div>';
  });

  document.getElementById('rewards').innerHTML = rewardsHtml;
}

function mediumProgress(row, direction) {
  google.script.run
    .withSuccessHandler(render)
    .withFailureHandler(function(err) {
      alert('Помилка: ' + err.message);
    })
    .addMediumProgress(row, direction);
}

function toggle(btn) {
  var sheet = btn.dataset.sheet;
  var row = Number(btn.dataset.row);
  var done = btn.dataset.done === 'true';

  google.script.run
    .withSuccessHandler(render)
    .withFailureHandler(function(err) {
      alert('Помилка: ' + err.message);
    })
    .toggleQuest(sheet, row, done);
}

function startNewDay() {
  google.script.run
    .withSuccessHandler(render)
    .withFailureHandler(function(err) {
      alert('Помилка нового дня: ' + err.message);
    })
    .startNewDay();
}

load();
</script>
</body>
</html>
