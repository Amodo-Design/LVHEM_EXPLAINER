// zkml verification console: send one prompt and operate the system that
// proves it. The chat is the dashboard; the stack is the real components,
// split by who holds the weights; the inspector shows each component's own
// interface (the tap message, ledger rows, POST /proofs, the job, /health).
//
// Every prompt, answer, id, timestamp, timing and size comes from
// zkml/presets.js, generated from the measured 2026-10-15 proof sweep.
// Values the sweep did not record are shown as ‹placeholders›.
import { EXAMPLES, META } from "./presets.js";

const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(location.search);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function el(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) node.append(kid instanceof Node ? kid : String(kid));
  return node;
}

// ---------- formatting ----------
const fmtS = (s) => (s < 60 ? `${Math.round(s)} s` : `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")} s`);
const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const fmtGB = (b) => `${(b / 1e9).toFixed(2)} GB`;
const fmtBytes = (b) => b.toLocaleString("en-GB");
const shortDigest = (d) => (d ? d.replace(/^(sha256:)(.{8}).*(.{4})$/, "$1$2…$3") : "‹digest›");
const OWNER = { amodo: "Amodo", gpai: "GPAI · zkml", both: "Amodo + GPAI", lab: "the model being checked", hw: "hardware" };

// A tiny JSON printer: long id arrays are elided with their count, and
// ‹placeholders› (values the sweep did not record) are marked.
const ids = (arr) => ({ __ids: arr });
function jsonText(v, ind = "") {
  if (v && v.__ids) {
    const a = v.__ids;
    return a.length <= 8 ? `[${a.join(", ")}]` : `[${a.slice(0, 6).join(", ")}, …, ${a[a.length - 1]}]  /* ${a.length} ids */`;
  }
  if (Array.isArray(v)) return `[${v.map((x) => jsonText(x, ind)).join(", ")}]`;
  if (v && typeof v === "object") {
    const inner = ind + "  ";
    const lines = Object.entries(v).map(([k, x]) => `${inner}"${k}": ${jsonText(x, inner)}`);
    return lines.length ? `{\n${lines.join(",\n")}\n${ind}}` : "{}";
  }
  return typeof v === "string" ? JSON.stringify(v) : String(v);
}
function code(title, obj) {
  const pre = el("pre", { class: "json" });
  pre.textContent = typeof obj === "string" ? obj : jsonText(obj);
  return el("figure", { class: "codeblock" }, el("figcaption", { text: title }), pre);
}
const PH = (what) => `‹${what}›`;

// ---------- the system ----------
const ZONES = [
  { key: "you", label: "You" },
  { key: "verifier", label: "Verifier side", sub: "never holds the weights" },
  { key: "prover", label: "Prover box", sub: "the weights live here" },
];
const LAYERS = [
  { key: "dashboard", zone: "you", name: "Dashboard", code: "inf-ver-ui-gov", owner: "amodo" },
  { key: "ledger", zone: "verifier", name: "Ledger", code: "message-writer · ledger", owner: "amodo" },
  { key: "orchestrator", zone: "verifier", name: "Orchestrator", code: "zk-orchestrator", owner: "amodo" },
  { key: "verifier", zone: "verifier", name: "Verifier", code: "zk-verifier + zkml verifier", owner: "both" },
  { key: "tap", zone: "prover", name: "Network tap", code: "inf-proxy", owner: "amodo" },
  { key: "model", zone: "prover", name: "Model server", code: `vLLM · ${META.model}`, owner: "lab" },
  { key: "prover", zone: "prover", name: "Prover service", code: "zk-prover", owner: "amodo" },
  { key: "zkml", zone: "prover", name: "zkml", code: "proof library", owner: "gpai" },
  { key: "gpu", zone: "prover", name: "GPU", code: META.hardware, owner: "hw" },
];

const VERIFY = META.verifier_reference;
const TOKENS_PER_SECOND = 28;

