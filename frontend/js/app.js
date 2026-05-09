/* ===========================================================
   FITillegence — Frontend JS
   Handles form submission, API calls, and rendering
   =========================================================== */

const API_BASE = window.location.origin; // same origin (Flask serves both)

const form = document.getElementById('fitness-form');
const generateBtn = document.getElementById('generate-btn');
const compareBtn = document.getElementById('compare-btn');
const loadingEl = document.getElementById('loading');
const loadingTextEl = document.getElementById('loading-text');
const resultsEl = document.getElementById('results');
const resultsContent = document.getElementById('results-content');
const resultsSubtitle = document.getElementById('results-subtitle');
const strategySelect = document.getElementById('strategy-select');
const strategyDesc = document.getElementById('strategy-desc');

// Strategy descriptions (loaded from backend)
let STRATEGY_META = {};

// ============ INIT ============
async function init() {
  try {
    const res = await fetch(`${API_BASE}/api/strategies`);
    const list = await res.json();
    list.forEach(s => { STRATEGY_META[s.id] = s; });
    updateStrategyDesc();
  } catch (e) {
    console.warn('Could not load strategies metadata', e);
  }
}
init();

strategySelect.addEventListener('change', updateStrategyDesc);
function updateStrategyDesc() {
  const id = strategySelect.value;
  const meta = STRATEGY_META[id];
  strategyDesc.textContent = meta ? meta.description : '';
}

// ============ HELPERS ============
function scrollToBuilder() {
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
}
window.scrollToBuilder = scrollToBuilder;

function getFormData() {
  const data = new FormData(form);
  const obj = {};
  data.forEach((v, k) => { obj[k] = v; });
  // Coerce numeric fields
  obj.age = Number(obj.age);
  obj.weight_kg = Number(obj.weight_kg);
  obj.height_cm = Number(obj.height_cm);
  obj.workout_days = Number(obj.workout_days);
  return obj;
}

function showLoading(message) {
  loadingTextEl.textContent = message || 'Crafting your personalized plan...';
  loadingEl.classList.remove('hidden');
  resultsEl.classList.add('hidden');
  generateBtn.disabled = true;
  compareBtn.disabled = true;
  loadingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideLoading() {
  loadingEl.classList.add('hidden');
  generateBtn.disabled = false;
  compareBtn.disabled = false;
}

function showError(msg) {
  hideLoading();
  resultsContent.innerHTML = `
    <div class="plan-card" style="border-color:#ff4d6d">
      <h2>⚠️ Something went wrong</h2>
      <p>${escapeHtml(msg)}</p>
      <p><small>Check that your Gemini API key is set in <code>backend/.env</code> and that the backend is running.</small></p>
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

// ============ MARKDOWN -> HTML (lightweight, no library) ============
function markdownToHtml(md) {
  if (!md) return '';
  let html = escapeHtml(md);

  // Headings
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h2>$1</h2>');

  // Bold + italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists (very simple: convert lines starting with "- " or "* " or "1. ")
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

// ============ RESET VIEW ============
function resetView() {
  resultsEl.classList.add('hidden');
  resultsContent.innerHTML = '';
  scrollToBuilder();
}
window.resetView = resetView;

// ============ GENERATE SINGLE PLAN ============
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

// ============ COMPARE ALL STRATEGIES ============
compareBtn.addEventListener('click', async () => {
  // basic HTML5 validation
  if (!form.reportValidity()) return;
  await comparePrompts();
});

async function comparePrompts() {
  const payload = getFormData();
  showLoading('Running all 4 strategies side-by-side... this takes ~30 seconds.');

  try {
    const res = await fetch(`${API_BASE}/api/compare-prompts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Request failed');

    renderComparison(data);
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
