// zkml proof chat: one prompt, one zero-knowledge proof, one verdict.
// Every prompt, answer, timing and size comes from zkml/presets.js, which is
// generated from the measured 2026-10-15 proof sweep. The page replays those
// measurements on an accelerated clock; nothing is computed or invented here.
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
const shortDigest = (d) => (d ? d.replace(/^(sha256:)(.{8}).*(.{4})$/, "$1$2…$3") : "—");
const idsPreview = (ids, n = 7) => `[${ids.slice(0, n).join(", ")}, …, ${ids[ids.length - 1]}]`;
const whenUTC = (iso) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC`;
};
const OWNER = { amodo: "Amodo", gpai: "GPAI · zkml", both: "Amodo + GPAI" };
const ZONE = { prover: "Prover box · holds the weights", verifier: "Verifier side · never sees the weights", link: "Prover box ⇄ verifier side" };

// ---------- the run ----------
const TOKENS_PER_SECOND = 28;
const VERIFY = META.verifier_reference;
let speed = [1, 50, 200].includes(Number(params.get("speed"))) ? Number(params.get("speed")) : 50;
let selected = Math.max(0, EXAMPLES.findIndex((e) => e.id === params.get("example")));
let run = null;

function buildSteps(ex) {
  return [
    { node: "ledger", seconds: 0, hold: 1100 },
    { node: "orchestrator", seconds: 0, hold: 1100 },
    { node: "request", seconds: 0, hold: 1000 },
    ...ex.phases.map((p) => ({ node: "zkml", phase: p.key, seconds: p.seconds, hold: 300 })),
    { node: "verifier", seconds: VERIFY.seconds, hold: 500 },
    { node: "record", seconds: 0, hold: 900 },
  ];
}
const stepMs = (step) => (reduced ? 0 : 1) * step.hold + (step.seconds * 1000) / speed;

function start(index) {
  if (run) cancelAnimationFrame(run.raf);
  const ex = EXAMPLES[index];
  run = { ex, steps: buildSteps(ex), phase: "answering", shown: reduced ? ex.answer_tokens.length : 0, pause: 0, index: 0, frac: 0, last: performance.now(), raf: 0 };
  renderThread();
  mountView();
  announce("Message sent. Generating the answer.");
  tick(performance.now());
}

function tick(now) {
  if (!run) return;
  const dt = Math.min(250, now - run.last);
  run.last = now;
  if (run.phase === "answering") {
    run.shown = Math.min(run.ex.answer_tokens.length, run.shown + (dt / 1000) * TOKENS_PER_SECOND);
    if (run.shown >= run.ex.answer_tokens.length) {
      run.pause += dt;
      if (run.pause > (reduced ? 0 : 700)) {
        run.phase = "proving";
        announce("Answer captured. Proof requested.");
      }
    }
  } else if (run.phase === "proving") {
    let budget = dt;
    while (budget > 0 && run.index < run.steps.length) {
      const total = stepMs(run.steps[run.index]);
      const left = (1 - run.frac) * total;
      if (total === 0 || budget >= left) {
        budget -= left;
        run.index += 1;
        run.frac = 0;
      } else {
        run.frac += budget / total;
        budget = 0;
      }
    }
    if (run.index >= run.steps.length) finish();
  }
  update();
  if (run.phase !== "done") run.raf = requestAnimationFrame(tick);
}

function finish() {
  run.phase = "done";
  run.index = run.steps.length;
  run.frac = 0;
  announce(`Verified. Pass, bound. ${fmtGB(run.ex.proof_bytes)} proof.`);
}

function skip() {
  if (!run) start(selected);
  run.shown = run.ex.answer_tokens.length;
  if (run.phase !== "done") finish();
  update();
}

// Seconds of measured proof time elapsed, and the state of each step.
function clockOf(r) {
  let s = 0;
  for (let i = 0; i < r.steps.length; i++) {
    if (i < r.index) s += r.steps[i].seconds;
    else if (i === r.index && r.phase === "proving") s += r.steps[i].seconds * r.frac;
  }
  return s;
}
function stepState(i) {
  if (!run || run.phase === "answering") return "waiting";
  if (run.phase === "done" || i < run.index) return "done";
  return i === run.index ? "working" : "waiting";
}
function nodeState(node) {
  if (!run) return "waiting";
  if (node === "tap") return run.phase === "answering" ? "working" : "done";
  const idx = run.steps.map((s, i) => (s.node === node ? i : -1)).filter((i) => i >= 0);
  const states = idx.map(stepState);
  if (states.every((s) => s === "done")) return "done";
  if (states.some((s) => s !== "waiting")) return "working";
  return "waiting";
}
const totalSeconds = (ex) => ex.phases.reduce((a, p) => a + p.seconds, 0) + VERIFY.seconds;

// ---------- chat thread ----------
function renderThread() {
  const ex = run.ex;
  $("#thread-empty").hidden = true;
  const words = ex.passage.split(/\s+/).length;
  const thread = $("#thread");
  thread.replaceChildren(
    el("div", { class: "bubble bubble-user" },
      el("div", { class: "bubble-meta", text: `You · ${ex.n_prompt} tokens with the chat template` }),
      el("p", { text: ex.instruction }),
      el("details", { class: "passage" }, el("summary", { text: `Passage (${words} words)` }), el("p", { text: ex.passage })),
      el("p", { class: "question", text: ex.question })),
    el("div", { class: "bubble bubble-model" },
      el("div", { class: "bubble-meta", text: `${META.model} · ${ex.n_response} tokens` }),
      el("p", { class: "answer", id: "answer" })),
    el("div", { class: "chat-status", id: "chat-status", role: "status" }),
  );
}

function updateThread() {
  const ex = run.ex;
  const shown = Math.floor(run.shown);
  $("#answer").textContent = ex.answer_tokens.slice(0, shown).join("") || "…";
  const status = $("#chat-status");
  status.dataset.phase = run.phase;
  if (run.phase === "answering") status.replaceChildren(el("span", { class: "spinner", "aria-hidden": "true" }), "Generating the answer");
  else if (run.phase === "proving") status.replaceChildren(el("span", { class: "spinner", "aria-hidden": "true" }), `Proving this answer · ${fmtClock(clockOf(run))} of proof time`);
  else status.replaceChildren(
    el("span", { class: "verdict", text: "PASS · bound" }),
    el("span", { text: `${fmtGB(ex.proof_bytes)} proof · ${fmtS(ex.job_wall_s)} on one H100 · checked without the weights` }));
}

// ---------- views ----------
function kv(key, value) {
  return el("div", { class: "kv" }, el("span", { class: "kv-key", text: key }), el("span", { class: "kv-val", text: value }));
}
function ownerTag(owner) {
  return el("span", { class: `owner owner-${owner}`, text: OWNER[owner] });
}

const SYSTEM_NODES = (ex) => [
  { id: "tap", name: "Network tap", code: "inf-proxy", owner: "amodo", zone: "prover",
    lede: "Passes your chat to the model server and copies the exchange off the wire.",
    rows: [["prompt_token_ids", `${idsPreview(ex.prompt_ids)}  (${ex.n_prompt})`], ["response_token_ids", `${idsPreview(ex.answer_ids)}  (${ex.n_response})`]] },
  { id: "ledger", name: "Ledger", code: "message-writer → inference_event", owner: "amodo", zone: "verifier",
    lede: "Writes one row: who answered, and exactly which tokens went in and came out.",
    rows: [["model", META.model], ["prompt_token_ids", `int[${ex.n_prompt}]`], ["response_token_ids", `int[${ex.n_response}]`], ["hardware", "the prover box, resolved by hostname"]] },
  { id: "orchestrator", name: "Orchestrator", code: "zk-orchestrator", owner: "amodo", zone: "verifier",
    lede: "The verifier is idle, so it hands over the newest unverified chat.",
    rows: [["strategy", "latest_unverified"], ["call", "POST /verifications {inference_event_id}"]] },
  { id: "request", name: "Proof request", code: "zk-verifier → zk-prover", owner: "amodo", zone: "link",
    lede: "Asks the prover box for a proof over the management channel. Only token ids cross; the weights stay put.",
    rows: [["proof_system", "zkml"], ["profile", ex.profile || "private-weights"], ["window", `${ex.window} tokens`], ["commitment opening", `${ex.openings_used} of ${ex.openings_budget}`]] },
  { id: "zkml", name: "zkml", code: `GPU prover · ${META.hardware}`, owner: "gpai", zone: "prover",
    lede: "Proves the model's forward pass over the committed weights, then checks its own proof.", phases: true },
  { id: "verifier", name: "Weight-blind verifier", code: "zk-verifier + zkml verifier", owner: "both", zone: "verifier",
    lede: "Downloads the proof and holds it to the model's registered commitment. It never loads the model.",
    rows: [["expectation", "from model_commitment, no weights"], ["pins", `prompt (${ex.n_prompt}) + answer (${ex.n_response}) token ids`], ["result", "VERIFIED (BOUND)"]],
    note: `Verify time is the ${VERIFY.seconds} s measured for a ${VERIFY.window}-window zkml proof on ${VERIFY.date} (${VERIFY.where}).` },
  { id: "record", name: "Verdict recorded", code: "ledger · verification_event", owner: "amodo", zone: "verifier",
    lede: "The result goes in the ledger and back to the chat.",
    rows: [["result", "pass"], ["proof_size_bytes", fmtBytes(ex.proof_bytes)], ["statement", shortDigest(ex.statement_digest)]] },
];

const VIEWS = {
  system: {
    label: "How it happens",
    build(ex) {
      const root = el("div", { class: "view view-system" });
      root.append(el("header", { class: "panel-head" },
        el("div", {}, el("h2", { text: "How it happens" }), el("p", { class: "panel-sub", text: "Each box is a real component. Watch the chat move through them." })),
        el("div", { class: "clock", "data-slot": "clock" })));
      const flow = el("ol", { class: "flow" });
      for (const node of SYSTEM_NODES(ex)) {
        const card = el("li", { class: `node node-${node.owner}`, "data-node": node.id, "data-state": "waiting" },
          el("div", { class: "node-head" },
            el("span", { class: "node-dot", "aria-hidden": "true" }),
            el("div", { class: "node-title" }, el("strong", { text: node.name }), el("code", { text: node.code })),
            ownerTag(node.owner),
            el("span", { class: "node-state", "data-slot": "state", text: "waiting" })),
          el("p", { class: "node-zone", text: ZONE[node.zone] }),
          el("p", { class: "node-lede", text: node.lede }));
        if (node.rows) card.append(el("div", { class: "kvs" }, node.rows.map(([k, v]) => kv(k, v))));
        if (node.phases) {
          card.append(el("div", { class: "phases" }, ex.phases.map((p) => el("div", { class: "phase", "data-phase": p.key, "data-state": "waiting" },
            el("span", { class: "phase-label", text: p.label }),
            el("span", { class: "phase-bar", "aria-hidden": "true" }, el("span", { class: "phase-fill" })),
            el("span", { class: "phase-time", text: "—" })))));
          card.append(el("div", { class: "kvs" }, kv("proof file", "—"), kv("GPU peak · host memory", `${(ex.gpu_peak_mib / 1024).toFixed(1)} GiB · ${Math.round(ex.rss_bytes / 1e9)} GB`)));
        }
        if (node.note) card.append(el("p", { class: "node-note", text: node.note }));
        flow.append(card);
      }
      root.append(flow);
      return root;
    },
    update(root) {
      const ex = run.ex;
      $('[data-slot="clock"]', root).replaceChildren(...clockParts());
      for (const card of root.querySelectorAll(".node")) {
        const state = nodeState(card.dataset.node);
        if (card.dataset.state !== state) {
          card.dataset.state = state;
          $('[data-slot="state"]', card).textContent = state === "working" ? "working" : state;
          if (state === "working" && !reduced) card.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
      ex.phases.forEach((p, i) => {
        const row = $(`[data-phase="${p.key}"]`, root);
        const stepIndex = 3 + i;
        const state = stepState(stepIndex);
        const frac = state === "done" ? 1 : state === "working" ? run.frac : 0;
        row.dataset.state = state;
        $(".phase-fill", row).style.width = `${frac * 100}%`;
        $(".phase-time", row).textContent = state === "waiting" ? "—" : state === "done" ? fmtS(p.seconds) : `${fmtS(p.seconds * frac)}`;
      });
      const zk = $('[data-node="zkml"]', root);
      $(".kvs .kv-val", zk).textContent = nodeState("zkml") === "done" ? `${fmtBytes(ex.proof_bytes)} bytes (${fmtGB(ex.proof_bytes)})` : nodeState("zkml") === "working" ? "being written…" : "—";
    },
  },

  log: {
    label: "Prover log",
    lines(ex) {
      const steps = buildSteps(ex);
      const at = (i) => steps.slice(0, i).reduce((a, s) => a + s.seconds, 0);
      const L = [
        { after: -1, src: "amodo", tag: "amodo/tap", text: `chat copied · ${ex.n_prompt} prompt + ${ex.n_response} answer token ids`, t: 0 },
        { after: 0, src: "amodo", tag: "amodo/ledger", text: "inference_event written · model resolved by hostname", t: 0 },
        { after: 1, src: "amodo", tag: "amodo/orchestrator", text: "verifier idle → POST /verifications (latest_unverified)", t: 0 },
        { after: 2, src: "amodo", tag: "amodo/zk-prover", text: `job accepted · zkml ${ex.profile} · window ${ex.window} · opening ${ex.openings_used} of ${ex.openings_budget}`, t: 0 },
      ];
      ex.phases.forEach((p, i) => L.push({ after: 3 + i, src: p.owner === "both" ? "amodo" : "gpai", tag: p.owner === "both" ? "zk-prover/zkml" : "gpai/zkml", text: `${p.label.toLowerCase().padEnd(32)} ${fmtS(p.seconds)}`, t: at(4 + i) }));
      L.push({ after: 3 + ex.phases.length - 1, src: "gpai", tag: "gpai/zkml", text: `proof written · ${fmtBytes(ex.proof_bytes)} bytes`, t: at(3 + ex.phases.length) });
      L.push({ after: 3 + ex.phases.length, src: "amodo", tag: "amodo/zk-verifier", text: `weight-blind check against model_commitment · ${fmtS(VERIFY.seconds)} (reference)`, t: at(4 + ex.phases.length) });
      L.push({ after: 3 + ex.phases.length, src: "pass", tag: "VERIFIED (BOUND)", text: `statement ${shortDigest(ex.statement_digest)}`, t: at(4 + ex.phases.length) });
      L.push({ after: 4 + ex.phases.length, src: "amodo", tag: "amodo/ledger", text: "verification_event · result pass", t: at(5 + ex.phases.length) });
      return L;
    },
    build(ex) {
      const root = el("div", { class: "view view-log" });
      root.append(el("header", { class: "panel-head" },
        el("div", {}, el("h2", { text: "Prover log" }), el("p", { class: "panel-sub", text: "Blue lines run in Amodo's system; orange lines run inside zkml." })),
        el("div", { class: "clock", "data-slot": "clock" })));
      const term = el("div", { class: "terminal", "data-slot": "term" });
      root.append(term);
      root._lines = this.lines(ex);
      root._shown = 0;
      return root;
    },
    update(root) {
      $('[data-slot="clock"]', root).replaceChildren(...clockParts());
      const done = run.phase === "answering" ? 0 : run.phase === "done" ? run.steps.length : run.index;
      const visible = run.phase === "answering" ? 1 : root._lines.filter((l) => l.after < done).length;
      const term = $('[data-slot="term"]', root);
      while (root._shown < visible) {
        const l = root._lines[root._shown++];
        term.append(el("div", { class: `log-line log-${l.src}` }, el("span", { class: "log-t", text: `+${fmtClock(l.t)}` }), el("span", { class: "log-tag", text: `[${l.tag}]` }), el("span", { class: "log-text", text: l.text })));
        term.scrollTop = term.scrollHeight;
      }
    },
  },

  scale: {
    label: "To scale",
    build(ex) {
      const root = el("div", { class: "view view-scale" });
      const total = totalSeconds(ex);
      const segs = [...ex.phases.map((p) => ({ ...p })), { key: "verify", label: "Weight-blind verify (reference)", owner: "amodo", seconds: VERIFY.seconds }];
      root.append(el("header", { class: "panel-head" },
        el("div", {}, el("h2", { text: "The answer is instant. The proof is not." }), el("p", { class: "panel-sub", text: `${fmtS(total)} of measured work, drawn to scale.` })),
        el("div", { class: "clock", "data-slot": "clock" })));
      const bar = el("div", { class: "scale-bar", role: "img", "aria-label": segs.map((s) => `${s.label} ${Math.round(s.seconds)} seconds`).join(", ") },
        segs.map((s) => el("span", { class: `seg seg-${s.key}`, style: `flex-grow:${s.seconds}` })),
        el("span", { class: "scale-on", "data-slot": "fill" }, segs.map((s) => el("span", { class: `seg seg-${s.key}`, style: `flex-grow:${s.seconds}` }))),
        el("span", { class: "scale-marker", "data-slot": "marker" }));
      const legend = el("div", { class: "scale-legend" }, segs.map((s) => el("div", { class: `legend-item legend-${s.key}` },
        el("strong", { text: fmtS(s.seconds) }), el("span", { text: s.label }), ownerTag(s.owner))));
      root.append(bar, legend,
        el("div", { class: "scale-facts" },
          el("div", {}, el("span", { text: "Window" }), el("strong", { text: `${ex.window} tokens` })),
          el("div", {}, el("span", { text: "Proof" }), el("strong", { text: fmtGB(ex.proof_bytes) })),
          el("div", {}, el("span", { text: "Per answer token" }), el("strong", { text: `${Math.round(ex.proof_bytes / ex.n_response / 1e6)} MB` })),
          el("div", {}, el("span", { text: "Weights shown" }), el("strong", { text: "none" }))));
      root._total = total;
      return root;
    },
    update(root) {
      $('[data-slot="clock"]', root).replaceChildren(...clockParts());
      const accepted = run.phase === "answering" ? 0 : clockOf(run);
      const pct = Math.min(100, (accepted / root._total) * 100);
      $('[data-slot="fill"]', root).style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      $('[data-slot="marker"]', root).style.left = `${pct}%`;
    },
  },
};
const VIEW_KEYS = Object.keys(VIEWS);
let viewKey = VIEW_KEYS.includes(params.get("view")) ? params.get("view") : "system";
let viewRoot = null;

function clockParts() {
  if (!run || run.phase === "answering") return [el("span", { class: "clock-label", text: "proof time" }), el("strong", { text: "00:00" })];
  return [el("span", { class: "clock-label", text: run.phase === "done" ? "measured · proof + verify" : `proof time · replaying at ${speed === 1 ? "real time" : `${speed}×`}` }),
    el("strong", { text: fmtClock(clockOf(run)) })];
}

function mountView() {
  const panel = $("#panel");
  const ex = run ? run.ex : EXAMPLES[selected];
  viewRoot = VIEWS[viewKey].build(ex);
  panel.replaceChildren(viewRoot);
  if (run) VIEWS[viewKey].update(viewRoot);
  else $('[data-slot="clock"]', viewRoot).replaceChildren(...clockParts());
  for (const b of document.querySelectorAll("#views button")) b.setAttribute("aria-pressed", String(b.dataset.view === viewKey));
}

function update() {
  if (!run) return;
  updateThread();
  VIEWS[viewKey].update(viewRoot);
}

function setView(key) {
  viewKey = key;
  const url = new URL(location.href);
  url.searchParams.set("view", key);
  history.replaceState(null, "", url);
  mountView();
}

// ---------- controls ----------
function announce(text) { $("#announce").textContent = text; }

function selectExample(index) {
  selected = index;
  const ex = EXAMPLES[index];
  $("#prompt-preview").value = `${ex.instruction}\n\nPassage: ${ex.passage}\n\nQuestion: ${ex.question}`;
  for (const b of document.querySelectorAll("#examples button")) b.setAttribute("aria-pressed", String(Number(b.dataset.index) === index));
  if (!run) mountView();
}

function renderControls() {
  EXAMPLES.forEach((ex, i) => $("#examples").append(el("button", { type: "button", class: "example", "data-index": i, onclick: () => selectExample(i) },
    el("span", { text: ex.label }), el("small", { text: `${ex.window}-token window` }))));
  VIEW_KEYS.forEach((key) => $("#views").append(el("button", { type: "button", class: "view-button", "data-view": key, onclick: () => setView(key), text: VIEWS[key].label })));
  $("#next-view").addEventListener("click", () => setView(VIEW_KEYS[(VIEW_KEYS.indexOf(viewKey) + 1) % VIEW_KEYS.length]));
  $("#composer").addEventListener("submit", (e) => { e.preventDefault(); start(selected); });
  for (const b of document.querySelectorAll("[data-speed]")) b.addEventListener("click", () => { speed = Number(b.dataset.speed); markSpeed(); });
  $("#skip").addEventListener("click", skip);
  $("#source").textContent = `Measured data: ${META.source}, ${META.model} on ${META.hardware}. Answers are zkml's own greedy output, decoded. The verifier step uses the ${VERIFY.seconds} s measured for a ${VERIFY.window}-window proof on ${VERIFY.date} (${VERIFY.where}).`;
  markSpeed();
}
function markSpeed() {
  for (const b of document.querySelectorAll("[data-speed]")) b.setAttribute("aria-pressed", String(Number(b.dataset.speed) === speed));
}

renderControls();
selectExample(selected);
mountView();
if (params.get("autoplay") === "1") start(selected);