function buildSteps(ex) {
  const ph = Object.fromEntries(ex.phases.map((p) => [p.key, p]));
  const n = ex.n_prompt + ex.n_response;
  return [
    { key: "send", layer: "dashboard", owner: "amodo", dir: "down", hold: 1300, title: "You send the prompt",
      says: "The dashboard sends your chat towards the model, tagged with a chat id so it can find the verdict later." },
    { key: "forward", layer: "tap", owner: "amodo", dir: "down", hold: 1300, title: "The tap forwards it",
      says: "inf-proxy passes the request to the model server unchanged, except that it asks for the token ids back." },
    { key: "generate", layer: "model", owner: "lab", dir: "up", hold: 500, stream: true, title: "The model answers",
      says: "vLLM generates the answer and the tap streams it back to you. Nothing about this is slowed down by verification." },
    { key: "capture", layer: "tap", owner: "amodo", dir: "side", hold: 1400, title: "The tap copies the exchange",
      says: `inf-proxy posts the tap message to message-writer: the text plus the exact ${n} token ids that went in and came out.` },
    { key: "record_inference", layer: "ledger", owner: "amodo", hold: 1400, title: "The ledger records it",
      says: "message-writer works out which model this host is serving and writes one inference_event row." },
    { key: "orchestrate", layer: "orchestrator", owner: "amodo", hold: 1400, title: "The orchestrator picks it",
      says: "The verifier is idle, so the orchestrator hands it the newest unverified chat: POST /verifications." },
    { key: "request", layer: "verifier", owner: "amodo", dir: "down", hold: 1500, title: "The verifier asks for a proof",
      says: "zk-verifier reads the model's current zkml commitment from the ledger and sends POST /proofs with the token ids. No weights, no checkpoint." },
    { key: "checks", layer: "prover", owner: "amodo", hold: 1400, title: "The prover checks the request",
      says: "zk-prover confirms the proof system, that the commitment is its current one, and that its loaded checkpoint is the one that commitment was made from. Job queued." },
    { key: "accept", layer: "zkml", also: ["prover"], owner: "both", seconds: ph.accept.seconds, hold: 300, proofClock: true, title: "Is this the model's own answer?",
      says: "zkml runs the model on the captured tokens first. The answer must be exactly the model's own greedy continuation, or nothing is proved." },
    { key: "commit", layer: "zkml", also: ["gpu"], owner: "gpai", seconds: ph.commit.seconds, hold: 300, proofClock: true, title: "Commit to the weights",
      says: "zkml commits to the weights for this proof. They stay hidden; only the commitment is public." },
    { key: "forward_pass", layer: "zkml", also: ["gpu"], owner: "gpai", seconds: ph.forward.seconds, hold: 300, proofClock: true, title: "Run the model, recorded",
      says: `zkml runs ${META.model} over the ${ex.window}-token window in fp8 on the GPU and keeps every value it will have to prove.` },
    { key: "prove", layer: "zkml", also: ["gpu"], owner: "gpai", seconds: ph.prove.seconds, hold: 300, proofClock: true, title: "Prove",
      says: `zkml proves that computation, layer by layer, and that each of the ${ex.n_response} answer tokens was the model's top choice. This is most of the time.` },
    { key: "selfverify", layer: "zkml", also: ["gpu"], owner: "gpai", seconds: ph.selfverify.seconds, hold: 300, proofClock: true, title: "zkml checks its own proof",
      says: "Before handing it over, zkml verifies the proof it just made." },
    { key: "fetch", layer: "prover", also: ["verifier"], owner: "amodo", dir: "up", hold: 1600, title: "The proof goes back",
      says: `zk-prover tells the verifier the job is done. The verifier reads the job and downloads the ${fmtGB(ex.proof_bytes)} proof, checking its digest.` },
    { key: "verify", layer: "verifier", owner: "both", seconds: VERIFY.seconds, hold: 400, proofClock: true, reference: true, title: "The verifier checks the proof",
      says: "zk-verifier runs zkml's verifier against the commitment it holds, with your prompt and the answer pinned. It never loads the model." },
    { key: "record_verdict", layer: "ledger", owner: "amodo", dir: "up", hold: 1300, title: "The verdict is recorded",
      says: "zk-verifier writes verification_event and its zkml extension row: pass, bound." },
    { key: "show", layer: "dashboard", owner: "amodo", dir: "up", hold: 1000, title: "You see the verdict",
      says: "The dashboard finds the verdict by chat id and shows it beside the answer." },
  ];
}

// ---------- run state ----------
let speed = [1, 50, 200].includes(Number(params.get("speed"))) ? Number(params.get("speed")) : 50;
let mode = params.get("mode") === "step" ? "step" : "auto";
let selected = Math.max(0, EXAMPLES.findIndex((e) => e.id === params.get("example")));
let run = null;
let pinned = null; // a layer the viewer clicked; otherwise the inspector follows the action
let inspectorKey = null;
let inspectorStep = -2;
let live = [];

