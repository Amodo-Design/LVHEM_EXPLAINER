// Fake verification dashboard: replays pre-written answers and pre-computed
// verdicts from presets.js with realistic timing. No network, no randomness
// in the outcomes; only the pacing has a little jitter so it reads as live.
import { INSTANCES, PRESETS, THRESHOLD } from "./presets.js";

const BAR_MAX = 5;
const $ = (sel, root = document) => root.querySelector(sel);

// Every example runs on both instances; one click sends the preset prompt.
function renderExamples() {
  PRESETS.forEach((preset, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Example ${index + 1}`);
    button.title = preset.prompt;
    button.addEventListener("click", () => send(preset));
    $("#examples").append(button);
  });
}

// The shared timeline follows the most recently sent example. Both model
// cards must reach a milestone before it advances; older runs cannot reset it.
let latestRun = 0;
function setTimeline(step) {
  $("#timeline").dataset.step = String(step);
  [...$("#timeline").children].forEach((item, index) => {
    item.classList.toggle("is-reached", index < step);
    item.classList.toggle("is-current", index === step - 1);
    if (index === step - 1) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  $("#timeline-status").textContent = $("#timeline").children[step - 1].lastElementChild.textContent;
}

// --- timing ---------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = (base, spread) => base + (Math.random() * 2 - 1) * spread;

// --- a send ---------------------------------------------------------------

function send(preset) {
  const run = ++latestRun;
  const reached = { generated: 0, verifying: 0, complete: 0 };
  const steps = { generated: 2, verifying: 3, complete: 4 };
  const report = milestone => {
    reached[milestone]++;
    if (run === latestRun && reached[milestone] === INSTANCES.length) setTimeline(steps[milestone]);
  };
  setTimeline(1);

  $("#empty").hidden = true;
  const group = document.createElement("section");
  group.className = "chat-send-group";
  group.setAttribute("aria-label", "Prompt results");
  const time = new Date().toLocaleTimeString("en-GB");
  group.innerHTML = `<div class="chat-send-prompt"><span class="mono muted">${time}</span><p></p></div><div class="chat-cards"></div>`;
  $(".chat-send-prompt p", group).textContent = preset.prompt;
  const cards = $(".chat-cards", group);
  $("#sends").prepend(group);

  for (const inst of INSTANCES) {
    const card = buildCard(inst);
    cards.append(card);
    runCard(card, inst, preset[inst.key], report);
  }

}

function buildCard(inst) {
  const card = $("#card-template").content.firstElementChild.cloneNode(true);
  $('[data-slot="model"]', card).textContent = inst.key === "honest" ? "Correct model" : "Illegal model";
  return card;
}

async function runCard(card, inst, outcome, report) {
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
  // Each token gets a target time; occasional longer gaps mimic batching on
  // a shared GPU. Emission is driven by the clock rather than one token per
  // timer tick, so a throttled background tab catches up instead of crawling.
  const perToken = 1000 / inst.tokens_per_second;
  const schedule = [];
  let at = 0;
  for (const token of outcome.tokens) {
    at += Math.random() < 0.06 ? jitter(perToken * 4, perToken) : jitter(perToken, perToken * 0.35);
    schedule.push({ token, at });
  }
  const streamStart = performance.now();
  let next = 0;
  while (next < schedule.length) {
    const elapsed = performance.now() - streamStart;
    let emitted = "";
    while (next < schedule.length && schedule[next].at <= elapsed) emitted += schedule[next++].token;
    if (emitted) {
      reply.textContent += emitted;
      reply.scrollTop = reply.scrollHeight;
    }
    if (next < schedule.length) await sleep(Math.max(8, schedule[next].at - (performance.now() - streamStart)));
  }

  report("generated");

  // 2. The tap records the event in the ledger.
  stage.textContent = "awaiting ledger event";
  progressLabel.textContent = "Waiting for the ledger to record the inference";
  await sleep(jitter(900, 300));

  // 3. The verifier is kept warm, so it is ready almost at once.
  report("verifying");
  stage.textContent = "verifying";
  progressLabel.textContent = "Verifying: recomputing the answer and comparing logits";
  await sleep(jitter(1800 + outcome.tokens.length * 28, 500));

  // 4. Verdict.
  clearInterval(ticker);
  $('[data-slot="progress"]', card).hidden = true;
  stage.textContent = "done";
  renderResult(card, outcome);
  report("complete");
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

  // Keep the original response, highlighting tokens the verifier could not reproduce.
  const reply = $('[data-slot="reply"]', card);
  reply.textContent = "";
  for (const token of cmp) {
    const piece = document.createElement("span");
    piece.className = token.exact_match ? "token-piece" : "token-piece token-diff-prover";
    piece.textContent = token.prover_text;
    if (!token.exact_match) piece.title = `logit difference ${token.margin.toFixed(4)}`;
    reply.append(piece);
  }
  reply.scrollTop = 0;
}

// --- boot -----------------------------------------------------------------

renderExamples();
