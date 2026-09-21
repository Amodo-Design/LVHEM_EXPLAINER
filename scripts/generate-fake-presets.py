#!/usr/bin/env python3
"""Generate fake/presets.js: the fixture data behind the fake verification
dashboard at /fake/.

Everything is invented. Each preset holds a prompt and two pre-written
answers: one for the honest Qwen 7B instance and one for the Qwen 1.5B that
reports itself as the 7B. Token comparisons are synthesised so the honest
answer passes (near-identical recomputation, tiny margins) and the
misreporting one fails (roughly half the tokens diverge, large margins),
matching what the real verifier produces on the cluster. Deterministic seed.

    python3 scripts/generate-fake-presets.py
"""

from __future__ import annotations

import json
import random
import re
from pathlib import Path

rng = random.Random(20260921)
ROOT = Path(__file__).resolve().parent.parent

PRESETS = [
    (
        "Explain in a short paragraph why verifying AI inference matters.",
        "Verifying AI inference matters because the person asking a question rarely controls the hardware that answers it. A provider can quietly substitute a smaller, cheaper model, apply hidden filters, or serve a stale checkpoint, and the text that comes back will still look plausible. Recomputing the answer on independent hardware and comparing the token-level evidence turns a promise about which model ran into something that can be checked, so trust in the output no longer has to be trust in the operator.",
        "Verifying AI inference is important because it ensures the results produced by an AI system are accurate and reliable. Without verification, users may receive incorrect or misleading answers and never know. Checking the output against a trusted reference helps to catch errors, maintain consistency across deployments, and build confidence that the model is behaving as intended, which is essential in areas such as healthcare, finance and public services.",
    ),
    (
        "In a short paragraph, explain what a ledger is and why it is useful.",
        "A ledger is an append-only record in which every event is written once, timestamped, and never edited afterwards. Its usefulness comes from that discipline: because entries cannot be silently changed, anyone with access can reconstruct exactly what happened and in what order. In this system the ledger holds every inference event and every verification verdict, so a claim about a model's behaviour can always be traced back to the evidence that supports it.",
        "A ledger is a detailed record of transactions or events that provides a comprehensive overview of activity over time. It consists of entries that track what happened, when, and by whom. A ledger is useful because it offers a systematic way to record, categorize and summarize information, enabling better management, transparent reporting and accurate auditing for internal decision-making and external stakeholders such as regulators and customers.",
    ),
    (
        "Describe in three sentences how a large language model generates text.",
        "A large language model turns the prompt into a sequence of tokens and passes them through many layers of attention and feed-forward blocks to produce a probability over every possible next token. It samples one token from that distribution, appends it to the sequence, and repeats the whole computation for the next position. The visible answer is simply that chain of sampled tokens decoded back into text, one step at a time.",
        "A large language model works by reading the input text and predicting the most likely next word based on patterns it learned during training on huge amounts of data. It then adds that word to the text and repeats the process until the answer is complete. The model uses neural networks with billions of parameters to capture grammar, facts and reasoning patterns, which is why it can produce fluent and relevant responses.",
    ),
    (
        "Write a short paragraph on why data centres need so much cooling.",
        "A data centre converts almost all of the electricity it draws into heat, and a rack of accelerators can dissipate well over a hundred kilowatts in a footprint the size of a wardrobe. Silicon slows down and eventually fails when it runs hot, so that heat has to be moved out continuously, first from the chips into air or liquid and then out of the building. Cooling is therefore not an accessory but the other half of the power budget, which is why modern halls are designed around water loops and heat rejection as much as around compute.",
        "Data centres need a lot of cooling because the servers inside them generate a large amount of heat while they operate. Thousands of processors running continuously produce heat that must be removed to keep the equipment within safe operating temperatures. If the temperature rises too high, hardware can slow down, become unreliable or fail entirely. Cooling systems such as air conditioning, liquid cooling and hot-aisle containment are used to maintain stable conditions and protect the equipment.",
    ),
    (
        "Explain to a non-expert, in a short paragraph, what a GPU is for.",
        "A GPU is a processor built to do the same simple arithmetic on thousands of numbers at once rather than one calculation after another. That was originally for drawing pixels, where every point on a screen needs the same treatment, but it turns out that training and running neural networks is the same kind of problem: enormous grids of numbers multiplied and added in parallel. So a GPU is what makes modern AI practical, turning work that would take a conventional processor days into something that finishes in minutes.",
        "A GPU, or graphics processing unit, is a special type of computer chip designed to handle many calculations at the same time. It was originally created to render images and video games quickly, but its ability to process large amounts of data in parallel makes it very useful for other tasks too. Today GPUs are widely used for artificial intelligence, scientific research and data analysis, where they can perform complex computations much faster than a regular processor.",
    ),
]

