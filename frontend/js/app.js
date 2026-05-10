/* ============================================================
   FITillegence — app.js (Premium Energy edition)
   Multi-step form, sliders, BMI, particles, tilt, reveal, confetti
   ============================================================ */

const API_BASE = window.location.origin;

// ============ PARTICLES (orange-themed) ============
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#ff6b1a', '#ff8a3d', '#ffaa66', '#fbbf24'];
  const COUNT = Math.min(60, Math.floor(window.innerWidth / 28));

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.15,
    });
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
})();

// ============ SCROLL REVEAL ============
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
})();

// ============ NUMBER COUNTERS ============
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function step(t) {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => obs.observe(c));
})();

// ============ 3D TILT ============
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============ MULTI-STEP FORM ============
const form = document.getElementById('fitness-form');
const steps = document.querySelectorAll('.form-step');
const progressFill = document.getElementById('progress-fill');
const progressSteps = document.querySelectorAll('.progress-step');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const generateBtn = document.getElementById('generate-btn');
const compareBtn = document.getElementById('compare-btn');
const TOTAL_STEPS = 4;
let currentStep = 1;

function showStep(n) {
  currentStep = n;
  steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
  progressSteps.forEach(s => {
    const num = Number(s.dataset.step);
    s.classList.toggle('active', num === n);
    s.classList.toggle('completed', num < n);
  });
  progressFill.style.width = `${(n / TOTAL_STEPS) * 100}%`;
  prevBtn.disabled = n === 1;

  const onLast = n === TOTAL_STEPS;
  nextBtn.classList.toggle('hidden', onLast);
  generateBtn.classList.toggle('hidden', !onLast);
  compareBtn.classList.toggle('hidden', !onLast);
}

prevBtn.addEventListener('click', () => { if (currentStep > 1) showStep(currentStep - 1); });
nextBtn.addEventListener('click', () => { if (currentStep < TOTAL_STEPS) showStep(currentStep + 1); });

progressSteps.forEach(ps => {
  ps.addEventListener('click', () => {
    const target = Number(ps.dataset.step);
    if (target <= currentStep || ps.classList.contains('completed')) showStep(target);
  });
});

// ============ SLIDERS + BMI ============
const ageSlider = document.getElementById('age');
const weightSlider = document.getElementById('weight');
const heightSlider = document.getElementById('height');
const daysSlider = document.getElementById('days');
const ageVal = document.getElementById('age-val');
const weightVal = document.getElementById('weight-val');
const heightVal = document.getElementById('height-val');
const daysVal = document.getElementById('days-val');
const bmiCard = document.getElementById('bmi-card');
const bmiValue = document.getElementById('bmi-value');
const bmiStatus = document.getElementById('bmi-status');

function bindSlider(slider, label, transform = v => v) {
  slider.addEventListener('input', () => {
    label.textContent = transform(slider.value);
    updateBMI();
  });
}
bindSlider(ageSlider, ageVal);
bindSlider(weightSlider, weightVal, v => parseFloat(v).toFixed(1).replace('.0', ''));
bindSlider(heightSlider, heightVal);
bindSlider(daysSlider, daysVal);

function updateBMI() {
  const w = parseFloat(weightSlider.value);
  const h = parseFloat(heightSlider.value) / 100;
  if (!w || !h) return;
  const bmi = w / (h * h);
  bmiValue.textContent = bmi.toFixed(1);

  bmiCard.classList.remove('healthy', 'warn', 'alert');
  let status, klass;
  if (bmi < 18.5) { status = 'Underweight'; klass = 'warn'; }
  else if (bmi < 25) { status = 'Healthy range'; klass = 'healthy'; }
  else if (bmi < 30) { status = 'Overweight'; klass = 'warn'; }
  else { status = 'Obese'; klass = 'alert'; }
  bmiCard.classList.add(klass);
  bmiStatus.textContent = status;
}
updateBMI();

// ============ FORM DATA ============
function getFormData() {
  const fd = new FormData(form);
  const obj = {};
  fd.forEach((v, k) => { obj[k] = v; });
  obj.age = Number(obj.age);
  obj.weight_kg = Number(obj.weight_kg);
  obj.height_cm = Number(obj.height_cm);
  obj.workout_days = Number(obj.workout_days);
  return obj;
}

// ============ HELPERS ============
function scrollToBuilder() {
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}
window.scrollToBuilder = scrollToBuilder;

const loadingEl = document.getElementById('loading');
const loadingTextEl = document.getElementById('loading-text');
const loadingTipEl = document.getElementById('loading-tip');
const resultsEl = document.getElementById('results');
const resultsContent = document.getElementById('results-content');
const resultsSubtitle = document.getElementById('results-subtitle');

