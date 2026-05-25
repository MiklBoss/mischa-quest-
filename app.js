const API = 'https://script.google.com/macros/s/AKfycbwBw4PgtCgmJZzsETs-VPcgqAY4YoS2jpvPpWhXhgAz-7uQuVOW8DvzPJfcfXsHNnzhZQ/exec';

async function loadGame() {
  const app = document.getElementById('app');

  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log(data);

    app.innerHTML = `
      <h1>🎮 Mischa Quest</h1>
      <h2>JSON отримано ✅</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

  } catch (err) {
    app.innerHTML = `
      <h1>⚠️ Error</h1>
      <pre>${err.message}</pre>
    `;
  }
}

loadGame();
