// Fake verification dashboard: replays pre-written answers and pre-computed
// verdicts from presets.js with realistic timing. No network, no randomness
// in the outcomes; only the pacing has a little jitter so it reads as live.
import { INSTANCES, PRESETS, THRESHOLD } from "./presets.js";

const BAR_MAX = 5;
const $ = (sel, root = document) => root.querySelector(sel);

const state = {
  selected: new Set(INSTANCES.map((i) => i.key)),
};

// --- picker + chips -------------------------------------------------------

function renderPicker() {
  const menu = $("#picker-menu");
  menu.innerHTML = "";
  for (const inst of INSTANCES) {
    const label = document.createElement("label");
    label.className = "chat-picker-option";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = state.selected.has(inst.key);
    box.addEventListener("change", () => {
      if (box.checked) state.selected.add(inst.key);
      else state.selected.delete(inst.key);
      renderSelection();
    });
    const text = document.createElement("span");
    text.className = "chat-picker-label";
    text.innerHTML = `<span>${inst.model_name}</span><span class="mono muted">${inst.hostname} · ${inst.deployment_id.slice(0, 8)}</span>`;
    label.append(box, text);
    menu.append(label);
  }
  renderSelection();
}

function renderSelection() {
  const chosen = INSTANCES.filter((i) => state.selected.has(i.key));
  $("#picker-summary").textContent =
    chosen.length === 0
      ? "Select model instances"
      : chosen.length === 1
        ? `${chosen[0].model_name} · ${chosen[0].hostname} · ${chosen[0].deployment_id.slice(0, 8)}`
        : `${chosen.length} instances selected`;
  const chips = $("#chips");
  chips.innerHTML = "";
  for (const inst of chosen) {
    const li = document.createElement("li");
    li.className = "chat-chip";
    li.innerHTML = `<span>${inst.model_name}</span><span class="chat-chip-host mono">${inst.hostname}</span>`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "chat-chip-remove";
    remove.setAttribute("aria-label", `Remove ${inst.model_name} on ${inst.hostname}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      state.selected.delete(inst.key);
      renderPicker();
    });
    li.append(remove);
    chips.append(li);
  }
  updateSendEnabled();
}

// Close the picker on outside click so it never sits over the composer.
document.addEventListener("mousedown", (event) => {
  const picker = $("#picker");
  if (picker.open && !picker.contains(event.target)) picker.open = false;
});

// --- composer -------------------------------------------------------------

function renderPrompts() {
  const select = $("#prompt");
  PRESETS.forEach((preset, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = preset.prompt;
    select.append(option);
  });
  select.addEventListener("change", updateSendEnabled);
  $("#send").addEventListener("click", send);
  select.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !$("#send").disabled) {
      event.preventDefault();
      send();
    }
  });
}

function updateSendEnabled() {
  $("#send").disabled = $("#prompt").value === "" || state.selected.size === 0;
}

// --- timing ---------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = (base, spread) => base + (Math.random() * 2 - 1) * spread;

// --- a send ---------------------------------------------------------------

function send() {
  const preset = PRESETS[Number($("#prompt").value)];
  const chosen = INSTANCES.filter((i) => state.selected.has(i.key));
  if (!preset || chosen.length === 0) return;

  $("#empty").hidden = true;
  const group = document.createElement("section");
  group.className = "chat-send-group";
  group.setAttribute("aria-label", "Prompt results");
  const time = new Date().toLocaleTimeString("en-GB");
  group.innerHTML = `<div class="chat-send-prompt"><span class="mono muted">${time}</span><p></p></div><div class="chat-cards"></div>`;
  $(".chat-send-prompt p", group).textContent = preset.prompt;
  const cards = $(".chat-cards", group);
  cards.style.gridTemplateColumns = `repeat(${Math.min(chosen.length, 2)}, minmax(0, 1fr))`;
  $("#sends").prepend(group);

  for (const inst of chosen) {
    const card = buildCard(inst);
    cards.append(card);
    runCard(card, inst, preset[inst.key]);
  }

  $("#prompt").value = "";
  updateSendEnabled();
}

function buildCard(inst) {
  const card = $("#card-template").content.firstElementChild.cloneNode(true);
  $('[data-slot="model"]', card).textContent = inst.model_name;
  $('[data-slot="host"]', card).textContent = inst.hostname;
  $('[data-slot="guid"]', card).textContent = inst.deployment_id.slice(0, 8);
  $('[data-slot="guid"]', card).title = `Deployment ${inst.deployment_id}`;
  return card;
}

async function runCard(card, inst, outcome) {
  const reply = $('[data-slot="reply"]', card);
  const stage = $('[data-slot="stage"]', card);
  const progressLabel = $('[data-slot="progress-label"]', card);
  const progressTime = $('[data-slot="progress-time"]', card);
  const started = performance.now();
  const ticker = setInterval(() => {
    progressTime.textContent = `${Math.round((performance.now() - started) / 1000)}s`;
  }, 250);

  // 1. Time to first token, then the reply streams at the instance's speed.
  stage.textContent = "inferring";
  progressLabel.textContent = "Generating answer";
  await sleep(jitter(inst.key === "liar" ? 420 : 650, 150));
  reply.textContent = "";
  const perToken = 1000 / inst.tokens_per_second;
  for (const token of outcome.tokens) {
    reply.textContent += token;
    reply.scrollTop = reply.scrollHeight;
    // Occasional longer pauses mimic batching on a shared GPU.
    await sleep(Math.random() < 0.06 ? jitter(perToken * 4, perToken) : jitter(perToken, perToken * 0.35));
  }

  // 2. The tap records the event in the ledger.
  stage.textContent = "awaiting ledger event";
  progressLabel.textContent = "Waiting for the ledger to record the inference";
  await sleep(jitter(900, 300));

  // 3. The verifier is kept warm, so it is ready almost at once.
  stage.textContent = "verifying";
  progressLabel.textContent = "Verifying: recomputing the answer and comparing logits";
  await sleep(jitter(1800 + outcome.tokens.length * 28, 500));

  // 4. Verdict.
  clearInterval(ticker);
  $('[data-slot="progress"]', card).hidden = true;
  stage.textContent = "done";
  renderResult(card, outcome);
}

function renderResult(card, outcome) {
  const result = outcome.result;
  const section = $('[data-slot="result"]', card);
  section.hidden = false;
  section.classList.add(`chat-result-${result}`);
  card.classList.add(`chat-card-${result}`);

  $('[data-slot="verdict"]', card).classList.add(`chat-verdict-${result}`);
  $('[data-slot="verdict-label"]', card).textContent = result;

  const cmp = outcome.comparison;
  const differing = cmp.filter((t) => !t.exact_match).length;
  $('[data-slot="match"]', card).textContent = (outcome.exact_match_level_pct * 100).toFixed(1);
  $('[data-slot="match-hint"]', card).textContent = `${cmp.length - differing} of ${cmp.length} tokens identical`;
  $('[data-slot="delta"]', card).textContent = outcome.mean_logit_difference.toFixed(3);
  $('[data-slot="threshold-hint"]', card).textContent = `threshold ${THRESHOLD.toFixed(2)}`;
  const fill = Math.min(100, (outcome.mean_logit_difference / BAR_MAX) * 100);
  const marker = Math.min(100, (THRESHOLD / BAR_MAX) * 100);
  const bar = $('[data-slot="bar"]', card);
  bar.setAttribute("aria-label", `mean logit difference ${outcome.mean_logit_difference.toFixed(3)} on a 0 to ${BAR_MAX} scale, threshold ${THRESHOLD}`);
  $('[data-slot="bar-marker"]', card).style.left = `${marker}%`;
  requestAnimationFrame(() => {
    $('[data-slot="bar-fill"]', card).style.width = `${fill}%`;
  });

  $('[data-slot="diff-summary"]', card).textContent = `${differing} / ${cmp.length} different`;
  const prover = $('[data-slot="diff-prover"]', card);
  const verifier = $('[data-slot="diff-verifier"]', card);
  for (const token of cmp) {
    const p = document.createElement("span");
    p.className = token.exact_match ? "token-piece" : "token-piece token-diff-prover";
    p.textContent = token.prover_text;
    p.title = token.exact_match ? "" : `logit difference ${token.margin.toFixed(4)}`;
    prover.append(p);
    const v = document.createElement("span");
    v.className = token.exact_match ? "token-piece" : "token-piece token-diff-verifier";
    v.textContent = token.verifier_text;
    verifier.append(v);
  }
}

// --- boot -----------------------------------------------------------------

renderPicker();
renderPrompts();