const TIPS = [
  "💡 Tip: Try comparing all 4 strategies for the full picture",
  "🔥 Chain-of-Thought is best when calorie math matters",
  "🎭 Role-Based feels like talking to a real coach",
  "📋 Few-Shot keeps formatting super consistent",
  "⚡ Zero-Shot is the fastest baseline",
  "🏋️ Groq's LPU chips are 10× faster than typical GPUs",
];
let tipTimer = null;
function startTipRotation() {
  let i = 0;
  loadingTipEl.textContent = TIPS[0];
  tipTimer = setInterval(() => {
    i = (i + 1) % TIPS.length;
    loadingTipEl.style.opacity = '0';
    setTimeout(() => {
      loadingTipEl.textContent = TIPS[i];
      loadingTipEl.style.opacity = '1';
    }, 300);
  }, 3000);
}
function stopTipRotation() { if (tipTimer) { clearInterval(tipTimer); tipTimer = null; } }

function showLoading(message) {
  loadingTextEl.textContent = message || 'Crafting your personalized plan...';
  loadingEl.classList.remove('hidden');
  resultsEl.classList.add('hidden');
  generateBtn.disabled = true;
  compareBtn.disabled = true;
  loadingTipEl.style.transition = 'opacity 0.3s';
  startTipRotation();
  loadingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideLoading() {
  loadingEl.classList.add('hidden');
  generateBtn.disabled = false;
  compareBtn.disabled = false;
  stopTipRotation();
}

function showError(msg) {
  hideLoading();
  resultsContent.innerHTML = `
    <div class="plan-card" style="border-color:#ff6b1a">
      <h2>⚠️ Something went wrong</h2>
      <p>${escapeHtml(msg)}</p>
      <p><small>Check that your Groq API key is set in <code>backend/.env</code> and that the backend is running.</small></p>
    </div>`;
  resultsSubtitle.textContent = '';
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth' });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

// ============ MARKDOWN -> HTML ============
function markdownToHtml(md) {
  if (!md) return '';
  let html = escapeHtml(md);
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  const lines = html.split('\n');
  const out = [];
  let inUl = false, inOl = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    const ulMatch = line.match(/^\s*[-*]\s+(.*)/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)/);

    if (ulMatch) {
      if (!inUl) { out.push('<ul>'); inUl = true; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      out.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inOl) { out.push('<ol>'); inOl = true; }
      if (inUl) { out.push('</ul>'); inUl = false; }
      out.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (line.trim() === '') {
        out.push('');
      } else if (/^<h\d>/.test(line)) {
        out.push(line);
      } else {
        out.push(`<p>${line}</p>`);
      }
    }
  }
  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');
  return out.join('\n');
}

// ============ CONFETTI (orange/amber theme) ============
function fireConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#ff6b1a', '#ff8a3d', '#ffaa66', '#fbbf24', '#ffffff'];
  const count = 80;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-20px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

// ============ RESET ============
function resetView() {
  resultsEl.classList.add('hidden');
  resultsContent.innerHTML = '';
  showStep(1);
  scrollToBuilder();
}
window.resetView = resetView;

// ============ GENERATE PLAN ============
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await generateSinglePlan();
});

async function generateSinglePlan() {
  const payload = getFormData();
  showLoading('Crafting your personalized plan...');

  try {
    const res = await fetch(`${API_BASE}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    renderSinglePlan(data);
    fireConfetti();
  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to generate plan.');
  } finally {
    hideLoading();
  }
}

function renderSinglePlan(data) {
  resultsSubtitle.innerHTML =
    `Generated using <strong>${escapeHtml(data.strategy_name)}</strong> strategy`;
  resultsContent.innerHTML = `
    <div class="plan-card">
      <span class="strategy-tag">🧠 ${escapeHtml(data.strategy_name)}</span>
      ${markdownToHtml(data.plan)}
    </div>
  `;
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ COMPARE ALL ============
compareBtn.addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  await comparePrompts();
});

async function comparePrompts() {
  const payload = getFormData();
  showLoading('Running all 4 strategies side-by-side... ~30 seconds');

  try {
    const res = await fetch(`${API_BASE}/api/compare-prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    renderComparison(data);
    fireConfetti();
  } catch (err) {
    console.error(err);
    showError(err.message || 'Comparison failed.');
  } finally {
    hideLoading();
  }
}

function renderComparison(data) {
  resultsSubtitle.innerHTML =
    `Side-by-side comparison of <strong>${data.results.length}</strong> prompt strategies`;
  const cards = data.results.map(r => `
    <div class="plan-card">
      <span class="strategy-tag">🧠 ${escapeHtml(r.strategy_name)}</span>
      <p class="strategy-desc">${escapeHtml(r.description)}</p>
      ${markdownToHtml(r.plan)}
    </div>
  `).join('');
  resultsContent.innerHTML = `<div class="compare-grid">${cards}</div>`;
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============ INIT ============
showStep(1);