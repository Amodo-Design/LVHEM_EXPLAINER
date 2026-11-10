// Chat, ledger and proof replay. Nothing is computed here.
//
// Send posts a recorded prompt and its answer arrives token by token. As soon
// as the answer is complete the exchange lands in the ledger. Clicking a ledger
// entry asks the prover for its proof, and the recorded proof job plays back
// at roughly 150 times its real speed.
//
// Every exchange in exchanges.js is a recorded zkml proof of a Llama-3.2-1B
// answer: its token ids, step times and proof size are the recorded ones. Each
// token is [text, id]; the empty text is the end-of-answer token.
import { EXCHANGES } from "./exchanges.js";

const TOKEN_MS = 120;        // one answer token
const REQUEST_MS = 950;      // "requesting proof"
const REPLAY_MS = 8400;      // one whole proof job, whatever its recorded length
const NEXT = { 0: "Send the first prompt", 1: "Answering", 2: "Ask for a proof", 3: "Proving" };

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const embedded = window.parent !== window && document.documentElement.dataset.embed === "true";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const total = x => x.stages.reduce((a, s) => a + s[1], 0);
const answer = (x, k = x.tokens.length) => x.tokens.slice(0, k).map(t => t[0]).join("");
const shown = raw => raw === "" ? "<|eot_id|>" : raw.replace(/ /g, "␣").replace(/\n/g, "↵");
const oneLine = text => text.replace(/\s+/g, " ").trim();
const clock = s => { s = Math.floor(s); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };

const chats = [];   // { x, k, done, note }
const units = [];   // { n, x, phase: recorded | requesting | proving | verified, t, button, status }
let next = 0, open = null;

// ---------- what the presentation's forward arrow sees
function step() {
  if (units.some(u => u.phase === "verified")) return 4;
  if (units.some(u => u.phase === "requesting" || u.phase === "proving")) return 3;
  if (units.length) return 2;
  return chats.length ? 1 : 0;
}
function publish() {
  const s = step(), last = chats[chats.length - 1], streaming = !!last && !last.done;
  const state = { type: "recomputation-state", step: s, nextLabel: NEXT[s] ?? "Next step",
                  canAdvance: s === 0 || s === 2 };
  $("send").disabled = streaming;
  $("send").textContent = chats.length ? "Send another" : "Send";
  $("next-prompt").value = oneLine(EXCHANGES[next].prompt);
  $("next-label").textContent = "Next prompt · " + (next + 1) + " of " + EXCHANGES.length;
  $("advance").disabled = !state.canAdvance;
  $("advance").setAttribute("aria-label", state.nextLabel);
  if (embedded) window.parent.postMessage(state, location.origin);
}
function advance() {
  const s = step();
  if (s === 0) send();
  else if (s === 2) request(units.find(u => u.phase === "recorded"));
}

// ---------- chat
function note(chat, i) {
  const x = chat.x, count = x.nPrompt + " prompt + " + x.tokens.length + " answer tokens.";
  if (!chat.done) return "Answering: token " + chat.k + " of " + x.tokens.length;
  return count + " In the ledger as #" + (i + 1) + ".";
}
function refreshNotes() { chats.forEach((c, i) => { c.note.textContent = note(c, i); }); }
function send() {
  const last = chats[chats.length - 1];
  if (last && !last.done) return;
  const x = EXCHANGES[next];
  next = (next + 1) % EXCHANGES.length;
  const turn = el("div", "turn"), q = el("div", "q", x.prompt), a = el("div", "a"), n = el("span", "note");
  turn.append(q);
  if (x.prompt.length > 320) {   // a prompt with a passage: show its start, and the rest on request
    q.classList.add("long");
    const more = el("button", "more", "Show the full prompt");
    more.type = "button";
    more.addEventListener("click", () => { more.textContent = q.classList.toggle("long") ? "Show the full prompt" : "Collapse the prompt"; });
    turn.append(more);
  }
  turn.append(a, n);
  $("thread").append(turn);
  $("chat-empty").hidden = true;
  const chat = { x, k: 0, done: false, note: n };
  chats.push(chat);
  const tick = () => {
    chat.k = reduced ? x.tokens.length : chat.k + 1;
    chat.done = chat.k >= x.tokens.length;
    a.textContent = answer(x, chat.k);
    refreshNotes();
    $("thread").scrollTop = $("thread").scrollHeight;
    if (chat.done) { addUnit(x); publish(); } else setTimeout(tick, TOKEN_MS);
  };
  refreshNotes();
  $("thread").scrollTop = $("thread").scrollHeight;
  publish();
  setTimeout(tick, reduced ? 0 : TOKEN_MS * 2);
}