function newRun(ex) {
  return { ex, steps: buildSteps(ex), index: 0, frac: 0, shown: 0, waiting: false, paused: false, done: false, last: performance.now(), raf: 0, log: [] };
}
const stepAt = (r, key) => r.steps.findIndex((s) => s.key === key);
const reached = (key) => run && (run.done || run.index > stepAt(run, key));
const atOrPast = (key) => run && (run.done || run.index >= stepAt(run, key));
const current = () => (run && !run.done ? run.steps[run.index] : null);

function stepMs(step) {
  if (step.stream) return (run.ex.answer_tokens.length / TOKENS_PER_SECOND) * 1000 + step.hold;
  return (reduced ? 0.3 : 1) * step.hold + ((step.seconds || 0) * 1000) / speed;
}

function start(index) {
  if (run) cancelAnimationFrame(run.raf);
  run = newRun(EXAMPLES[index]);
  pinned = null;
  renderThread();
  $("#events").replaceChildren();
  logStep(run.steps[0]);
  announce(run.steps[0].title);
  run.last = performance.now();
  run.raf = requestAnimationFrame(tick);
  refresh(true);
}

function tick(now) {
  if (!run) return;
  const dt = Math.min(250, now - run.last);
  run.last = now;
  if (!run.paused && !run.waiting && !run.done) advance(dt);
  refresh(false);
  if (!run.done) run.raf = requestAnimationFrame(tick);
}

function advance(dt) {
  let budget = dt;
  while (budget > 0 && !run.done && !run.waiting) {
    const step = run.steps[run.index];
    const total = stepMs(step);
    const left = (1 - run.frac) * total;
    if (budget >= left) {
      budget -= left;
      completeStep();
    } else {
      run.frac += budget / total;
      budget = 0;
      if (step.stream) run.shown = Math.min(run.ex.answer_tokens.length, ((run.frac * total) / 1000) * TOKENS_PER_SECOND);
    }
  }
}

function completeStep() {
  const step = run.steps[run.index];
  if (step.stream) run.shown = run.ex.answer_tokens.length;
  run.index += 1;
  run.frac = 0;
  if (run.index >= run.steps.length) {
    run.done = true;
    announce(`Verified. Pass, bound. ${fmtGB(run.ex.proof_bytes)} proof.`);
    return;
  }
  logStep(run.steps[run.index]);
  if (mode === "step") run.waiting = true;
  else announce(run.steps[run.index].title);
}

function nextStep() {
  if (!run) return start(selected);
  if (run.waiting) {
    run.waiting = false;
    announce(run.steps[run.index].title);
  } else if (!run.done) {
    completeStep();
    run.waiting = false;
  }
  refresh(true);
}

function skipToVerdict() {
  if (!run) start(selected);
  while (!run.done) completeStep();
  run.waiting = false;
  run.shown = run.ex.answer_tokens.length;
  refresh(true);
}

function proofClock() {
  if (!run) return 0;
  let s = 0;
  run.steps.forEach((step, i) => {
    if (!step.seconds) return;
    if (run.done || i < run.index) s += step.seconds;
    else if (i === run.index) s += step.seconds * run.frac;
  });
  return s;
}

function logStep(step) {
  const t = proofClock();
  run.log.push({ step, t });
  const item = el("li", { class: `event event-${step.owner}` },
    el("span", { class: "event-t", text: step.proofClock || reached("checks") ? `+${fmtClock(t)}` : "—" }),
    el("span", { class: "event-title", text: step.title }),
    ownerTag(step.owner));
  $("#events").append(item);
  $("#events-count").textContent = `(${run.log.length})`;
}

// ---------- layer status lines ----------
function layerState(key) {
  if (!run) return "idle";
  const step = current();
  if (step && (step.layer === key || (step.also || []).includes(key))) return "active";
  const touched = run.steps.some((s, i) => (i < run.index || run.done) && (s.layer === key || (s.also || []).includes(key)));
  return touched ? "done" : "idle";
}

function verificationState() {
  if (!atOrPast("orchestrate")) return null;
  if (!atOrPast("request")) return "queued";
  if (!atOrPast("checks")) return "requesting_proof";
  if (!atOrPast("fetch")) return "awaiting_proof";
  if (!atOrPast("verify")) return "downloading";
  if (!reached("verify")) return "verifying";
  return "done";
}
function jobState() {
  if (!atOrPast("checks")) return null;
  if (!atOrPast("accept")) return "queued";
  if (!reached("selfverify")) return "proving";
  return "done";
}
const proofsRemaining = () => run.ex.openings_budget - run.ex.openings_used + (reached("selfverify") ? 0 : 1);

