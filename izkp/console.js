// Zero-knowledge verification console: an illustration that runs nothing.
// Every milestone is advanced explicitly (the forward arrow, here or in the
// presentation that embeds this page); only answer streaming and the short
// "proving" wait use timers. The answers are fixtures, written for this page.

// Two data centres claim sealed model X. A serves it; B has swapped the model,
// so its answers differ in wording, even where they are just as correct.
const INSTANCES = [
  { id: "a", kind: "sealed", tag: "Data centre A · serves sealed model X" },
  { id: "b", kind: "swapped", tag: "Data centre B · swapped the model" },
];
const PRESETS = [
  { prompt: "What is the capital of France? Answer in one sentence.",
    a: "The capital of France is Paris.",
    b: "Paris is the capital city of France." },
  { prompt: "Explain photosynthesis in one sentence.",
    a: "Photosynthesis is how plants use sunlight, water and carbon dioxide to make sugar and release oxygen.",
    b: "Plants turn light into chemical energy, storing it as sugar and giving off oxygen." },
  { prompt: "Write a two-line poem about the sea.",
    a: "The tide keeps time on ancient stone,\nand brings each wandering wave back home.",
    b: "Grey waves fold beneath the gulls,\nsalt wind sings among the hulls." },
  { prompt: "What is 17 times 6?",
    a: "17 times 6 is 102.",
    b: "17 × 6 = 102." },
  { prompt: "Name the three primary colours.",
    a: "Red, yellow and blue.",
    b: "The primary colours are red, blue and yellow." },
];
const NEXT = { 0: "Send example 5", 1: "Generate the answers", 2: "Pick this answer and ask for proofs", 3: "Check the proofs" };
const PROVING_MS = 3200;

const $ = (sel, root = document) => root.querySelector(sel);
const embedded = window.parent !== window && document.documentElement.dataset.embed === "true";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let run = null;

function publish() {
  const step = run?.step ?? 0;
  const state = { type: "recomputation-state", step, canAdvance: !run || (!run.busy && step < 4), nextLabel: NEXT[step] ?? "Next step" };
  $("#advance").disabled = !state.canAdvance;
  $("#advance").setAttribute("aria-label", state.nextLabel);
  $("#clear").disabled = !run;
  [...$("#timeline").children].forEach((item, i) => {
    item.classList.toggle("is-reached", i < step);
    item.classList.toggle("is-current", i === step - 1);
  });
  if (embedded) window.parent.postMessage(state, location.origin);
}

function say(text) { $("#status").textContent = text; }

function clear() {
  if (run) run.timers.forEach(clearTimeout);
  run = null;
  $("#run").hidden = true;
  $("#empty").hidden = false;
  $("#cards").replaceChildren();
  document.querySelectorAll("#examples button").forEach(b => b.setAttribute("aria-pressed", "false"));
  publish();
}

function send(index) {
  clear();
  const preset = PRESETS[index];
  run = { preset, step: 1, busy: false, timers: [], cards: {} };
  $("#examples").children[index].setAttribute("aria-pressed", "true");
  $("#question").textContent = preset.prompt;
  for (const inst of INSTANCES) {
    const node = $("#card-template").content.firstElementChild.cloneNode(true);
    node.dataset.kind = inst.kind;
    const slot = name => $(`[data-slot="${name}"]`, node);
    slot("tag").textContent = inst.tag;
    run.cards[inst.id] = { inst, node, slot };
    $("#cards").append(node);
  }
  $("#empty").hidden = true;
  $("#run").hidden = false;
  say("Question sent to both data centres.");
  publish();
}

const later = (fn, ms) => { const id = setTimeout(fn, reduced ? 0 : ms); run.timers.push(id); };
const each = fn => Object.values(run.cards).forEach(fn);

// Step 1 -> 2: both answer; the certifier records each answer as it leaves.
function answer() {
  run.busy = true; publish();
  let pending = INSTANCES.length;
  each(card => {
    const text = run.preset[card.inst.id], words = text.split(/(?<=\s)/);
    card.slot("stage").textContent = "answering";
    card.slot("reply").textContent = "";
    let i = 0;
    const pace = card.inst.kind === "sealed" ? 70 : 55;
    const tick = () => {
      card.slot("reply").textContent += words[i++];
      if (i < words.length) return later(tick, pace);
      card.slot("recorded").classList.add("on");
      card.slot("stage").textContent = "recorded";
      if (--pending === 0) { run.step = 2; run.busy = false; say("Both answers recorded by the certifier."); publish(); }
    };
    later(tick, 250);
  });
}

// Step 2 -> 3: the verifier picks this answer; each prover has to prove it.
function prove() {
  run.busy = true; publish();
  each(card => {
    card.slot("sampled").classList.add("on");
    card.slot("stage").textContent = "proving";
    card.slot("proving").hidden = false;
    const fill = card.slot("fill");
    fill.style.transition = reduced ? "none" : `width ${PROVING_MS}ms linear`;
    requestAnimationFrame(() => { fill.style.width = "100%"; });
  });
  later(() => {
    each(card => {
      card.slot("proving").hidden = true;
      const ok = card.inst.kind === "sealed";
      card.slot("proof").classList.add(ok ? "on" : "missing");
      card.slot("proof-label").textContent = ok ? "Proof received from the prover" : "No proof: this answer cannot be proved against the sealed model";
      card.slot("stage").textContent = ok ? "proof received" : "no proof";
    });
    run.step = 3; run.busy = false; say("Proving finished."); publish();
  }, PROVING_MS + 200);
}

// Step 3 -> 4: the verifier checks what it received against the fingerprint and the record.
function check() {
  each(card => {
    const ok = card.inst.kind === "sealed", verdict = card.slot("verdict");
    verdict.hidden = false;
    verdict.className = "verdict " + (ok ? "pass" : "fail");
    card.slot("verdict-title").textContent = ok ? "Verified" : "Not verified";
    card.slot("verdict-text").textContent = ok
      ? "The proof matches the fingerprint and the record. This answer came from sealed model X."
      : "No valid proof. This answer did not come from sealed model X.";
    card.slot("stage").textContent = ok ? "verified" : "not verified";
  });
  run.step = 4; say("Proofs checked."); publish();
}

function advance() {
  if (!run) return send(4);
  if (run.busy || run.step >= 4) return;
  [null, answer, prove, check][run.step]();
}

PRESETS.forEach((preset, index) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "example-button"; b.textContent = String(index + 1);
  b.setAttribute("aria-label", `Example ${index + 1}`); b.setAttribute("aria-pressed", "false");
  b.title = preset.prompt;
  b.addEventListener("click", () => send(index));
  $("#examples").append(b);
});
$("#clear").addEventListener("click", clear);
$("#advance").addEventListener("click", advance);
window.addEventListener("message", event => {
  if (!embedded || event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === "recomputation-advance") advance();
});
publish();