// ---------- ledger
function addUnit(x) {
  const u = { n: units.length + 1, x, phase: "recorded", t: 0 };
  const b = u.button = el("button", "unit");
  b.type = "button"; b.dataset.phase = u.phase; b.setAttribute("aria-pressed", "false");
  const top = el("span", "top"), bottom = el("span", "bottom");
  top.append(el("span", "n", "#" + u.n), el("span", "p", oneLine(x.prompt)));
  u.status = el("span", "status");
  bottom.append(el("span", "meta", x.nPrompt + " + " + x.tokens.length + " tokens"), u.status);
  b.append(top, el("span", "ans", oneLine(answer(x))), bottom);
  b.addEventListener("click", () => request(u));
  const li = el("li"); li.append(b); $("units").append(li);
  units.push(u);
  $("ledger-empty").hidden = true;
  $("count").textContent = units.length === 1 ? "1 exchange" : units.length + " exchanges";
  paint(u);
}
function paint(u) {
  u.button.dataset.phase = u.phase;
  u.status.textContent =
    u.phase === "recorded" ? "Recorded · click to ask for a proof" :
    u.phase === "requesting" ? "Requesting proof" :
    u.phase === "proving" ? "Proving " + clock(u.t) + " of " + clock(total(u.x)) : "Verified";
  $("hint").hidden = !!open || !units.length;
  if (open === u) paintProof();
}
function paintProof() {
  const u = open, x = u.x, all = total(x);
  $("proof").hidden = false;
  $("proof-title").textContent = "Proof for #" + u.n;
  $("proof-clock").textContent = u.phase === "proving" ? clock(u.t) + " of " + clock(all) : u.phase === "verified" ? clock(all) + " recorded" : "";
  $("proof-requesting").hidden = u.phase !== "requesting";
  $("proof-proving").hidden = u.phase !== "proving";
  $("proof-done").hidden = u.phase !== "verified";
  if (u.phase === "proving") {
    let acc = 0, name = "";
    for (const [label, secs] of x.stages) { if (!name && u.t < acc + secs) name = label; acc += secs; }
    $("proof-stage").textContent = name;
    $("proof-fill").style.width = (100 * u.t / all) + "%";
  }
  $("proof-claim").textContent = "The sealed model, given this prompt, produces exactly these " + x.tokens.length + " tokens.";
  $("proof-facts").textContent = "window " + x.window + " · proof " + x.size + " · weights not revealed";
  $("tokens-label").textContent = u.phase === "verified" ? "Answer tokens, proved" : "Answer tokens, as recorded";
  $("tokens").classList.toggle("proved", u.phase === "verified");
  if ($("tokens").dataset.unit !== String(u.n)) {
    $("tokens").dataset.unit = String(u.n);
    $("tokens").replaceChildren(...x.tokens.map(([raw, id]) => {
      const t = el("span", "token"); t.append(el("b", null, shown(raw)), el("small", null, String(id))); return t;
    }));
  }
}
// Click a ledger entry: open it and, the first time, ask for its proof and play the recorded job back.
function request(u) {
  if (!u) return;
  if (open) open.button.setAttribute("aria-pressed", "false");
  open = u; u.button.setAttribute("aria-pressed", "true");
  if (u.phase !== "recorded") { paint(u); return; }
  u.phase = "requesting"; paint(u); publish();
  setTimeout(() => {
    u.phase = "proving"; u.t = 0; paint(u);
    const all = total(u.x), t0 = performance.now();
    const frame = now => {
      u.t = reduced ? all : Math.min(all, (now - t0) / REPLAY_MS * all);
      if (u.t >= all) { u.phase = "verified"; paint(u); publish(); return; }
      paint(u);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, reduced ? 0 : REQUEST_MS);
}

$("composer").addEventListener("submit", event => { event.preventDefault(); send(); });
$("advance").addEventListener("click", advance);
window.addEventListener("message", event => {
  if (!embedded || event.source !== window.parent || event.origin !== location.origin) return;
  if (event.data?.type === "recomputation-advance") advance();
});
publish();
