// Interactive presentation of fixture responses and verification outcomes.
// Every milestone is advanced explicitly; only response streaming uses timers.
import { INSTANCES, PRESETS, THRESHOLD } from "./presets.js";

const BAR_MAX = 5;
const $ = (sel, root = document) => root.querySelector(sel);
const embedded = window.parent !== window && document.documentElement.dataset.embed === "true";
const nextLabels = { 1: "Generate response", 2: "Start verification", 3: "Complete verification" };
let activeRun = null;

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

function publishState() {
  const step = activeRun?.step ?? 0;
  const state = {
    type: "recomputation-state", step,
    canAdvance: Boolean(activeRun && !activeRun.busy && step < 4),
    nextLabel: nextLabels[step] ?? "Next step",
  };
  $("#advance").disabled = !state.canAdvance;
  $("#advance").setAttribute("aria-label", state.nextLabel);
  if (embedded) window.parent.postMessage(state, location.origin);
}

function setTimeline(step) {
  $("#timeline").dataset.step = String(step);
  [...$("#timeline").children].forEach((item, index) => {
    item.classList.toggle("is-reached", index < step);
    item.classList.toggle("is-current", index === step - 1);
    if (index === step - 1) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
  $("#timeline-status").textContent = step
    ? $("#timeline").children[step - 1].lastElementChild.textContent
    : "Results cleared. Choose an example to start again.";
}

function sleep(ms, signal) {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise((resolve, reject) => {
    const onAbort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
const jitter = (base, spread) => base + (Math.random() * 2 - 1) * spread;

function pausePreviousRun() {
  if (!activeRun) return;
  activeRun.controller.abort();
  if (activeRun.step < 4) for (const { card } of activeRun.entries) {
    $('[data-slot="progress"]', card).hidden = true;
    $('[data-slot="stage"]', card).textContent = "paused";
  }
}

function clearResults() {
  pausePreviousRun();
  activeRun = null;
  $("#sends").replaceChildren();
  $("#empty").hidden = false;
  $("#clear").disabled = true;
  setTimeline(0);
  publishState();
  $(".shell").scrollTop = 0;
  window.scrollTo(0, 0);
}

function send(preset) {
  pausePreviousRun();
  const run = { step: 1, busy: false, controller: new AbortController(), entries: [] };
  activeRun = run;
  $("#clear").disabled = false;
  $("#empty").hidden = true;
  const group = document.createElement("section");
  group.className = "chat-send-group";
  group.setAttribute("aria-label", "Prompt results");
  const time = new Date().toLocaleTimeString("en-GB");
  group.innerHTML = `<div class="chat-send-prompt"><span class="mono muted">${time}</span><p></p></div><div class="chat-cards"></div>`;
  $(".chat-send-prompt p", group).textContent = preset.prompt;
  $("#sends").prepend(group);
  for (const inst of INSTANCES) {
    const card = $("#card-template").content.firstElementChild.cloneNode(true);
    $('[data-slot="model"]', card).textContent = inst.key === "honest" ? "Correct model" : "Illegal model";
    $('[data-slot="stage"]', card).textContent = "message sent";
    $('[data-slot="reply"]', card).textContent = "Waiting to generate a response.";
    $('[data-slot="progress"]', card).hidden = true;
    $(".chat-cards", group).append(card);
    run.entries.push({ card, inst, outcome: preset[inst.key] });
  }
  setTimeline(1);
  publishState();
}

async function advance() {
  const run = activeRun;
  if (!run || run.busy || run.step === 4) return;
  if (run.step === 1) {
    run.busy = true;
    publishState();
    try {
      await Promise.all(run.entries.map(entry => streamResponse(entry, run.controller.signal)));
      if (activeRun !== run || run.controller.signal.aborted) return;
      run.step = 2;
    } catch (error) {
      if (!run.controller.signal.aborted) throw error;
      return;
    } finally {
      run.busy = false;
      if (activeRun === run) publishState();
    }
  } else if (run.step === 2) {
    run.step = 3;
    for (const { card } of run.entries) {
      $('[data-slot="stage"]', card).textContent = "verifying";
      $('[data-slot="progress"]', card).hidden = false;
      $('[data-slot="progress-time"]', card).hidden = true;
      $('[data-slot="progress-label"]', card).textContent = "Recomputing the answer and comparing logits";
    }
  } else {
    run.step = 4;
    for (const { card, outcome } of run.entries) {
      $('[data-slot="progress"]', card).hidden = true;
      $('[data-slot="stage"]', card).textContent = "done";
      renderResult(card, outcome);
    }
  }
  setTimeline(run.step);
  publishState();
}

async function streamResponse({ card, inst, outcome }, signal) {
  const reply = $('[data-slot="reply"]', card);
  const stage = $('[data-slot="stage"]', card);
  const progressTime = $('[data-slot="progress-time"]', card);
  $('[data-slot="progress"]', card).hidden = false;
  $('[data-slot="progress-label"]', card).textContent = "Generating answer";
  stage.textContent = "inferring";
  const started = performance.now();
  const ticker = setInterval(() => {
    progressTime.textContent = `${Math.round((performance.now() - started) / 1000)}s`;
  }, 250);
  try {
    await sleep(jitter(inst.key === "liar" ? 420 : 650, 150), signal);
    reply.textContent = "";
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
      if (next < schedule.length) await sleep(Math.max(8, schedule[next].at - (performance.now() - streamStart)), signal);
    }
    reply.scrollTop = 0;
    stage.textContent = "response generated";
    $('[data-slot="progress"]', card).hidden = true;
  } finally {
    clearInterval(ticker);
  }
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

renderExamples();
$("#clear").addEventListener("click", clearResults);
$("#advance").addEventListener("click", advance);
window.addEventListener("message", event => {
  if (!embedded || event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === "recomputation-advance") advance();
});
publishState();