function layerStatus(key) {
  const ex = run ? run.ex : EXAMPLES[selected];
  const step = current();
  switch (key) {
    case "dashboard": return !run ? "ready" : reached("show") ? "verdict shown: pass" : reached("send") ? "waiting for the verdict" : "sending";
    case "ledger": return !run || !reached("record_inference") ? "no rows for this chat yet" : reached("record_verdict") ? "verdict: pass" : "inference_event written";
    case "orchestrator": return !run || !atOrPast("orchestrate") ? "watching for unverified chats" : reached("orchestrate") ? "handed over 1 chat" : "verifier idle → handing over";
    case "verifier": { const s = run && verificationState(); return s ? (s === "done" ? "done · pass" : s) : "idle"; }
    case "tap": return !run ? "listening" : reached("capture") ? `copied ${ex.n_prompt + ex.n_response} token ids` : atOrPast("capture") ? "copying the exchange" : "forwarding";
    case "model": return !run ? "serving" : step && step.key === "generate" ? `generating · ${Math.floor(run.shown)}/${ex.n_response} tokens` : reached("generate") ? `answered · ${ex.n_response} tokens` : "serving";
    case "prover": { const j = run && jobState(); return j ? `job ${j}` : `ready · ${run ? proofsRemaining() : ex.openings_budget - ex.openings_used + 1} proofs left`; }
    case "zkml": return run && step && step.layer === "zkml" ? step.title : run && reached("selfverify") ? `proof · ${fmtGB(ex.proof_bytes)}` : "idle";
    case "gpu": return layerState("gpu") === "active" ? `proving · ${(ex.gpu_peak_mib / 1024).toFixed(1)} GiB peak` : "idle";
  }
  return "";
}
function ownerTag(owner) { return el("span", { class: `owner owner-${owner}`, text: OWNER[owner] }); }

// ---------- rendering: stack ----------
function renderStack() {
  const stack = $("#stack");
  stack.replaceChildren();
  for (const zone of ZONES) {
    const group = el("div", { class: `zone zone-${zone.key}` },
      el("div", { class: "zone-label" }, el("strong", { text: zone.label }), zone.sub ? el("span", { text: zone.sub }) : null));
    for (const layer of LAYERS.filter((l) => l.zone === zone.key)) {
      group.append(el("button", { type: "button", class: `layer layer-${layer.owner}`, "data-layer": layer.key, "aria-pressed": "false", onclick: () => pin(layer.key) },
        el("span", { class: "layer-dot", "aria-hidden": "true" }),
        el("span", { class: "layer-main" },
          el("span", { class: "layer-name" }, el("strong", { text: layer.name }), el("span", { class: "layer-code", text: layer.code })),
          el("span", { class: "layer-status", "data-slot": "status" })),
        el("span", { class: "layer-dir", "data-slot": "dir", "aria-hidden": "true" })));
    }
    stack.append(group);
  }
}

function updateStack() {
  const step = current();
  for (const node of document.querySelectorAll(".layer")) {
    const key = node.dataset.layer;
    node.dataset.state = layerState(key);
    node.setAttribute("aria-pressed", String(key === inspectorKey));
    $('[data-slot="status"]', node).textContent = layerStatus(key);
    const dir = step && step.layer === key && step.dir ? { down: "↓", up: "↑", side: "→" }[step.dir] : "";
    $('[data-slot="dir"]', node).textContent = dir;
  }
}

function pin(key) {
  pinned = pinned === key ? null : key;
  refresh(true);
}

// ---------- rendering: now bar, controls, clock ----------
function renderNow() {
  const now = $("#now");
  if (!run) {
    now.replaceChildren(el("p", { class: "now-step", text: "Ready" }), el("p", { class: "now-title", text: "Send a prompt to start" }),
      el("p", { class: "now-says", text: "Every box below is a real component. Click any of them to see what it holds." }));
    return;
  }
  if (run.done) {
    now.replaceChildren(el("p", { class: "now-step", text: `Done · ${run.steps.length} steps` }),
      el("p", { class: "now-title" }, el("span", { class: "verdict", text: "PASS · bound" }), " This answer is this model's, on this prompt."),
      el("p", { class: "now-says", text: `Proved by zkml (GPAI) inside Amodo's system: ${fmtGB(run.ex.proof_bytes)}, ${fmtS(run.ex.job_wall_s)} on the H100, checked without the weights.` }));
    return;
  }
  const step = current();
  now.replaceChildren(
    el("p", { class: "now-step" }, `Step ${run.index + 1} of ${run.steps.length}`, ownerTag(step.owner), run.waiting ? el("span", { class: "now-wait", text: "waiting for you" }) : null),
    el("p", { class: "now-title", text: step.title }),
    el("p", { class: "now-says", text: step.says + (step.reference ? ` (${VERIFY.seconds} s is the time measured for a ${VERIFY.window}-window proof on ${VERIFY.date}, ${VERIFY.where}.)` : "") }));
}

