// Inference proof verification: the zkml version of the fake dashboard.
// Same flow and controls as fake/ (every milestone is advanced explicitly).
// Beside the chat, a small map of the system shows the chat travelling:
// it lands on the ledger, goes from the ledger to the orchestrator and the
// verifier, down to the prover and zkml, and the proof and verdict come back.
// Every prompt, answer, timing and size comes from zkml/presets.js, generated
// from the measured 2026-10-15 proof sweep. The embed protocol matches fake/,
// so the presentation can show either page.
import { EXAMPLES, META } from "./presets.js";

const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(location.search);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const embedded = window.parent !== window && document.documentElement.dataset.embed === "true";
const SPEED = Number(params.get("speed")) > 0 ? Number(params.get("speed")) : 120;
const TOKENS_PER_SECOND = 30;
const FLIGHT_MS = 850;
const nextLabels = { 0: "Send example 1", 1: "Generate response", 2: "Generate proof", 3: "Verify proof" };
const PHASE_SHORT = { accept: "checking", commit: "commit", forward: "forward", prove: "proving", selfverify: "self-check" };
const EDGES = [["chat", "tap"], ["tap", "model"], ["tap", "ledger"], ["ledger", "orchestrator"], ["orchestrator", "verifier"],
  ["ledger", "verifier"], ["verifier", "prover"], ["prover", "zkml"], ["ledger", "chat"]];
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
  const skippable = activeRun?.busy && step === 2;
  const state = {
    type: "recomputation-state", step,
    canAdvance: !activeRun || ((!activeRun.busy || skippable) && step < 4),
    nextLabel: skippable ? "Skip ahead" : nextLabels[step] ?? "Next step",
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

// ---------- the system map ----------
const nodeEl = (run, key) => $(`[data-node="${key}"]`, run.net);
function centre(run, key) {
  const box = run.net.getBoundingClientRect();
  const r = nodeEl(run, key).getBoundingClientRect();
  return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
}
function edgeEl(run, a, b) { return $(`[data-edge="${[a, b].sort().join("-")}"]`, run.net); }

function drawEdges(run) {
  const svg = $(".edges", run.net);
  const { width, height } = run.net.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren(...EDGES.map(([a, b]) => {
    const pa = centre(run, a), pb = centre(run, b);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    for (const [k, v] of Object.entries({ x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y })) line.setAttribute(k, v.toFixed(1));
    line.dataset.edge = [a, b].sort().join("-");
    return line;
  }));
}

function setNode(run, key, state, value) {
  const node = nodeEl(run, key);
  node.dataset.state = state;
  const small = $("small", node);
  if (small && value != null) small.textContent = value;
}

function landRow(run, text, kind) {
  const li = document.createElement("li");
  li.className = `ledger-row ledger-row-${kind}`;
  li.textContent = text;
  $(".ledger-rows", run.net).append(li);
}

// A labelled packet travels from one component to another along their link.
async function fly(run, from, to, label, kind = "amodo") {
  const signal = run.controller.signal;
  if (signal.aborted) throw signal.reason;
  const edge = edgeEl(run, from, to);
  const hit = () => {
    const node = nodeEl(run, to);
    node.classList.remove("is-hit");
    void node.offsetWidth;
    node.classList.add("is-hit");
  };
  if (reduced || run.skip) { hit(); return; }
  const packet = document.createElement("span");
  packet.className = `packet packet-${kind}`;
  packet.textContent = label;
  run.net.append(packet);
  const w = packet.offsetWidth, h = packet.offsetHeight;
  const a = centre(run, from), b = centre(run, to);
  const at = (p) => `translate(${p.x - w / 2}px, ${p.y - h / 2}px)`;
  edge?.classList.add("is-active");
  const anim = packet.animate([
    { transform: at(a), opacity: 0 }, { transform: at(a), opacity: 1, offset: 0.12 },
    { transform: at(b), opacity: 1, offset: 0.9 }, { transform: at(b), opacity: 0 },
  ], { duration: FLIGHT_MS, easing: "ease-in-out", fill: "forwards" });
  const onAbort = () => anim.cancel();
  signal.addEventListener("abort", onAbort, { once: true });
  await anim.finished.catch(() => {});
  signal.removeEventListener("abort", onAbort);
  packet.remove();
  edge?.classList.remove("is-active");
  if (signal.aborted) throw signal.reason;
  hit();
}

function systemStage(run, text) { $('[data-slot="system-stage"]', run.system).textContent = text; }

// ---------- runs ----------
function pausePreviousRun() {
  if (!activeRun) return;
  activeRun.controller.abort();
  activeRun.observer?.disconnect();
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
  const run = { ex, step: 1, busy: true, controller: new AbortController(), skip: false };
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
  Object.assign(run, { card, system, net: $('[data-slot="net"]', system) });
  drawEdges(run);
  run.observer = new ResizeObserver(() => drawEdges(run));
  run.observer.observe(run.net);
  setTimeline(1);
  publishState();
  sendPrompt(run);
}

async function sendPrompt(run) {
  try {
    setNode(run, "chat", "active", "sent");
    systemStage(run, "sending");
    await fly(run, "chat", "tap", "prompt");
    setNode(run, "chat", "done");
    setNode(run, "tap", "active", "forwarding");
    await fly(run, "tap", "model", "prompt", "data");
    setNode(run, "model", "active", "ready");
    systemStage(run, "at the model");
  } catch (error) {
    if (!run.controller.signal.aborted) throw error;
    return;
  } finally {
    run.busy = false;
    if (activeRun === run) publishState();
  }
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
  setNode(run, "model", "active", "answering");
  systemStage(run, "answering");
  await fly(run, "model", "tap", "answer", "data");
  await fly(run, "tap", "chat", "answer", "data");
  setNode(run, "chat", "active", "answer");
  reply.textContent = "";
  const per = 1000 / TOKENS_PER_SECOND;
  for (const token of ex.answer_tokens) {
    reply.textContent += token;
    if (!reduced) await sleep(per * (0.65 + Math.random() * 0.7), signal);
  }
  reply.scrollTop = 0;
  $('[data-slot="stage"]', card).textContent = "response generated";
  setNode(run, "model", "done", `${ex.n_response} tokens`);
  setNode(run, "chat", "done");
  // The tap's copy lands on the ledger.
  setNode(run, "tap", "active", "copying");
  systemStage(run, "recording");
  await fly(run, "tap", "ledger", `${ex.n_prompt + ex.n_response} ids`);
  setNode(run, "tap", "done", "copied");
  landRow(run, "inference_event", "event");
  setNode(run, "ledger", "done");
  systemStage(run, "recorded");
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
  clock.textContent = "";
  systemStage(run, "requesting");
  await fly(run, "ledger", "orchestrator", "new event");
  setNode(run, "orchestrator", "active", "picked");
  await fly(run, "orchestrator", "verifier", "verify");
  setNode(run, "orchestrator", "done");
  setNode(run, "verifier", "active", "requesting");
  await fly(run, "ledger", "verifier", "commitment");
  await fly(run, "verifier", "prover", "token ids");
  setNode(run, "verifier", "done", "waiting");
  setNode(run, "prover", "active", "job");
  await fly(run, "prover", "zkml", "prove", "gpai");
  setNode(run, "prover", "active", "proving");
  systemStage(run, "proving");
  label.textContent = "Generating the proof with zkml";
  let elapsed = 0;
  for (const phase of ex.phases) {
    const start = elapsed;
    const ms = (phase.seconds * 1000) / SPEED;
    const t0 = performance.now();
    while (!run.skip && !reduced) {
      const f = Math.min(1, (performance.now() - t0) / ms);
      elapsed = start + phase.seconds * f;
      clock.textContent = fmtClock(elapsed);
      setNode(run, "zkml", "active", `${PHASE_SHORT[phase.key] || phase.key} ${fmtClock(elapsed)}`);
      if (f >= 1) break;
      await sleep(80, signal);
    }
    elapsed = start + phase.seconds;
  }
  clock.textContent = fmtClock(elapsed);
  run.skip = false;
  setNode(run, "zkml", "done", fmtGB(ex.proof_bytes));
  label.textContent = "Returning the proof";
  await fly(run, "zkml", "prover", "proof", "gpai");
  setNode(run, "prover", "done", "done");
  await fly(run, "prover", "verifier", fmtGB(ex.proof_bytes), "gpai");
  setNode(run, "verifier", "active", "proof in");
  progress.hidden = true;
  $('[data-slot="stage"]', card).textContent = `proof ready · ${fmtClock(elapsed)}`;
  systemStage(run, "proof ready");
}

async function verify(run) {
  const { card, ex } = run;
  const signal = run.controller.signal;
  const progress = $('[data-slot="progress"]', card);
  $('[data-slot="stage"]', card).textContent = "verifying";
  progress.hidden = false;
  $('[data-slot="progress-label"]', card).textContent = "Checking the proof without the weights";
  $('[data-slot="progress-time"]', card).textContent = "";
  setNode(run, "verifier", "active", "checking");
  systemStage(run, "verifying");
  await sleep(1300, signal);
  setNode(run, "verifier", "done", "pass");
  await fly(run, "verifier", "ledger", "pass", "pass");
  landRow(run, "verification_event · pass", "pass");
  await fly(run, "ledger", "chat", "verdict", "pass");
  setNode(run, "chat", "done", "pass");
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
