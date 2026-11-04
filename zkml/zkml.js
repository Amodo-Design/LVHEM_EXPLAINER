// Inference proof verification: the zkml version of the fake dashboard.
// Same flow and controls as fake/ (every milestone is advanced explicitly);
// the proof itself replays on an accelerated clock. Every prompt, answer,
// timing and size comes from zkml/presets.js, generated from the measured
// 2026-10-15 proof sweep. The embed protocol matches fake/, so the
// presentation can show either page.
import { EXAMPLES, META } from "./presets.js";

const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(location.search);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const embedded = window.parent !== window && document.documentElement.dataset.embed === "true";
const SPEED = Number(params.get("speed")) > 0 ? Number(params.get("speed")) : 120;
const TOKENS_PER_SECOND = 30;
const nextLabels = { 0: "Send example 1", 1: "Generate response", 2: "Generate proof", 3: "Verify proof" };
const PHASE_SHORT = { accept: "checking", commit: "commit", forward: "forward", prove: "proving", selfverify: "self-check" };
let activeRun = null;

const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const fmtMin = (s) => `${Math.round(s / 60)} min`;
const fmtGB = (b) => `${(b / 1e9).toFixed(2)} GB`;

function renderExamples() {
  EXAMPLES.forEach((ex, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "example-button";
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `Example ${index + 1}: ${ex.question}`);
    button.title = ex.question;
    button.addEventListener("click", () => send(ex));
    $("#examples").append(button);
  });
}