function updateControls() {
  for (const b of document.querySelectorAll("[data-mode]")) b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
  for (const b of document.querySelectorAll("[data-speed]")) b.setAttribute("aria-pressed", String(Number(b.dataset.speed) === speed));
  const next = $("#next-step");
  next.hidden = mode !== "step" || (run && run.done);
  const upcoming = !run ? EXAMPLES.length && "Send" : run.waiting ? run.steps[run.index].title : run.steps[run.index + 1]?.title;
  next.textContent = !run ? "Next: send the prompt" : `Next: ${upcoming || "finish"}`;
  $("#pause").hidden = mode === "step" || !run || run.done;
  $("#pause").textContent = run && run.paused ? "Resume" : "Pause";
  $("#skip").disabled = Boolean(run && run.done);
}

function updateClock() {
  const t = proofClock();
  const label = !run ? "proof clock" : run.done ? "measured · proof + verify" : `proof clock · ${speed === 1 ? "real time" : `${speed}× replay`}`;
  $("#clock").replaceChildren(el("span", { class: "clock-label", text: label }), el("strong", { text: fmtClock(t) }));
}

// ---------- rendering: inspector ----------
const ABOUT = {
  dashboard: "The chat you are using. It sends prompts through the tap, then polls the ledger by chat id until a verdict arrives.",
  ledger: "The record of every captured chat and every verification. Rows are written once. Model identity is derived from the model's name.",
  orchestrator: "A small loop with no web server. Whenever the verifier is idle it hands over the newest unverified chat of a model that isn't paused. The strategy is pluggable.",
  verifier: "Amodo's verifier service, weight-blind by design: it holds the model's public commitment, never the model. It drives the proof request and runs GPAI's zkml verifier on the result.",
  tap: "A software stand-in for a hardware network tap. It forwards traffic untouched (it only asks for token ids back) and copies each finished exchange to message-writer.",
  model: "The model under test, served by vLLM on the prover box. Not built by us: it is what the proof checks.",
  prover: "Amodo's prover service: a thin networking layer around the zkml library. It checks each request, runs the job on the GPU, keeps the commitment's opening budget and serves the proof file.",
  zkml: "GPAI's proof library, by Pierre Peigné. It turns one forward pass of the model into a zero-knowledge proof over weights it never reveals, and verifies such proofs without them.",
  gpu: "One NVIDIA H100 80 GB on the prover box (amodo-cray1). zkml's CUDA kernels do the heavy lifting.",
};

