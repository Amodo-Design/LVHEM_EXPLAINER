#!/usr/bin/env python3
"""Generate zkml/presets.js: the measured data behind the zkml chat demo at
/zkml/.

Unlike fake/presets.js nothing here is invented. Every prompt, answer and
number is read from the proof-time sweep that the LVHEM inference prototype
ran on 2026-10-15 (Amodo-Design/LVHEM_INFERENCE_ZKP_PROTOTYPE, PR #9,
docs/measurements/2026-10-15-proof-sweep/proof_sweep.sqlite), zkml rows only.
Answers are zkml's own greedy token ids, decoded with the Llama 3.2 tokenizer.

    python3 scripts/generate-zkml-presets.py \\
        --sweep-db path/to/proof_sweep.sqlite \\
        --tokenizer path/to/Llama-3.2-1B-Instruct/tokenizer.json

Needs the `tokenizers` package (pip install tokenizers). The tokenizer file is
not committed here (17 MB); any copy of Llama-3.2-1B-Instruct's
tokenizer.json works.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (window, prompt_id, button label). The first is the default example.
POINTS = [
    (256, "p128-two_sentences", "Two-sentence summary"),
    (128, "p112-one_word", "One-word subject"),
    (512, "p256-hundred_words", "100-word summary"),
    (1024, "p512-two_sentences", "Long passage, 1024 window"),
]

# The weight-blind verifier's own check, measured on 2026-10-09 for a real
# 256-window zkml proof (docs/poisoned-model-runbook.md, "Real zkml on the GPU
# box"): 117.8 s and 118.5 s on a laptop CPU. The sweep's proofs were checked
# by the prover's self-verify only, so this is shown as a reference figure.
VERIFIER_REFERENCE = {"seconds": 118, "date": "2026-10-09", "window": 256, "where": "laptop CPU"}


def split_prompt(content: str) -> tuple[str, str, str]:
    head, _, rest = content.partition("\n\nPassage: ")
    passage, _, question = rest.rpartition("\n\nQuestion: ")
    return head.strip(), passage.strip(), question.strip()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sweep-db", required=True, type=Path)
    ap.add_argument("--tokenizer", required=True, type=Path)
    args = ap.parse_args()

    from tokenizers import Tokenizer

    tok = Tokenizer.from_file(str(args.tokenizer))
    db = sqlite3.connect(args.sweep_db)
    db.row_factory = sqlite3.Row
    run = dict(db.execute("SELECT * FROM run").fetchone())

    examples = []
    for window, pid, label in POINTS:
        p = db.execute(
            "SELECT * FROM proof WHERE system = 'zkml' AND window = ? AND prompt_id = ? AND state = 'done'",
            (window, pid),
        ).fetchone()
        pt = db.execute("SELECT * FROM point WHERE window = ? AND prompt_id = ?", (window, pid)).fetchone()
        pr = db.execute("SELECT * FROM prompt WHERE id = ?", (pid,)).fetchone()
        if not (p and pt and pr):
            raise SystemExit(f"missing sweep rows for {pid} at window {window}")
        detail = json.loads(p["detail_json"])
        buckets = json.loads(p["buckets_json"])
        content = json.loads(pr["messages_json"])[0]["content"]
        instruction, passage, question = split_prompt(content)
        ids = json.loads(pt["response_ids_json"])
        pieces = [tok.decode([i], skip_special_tokens=False) for i in ids]
        # The span ends on the stop token; show it as a marker, not text.
        if pieces and pieces[-1] == "<|eot_id|>":
            pieces[-1] = ""
        overhead = p["job_wall_s"] - sum(buckets.values())
        examples.append(
            {
                "id": pid,
                "label": label,
                "window": window,
                "instruction": instruction,
                "passage": passage,
                "question": question,
                "n_prompt": pt["n_prompt"],
                "n_response": pt["n_response"],
                "prompt_ids": json.loads(pr["prompt_ids_json"]),
                "answer_ids": ids,
                "answer_tokens": pieces,
                "answer_text": tok.decode(ids, skip_special_tokens=True),
                "ends_on_stop_token": ids[-1] == 128009,
                "job_id": (p["job"] or "").rsplit("/", 1)[-1],
                "request_id": p["request_id"],
                "submitted_at": p["submitted_at"],
                "accepted_at": p["accepted_at"],
                "started_at": p["started_at"],
                "finished_at": p["finished_at"],
                "job_wall_s": round(p["job_wall_s"], 1),
                "phases": [
                    {"key": "accept", "label": "Prover service + acceptor check", "owner": "both", "seconds": round(overhead, 1)},
                    {"key": "commit", "label": "Commit to the weights", "owner": "gpai", "seconds": round(buckets["commit"], 1)},
                    {"key": "forward", "label": "Forward pass, recorded", "owner": "gpai", "seconds": round(buckets["forward"], 1)},
                    {"key": "prove", "label": "Prove", "owner": "gpai", "seconds": round(buckets["prove"], 1)},
                    {"key": "selfverify", "label": "Self-verify", "owner": "gpai", "seconds": round(buckets["verify"], 1)},
                ],
                "proof_bytes": p["proof_size_bytes"],
                "rss_bytes": p["rss_bytes"],
                "gpu_peak_mib": p["gpu_peak_nvsmi_mib"],
                "openings_used": detail.get("openings_used", p["openings_used"]),
                "openings_budget": detail.get("openings_budget", 6),
                "profile": detail.get("profile"),
                "positions_claimed": detail.get("positions_claimed"),
                "wire_version": detail.get("wire_version"),
                "statement_digest": detail.get("native_statement_digest"),
                "library_version": p["system_version"],
            }
        )
        print(f"{pid:22} w{window:<5} {pt['n_prompt']:>4}+{pt['n_response']:<3} {p['job_wall_s']:7.0f} s {p['proof_size_bytes'] / 1e9:.2f} GB")

    meta = {
        "source": "LVHEM inference prototype, proof-time sweep 2026-10-15 (PR #9), zkml rows",
        "host": run["host"],
        "hardware": "1 × NVIDIA H100 80 GB",
        "model": "Llama-3.2-1B-Instruct",
        "checkpoint": Path(run["zkll"]).name,
        "verifier_reference": VERIFIER_REFERENCE,
    }
    js = (
        "// Generated from measured data; see scripts/generate-zkml-presets.py.\n"
        "// Prompts, answers (zkml's own token ids, decoded) and every timing and size\n"
        "// come from the 2026-10-15 proof sweep. Do not edit by hand.\n"
        f"export const META = {json.dumps(meta, indent=1, ensure_ascii=False)};\n"
        f"export const EXAMPLES = {json.dumps(examples, indent=1, ensure_ascii=False)};\n"
    )
    (ROOT / "zkml" / "presets.js").write_text(js)
    print(f"wrote zkml/presets.js ({len(js)} bytes)")


if __name__ == "__main__":
    main()