function publishState() {
  const step = activeRun?.step ?? 0;
  const proving = activeRun?.busy && step === 2;
  const state = {
    type: "recomputation-state", step,
    canAdvance: !activeRun || ((!activeRun.busy || proving) && step < 4),
    nextLabel: proving ? "Skip ahead" : nextLabels[step] ?? "Next step",
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
    : "Results cleared. Use the forward arrow to send example 1, or choose another example.";
}

function sleep(ms, signal) {
  if (signal.aborted) return Promise.reject(signal.reason);
  return new Promise((resolve, reject) => {
    const onAbort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", onAbort); resolve(); }, reduced ? Math.min(ms, 50) : ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

// ---------- the system card ----------
function layer(run, key, state, value) {
  const row = $(`[data-layer="${key}"]`, run.system);
  row.dataset.state = state;
  if (value != null) $(".layer-value", row).textContent = value;
}
function systemStage(run, text) { $('[data-slot="system-stage"]', run.system).textContent = text; }
function settle(run, ...keys) { for (const key of keys) { const row = $(`[data-layer="${key}"]`, run.system); if (row.dataset.state === "active") row.dataset.state = "done"; } }

// ---------- runs ----------
function pausePreviousRun() {
  if (!activeRun) return;
  activeRun.controller.abort();
  if (activeRun.step < 4) {
    $('[data-slot="progress"]', activeRun.card).hidden = true;
    $('[data-slot="stage"]', activeRun.card).textContent = "paused";
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
  window.scrollTo(0, 0);
}

function send(ex) {
  pausePreviousRun();
  const run = { ex, step: 1, busy: false, controller: new AbortController(), skip: false };
  activeRun = run;
  $("#clear").disabled = false;
  $("#empty").hidden = true;
  const group = document.createElement("section");
  group.className = "chat-send-group";
  group.setAttribute("aria-label", "Prompt results");
  const time = new Date().toLocaleTimeString("en-GB");
  group.innerHTML = `<div class="chat-send-prompt"><span class="mono muted">${time}</span><p></p></div><details class="zk-passage"><summary>Passage</summary><p></p></details><div class="chat-cards"></div>`;
  $(".chat-send-prompt p", group).textContent = ex.question;
  $(".zk-passage p", group).textContent = ex.passage;
  const card = $("#card-template").content.firstElementChild.cloneNode(true);
  $('[data-slot="model"]', card).textContent = META.model;
  $('[data-slot="reply"]', card).textContent = "Waiting to generate a response.";
  const system = $("#system-template").content.firstElementChild.cloneNode(true);
  $(".chat-cards", group).append(card, system);
  $("#sends").prepend(group);
  Object.assign(run, { card, system });
  layer(run, "tap", "active", "forwarding");
  systemStage(run, "capturing");
  setTimeline(1);
  publishState();
}

async function advance() {
  const run = activeRun;
  if (!run) { send(EXAMPLES[0]); return; }
  if (run.busy && run.step === 2) { run.skip = true; return; }
  if (run.busy || run.step === 4) return;
  run.busy = true;
  publishState();
  try {
    if (run.step === 1) await generate(run);
    else if (run.step === 2) await prove(run);
    else await verify(run);
    if (activeRun !== run || run.controller.signal.aborted) return;
    run.step += 1;
  } catch (error) {
    if (!run.controller.signal.aborted) throw error;
    return;
  } finally {
    run.busy = false;
    if (activeRun === run) publishState();
  }
  setTimeline(run.step);
  publishState();
}

async function generate(run) {
  const { card, ex } = run;
  const signal = run.controller.signal;
  const reply = $('[data-slot="reply"]', card);
  $('[data-slot="stage"]', card).textContent = "inferring";
  layer(run, "model", "active", "answering");
  await sleep(500, signal);
  reply.textContent = "";
  const per = 1000 / TOKENS_PER_SECOND;
  for (let i = 0; i < ex.answer_tokens.length; i++) {
    reply.textContent += ex.answer_tokens[i];
    if (!reduced) await sleep(per * (0.65 + Math.random() * 0.7), signal);
  }
  reply.scrollTop = 0;
  $('[data-slot="stage"]', card).textContent = "response generated";
  layer(run, "model", "done", `${ex.n_response} tokens`);
  layer(run, "tap", "done", `${ex.n_prompt + ex.n_response} ids`);
  layer(run, "ledger", "active", "1 event");
  await sleep(500, signal);
  settle(run, "ledger");
  systemStage(run, "captured");
}

async function prove(run) {
  const { card, ex } = run;
  const signal = run.controller.signal;
  const progress = $('[data-slot="progress"]', card);
  const label = $('[data-slot="progress-label"]', card);
  const clock = $('[data-slot="progress-time"]', card);
  $('[data-slot="stage"]', card).textContent = "proving";
  progress.hidden = false;
  label.textContent = "Requesting a proof";
  clock.textContent = "00:00";
  systemStage(run, "proving");
  const hop = async (key, value, after) => { layer(run, key, "active", value); if (!run.skip) await sleep(650, signal); layer(run, key, "done", after ?? value); };
  await hop("orchestrator", "picked");
  await hop("verifier", "request", "waiting");
  layer(run, "prover", "active", "queued");
  if (!run.skip) await sleep(500, signal);
  layer(run, "prover", "active", "proving");
  label.textContent = "Generating the proof with zkml";
  let elapsed = 0;
  for (const phase of ex.phases) {
    layer(run, "zkml", "active", PHASE_SHORT[phase.key] || phase.key);
    const start = elapsed;
    const ms = (phase.seconds * 1000) / SPEED;
    const t0 = performance.now();
    while (!run.skip && !reduced) {
      const f = Math.min(1, (performance.now() - t0) / ms);
      elapsed = start + phase.seconds * f;
      clock.textContent = fmtClock(elapsed);
      if (f >= 1) break;
      await sleep(80, signal);
    }
    elapsed = start + phase.seconds;
    clock.textContent = fmtClock(elapsed);
  }
  layer(run, "zkml", "done", fmtGB(ex.proof_bytes));
  layer(run, "prover", "done", "done");
  progress.hidden = true;
  $('[data-slot="stage"]', card).textContent = `proof ready · ${fmtClock(elapsed)}`;
  systemStage(run, "proof ready");
  run.skip = false;
}

async function verify(run) {
  const { card, ex } = run;
  const signal = run.controller.signal;
  const progress = $('[data-slot="progress"]', card);
  $('[data-slot="stage"]', card).textContent = "verifying";
  progress.hidden = false;
  $('[data-slot="progress-label"]', card).textContent = "Checking the proof without the weights";
  $('[data-slot="progress-time"]', card).textContent = "";
  layer(run, "verifier", "active", "checking");
  systemStage(run, "verifying");
  await sleep(1400, signal);
  layer(run, "verifier", "done", "pass");
  layer(run, "ledger", "done", "pass");
  progress.hidden = true;
  $('[data-slot="stage"]', card).textContent = "done";
  systemStage(run, "done");
  renderResult(card, ex);
}

function renderResult(card, ex) {
  const section = $('[data-slot="result"]', card);
  section.hidden = false;
  section.classList.add("chat-result-pass");
  card.classList.add("chat-card-pass");
  $('[data-slot="verdict"]', card).classList.add("chat-verdict-pass");
  $('[data-slot="verdict-label"]', card).textContent = "pass";
  $('[data-slot="tokens"]', card).textContent = `${ex.n_response} / ${ex.n_response}`;
  $('[data-slot="size"]', card).textContent = fmtGB(ex.proof_bytes);
  $('[data-slot="size-hint"]', card).textContent = `${fmtMin(ex.job_wall_s)} on one H100`;
}

renderExamples();
$("#clear").addEventListener("click", clearResults);
$("#advance").addEventListener("click", advance);
window.addEventListener("message", (event) => {
  if (!embedded || event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === "recomputation-advance") advance();
});
publishState();