function inspectorBody(key) {
  const ex = run ? run.ex : EXAMPLES[selected];
  const prompt = `${ex.instruction}\n\nPassage: ${ex.passage}\n\nQuestion: ${ex.question}`;
  const short = prompt.length > 90 ? `${prompt.slice(0, 88)}…` : prompt;
  const parts = [];
  const pending = (text) => el("p", { class: "pending", text });
  switch (key) {
    case "dashboard":
      if (!run) { parts.push(pending("Nothing sent yet.")); break; }
      parts.push(code("POST /v1/chat/completions  (to the tap)", { model: META.model, messages: [{ role: "user", content: short }], "X-OpenWebUI-Chat-Id": PH("chat id") }));
      if (reached("send")) parts.push(code("Polling the ledger by chat id", [
        `GET /inference-events/unverified/view?session_id=${PH("chat id")}&limit=1`,
        `→ ${!reached("record_inference") ? "nothing yet" : reached("record_verdict") ? "gone: it has a verdict" : "1 event, waiting to be proved"}`,
        `GET /verification-events/view?session_id=${PH("chat id")}&limit=1`,
        `→ ${reached("record_verdict") ? "1 row · result: pass" : "no verdict yet"}`,
      ].join("\n")));
      break;
    case "tap":
      if (!run) { parts.push(pending("Listening for chats.")); break; }
      parts.push(code("Forwarded to vLLM", { model: META.model, messages: [{ role: "user", content: short }], return_token_ids: true }));
      if (atOrPast("capture")) parts.push(code("POST message-writer /inferences  (the tap message)", {
        tap: { hostname: PH("prover host"), received_at: PH("timestamp"), completed_at: PH("timestamp") },
        session: { session_id: PH("chat id"), response_id: PH("vLLM response id") },
        model: { name: META.model },
        request: { prompt_text: short, prompt_token_ids: ids(ex.prompt_ids) },
        response: { output_text: ex.answer_text, output_token_ids: ids(ex.answer_ids), usage_completion_tokens: ex.n_response },
      }));
      break;
    case "model":
      parts.push(el("p", { class: "note", text: "The weights it serves stay on this box. The answers shown here are the model's greedy answers, decoded from the token ids zkml proved." }));
      if (run && atOrPast("generate")) {
        const block = code("Response token ids so far", "");
        const pre = $("pre", block);
        live.push(() => {
          const n = Math.floor(run.shown);
          const text = n ? jsonText({ output_token_ids: ids(ex.answer_ids.slice(0, n)), decoded: ex.answer_tokens.slice(0, n).join("") }) : "waiting for the first token…";
          if (pre.textContent !== text) pre.textContent = text;
        });
        parts.push(block);
      }
      break;
    case "ledger": {
      if (!run || !reached("record_inference")) { parts.push(pending("No rows for this chat yet.")); break; }
      parts.push(table("inference_event", [
        ["id", PH("uuid")], ["session_id", PH("chat id")], ["model_id", "uuid5(\"Llama-3.2-1B-Instruct\")"], ["hardware_id", "the prover box, resolved by hostname"],
        ["prompt_token_ids", `int[${ex.n_prompt}]`], ["response_token_ids", `int[${ex.n_response}]`], ["output_text_representation", ex.answer_text],
      ]));
      if (reached("record_verdict")) {
        parts.push(table("verification_event", [
          ["result", "pass"], ["error_code", "null"], ["proof_size_bytes", fmtBytes(ex.proof_bytes)], ["proof_digest", PH("sha256 of the file")],
          ["verify_elapsed_ms", `${VERIFY.seconds * 1000}  (reference)`], ["model_commitment_id", PH("uuid")],
        ]));
        parts.push(table("verification_zkml", [["wire_version", String(ex.wire_version)], ["bound", "true"], ["native_statement_digest", ex.statement_digest]]));
      }
      break;
    }
    case "orchestrator": {
      if (!run || !atOrPast("orchestrate")) { parts.push(pending("Watching the verifier's queue and the ledger.")); break; }
      parts.push(code("Loop", [
        "GET  zk-verifier /health                         → queue_depth: 0",
        "GET  ledger /models                              → Llama-3.2-1B-Instruct, not paused",
        "GET  ledger /inference-events/unverified/view?model_id=…&limit=1",
        "                                                 → this chat (newest unverified)",
        "POST zk-verifier /verifications {inference_event_id} → 202 queued",
        "",
        "strategy: latest_unverified   (ZK_STRATEGY, pluggable)",
      ].join("\n")));
      break;
    }
    case "verifier": {
      const s = run && verificationState();
      if (!s) { parts.push(pending("Idle. Nothing handed over yet.")); break; }
      parts.push(code("GET /verifications/{id}", { verification_id: PH("uuid"), inference_event_id: PH("uuid"), state: s, result: s === "done" ? "pass" : null }));
      if (atOrPast("request")) parts.push(code("POST zk-prover /proofs  (the proof request)", {
        request_id: ex.request_id, inference_event_id: PH("uuid"), model_commitment_id: PH("uuid"), proof_system: "zkml",
        commitment: PH("the model's public zkml commitment"),
        token_ids: { prompt: ids(ex.prompt_ids), response: ids(ex.answer_ids), continuation_start: ex.n_prompt },
        randomness: PH("64 hex"), positions: null,
      }));
      if (atOrPast("verify")) parts.push(code("zkml verifier", `expectation: from model_commitment (no weights)\npinned:      prompt ${ex.n_prompt} + answer ${ex.n_response} token ids\nresult:      ${reached("verify") ? "VERIFIED (BOUND)" : "checking…"}`));
      break;
    }
    case "prover": {
      parts.push(code("GET /health", { status: "ok", proof_system: "zkml", queue_depth: run && jobState() === "queued" ? 1 : 0,
        backend: { profile: ex.profile, window: ex.window, openings_used: run && reached("selfverify") ? ex.openings_used : ex.openings_used - 1, proofs_remaining_min: run ? proofsRemaining() : ex.openings_budget - ex.openings_used + 1 } }));
      const j = run && jobState();
      if (j) parts.push(code(`GET /proofs/${ex.job_id}`, {
        job_id: ex.job_id, request_id: ex.request_id, state: j, accepted_at: ex.accepted_at, started_at: j === "queued" ? null : ex.started_at,
        finished_at: j === "done" ? ex.finished_at : null, error: null,
        response: j !== "done" ? null : {
          proof_digest: PH("sha256"), proof_size_bytes: ex.proof_bytes, positions_claimed: ex.positions_claimed, prover_peak_rss_bytes: ex.rss_bytes, system_version: ex.library_version,
          system_detail: { native_statement_digest: ex.statement_digest, openings_used: ex.openings_used, openings_budget: ex.openings_budget, profile: ex.profile, wire_version: ex.wire_version },
        },
      }));
      break;
    }
    case "zkml": {
      const box = el("div", { class: "phases" });
      const byKey = Object.fromEntries(ex.phases.map((p) => [p.key, p]));
      const order = [["accept", "accept"], ["commit", "commit"], ["forward_pass", "forward"], ["prove", "prove"], ["selfverify", "selfverify"]];
      for (const [stepKey, phaseKey] of order) {
        const p = byKey[phaseKey];
        const row = el("div", { class: "phase" }, el("span", { class: "phase-label", text: p.label }),
          el("span", { class: "phase-bar", "aria-hidden": "true" }, el("span", { class: `phase-fill fill-${phaseKey}` })), el("span", { class: "phase-time", text: "—" }));
        box.append(row);
        live.push(() => {
          const i = run ? stepAt(run, stepKey) : -1;
          const state = !run ? "waiting" : run.done || run.index > i ? "done" : run.index === i ? "working" : "waiting";
          const frac = state === "done" ? 1 : state === "working" ? run.frac : 0;
          row.dataset.state = state;
          $(".phase-fill", row).style.width = `${frac * 100}%`;
          $(".phase-time", row).textContent = state === "waiting" ? "—" : fmtS(p.seconds * frac);
        });
      }
      parts.push(box);
      parts.push(table("This proof binds", [
        ["every weight tensor", "to the registered, hiding commitment"], ["your prompt", `${ex.n_prompt} token ids, public`],
        ["the answer, exactly", `each of ${ex.n_response} tokens is the argmax of its logits`], ["window", `${ex.window} tokens · profile ${ex.profile}`],
      ]));
      parts.push(el("p", { class: "note", text: `${ex.library_version} · checkpoint ${META.checkpoint} · greedy answers only; six proofs per registration.` }));
      break;
    }
    case "gpu": {
      const gpu = el("div", { class: "gauges" });
      const gauge = (label, value, max, text) => {
        const fill = el("span", { class: "gauge-fill" });
        const g = el("div", { class: "gauge" }, el("div", { class: "gauge-head" }, el("span", { text: label }), el("strong", { text })), el("span", { class: "gauge-bar", "aria-hidden": "true" }, fill));
        live.push(() => { fill.style.width = `${layerState("gpu") === "active" || (run && reached("selfverify")) ? (value / max) * 100 : 0}%`; });
        return g;
      };
      gpu.append(gauge("GPU memory, peak", ex.gpu_peak_mib, 81559, `${(ex.gpu_peak_mib / 1024).toFixed(1)} GiB of 80 GB`));
      gpu.append(gauge("Host memory, peak", ex.rss_bytes, 128e9, `${Math.round(ex.rss_bytes / 1e9)} GB`));
      parts.push(gpu, el("p", { class: "note", text: "GPU peak from nvidia-smi sampled every 5 s during the sweep; host memory is the prover's peak resident set." }));
      break;
    }
  }
  return parts;
}