INSTANCES = [
    {
        "key": "liar",
        "model_name": "Qwen/Qwen2.5-7B-Instruct",
        "hostname": "kserve-qwen2-5-1-5b-instruct",
        "deployment_id": "3d8bd5e6-b7ab-44e9-bd2c-99cf51360de4",
        # A 1.5B decodes faster than a 7B; the demo keeps that tell.
        "tokens_per_second": 44,
    },
    {
        "key": "honest",
        "model_name": "Qwen/Qwen2.5-7B-Instruct",
        "hostname": "kserve-qwen2-5-7b-instruct",
        "deployment_id": "8fd0db5d-6e02-4bc6-9d24-f1f0a1a99a41",
        "tokens_per_second": 31,
    },
]

SWAPS = {" the": " a", " a": " the", " and": " or", " that": " which", " is": " remains", " can": " may", " of": " for"}
FILLERS = [" the", " and", " of", " systems", " model", " data", " which", " also", " often", " process", " results", " that", ",", "."]


def tokenize(text: str) -> list[str]:
    """Word pieces with their leading space, punctuation split off: close
    enough to a BPE tokenizer for a diff that reads naturally."""
    return [m.group(0) for m in re.finditer(r"\s*[A-Za-z0-9']+|\s*[^\sA-Za-z0-9']", text)]


def honest_comparison(tokens: list[str]) -> list[dict]:
    """Near-perfect recomputation: zero to two tokens differ, small margins."""
    n = len(tokens)
    k = rng.choice([0, 1, 1, 2])
    swapped = set(rng.sample(range(3, n - 1), k)) if k else set()
    out = []
    for i, t in enumerate(tokens):
        if i in swapped:
            alt = SWAPS.get(t, t.rstrip(",.") + "s")
            out.append({"index": i, "prover_text": t, "verifier_text": alt, "exact_match": False, "margin": round(rng.uniform(0.35, 0.9), 4)})
        else:
            out.append({"index": i, "prover_text": t, "verifier_text": t, "exact_match": True, "margin": round(rng.uniform(0.0, 0.03), 4)})
    return out


def liar_comparison(prover_tokens: list[str], reference_tokens: list[str]) -> list[dict]:
    """The verifier recomputes with the real 7B, so after a short shared
    prefix roughly half the tokens diverge; mismatches carry large margins."""
    shared = rng.randint(2, 5)
    out = []
    for i, t in enumerate(prover_tokens):
        if i < shared or rng.random() < 0.55:
            out.append({"index": i, "prover_text": t, "verifier_text": t, "exact_match": True, "margin": round(rng.uniform(0.0, 0.06), 4)})
        else:
            v = reference_tokens[i] if i < len(reference_tokens) else rng.choice(FILLERS)
            if v == t:
                v = rng.choice([f for f in FILLERS if f != t])
            out.append({"index": i, "prover_text": t, "verifier_text": v, "exact_match": False, "margin": round(rng.uniform(0.6, 8.0), 4)})
    return out


def metrics(cmp: list[dict]) -> dict:
    margins = [c["margin"] for c in cmp]
    identical = sum(1 for c in cmp if c["exact_match"])
    return {
        "exact_match_level_pct": round(identical / len(cmp), 4),
        "mean_logit_difference": round(sum(margins) / len(margins), 4),
    }


def main() -> None:
    presets = []
    for prompt, honest, liar in PRESETS:
        ht, lt = tokenize(honest), tokenize(liar)
        hc, lc = honest_comparison(ht), liar_comparison(lt, ht)
        presets.append(
            {
                "prompt": prompt,
                "honest": {"tokens": ht, "comparison": hc, **metrics(hc), "result": "pass"},
                "liar": {"tokens": lt, "comparison": lc, **metrics(lc), "result": "fail"},
            }
        )
        print(f"{prompt[:44]:46} honest {metrics(hc)}  liar {metrics(lc)}")

    js = (
        "// Generated fixture data for the fake dashboard at /fake/. Every answer,\n"
        "// token and verification metric here is invented; nothing is computed at\n"
        "// runtime. Regenerate with: python3 scripts/generate-fake-presets.py\n"
        f"export const INSTANCES = {json.dumps(INSTANCES, indent=1)};\n"
        "export const THRESHOLD = 0.3;\n"
        f"export const PRESETS = {json.dumps(presets, indent=1, ensure_ascii=False)};\n"
    )
    (ROOT / "fake" / "presets.js").write_text(js)
    print(f"wrote fake/presets.js ({len(js)} bytes)")


if __name__ == "__main__":
    main()