function table(title, rows) {
  return el("figure", { class: "rowtable" }, el("figcaption", { text: title }),
    el("dl", {}, rows.map(([k, v]) => el("div", { class: "rowtable-row" }, el("dt", { text: k }), el("dd", { class: String(v).startsWith("‹") ? "ph" : null, text: v })))));
}

function renderInspector() {
  const key = inspectorKey;
  const layer = LAYERS.find((l) => l.key === key);
  live = [];
  const head = el("header", { class: "inspector-head" },
    el("div", {}, el("h3", { text: layer.name }), el("code", { text: layer.code })),
    ownerTag(layer.owner),
    pinned ? el("button", { type: "button", class: "ctl ctl-small", onclick: () => { pinned = null; refresh(true); }, text: "Follow the action" }) : el("span", { class: "following", text: run && !run.done ? "following the action" : "" }));
  const zone = ZONES.find((z) => z.key === layer.zone);
  $("#inspector").replaceChildren(head,
    el("p", { class: "inspector-zone", text: zone.sub ? `${zone.label} · ${zone.sub}` : zone.label }),
    el("p", { class: "inspector-about", text: ABOUT[key] }),
    ...inspectorBody(key));
}

// ---------- chat ----------
function renderThread() {
  const ex = run.ex;
  $("#thread-empty").hidden = true;
  const words = ex.passage.split(/\s+/).length;
  $("#thread").replaceChildren(
    el("div", { class: "bubble bubble-user" },
      el("div", { class: "bubble-meta", text: "You" }),
      el("p", { text: ex.instruction }),
      el("details", { class: "passage" }, el("summary", { text: `Passage (${words} words)` }), el("p", { text: ex.passage })),
      el("p", { class: "question", text: ex.question })),
    el("div", { class: "bubble bubble-model" },
      el("div", { class: "bubble-meta", text: `${META.model}` }),
      el("p", { class: "answer", id: "answer", text: "…" })),
    el("div", { class: "chat-status", id: "chat-status" }));
}

function updateThread() {
  if (!run) return;
  const ex = run.ex;
  const shown = Math.floor(run.shown);
  $("#answer").textContent = shown ? ex.answer_tokens.slice(0, shown).join("") : "…";
  const status = $("#chat-status");
  const phase = run.done ? "done" : reached("generate") ? "proving" : "answering";
  status.dataset.phase = phase;
  const text = phase === "answering" ? (reached("send") ? "Generating the answer" : "Sending")
    : phase === "proving" ? (reached("orchestrate") ? `Being proved · ${fmtClock(proofClock())} of proof time` : "Answer captured · waiting to be picked for proving")
    : null;
  if (text) {
    if (status.dataset.text !== text) {
      status.dataset.text = text;
      status.replaceChildren(el("span", { class: "spinner", "aria-hidden": "true" }), el("span", { text }));
    }
  } else if (status.dataset.text !== "done") {
    status.dataset.text = "done";
    status.replaceChildren(el("span", { class: "verdict", text: "PASS · bound" }), el("span", { text: `${fmtGB(ex.proof_bytes)} proof · proved in ${fmtS(ex.job_wall_s)} · checked without the weights` }));
  }
}

// ---------- refresh ----------
function refresh(force) {
  const follow = pinned || (current() ? current().layer : run && run.done ? "ledger" : "dashboard");
  const stepIdx = run ? (run.done ? run.steps.length : run.index) : -1;
  if (force || follow !== inspectorKey || stepIdx !== inspectorStep) {
    inspectorKey = follow;
    inspectorStep = stepIdx;
    renderInspector();
    renderNow();
  }
  live.forEach((fn) => fn());
  updateStack();
  updateControls();
  updateClock();
  updateThread();
}

// ---------- controls ----------
function announce(text) { $("#announce").textContent = text; }

function selectExample(index) {
  selected = index;
  const ex = EXAMPLES[index];
  $("#prompt-preview").value = `${ex.instruction}\n\nPassage: ${ex.passage}\n\nQuestion: ${ex.question}`;
  for (const b of document.querySelectorAll("#examples button")) b.setAttribute("aria-pressed", String(Number(b.dataset.index) === index));
  if (!run) refresh(true);
}

function init() {
  EXAMPLES.forEach((ex, i) => $("#examples").append(el("button", { type: "button", class: "example", "data-index": i, onclick: () => selectExample(i) },
    el("span", { text: ex.label }), el("small", { text: `${ex.window}-token window` }))));
  renderStack();
  $("#composer").addEventListener("submit", (e) => { e.preventDefault(); start(selected); });
  for (const b of document.querySelectorAll("[data-mode]")) b.addEventListener("click", () => {
    mode = b.dataset.mode;
    if (run && mode === "auto") run.waiting = false;
    refresh(true);
  });
  for (const b of document.querySelectorAll("[data-speed]")) b.addEventListener("click", () => { speed = Number(b.dataset.speed); refresh(false); });
  $("#next-step").addEventListener("click", nextStep);
  $("#pause").addEventListener("click", () => { if (run) { run.paused = !run.paused; refresh(true); } });
  $("#skip").addEventListener("click", skipToVerdict);
  $("#source").textContent = `Measured data: ${META.source}; ${META.model} on ${META.hardware} (${META.host}). Answers are the model's greedy output as zkml proved it, decoded from token ids. Job ids, request ids and timestamps are the sweep's own. The verifier's check uses the ${VERIFY.seconds} s measured for a ${VERIFY.window}-window proof on ${VERIFY.date} (${VERIFY.where}). ‹Bracketed› values were not recorded by the sweep.`;
  selectExample(selected);
  refresh(true);
  if (params.get("autoplay") === "1") start(selected);
}

init();
