// Generated fixture data for the fake dashboard at /fake/. Every answer,
// token and verification metric here is invented; nothing is computed at
// runtime. Regenerate with: python3 scripts/generate-fake-presets.py
export const INSTANCES = [
 {
  "key": "liar",
  "model_name": "Qwen/Qwen2.5-7B-Instruct",
  "hostname": "kserve-qwen2-5-1-5b-instruct",
  "deployment_id": "3d8bd5e6-b7ab-44e9-bd2c-99cf51360de4",
  "tokens_per_second": 44
 },
 {
  "key": "honest",
  "model_name": "Qwen/Qwen2.5-7B-Instruct",
  "hostname": "kserve-qwen2-5-7b-instruct",
  "deployment_id": "8fd0db5d-6e02-4bc6-9d24-f1f0a1a99a41",
  "tokens_per_second": 31
 }
];
export const THRESHOLD = 0.3;
export const PRESETS = [
 {
  "prompt": "Explain in a short paragraph why verifying AI inference matters.",
  "honest": {
   "tokens": [
    "Verifying",
    " AI",
    " inference",
    " matters",
    " because",
    " the",
    " person",
    " asking",
    " a",
    " question",
    " rarely",
    " controls",
    " the",
    " hardware",
    " that",
    " answers",
    " it",
    ".",
    " A",
    " provider",
    " can",
    " quietly",
    " substitute",
    " a",
    " smaller",
    ",",
    " cheaper",
    " model",
    ",",
    " apply",
    " hidden",
    " filters",
    ",",
    " or",
    " serve",
    " a",
    " stale",
    " checkpoint",
    ",",
    " and",
    " the",
    " text",
    " that",
    " comes",
    " back",
    " will",
    " still",
    " look",
    " plausible",
    ".",
    " Recomputing",
    " the",
    " answer",
    " on",
    " independent",
    " hardware",
    " and",
    " comparing",
    " the",
    " token",
    "-",
    "level",
    " evidence",
    " turns",
    " a",
    " promise",
    " about",
    " which",
    " model",
    " ran",
    " into",
    " something",
    " that",
    " can",
    " be",
    " checked",
    ",",
    " so",
    " trust",
    " in",
    " the",
    " output",
    " no",
    " longer",
    " has",
    " to",
    " be",
    " trust",
    " in",
    " the",
    " operator",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "Verifying",
     "verifier_text": "Verifying",
     "exact_match": true,
     "margin": 0.0057
    },
    {
     "index": 1,
     "prover_text": " AI",
     "verifier_text": " AI",
     "exact_match": true,
     "margin": 0.0248
    },
    {
     "index": 2,
     "prover_text": " inference",
     "verifier_text": " inference",
     "exact_match": true,
     "margin": 0.026
    },
    {
     "index": 3,
     "prover_text": " matters",
     "verifier_text": " matters",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 4,
     "prover_text": " because",
     "verifier_text": " because",
     "exact_match": true,
     "margin": 0.0105
    },
    {
     "index": 5,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0216
    },
    {
     "index": 6,
     "prover_text": " person",
     "verifier_text": " person",
     "exact_match": true,
     "margin": 0.0098
    },
    {
     "index": 7,
     "prover_text": " asking",
     "verifier_text": " askings",
     "exact_match": false,
     "margin": 0.5468
    },
    {
     "index": 8,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0086
    },
    {
     "index": 9,
     "prover_text": " question",
     "verifier_text": " question",
     "exact_match": true,
     "margin": 0.0021
    },
    {
     "index": 10,
     "prover_text": " rarely",
     "verifier_text": " rarely",
     "exact_match": true,
     "margin": 0.0296
    },
    {
     "index": 11,
     "prover_text": " controls",
     "verifier_text": " controls",
     "exact_match": true,
     "margin": 0.006
    },
    {
     "index": 12,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0286
    },
    {
     "index": 13,
     "prover_text": " hardware",
     "verifier_text": " hardware",
     "exact_match": true,
     "margin": 0.0165
    },
    {
     "index": 14,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0196
    },
    {
     "index": 15,
     "prover_text": " answers",
     "verifier_text": " answers",
     "exact_match": true,
     "margin": 0.0059
    },
    {
     "index": 16,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0226
    },
    {
     "index": 17,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0245
    },
    {
     "index": 18,
     "prover_text": " A",
     "verifier_text": " A",
     "exact_match": true,
     "margin": 0.03
    },
    {
     "index": 19,
     "prover_text": " provider",
     "verifier_text": " provider",
     "exact_match": true,
     "margin": 0.0139
    },
    {
     "index": 20,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.0215
    },
    {
     "index": 21,
     "prover_text": " quietly",
     "verifier_text": " quietly",
     "exact_match": true,
     "margin": 0.0278
    },
    {
     "index": 22,
     "prover_text": " substitute",
     "verifier_text": " substitute",
     "exact_match": true,
     "margin": 0.0196
    },
    {
     "index": 23,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.001
    },
    {
     "index": 24,
     "prover_text": " smaller",
     "verifier_text": " smaller",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 25,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.013
    },
    {
     "index": 26,
     "prover_text": " cheaper",
     "verifier_text": " cheaper",
     "exact_match": true,
     "margin": 0.008
    },
    {
     "index": 27,
     "prover_text": " model",
     "verifier_text": " model",
     "exact_match": true,
     "margin": 0.0273
    },
    {
     "index": 28,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0127
    },
    {
     "index": 29,
     "prover_text": " apply",
     "verifier_text": " apply",
     "exact_match": true,
     "margin": 0.0168
    },
    {
     "index": 30,
     "prover_text": " hidden",
     "verifier_text": " hidden",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 31,
     "prover_text": " filters",
     "verifier_text": " filters",
     "exact_match": true,
     "margin": 0.0061
    },
    {
     "index": 32,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0187
    },
    {
     "index": 33,
     "prover_text": " or",
     "verifier_text": " or",
     "exact_match": true,
     "margin": 0.0051
    },
    {
     "index": 34,
     "prover_text": " serve",
     "verifier_text": " serve",
     "exact_match": true,
     "margin": 0.0019
    },
    {
     "index": 35,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0041
    },
    {
     "index": 36,
     "prover_text": " stale",
     "verifier_text": " stale",
     "exact_match": true,
     "margin": 0.0098
    },
    {
     "index": 37,
     "prover_text": " checkpoint",
     "verifier_text": " checkpoint",
     "exact_match": true,
     "margin": 0.0208
    },
    {
     "index": 38,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0014
    },
    {
     "index": 39,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0253
    },
    {
     "index": 40,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0058
    },
    {
     "index": 41,
     "prover_text": " text",
     "verifier_text": " text",
     "exact_match": true,
     "margin": 0.0012
    },
    {
     "index": 42,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0275
    },
    {
     "index": 43,
     "prover_text": " comes",
     "verifier_text": " comes",
     "exact_match": true,
     "margin": 0.0037
    },
    {
     "index": 44,
     "prover_text": " back",
     "verifier_text": " back",
     "exact_match": true,
     "margin": 0.0146
    },
    {
     "index": 45,
     "prover_text": " will",
     "verifier_text": " will",
     "exact_match": true,
     "margin": 0.0014
    },
    {
     "index": 46,
     "prover_text": " still",
     "verifier_text": " still",
     "exact_match": true,
     "margin": 0.0142
    },
    {
     "index": 47,
     "prover_text": " look",
     "verifier_text": " look",
     "exact_match": true,
     "margin": 0.0201
    },
    {
     "index": 48,
     "prover_text": " plausible",
     "verifier_text": " plausible",
     "exact_match": true,
     "margin": 0.0123
    },
    {
     "index": 49,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0012
    },
    {
     "index": 50,
     "prover_text": " Recomputing",
     "verifier_text": " Recomputing",
     "exact_match": true,
     "margin": 0.0096
    },
    {
     "index": 51,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0002
    },
    {
     "index": 52,
     "prover_text": " answer",
     "verifier_text": " answer",
     "exact_match": true,
     "margin": 0.0038
    },
    {
     "index": 53,
     "prover_text": " on",
     "verifier_text": " on",
     "exact_match": true,
     "margin": 0.0228
    },
    {
     "index": 54,
     "prover_text": " independent",
     "verifier_text": " independent",
     "exact_match": true,
     "margin": 0.0161
    },
    {
     "index": 55,
     "prover_text": " hardware",
     "verifier_text": " hardware",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 56,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0116
    },
    {
     "index": 57,
     "prover_text": " comparing",
     "verifier_text": " comparing",
     "exact_match": true,
     "margin": 0.0054
    },
    {
     "index": 58,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0036
    },
    {
     "index": 59,
     "prover_text": " token",
     "verifier_text": " token",
     "exact_match": true,
     "margin": 0.0297
    },
    {
     "index": 60,
     "prover_text": "-",
     "verifier_text": "-",
     "exact_match": true,
     "margin": 0.0157
    },
    {
     "index": 61,
     "prover_text": "level",
     "verifier_text": "level",
     "exact_match": true,
     "margin": 0.0178
    },
    {
     "index": 62,
     "prover_text": " evidence",
     "verifier_text": " evidence",
     "exact_match": true,
     "margin": 0.0115
    },
    {
     "index": 63,
     "prover_text": " turns",
     "verifier_text": " turns",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 64,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0254
    },
    {
     "index": 65,
     "prover_text": " promise",
     "verifier_text": " promise",
     "exact_match": true,
     "margin": 0.0231
    },
    {
     "index": 66,
     "prover_text": " about",
     "verifier_text": " about",
     "exact_match": true,
     "margin": 0.0067
    },
    {
     "index": 67,
     "prover_text": " which",
     "verifier_text": " which",
     "exact_match": true,
     "margin": 0.0263
    },
    {
     "index": 68,
     "prover_text": " model",
     "verifier_text": " model",
     "exact_match": true,
     "margin": 0.0244
    },
    {
     "index": 69,
     "prover_text": " ran",
     "verifier_text": " ran",
     "exact_match": true,
     "margin": 0.0293
    },
    {
     "index": 70,
     "prover_text": " into",
     "verifier_text": " into",
     "exact_match": true,
     "margin": 0.0198
    },
    {
     "index": 71,
     "prover_text": " something",
     "verifier_text": " something",
     "exact_match": true,
     "margin": 0.0253
    },
    {
     "index": 72,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 73,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.0034
    },
    {
     "index": 74,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.016
    },
    {
     "index": 75,
     "prover_text": " checked",
     "verifier_text": " checked",
     "exact_match": true,
     "margin": 0.0083
    },
    {
     "index": 76,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0142
    },
    {
     "index": 77,
     "prover_text": " so",
     "verifier_text": " so",
     "exact_match": true,
     "margin": 0.0169
    },
    {
     "index": 78,
     "prover_text": " trust",
     "verifier_text": " trust",
     "exact_match": true,
     "margin": 0.0079
    },
    {
     "index": 79,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0022
    },
    {
     "index": 80,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 81,
     "prover_text": " output",
     "verifier_text": " output",
     "exact_match": true,
     "margin": 0.0204
    },
    {
     "index": 82,
     "prover_text": " no",
     "verifier_text": " no",
     "exact_match": true,
     "margin": 0.0033
    },
    {
     "index": 83,
     "prover_text": " longer",
     "verifier_text": " longer",
     "exact_match": true,
     "margin": 0.0206
    },
    {
     "index": 84,
     "prover_text": " has",
     "verifier_text": " has",
     "exact_match": true,
     "margin": 0.0121
    },
    {
     "index": 85,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0039
    },
    {
     "index": 86,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.0167
    },
    {
     "index": 87,
     "prover_text": " trust",
     "verifier_text": " trust",
     "exact_match": true,
     "margin": 0.0085
    },
    {
     "index": 88,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0165
    },
    {
     "index": 89,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0279
    },
    {
     "index": 90,
     "prover_text": " operator",
     "verifier_text": " operator",
     "exact_match": true,
     "margin": 0.019
    },
    {
     "index": 91,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0078
    }
   ],
   "exact_match_level_pct": 0.9891,
   "mean_logit_difference": 0.0203,
   "result": "pass"
  },
  "liar": {
   "tokens": [
    "Verifying",
    " AI",
    " inference",
    " is",
    " important",
    " because",
    " it",
    " ensures",
    " the",
    " results",
    " produced",
    " by",
    " an",
    " AI",
    " system",
    " are",
    " accurate",
    " and",
    " reliable",
    ".",
    " Without",
    " verification",
    ",",
    " users",
    " may",
    " receive",
    " incorrect",
    " or",
    " misleading",
    " answers",
    " and",
    " never",
    " know",
    ".",
    " Checking",
    " the",
    " output",
    " against",
    " a",
    " trusted",
    " reference",
    " helps",
    " to",
    " catch",
    " errors",
    ",",
    " maintain",
    " consistency",
    " across",
    " deployments",
    ",",
    " and",
    " build",
    " confidence",
    " that",
    " the",
    " model",
    " is",
    " behaving",
    " as",
    " intended",
    ",",
    " which",
    " is",
    " essential",
    " in",
    " areas",
    " such",
    " as",
    " healthcare",
    ",",
    " finance",
    " and",
    " public",
    " services",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "Verifying",
     "verifier_text": "Verifying",
     "exact_match": true,
     "margin": 0.0457
    },
    {
     "index": 1,
     "prover_text": " AI",
     "verifier_text": " AI",
     "exact_match": true,
     "margin": 0.0102
    },
    {
     "index": 2,
     "prover_text": " inference",
     "verifier_text": " inference",
     "exact_match": true,
     "margin": 0.0353
    },
    {
     "index": 3,
     "prover_text": " is",
     "verifier_text": " matters",
     "exact_match": false,
     "margin": 6.1114
    },
    {
     "index": 4,
     "prover_text": " important",
     "verifier_text": " because",
     "exact_match": false,
     "margin": 1.3534
    },
    {
     "index": 5,
     "prover_text": " because",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 6.296
    },
    {
     "index": 6,
     "prover_text": " it",
     "verifier_text": " person",
     "exact_match": false,
     "margin": 1.4421
    },
    {
     "index": 7,
     "prover_text": " ensures",
     "verifier_text": " ensures",
     "exact_match": true,
     "margin": 0.0535
    },
    {
     "index": 8,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0329
    },
    {
     "index": 9,
     "prover_text": " results",
     "verifier_text": " results",
     "exact_match": true,
     "margin": 0.0127
    },
    {
     "index": 10,
     "prover_text": " produced",
     "verifier_text": " produced",
     "exact_match": true,
     "margin": 0.0502
    },
    {
     "index": 11,
     "prover_text": " by",
     "verifier_text": " by",
     "exact_match": true,
     "margin": 0.0178
    },
    {
     "index": 12,
     "prover_text": " an",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 7.4268
    },
    {
     "index": 13,
     "prover_text": " AI",
     "verifier_text": " AI",
     "exact_match": true,
     "margin": 0.0
    },
    {
     "index": 14,
     "prover_text": " system",
     "verifier_text": " system",
     "exact_match": true,
     "margin": 0.0463
    },
    {
     "index": 15,
     "prover_text": " are",
     "verifier_text": " are",
     "exact_match": true,
     "margin": 0.0574
    },
    {
     "index": 16,
     "prover_text": " accurate",
     "verifier_text": " accurate",
     "exact_match": true,
     "margin": 0.0516
    },
    {
     "index": 17,
     "prover_text": " and",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 4.785
    },
    {
     "index": 18,
     "prover_text": " reliable",
     "verifier_text": " reliable",
     "exact_match": true,
     "margin": 0.0233
    },
    {
     "index": 19,
     "prover_text": ".",
     "verifier_text": " provider",
     "exact_match": false,
     "margin": 4.2794
    },
    {
     "index": 20,
     "prover_text": " Without",
     "verifier_text": " Without",
     "exact_match": true,
     "margin": 0.0512
    },
    {
     "index": 21,
     "prover_text": " verification",
     "verifier_text": " verification",
     "exact_match": true,
     "margin": 0.0506
    },
    {
     "index": 22,
     "prover_text": ",",
     "verifier_text": " substitute",
     "exact_match": false,
     "margin": 5.9384
    },
    {
     "index": 23,
     "prover_text": " users",
     "verifier_text": " users",
     "exact_match": true,
     "margin": 0.0101
    },
    {
     "index": 24,
     "prover_text": " may",
     "verifier_text": " may",
     "exact_match": true,
     "margin": 0.0535
    },
    {
     "index": 25,
     "prover_text": " receive",
     "verifier_text": " receive",
     "exact_match": true,
     "margin": 0.0583
    },
    {
     "index": 26,
     "prover_text": " incorrect",
     "verifier_text": " incorrect",
     "exact_match": true,
     "margin": 0.0169
    },
    {
     "index": 27,
     "prover_text": " or",
     "verifier_text": " model",
     "exact_match": false,
     "margin": 6.0682
    },
    {
     "index": 28,
     "prover_text": " misleading",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 6.6012
    },
    {
     "index": 29,
     "prover_text": " answers",
     "verifier_text": " apply",
     "exact_match": false,
     "margin": 3.1247
    },
    {
     "index": 30,
     "prover_text": " and",
     "verifier_text": " hidden",
     "exact_match": false,
     "margin": 2.2673
    },
    {
     "index": 31,
     "prover_text": " never",
     "verifier_text": " never",
     "exact_match": true,
     "margin": 0.0321
    },
    {
     "index": 32,
     "prover_text": " know",
     "verifier_text": " know",
     "exact_match": true,
     "margin": 0.0319
    },
    {
     "index": 33,
     "prover_text": ".",
     "verifier_text": " or",
     "exact_match": false,
     "margin": 4.3145
    },
    {
     "index": 34,
     "prover_text": " Checking",
     "verifier_text": " Checking",
     "exact_match": true,
     "margin": 0.0009
    },
    {
     "index": 35,
     "prover_text": " the",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 1.3827
    },
    {
     "index": 36,
     "prover_text": " output",
     "verifier_text": " stale",
     "exact_match": false,
     "margin": 2.8148
    },
    {
     "index": 37,
     "prover_text": " against",
     "verifier_text": " against",
     "exact_match": true,
     "margin": 0.0524
    },
    {
     "index": 38,
     "prover_text": " a",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 4.3936
    },
    {
     "index": 39,
     "prover_text": " trusted",
     "verifier_text": " trusted",
     "exact_match": true,
     "margin": 0.0269
    },
    {
     "index": 40,
     "prover_text": " reference",
     "verifier_text": " reference",
     "exact_match": true,
     "margin": 0.0564
    },
    {
     "index": 41,
     "prover_text": " helps",
     "verifier_text": " text",
     "exact_match": false,
     "margin": 7.1198
    },
    {
     "index": 42,
     "prover_text": " to",
     "verifier_text": " that",
     "exact_match": false,
     "margin": 0.6714
    },
    {
     "index": 43,
     "prover_text": " catch",
     "verifier_text": " catch",
     "exact_match": true,
     "margin": 0.0457
    },
    {
     "index": 44,
     "prover_text": " errors",
     "verifier_text": " back",
     "exact_match": false,
     "margin": 6.035
    },
    {
     "index": 45,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.035
    },
    {
     "index": 46,
     "prover_text": " maintain",
     "verifier_text": " still",
     "exact_match": false,
     "margin": 5.7005
    },
    {
     "index": 47,
     "prover_text": " consistency",
     "verifier_text": " look",
     "exact_match": false,
     "margin": 0.754
    },
    {
     "index": 48,
     "prover_text": " across",
     "verifier_text": " across",
     "exact_match": true,
     "margin": 0.0501
    },
    {
     "index": 49,
     "prover_text": " deployments",
     "verifier_text": " deployments",
     "exact_match": true,
     "margin": 0.0072
    },
    {
     "index": 50,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.012
    },
    {
     "index": 51,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0131
    },
    {
     "index": 52,
     "prover_text": " build",
     "verifier_text": " build",
     "exact_match": true,
     "margin": 0.0041
    },
    {
     "index": 53,
     "prover_text": " confidence",
     "verifier_text": " on",
     "exact_match": false,
     "margin": 7.4411
    },
    {
     "index": 54,
     "prover_text": " that",
     "verifier_text": " independent",
     "exact_match": false,
     "margin": 7.2254
    },
    {
     "index": 55,
     "prover_text": " the",
     "verifier_text": " hardware",
     "exact_match": false,
     "margin": 5.2434
    },
    {
     "index": 56,
     "prover_text": " model",
     "verifier_text": " model",
     "exact_match": true,
     "margin": 0.0323
    },
    {
     "index": 57,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0119
    },
    {
     "index": 58,
     "prover_text": " behaving",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 4.7424
    },
    {
     "index": 59,
     "prover_text": " as",
     "verifier_text": " token",
     "exact_match": false,
     "margin": 1.3148
    },
    {
     "index": 60,
     "prover_text": " intended",
     "verifier_text": "-",
     "exact_match": false,
     "margin": 6.4296
    },
    {
     "index": 61,
     "prover_text": ",",
     "verifier_text": "level",
     "exact_match": false,
     "margin": 7.0365
    },
    {
     "index": 62,
     "prover_text": " which",
     "verifier_text": " evidence",
     "exact_match": false,
     "margin": 6.5314
    },
    {
     "index": 63,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0394
    },
    {
     "index": 64,
     "prover_text": " essential",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 1.5594
    },
    {
     "index": 65,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0585
    },
    {
     "index": 66,
     "prover_text": " areas",
     "verifier_text": " areas",
     "exact_match": true,
     "margin": 0.0032
    },
    {
     "index": 67,
     "prover_text": " such",
     "verifier_text": " which",
     "exact_match": false,
     "margin": 1.7827
    },
    {
     "index": 68,
     "prover_text": " as",
     "verifier_text": " model",
     "exact_match": false,
     "margin": 6.7864
    },
    {
     "index": 69,
     "prover_text": " healthcare",
     "verifier_text": " ran",
     "exact_match": false,
     "margin": 5.8467
    },
    {
     "index": 70,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0061
    },
    {
     "index": 71,
     "prover_text": " finance",
     "verifier_text": " something",
     "exact_match": false,
     "margin": 5.3517
    },
    {
     "index": 72,
     "prover_text": " and",
     "verifier_text": " that",
     "exact_match": false,
     "margin": 6.8558
    },
    {
     "index": 73,
     "prover_text": " public",
     "verifier_text": " public",
     "exact_match": true,
     "margin": 0.0415
    },
    {
     "index": 74,
     "prover_text": " services",
     "verifier_text": " services",
     "exact_match": true,
     "margin": 0.0211
    },
    {
     "index": 75,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0024
    }
   ],
   "exact_match_level_pct": 0.5395,
   "mean_logit_difference": 2.1617,
   "result": "fail"
  }
 },
 {
  "prompt": "In a short paragraph, explain what a ledger is and why it is useful.",
  "honest": {
   "tokens": [
    "A",
    " ledger",
    " is",
    " an",
    " append",
    "-",
    "only",
    " record",
    " in",
    " which",
    " every",
    " event",
    " is",
    " written",
    " once",
    ",",
    " timestamped",
    ",",
    " and",
    " never",
    " edited",
    " afterwards",
    ".",
    " Its",
    " usefulness",
    " comes",
    " from",
    " that",
    " discipline",
    ":",
    " because",
    " entries",
    " cannot",
    " be",
    " silently",
    " changed",
    ",",
    " anyone",
    " with",
    " access",
    " can",
    " reconstruct",
    " exactly",
    " what",
    " happened",
    " and",
    " in",
    " what",
    " order",
    ".",
    " In",
    " this",
    " system",
    " the",
    " ledger",
    " holds",
    " every",
    " inference",
    " event",
    " and",
    " every",
    " verification",
    " verdict",
    ",",
    " so",
    " a",
    " claim",
    " about",
    " a",
    " model's",
    " behaviour",
    " can",
    " always",
    " be",
    " traced",
    " back",
    " to",
    " the",
    " evidence",
    " that",
    " supports",
    " it",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.0032
    },
    {
     "index": 1,
     "prover_text": " ledger",
     "verifier_text": " ledger",
     "exact_match": true,
     "margin": 0.0291
    },
    {
     "index": 2,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0218
    },
    {
     "index": 3,
     "prover_text": " an",
     "verifier_text": " an",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 4,
     "prover_text": " append",
     "verifier_text": " append",
     "exact_match": true,
     "margin": 0.0227
    },
    {
     "index": 5,
     "prover_text": "-",
     "verifier_text": "-",
     "exact_match": true,
     "margin": 0.0131
    },
    {
     "index": 6,
     "prover_text": "only",
     "verifier_text": "only",
     "exact_match": true,
     "margin": 0.0066
    },
    {
     "index": 7,
     "prover_text": " record",
     "verifier_text": " record",
     "exact_match": true,
     "margin": 0.0136
    },
    {
     "index": 8,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0173
    },
    {
     "index": 9,
     "prover_text": " which",
     "verifier_text": " which",
     "exact_match": true,
     "margin": 0.0255
    },
    {
     "index": 10,
     "prover_text": " every",
     "verifier_text": " every",
     "exact_match": true,
     "margin": 0.014
    },
    {
     "index": 11,
     "prover_text": " event",
     "verifier_text": " event",
     "exact_match": true,
     "margin": 0.0286
    },
    {
     "index": 12,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 13,
     "prover_text": " written",
     "verifier_text": " written",
     "exact_match": true,
     "margin": 0.0111
    },
    {
     "index": 14,
     "prover_text": " once",
     "verifier_text": " once",
     "exact_match": true,
     "margin": 0.0264
    },
    {
     "index": 15,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0261
    },
    {
     "index": 16,
     "prover_text": " timestamped",
     "verifier_text": " timestamped",
     "exact_match": true,
     "margin": 0.0264
    },
    {
     "index": 17,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0055
    },
    {
     "index": 18,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0258
    },
    {
     "index": 19,
     "prover_text": " never",
     "verifier_text": " never",
     "exact_match": true,
     "margin": 0.0053
    },
    {
     "index": 20,
     "prover_text": " edited",
     "verifier_text": " edited",
     "exact_match": true,
     "margin": 0.0037
    },
    {
     "index": 21,
     "prover_text": " afterwards",
     "verifier_text": " afterwards",
     "exact_match": true,
     "margin": 0.024
    },
    {
     "index": 22,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.007
    },
    {
     "index": 23,
     "prover_text": " Its",
     "verifier_text": " Its",
     "exact_match": true,
     "margin": 0.0169
    },
    {
     "index": 24,
     "prover_text": " usefulness",
     "verifier_text": " usefulness",
     "exact_match": true,
     "margin": 0.0242
    },
    {
     "index": 25,
     "prover_text": " comes",
     "verifier_text": " comes",
     "exact_match": true,
     "margin": 0.0013
    },
    {
     "index": 26,
     "prover_text": " from",
     "verifier_text": " from",
     "exact_match": true,
     "margin": 0.0099
    },
    {
     "index": 27,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0075
    },
    {
     "index": 28,
     "prover_text": " discipline",
     "verifier_text": " discipline",
     "exact_match": true,
     "margin": 0.0007
    },
    {
     "index": 29,
     "prover_text": ":",
     "verifier_text": ":",
     "exact_match": true,
     "margin": 0.0238
    },
    {
     "index": 30,
     "prover_text": " because",
     "verifier_text": " because",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 31,
     "prover_text": " entries",
     "verifier_text": " entries",
     "exact_match": true,
     "margin": 0.0029
    },
    {
     "index": 32,
     "prover_text": " cannot",
     "verifier_text": " cannot",
     "exact_match": true,
     "margin": 0.0013
    },
    {
     "index": 33,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.0079
    },
    {
     "index": 34,
     "prover_text": " silently",
     "verifier_text": " silently",
     "exact_match": true,
     "margin": 0.0113
    },
    {
     "index": 35,
     "prover_text": " changed",
     "verifier_text": " changed",
     "exact_match": true,
     "margin": 0.0212
    },
    {
     "index": 36,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 37,
     "prover_text": " anyone",
     "verifier_text": " anyone",
     "exact_match": true,
     "margin": 0.0254
    },
    {
     "index": 38,
     "prover_text": " with",
     "verifier_text": " with",
     "exact_match": true,
     "margin": 0.0174
    },
    {
     "index": 39,
     "prover_text": " access",
     "verifier_text": " accesss",
     "exact_match": false,
     "margin": 0.4597
    },
    {
     "index": 40,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.0235
    },
    {
     "index": 41,
     "prover_text": " reconstruct",
     "verifier_text": " reconstruct",
     "exact_match": true,
     "margin": 0.0163
    },
    {
     "index": 42,
     "prover_text": " exactly",
     "verifier_text": " exactlys",
     "exact_match": false,
     "margin": 0.5876
    },
    {
     "index": 43,
     "prover_text": " what",
     "verifier_text": " what",
     "exact_match": true,
     "margin": 0.0148
    },
    {
     "index": 44,
     "prover_text": " happened",
     "verifier_text": " happened",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 45,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0195
    },
    {
     "index": 46,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.02
    },
    {
     "index": 47,
     "prover_text": " what",
     "verifier_text": " what",
     "exact_match": true,
     "margin": 0.004
    },
    {
     "index": 48,
     "prover_text": " order",
     "verifier_text": " order",
     "exact_match": true,
     "margin": 0.0065
    },
    {
     "index": 49,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0291
    },
    {
     "index": 50,
     "prover_text": " In",
     "verifier_text": " In",
     "exact_match": true,
     "margin": 0.0268
    },
    {
     "index": 51,
     "prover_text": " this",
     "verifier_text": " this",
     "exact_match": true,
     "margin": 0.0253
    },
    {
     "index": 52,
     "prover_text": " system",
     "verifier_text": " system",
     "exact_match": true,
     "margin": 0.0145
    },
    {
     "index": 53,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0299
    },
    {
     "index": 54,
     "prover_text": " ledger",
     "verifier_text": " ledger",
     "exact_match": true,
     "margin": 0.0127
    },
    {
     "index": 55,
     "prover_text": " holds",
     "verifier_text": " holds",
     "exact_match": true,
     "margin": 0.0025
    },
    {
     "index": 56,
     "prover_text": " every",
     "verifier_text": " every",
     "exact_match": true,
     "margin": 0.0045
    },
    {
     "index": 57,
     "prover_text": " inference",
     "verifier_text": " inference",
     "exact_match": true,
     "margin": 0.0067
    },
    {
     "index": 58,
     "prover_text": " event",
     "verifier_text": " event",
     "exact_match": true,
     "margin": 0.0122
    },
    {
     "index": 59,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0243
    },
    {
     "index": 60,
     "prover_text": " every",
     "verifier_text": " every",
     "exact_match": true,
     "margin": 0.0289
    },
    {
     "index": 61,
     "prover_text": " verification",
     "verifier_text": " verification",
     "exact_match": true,
     "margin": 0.0075
    },
    {
     "index": 62,
     "prover_text": " verdict",
     "verifier_text": " verdict",
     "exact_match": true,
     "margin": 0.012
    },
    {
     "index": 63,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0214
    },
    {
     "index": 64,
     "prover_text": " so",
     "verifier_text": " so",
     "exact_match": true,
     "margin": 0.001
    },
    {
     "index": 65,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0255
    },
    {
     "index": 66,
     "prover_text": " claim",
     "verifier_text": " claim",
     "exact_match": true,
     "margin": 0.0009
    },
    {
     "index": 67,
     "prover_text": " about",
     "verifier_text": " about",
     "exact_match": true,
     "margin": 0.0274
    },
    {
     "index": 68,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0237
    },
    {
     "index": 69,
     "prover_text": " model's",
     "verifier_text": " model's",
     "exact_match": true,
     "margin": 0.0088
    },
    {
     "index": 70,
     "prover_text": " behaviour",
     "verifier_text": " behaviour",
     "exact_match": true,
     "margin": 0.0164
    },
    {
     "index": 71,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.0021
    },
    {
     "index": 72,
     "prover_text": " always",
     "verifier_text": " always",
     "exact_match": true,
     "margin": 0.0096
    },
    {
     "index": 73,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.0076
    },
    {
     "index": 74,
     "prover_text": " traced",
     "verifier_text": " traced",
     "exact_match": true,
     "margin": 0.0189
    },
    {
     "index": 75,
     "prover_text": " back",
     "verifier_text": " back",
     "exact_match": true,
     "margin": 0.0065
    },
    {
     "index": 76,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0023
    },
    {
     "index": 77,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0148
    },
    {
     "index": 78,
     "prover_text": " evidence",
     "verifier_text": " evidence",
     "exact_match": true,
     "margin": 0.0275
    },
    {
     "index": 79,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0124
    },
    {
     "index": 80,
     "prover_text": " supports",
     "verifier_text": " supports",
     "exact_match": true,
     "margin": 0.0177
    },
    {
     "index": 81,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0085
    },
    {
     "index": 82,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0034
    }
   ],
   "exact_match_level_pct": 0.9759,
   "mean_logit_difference": 0.0277,
   "result": "pass"
  },
  "liar": {
   "tokens": [
    "A",
    " ledger",
    " is",
    " a",
    " detailed",
    " record",
    " of",
    " transactions",
    " or",
    " events",
    " that",
    " provides",
    " a",
    " comprehensive",
    " overview",
    " of",
    " activity",
    " over",
    " time",
    ".",
    " It",
    " consists",
    " of",
    " entries",
    " that",
    " track",
    " what",
    " happened",
    ",",
    " when",
    ",",
    " and",
    " by",
    " whom",
    ".",
    " A",
    " ledger",
    " is",
    " useful",
    " because",
    " it",
    " offers",
    " a",
    " systematic",
    " way",
    " to",
    " record",
    ",",
    " categorize",
    " and",
    " summarize",
    " information",
    ",",
    " enabling",
    " better",
    " management",
    ",",
    " transparent",
    " reporting",
    " and",
    " accurate",
    " auditing",
    " for",
    " internal",
    " decision",
    "-",
    "making",
    " and",
    " external",
    " stakeholders",
    " such",
    " as",
    " regulators",
    " and",
    " customers",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.051
    },
    {
     "index": 1,
     "prover_text": " ledger",
     "verifier_text": " ledger",
     "exact_match": true,
     "margin": 0.0012
    },
    {
     "index": 2,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.058
    },
    {
     "index": 3,
     "prover_text": " a",
     "verifier_text": " an",
     "exact_match": false,
     "margin": 3.5642
    },
    {
     "index": 4,
     "prover_text": " detailed",
     "verifier_text": " detailed",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 5,
     "prover_text": " record",
     "verifier_text": "-",
     "exact_match": false,
     "margin": 1.8267
    },
    {
     "index": 6,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0196
    },
    {
     "index": 7,
     "prover_text": " transactions",
     "verifier_text": " record",
     "exact_match": false,
     "margin": 5.0755
    },
    {
     "index": 8,
     "prover_text": " or",
     "verifier_text": " or",
     "exact_match": true,
     "margin": 0.0479
    },
    {
     "index": 9,
     "prover_text": " events",
     "verifier_text": " events",
     "exact_match": true,
     "margin": 0.018
    },
    {
     "index": 10,
     "prover_text": " that",
     "verifier_text": " every",
     "exact_match": false,
     "margin": 7.4433
    },
    {
     "index": 11,
     "prover_text": " provides",
     "verifier_text": " provides",
     "exact_match": true,
     "margin": 0.0355
    },
    {
     "index": 12,
     "prover_text": " a",
     "verifier_text": " is",
     "exact_match": false,
     "margin": 5.3323
    },
    {
     "index": 13,
     "prover_text": " comprehensive",
     "verifier_text": " comprehensive",
     "exact_match": true,
     "margin": 0.024
    },
    {
     "index": 14,
     "prover_text": " overview",
     "verifier_text": " overview",
     "exact_match": true,
     "margin": 0.0021
    },
    {
     "index": 15,
     "prover_text": " of",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 6.0156
    },
    {
     "index": 16,
     "prover_text": " activity",
     "verifier_text": " timestamped",
     "exact_match": false,
     "margin": 3.8479
    },
    {
     "index": 17,
     "prover_text": " over",
     "verifier_text": " over",
     "exact_match": true,
     "margin": 0.0255
    },
    {
     "index": 18,
     "prover_text": " time",
     "verifier_text": " time",
     "exact_match": true,
     "margin": 0.0266
    },
    {
     "index": 19,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0381
    },
    {
     "index": 20,
     "prover_text": " It",
     "verifier_text": " edited",
     "exact_match": false,
     "margin": 5.4412
    },
    {
     "index": 21,
     "prover_text": " consists",
     "verifier_text": " afterwards",
     "exact_match": false,
     "margin": 4.8329
    },
    {
     "index": 22,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0311
    },
    {
     "index": 23,
     "prover_text": " entries",
     "verifier_text": " entries",
     "exact_match": true,
     "margin": 0.056
    },
    {
     "index": 24,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0305
    },
    {
     "index": 25,
     "prover_text": " track",
     "verifier_text": " track",
     "exact_match": true,
     "margin": 0.0568
    },
    {
     "index": 26,
     "prover_text": " what",
     "verifier_text": " what",
     "exact_match": true,
     "margin": 0.0251
    },
    {
     "index": 27,
     "prover_text": " happened",
     "verifier_text": " happened",
     "exact_match": true,
     "margin": 0.0099
    },
    {
     "index": 28,
     "prover_text": ",",
     "verifier_text": " discipline",
     "exact_match": false,
     "margin": 5.7984
    },
    {
     "index": 29,
     "prover_text": " when",
     "verifier_text": ":",
     "exact_match": false,
     "margin": 1.1994
    },
    {
     "index": 30,
     "prover_text": ",",
     "verifier_text": " because",
     "exact_match": false,
     "margin": 4.3534
    },
    {
     "index": 31,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0514
    },
    {
     "index": 32,
     "prover_text": " by",
     "verifier_text": " cannot",
     "exact_match": false,
     "margin": 2.7979
    },
    {
     "index": 33,
     "prover_text": " whom",
     "verifier_text": " be",
     "exact_match": false,
     "margin": 7.1325
    },
    {
     "index": 34,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0501
    },
    {
     "index": 35,
     "prover_text": " A",
     "verifier_text": " A",
     "exact_match": true,
     "margin": 0.0322
    },
    {
     "index": 36,
     "prover_text": " ledger",
     "verifier_text": " ledger",
     "exact_match": true,
     "margin": 0.0289
    },
    {
     "index": 37,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.028
    },
    {
     "index": 38,
     "prover_text": " useful",
     "verifier_text": " useful",
     "exact_match": true,
     "margin": 0.0037
    },
    {
     "index": 39,
     "prover_text": " because",
     "verifier_text": " because",
     "exact_match": true,
     "margin": 0.0078
    },
    {
     "index": 40,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0444
    },
    {
     "index": 41,
     "prover_text": " offers",
     "verifier_text": " reconstruct",
     "exact_match": false,
     "margin": 3.6122
    },
    {
     "index": 42,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0533
    },
    {
     "index": 43,
     "prover_text": " systematic",
     "verifier_text": " systematic",
     "exact_match": true,
     "margin": 0.0582
    },
    {
     "index": 44,
     "prover_text": " way",
     "verifier_text": " way",
     "exact_match": true,
     "margin": 0.0123
    },
    {
     "index": 45,
     "prover_text": " to",
     "verifier_text": " and",
     "exact_match": false,
     "margin": 4.1781
    },
    {
     "index": 46,
     "prover_text": " record",
     "verifier_text": " record",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 47,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0006
    },
    {
     "index": 48,
     "prover_text": " categorize",
     "verifier_text": " order",
     "exact_match": false,
     "margin": 4.845
    },
    {
     "index": 49,
     "prover_text": " and",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 2.9093
    },
    {
     "index": 50,
     "prover_text": " summarize",
     "verifier_text": " summarize",
     "exact_match": true,
     "margin": 0.0087
    },
    {
     "index": 51,
     "prover_text": " information",
     "verifier_text": " this",
     "exact_match": false,
     "margin": 5.4134
    },
    {
     "index": 52,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0159
    },
    {
     "index": 53,
     "prover_text": " enabling",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 6.6515
    },
    {
     "index": 54,
     "prover_text": " better",
     "verifier_text": " ledger",
     "exact_match": false,
     "margin": 7.4824
    },
    {
     "index": 55,
     "prover_text": " management",
     "verifier_text": " management",
     "exact_match": true,
     "margin": 0.0517
    },
    {
     "index": 56,
     "prover_text": ",",
     "verifier_text": " every",
     "exact_match": false,
     "margin": 6.3044
    },
    {
     "index": 57,
     "prover_text": " transparent",
     "verifier_text": " transparent",
     "exact_match": true,
     "margin": 0.0475
    },
    {
     "index": 58,
     "prover_text": " reporting",
     "verifier_text": " reporting",
     "exact_match": true,
     "margin": 0.0348
    },
    {
     "index": 59,
     "prover_text": " and",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 5.6854
    },
    {
     "index": 60,
     "prover_text": " accurate",
     "verifier_text": " accurate",
     "exact_match": true,
     "margin": 0.0449
    },
    {
     "index": 61,
     "prover_text": " auditing",
     "verifier_text": " auditing",
     "exact_match": true,
     "margin": 0.0013
    },
    {
     "index": 62,
     "prover_text": " for",
     "verifier_text": " verdict",
     "exact_match": false,
     "margin": 2.0813
    },
    {
     "index": 63,
     "prover_text": " internal",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 2.1853
    },
    {
     "index": 64,
     "prover_text": " decision",
     "verifier_text": " so",
     "exact_match": false,
     "margin": 4.2119
    },
    {
     "index": 65,
     "prover_text": "-",
     "verifier_text": "-",
     "exact_match": true,
     "margin": 0.0093
    },
    {
     "index": 66,
     "prover_text": "making",
     "verifier_text": " claim",
     "exact_match": false,
     "margin": 5.0905
    },
    {
     "index": 67,
     "prover_text": " and",
     "verifier_text": " about",
     "exact_match": false,
     "margin": 0.7438
    },
    {
     "index": 68,
     "prover_text": " external",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 2.3228
    },
    {
     "index": 69,
     "prover_text": " stakeholders",
     "verifier_text": " model's",
     "exact_match": false,
     "margin": 2.1047
    },
    {
     "index": 70,
     "prover_text": " such",
     "verifier_text": " behaviour",
     "exact_match": false,
     "margin": 2.5471
    },
    {
     "index": 71,
     "prover_text": " as",
     "verifier_text": " can",
     "exact_match": false,
     "margin": 2.436
    },
    {
     "index": 72,
     "prover_text": " regulators",
     "verifier_text": " regulators",
     "exact_match": true,
     "margin": 0.0033
    },
    {
     "index": 73,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0485
    },
    {
     "index": 74,
     "prover_text": " customers",
     "verifier_text": " customers",
     "exact_match": true,
     "margin": 0.0167
    },
    {
     "index": 75,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0544
    }
   ],
   "exact_match_level_pct": 0.5789,
   "mean_logit_difference": 1.7994,
   "result": "fail"
  }
 },
 {
  "prompt": "Describe in three sentences how a large language model generates text.",
  "honest": {
   "tokens": [
    "A",
    " large",
    " language",
    " model",
    " turns",
    " the",
    " prompt",
    " into",
    " a",
    " sequence",
    " of",
    " tokens",
    " and",
    " passes",
    " them",
    " through",
    " many",
    " layers",
    " of",
    " attention",
    " and",
    " feed",
    "-",
    "forward",
    " blocks",
    " to",
    " produce",
    " a",
    " probability",
    " over",
    " every",
    " possible",
    " next",
    " token",
    ".",
    " It",
    " samples",
    " one",
    " token",
    " from",
    " that",
    " distribution",
    ",",
    " appends",
    " it",
    " to",
    " the",
    " sequence",
    ",",
    " and",
    " repeats",
    " the",
    " whole",
    " computation",
    " for",
    " the",
    " next",
    " position",
    ".",
    " The",
    " visible",
    " answer",
    " is",
    " simply",
    " that",
    " chain",
    " of",
    " sampled",
    " tokens",
    " decoded",
    " back",
    " into",
    " text",
    ",",
    " one",
    " step",
    " at",
    " a",
    " time",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.0253
    },
    {
     "index": 1,
     "prover_text": " large",
     "verifier_text": " large",
     "exact_match": true,
     "margin": 0.0198
    },
    {
     "index": 2,
     "prover_text": " language",
     "verifier_text": " language",
     "exact_match": true,
     "margin": 0.0276
    },
    {
     "index": 3,
     "prover_text": " model",
     "verifier_text": " model",
     "exact_match": true,
     "margin": 0.0124
    },
    {
     "index": 4,
     "prover_text": " turns",
     "verifier_text": " turns",
     "exact_match": true,
     "margin": 0.0206
    },
    {
     "index": 5,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0101
    },
    {
     "index": 6,
     "prover_text": " prompt",
     "verifier_text": " prompt",
     "exact_match": true,
     "margin": 0.0038
    },
    {
     "index": 7,
     "prover_text": " into",
     "verifier_text": " intos",
     "exact_match": false,
     "margin": 0.6765
    },
    {
     "index": 8,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.016
    },
    {
     "index": 9,
     "prover_text": " sequence",
     "verifier_text": " sequence",
     "exact_match": true,
     "margin": 0.0095
    },
    {
     "index": 10,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0165
    },
    {
     "index": 11,
     "prover_text": " tokens",
     "verifier_text": " tokens",
     "exact_match": true,
     "margin": 0.0048
    },
    {
     "index": 12,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0171
    },
    {
     "index": 13,
     "prover_text": " passes",
     "verifier_text": " passes",
     "exact_match": true,
     "margin": 0.0067
    },
    {
     "index": 14,
     "prover_text": " them",
     "verifier_text": " them",
     "exact_match": true,
     "margin": 0.0053
    },
    {
     "index": 15,
     "prover_text": " through",
     "verifier_text": " through",
     "exact_match": true,
     "margin": 0.0239
    },
    {
     "index": 16,
     "prover_text": " many",
     "verifier_text": " many",
     "exact_match": true,
     "margin": 0.0128
    },
    {
     "index": 17,
     "prover_text": " layers",
     "verifier_text": " layers",
     "exact_match": true,
     "margin": 0.0154
    },
    {
     "index": 18,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.027
    },
    {
     "index": 19,
     "prover_text": " attention",
     "verifier_text": " attention",
     "exact_match": true,
     "margin": 0.0012
    },
    {
     "index": 20,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0273
    },
    {
     "index": 21,
     "prover_text": " feed",
     "verifier_text": " feed",
     "exact_match": true,
     "margin": 0.0029
    },
    {
     "index": 22,
     "prover_text": "-",
     "verifier_text": "-",
     "exact_match": true,
     "margin": 0.029
    },
    {
     "index": 23,
     "prover_text": "forward",
     "verifier_text": "forward",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 24,
     "prover_text": " blocks",
     "verifier_text": " blocks",
     "exact_match": true,
     "margin": 0.03
    },
    {
     "index": 25,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0202
    },
    {
     "index": 26,
     "prover_text": " produce",
     "verifier_text": " produce",
     "exact_match": true,
     "margin": 0.022
    },
    {
     "index": 27,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0053
    },
    {
     "index": 28,
     "prover_text": " probability",
     "verifier_text": " probability",
     "exact_match": true,
     "margin": 0.0027
    },
    {
     "index": 29,
     "prover_text": " over",
     "verifier_text": " over",
     "exact_match": true,
     "margin": 0.0226
    },
    {
     "index": 30,
     "prover_text": " every",
     "verifier_text": " every",
     "exact_match": true,
     "margin": 0.0016
    },
    {
     "index": 31,
     "prover_text": " possible",
     "verifier_text": " possible",
     "exact_match": true,
     "margin": 0.0214
    },
    {
     "index": 32,
     "prover_text": " next",
     "verifier_text": " next",
     "exact_match": true,
     "margin": 0.0126
    },
    {
     "index": 33,
     "prover_text": " token",
     "verifier_text": " token",
     "exact_match": true,
     "margin": 0.02
    },
    {
     "index": 34,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0128
    },
    {
     "index": 35,
     "prover_text": " It",
     "verifier_text": " It",
     "exact_match": true,
     "margin": 0.0296
    },
    {
     "index": 36,
     "prover_text": " samples",
     "verifier_text": " samples",
     "exact_match": true,
     "margin": 0.0068
    },
    {
     "index": 37,
     "prover_text": " one",
     "verifier_text": " one",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 38,
     "prover_text": " token",
     "verifier_text": " token",
     "exact_match": true,
     "margin": 0.0172
    },
    {
     "index": 39,
     "prover_text": " from",
     "verifier_text": " from",
     "exact_match": true,
     "margin": 0.02
    },
    {
     "index": 40,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0081
    },
    {
     "index": 41,
     "prover_text": " distribution",
     "verifier_text": " distribution",
     "exact_match": true,
     "margin": 0.0219
    },
    {
     "index": 42,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0093
    },
    {
     "index": 43,
     "prover_text": " appends",
     "verifier_text": " appends",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 44,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0272
    },
    {
     "index": 45,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0124
    },
    {
     "index": 46,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0131
    },
    {
     "index": 47,
     "prover_text": " sequence",
     "verifier_text": " sequence",
     "exact_match": true,
     "margin": 0.0046
    },
    {
     "index": 48,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0058
    },
    {
     "index": 49,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0227
    },
    {
     "index": 50,
     "prover_text": " repeats",
     "verifier_text": " repeats",
     "exact_match": true,
     "margin": 0.0189
    },
    {
     "index": 51,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.018
    },
    {
     "index": 52,
     "prover_text": " whole",
     "verifier_text": " whole",
     "exact_match": true,
     "margin": 0.0093
    },
    {
     "index": 53,
     "prover_text": " computation",
     "verifier_text": " computation",
     "exact_match": true,
     "margin": 0.0188
    },
    {
     "index": 54,
     "prover_text": " for",
     "verifier_text": " for",
     "exact_match": true,
     "margin": 0.0028
    },
    {
     "index": 55,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.016
    },
    {
     "index": 56,
     "prover_text": " next",
     "verifier_text": " next",
     "exact_match": true,
     "margin": 0.0147
    },
    {
     "index": 57,
     "prover_text": " position",
     "verifier_text": " position",
     "exact_match": true,
     "margin": 0.0273
    },
    {
     "index": 58,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0153
    },
    {
     "index": 59,
     "prover_text": " The",
     "verifier_text": " The",
     "exact_match": true,
     "margin": 0.0247
    },
    {
     "index": 60,
     "prover_text": " visible",
     "verifier_text": " visible",
     "exact_match": true,
     "margin": 0.0168
    },
    {
     "index": 61,
     "prover_text": " answer",
     "verifier_text": " answer",
     "exact_match": true,
     "margin": 0.0123
    },
    {
     "index": 62,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0159
    },
    {
     "index": 63,
     "prover_text": " simply",
     "verifier_text": " simply",
     "exact_match": true,
     "margin": 0.0124
    },
    {
     "index": 64,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.005
    },
    {
     "index": 65,
     "prover_text": " chain",
     "verifier_text": " chain",
     "exact_match": true,
     "margin": 0.0017
    },
    {
     "index": 66,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0205
    },
    {
     "index": 67,
     "prover_text": " sampled",
     "verifier_text": " sampled",
     "exact_match": true,
     "margin": 0.0001
    },
    {
     "index": 68,
     "prover_text": " tokens",
     "verifier_text": " tokens",
     "exact_match": true,
     "margin": 0.0185
    },
    {
     "index": 69,
     "prover_text": " decoded",
     "verifier_text": " decoded",
     "exact_match": true,
     "margin": 0.02
    },
    {
     "index": 70,
     "prover_text": " back",
     "verifier_text": " back",
     "exact_match": true,
     "margin": 0.0159
    },
    {
     "index": 71,
     "prover_text": " into",
     "verifier_text": " into",
     "exact_match": true,
     "margin": 0.0181
    },
    {
     "index": 72,
     "prover_text": " text",
     "verifier_text": " text",
     "exact_match": true,
     "margin": 0.003
    },
    {
     "index": 73,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0186
    },
    {
     "index": 74,
     "prover_text": " one",
     "verifier_text": " one",
     "exact_match": true,
     "margin": 0.0099
    },
    {
     "index": 75,
     "prover_text": " step",
     "verifier_text": " step",
     "exact_match": true,
     "margin": 0.0163
    },
    {
     "index": 76,
     "prover_text": " at",
     "verifier_text": " at",
     "exact_match": true,
     "margin": 0.0175
    },
    {
     "index": 77,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0213
    },
    {
     "index": 78,
     "prover_text": " time",
     "verifier_text": " time",
     "exact_match": true,
     "margin": 0.0275
    },
    {
     "index": 79,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0176
    }
   ],
   "exact_match_level_pct": 0.9875,
   "mean_logit_difference": 0.0236,
   "result": "pass"
  },
  "liar": {
   "tokens": [
    "A",
    " large",
    " language",
    " model",
    " works",
    " by",
    " reading",
    " the",
    " input",
    " text",
    " and",
    " predicting",
    " the",
    " most",
    " likely",
    " next",
    " word",
    " based",
    " on",
    " patterns",
    " it",
    " learned",
    " during",
    " training",
    " on",
    " huge",
    " amounts",
    " of",
    " data",
    ".",
    " It",
    " then",
    " adds",
    " that",
    " word",
    " to",
    " the",
    " text",
    " and",
    " repeats",
    " the",
    " process",
    " until",
    " the",
    " answer",
    " is",
    " complete",
    ".",
    " The",
    " model",
    " uses",
    " neural",
    " networks",
    " with",
    " billions",
    " of",
    " parameters",
    " to",
    " capture",
    " grammar",
    ",",
    " facts",
    " and",
    " reasoning",
    " patterns",
    ",",
    " which",
    " is",
    " why",
    " it",
    " can",
    " produce",
    " fluent",
    " and",
    " relevant",
    " responses",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.0354
    },
    {
     "index": 1,
     "prover_text": " large",
     "verifier_text": " large",
     "exact_match": true,
     "margin": 0.0083
    },
    {
     "index": 2,
     "prover_text": " language",
     "verifier_text": " also",
     "exact_match": false,
     "margin": 3.6876
    },
    {
     "index": 3,
     "prover_text": " model",
     "verifier_text": " often",
     "exact_match": false,
     "margin": 0.6422
    },
    {
     "index": 4,
     "prover_text": " works",
     "verifier_text": " works",
     "exact_match": true,
     "margin": 0.0518
    },
    {
     "index": 5,
     "prover_text": " by",
     "verifier_text": " by",
     "exact_match": true,
     "margin": 0.0028
    },
    {
     "index": 6,
     "prover_text": " reading",
     "verifier_text": " reading",
     "exact_match": true,
     "margin": 0.0164
    },
    {
     "index": 7,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0511
    },
    {
     "index": 8,
     "prover_text": " input",
     "verifier_text": " input",
     "exact_match": true,
     "margin": 0.0233
    },
    {
     "index": 9,
     "prover_text": " text",
     "verifier_text": " sequence",
     "exact_match": false,
     "margin": 4.317
    },
    {
     "index": 10,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0428
    },
    {
     "index": 11,
     "prover_text": " predicting",
     "verifier_text": " tokens",
     "exact_match": false,
     "margin": 7.0012
    },
    {
     "index": 12,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.043
    },
    {
     "index": 13,
     "prover_text": " most",
     "verifier_text": " most",
     "exact_match": true,
     "margin": 0.0511
    },
    {
     "index": 14,
     "prover_text": " likely",
     "verifier_text": " likely",
     "exact_match": true,
     "margin": 0.0418
    },
    {
     "index": 15,
     "prover_text": " next",
     "verifier_text": " through",
     "exact_match": false,
     "margin": 3.6547
    },
    {
     "index": 16,
     "prover_text": " word",
     "verifier_text": " word",
     "exact_match": true,
     "margin": 0.0233
    },
    {
     "index": 17,
     "prover_text": " based",
     "verifier_text": " layers",
     "exact_match": false,
     "margin": 2.9356
    },
    {
     "index": 18,
     "prover_text": " on",
     "verifier_text": " on",
     "exact_match": true,
     "margin": 0.0266
    },
    {
     "index": 19,
     "prover_text": " patterns",
     "verifier_text": " patterns",
     "exact_match": true,
     "margin": 0.0125
    },
    {
     "index": 20,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0125
    },
    {
     "index": 21,
     "prover_text": " learned",
     "verifier_text": " feed",
     "exact_match": false,
     "margin": 6.5681
    },
    {
     "index": 22,
     "prover_text": " during",
     "verifier_text": "-",
     "exact_match": false,
     "margin": 2.2035
    },
    {
     "index": 23,
     "prover_text": " training",
     "verifier_text": "forward",
     "exact_match": false,
     "margin": 1.7724
    },
    {
     "index": 24,
     "prover_text": " on",
     "verifier_text": " on",
     "exact_match": true,
     "margin": 0.0014
    },
    {
     "index": 25,
     "prover_text": " huge",
     "verifier_text": " huge",
     "exact_match": true,
     "margin": 0.019
    },
    {
     "index": 26,
     "prover_text": " amounts",
     "verifier_text": " produce",
     "exact_match": false,
     "margin": 5.0305
    },
    {
     "index": 27,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0501
    },
    {
     "index": 28,
     "prover_text": " data",
     "verifier_text": " data",
     "exact_match": true,
     "margin": 0.0316
    },
    {
     "index": 29,
     "prover_text": ".",
     "verifier_text": " over",
     "exact_match": false,
     "margin": 7.3161
    },
    {
     "index": 30,
     "prover_text": " It",
     "verifier_text": " every",
     "exact_match": false,
     "margin": 7.8827
    },
    {
     "index": 31,
     "prover_text": " then",
     "verifier_text": " then",
     "exact_match": true,
     "margin": 0.0542
    },
    {
     "index": 32,
     "prover_text": " adds",
     "verifier_text": " next",
     "exact_match": false,
     "margin": 1.8897
    },
    {
     "index": 33,
     "prover_text": " that",
     "verifier_text": " token",
     "exact_match": false,
     "margin": 5.3404
    },
    {
     "index": 34,
     "prover_text": " word",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 6.4864
    },
    {
     "index": 35,
     "prover_text": " to",
     "verifier_text": " It",
     "exact_match": false,
     "margin": 7.498
    },
    {
     "index": 36,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0548
    },
    {
     "index": 37,
     "prover_text": " text",
     "verifier_text": " one",
     "exact_match": false,
     "margin": 6.8168
    },
    {
     "index": 38,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0183
    },
    {
     "index": 39,
     "prover_text": " repeats",
     "verifier_text": " repeats",
     "exact_match": true,
     "margin": 0.0192
    },
    {
     "index": 40,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.01
    },
    {
     "index": 41,
     "prover_text": " process",
     "verifier_text": " process",
     "exact_match": true,
     "margin": 0.0111
    },
    {
     "index": 42,
     "prover_text": " until",
     "verifier_text": " until",
     "exact_match": true,
     "margin": 0.0154
    },
    {
     "index": 43,
     "prover_text": " the",
     "verifier_text": " appends",
     "exact_match": false,
     "margin": 7.2139
    },
    {
     "index": 44,
     "prover_text": " answer",
     "verifier_text": " answer",
     "exact_match": true,
     "margin": 0.023
    },
    {
     "index": 45,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0212
    },
    {
     "index": 46,
     "prover_text": " complete",
     "verifier_text": " complete",
     "exact_match": true,
     "margin": 0.0403
    },
    {
     "index": 47,
     "prover_text": ".",
     "verifier_text": " sequence",
     "exact_match": false,
     "margin": 4.6177
    },
    {
     "index": 48,
     "prover_text": " The",
     "verifier_text": " The",
     "exact_match": true,
     "margin": 0.0294
    },
    {
     "index": 49,
     "prover_text": " model",
     "verifier_text": " model",
     "exact_match": true,
     "margin": 0.0086
    },
    {
     "index": 50,
     "prover_text": " uses",
     "verifier_text": " uses",
     "exact_match": true,
     "margin": 0.03
    },
    {
     "index": 51,
     "prover_text": " neural",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 1.247
    },
    {
     "index": 52,
     "prover_text": " networks",
     "verifier_text": " whole",
     "exact_match": false,
     "margin": 5.9195
    },
    {
     "index": 53,
     "prover_text": " with",
     "verifier_text": " with",
     "exact_match": true,
     "margin": 0.0293
    },
    {
     "index": 54,
     "prover_text": " billions",
     "verifier_text": " billions",
     "exact_match": true,
     "margin": 0.0553
    },
    {
     "index": 55,
     "prover_text": " of",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 4.1427
    },
    {
     "index": 56,
     "prover_text": " parameters",
     "verifier_text": " next",
     "exact_match": false,
     "margin": 6.7271
    },
    {
     "index": 57,
     "prover_text": " to",
     "verifier_text": " position",
     "exact_match": false,
     "margin": 1.3426
    },
    {
     "index": 58,
     "prover_text": " capture",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 1.6483
    },
    {
     "index": 59,
     "prover_text": " grammar",
     "verifier_text": " grammar",
     "exact_match": true,
     "margin": 0.0283
    },
    {
     "index": 60,
     "prover_text": ",",
     "verifier_text": " visible",
     "exact_match": false,
     "margin": 1.8987
    },
    {
     "index": 61,
     "prover_text": " facts",
     "verifier_text": " answer",
     "exact_match": false,
     "margin": 2.407
    },
    {
     "index": 62,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0239
    },
    {
     "index": 63,
     "prover_text": " reasoning",
     "verifier_text": " simply",
     "exact_match": false,
     "margin": 6.6868
    },
    {
     "index": 64,
     "prover_text": " patterns",
     "verifier_text": " that",
     "exact_match": false,
     "margin": 2.0313
    },
    {
     "index": 65,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0359
    },
    {
     "index": 66,
     "prover_text": " which",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 3.2956
    },
    {
     "index": 67,
     "prover_text": " is",
     "verifier_text": " sampled",
     "exact_match": false,
     "margin": 1.0492
    },
    {
     "index": 68,
     "prover_text": " why",
     "verifier_text": " why",
     "exact_match": true,
     "margin": 0.0131
    },
    {
     "index": 69,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0171
    },
    {
     "index": 70,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.007
    },
    {
     "index": 71,
     "prover_text": " produce",
     "verifier_text": " produce",
     "exact_match": true,
     "margin": 0.0489
    },
    {
     "index": 72,
     "prover_text": " fluent",
     "verifier_text": " text",
     "exact_match": false,
     "margin": 7.9741
    },
    {
     "index": 73,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0509
    },
    {
     "index": 74,
     "prover_text": " relevant",
     "verifier_text": " one",
     "exact_match": false,
     "margin": 2.1029
    },
    {
     "index": 75,
     "prover_text": " responses",
     "verifier_text": " step",
     "exact_match": false,
     "margin": 6.9122
    },
    {
     "index": 76,
     "prover_text": ".",
     "verifier_text": " at",
     "exact_match": false,
     "margin": 2.6033
    }
   ],
   "exact_match_level_pct": 0.5455,
   "mean_logit_difference": 1.9747,
   "result": "fail"
  }
 },
 {
  "prompt": "Write a short paragraph on why data centres need so much cooling.",
  "honest": {
   "tokens": [
    "A",
    " data",
    " centre",
    " converts",
    " almost",
    " all",
    " of",
    " the",
    " electricity",
    " it",
    " draws",
    " into",
    " heat",
    ",",
    " and",
    " a",
    " rack",
    " of",
    " accelerators",
    " can",
    " dissipate",
    " well",
    " over",
    " a",
    " hundred",
    " kilowatts",
    " in",
    " a",
    " footprint",
    " the",
    " size",
    " of",
    " a",
    " wardrobe",
    ".",
    " Silicon",
    " slows",
    " down",
    " and",
    " eventually",
    " fails",
    " when",
    " it",
    " runs",
    " hot",
    ",",
    " so",
    " that",
    " heat",
    " has",
    " to",
    " be",
    " moved",
    " out",
    " continuously",
    ",",
    " first",
    " from",
    " the",
    " chips",
    " into",
    " air",
    " or",
    " liquid",
    " and",
    " then",
    " out",
    " of",
    " the",
    " building",
    ".",
    " Cooling",
    " is",
    " therefore",
    " not",
    " an",
    " accessory",
    " but",
    " the",
    " other",
    " half",
    " of",
    " the",
    " power",
    " budget",
    ",",
    " which",
    " is",
    " why",
    " modern",
    " halls",
    " are",
    " designed",
    " around",
    " water",
    " loops",
    " and",
    " heat",
    " rejection",
    " as",
    " much",
    " as",
    " around",
    " compute",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.028
    },
    {
     "index": 1,
     "prover_text": " data",
     "verifier_text": " data",
     "exact_match": true,
     "margin": 0.0283
    },
    {
     "index": 2,
     "prover_text": " centre",
     "verifier_text": " centre",
     "exact_match": true,
     "margin": 0.0026
    },
    {
     "index": 3,
     "prover_text": " converts",
     "verifier_text": " converts",
     "exact_match": true,
     "margin": 0.0259
    },
    {
     "index": 4,
     "prover_text": " almost",
     "verifier_text": " almost",
     "exact_match": true,
     "margin": 0.0264
    },
    {
     "index": 5,
     "prover_text": " all",
     "verifier_text": " all",
     "exact_match": true,
     "margin": 0.0138
    },
    {
     "index": 6,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0057
    },
    {
     "index": 7,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0159
    },
    {
     "index": 8,
     "prover_text": " electricity",
     "verifier_text": " electricity",
     "exact_match": true,
     "margin": 0.0011
    },
    {
     "index": 9,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0027
    },
    {
     "index": 10,
     "prover_text": " draws",
     "verifier_text": " draws",
     "exact_match": true,
     "margin": 0.0031
    },
    {
     "index": 11,
     "prover_text": " into",
     "verifier_text": " into",
     "exact_match": true,
     "margin": 0.0196
    },
    {
     "index": 12,
     "prover_text": " heat",
     "verifier_text": " heat",
     "exact_match": true,
     "margin": 0.0259
    },
    {
     "index": 13,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0091
    },
    {
     "index": 14,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0066
    },
    {
     "index": 15,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0197
    },
    {
     "index": 16,
     "prover_text": " rack",
     "verifier_text": " rack",
     "exact_match": true,
     "margin": 0.0007
    },
    {
     "index": 17,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.021
    },
    {
     "index": 18,
     "prover_text": " accelerators",
     "verifier_text": " accelerators",
     "exact_match": true,
     "margin": 0.0266
    },
    {
     "index": 19,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.022
    },
    {
     "index": 20,
     "prover_text": " dissipate",
     "verifier_text": " dissipate",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 21,
     "prover_text": " well",
     "verifier_text": " well",
     "exact_match": true,
     "margin": 0.0297
    },
    {
     "index": 22,
     "prover_text": " over",
     "verifier_text": " over",
     "exact_match": true,
     "margin": 0.0132
    },
    {
     "index": 23,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0176
    },
    {
     "index": 24,
     "prover_text": " hundred",
     "verifier_text": " hundreds",
     "exact_match": false,
     "margin": 0.5182
    },
    {
     "index": 25,
     "prover_text": " kilowatts",
     "verifier_text": " kilowatts",
     "exact_match": true,
     "margin": 0.0261
    },
    {
     "index": 26,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0233
    },
    {
     "index": 27,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0095
    },
    {
     "index": 28,
     "prover_text": " footprint",
     "verifier_text": " footprint",
     "exact_match": true,
     "margin": 0.0109
    },
    {
     "index": 29,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 30,
     "prover_text": " size",
     "verifier_text": " size",
     "exact_match": true,
     "margin": 0.0219
    },
    {
     "index": 31,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0287
    },
    {
     "index": 32,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0298
    },
    {
     "index": 33,
     "prover_text": " wardrobe",
     "verifier_text": " wardrobe",
     "exact_match": true,
     "margin": 0.0068
    },
    {
     "index": 34,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0042
    },
    {
     "index": 35,
     "prover_text": " Silicon",
     "verifier_text": " Silicon",
     "exact_match": true,
     "margin": 0.027
    },
    {
     "index": 36,
     "prover_text": " slows",
     "verifier_text": " slows",
     "exact_match": true,
     "margin": 0.0101
    },
    {
     "index": 37,
     "prover_text": " down",
     "verifier_text": " down",
     "exact_match": true,
     "margin": 0.0161
    },
    {
     "index": 38,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 39,
     "prover_text": " eventually",
     "verifier_text": " eventually",
     "exact_match": true,
     "margin": 0.0299
    },
    {
     "index": 40,
     "prover_text": " fails",
     "verifier_text": " fails",
     "exact_match": true,
     "margin": 0.0047
    },
    {
     "index": 41,
     "prover_text": " when",
     "verifier_text": " when",
     "exact_match": true,
     "margin": 0.0199
    },
    {
     "index": 42,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0021
    },
    {
     "index": 43,
     "prover_text": " runs",
     "verifier_text": " runs",
     "exact_match": true,
     "margin": 0.0092
    },
    {
     "index": 44,
     "prover_text": " hot",
     "verifier_text": " hot",
     "exact_match": true,
     "margin": 0.0082
    },
    {
     "index": 45,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0139
    },
    {
     "index": 46,
     "prover_text": " so",
     "verifier_text": " so",
     "exact_match": true,
     "margin": 0.0278
    },
    {
     "index": 47,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0256
    },
    {
     "index": 48,
     "prover_text": " heat",
     "verifier_text": " heat",
     "exact_match": true,
     "margin": 0.0033
    },
    {
     "index": 49,
     "prover_text": " has",
     "verifier_text": " has",
     "exact_match": true,
     "margin": 0.0158
    },
    {
     "index": 50,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0228
    },
    {
     "index": 51,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.003
    },
    {
     "index": 52,
     "prover_text": " moved",
     "verifier_text": " moved",
     "exact_match": true,
     "margin": 0.0101
    },
    {
     "index": 53,
     "prover_text": " out",
     "verifier_text": " out",
     "exact_match": true,
     "margin": 0.005
    },
    {
     "index": 54,
     "prover_text": " continuously",
     "verifier_text": " continuously",
     "exact_match": true,
     "margin": 0.0279
    },
    {
     "index": 55,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0168
    },
    {
     "index": 56,
     "prover_text": " first",
     "verifier_text": " first",
     "exact_match": true,
     "margin": 0.026
    },
    {
     "index": 57,
     "prover_text": " from",
     "verifier_text": " from",
     "exact_match": true,
     "margin": 0.0123
    },
    {
     "index": 58,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0096
    },
    {
     "index": 59,
     "prover_text": " chips",
     "verifier_text": " chips",
     "exact_match": true,
     "margin": 0.022
    },
    {
     "index": 60,
     "prover_text": " into",
     "verifier_text": " into",
     "exact_match": true,
     "margin": 0.0121
    },
    {
     "index": 61,
     "prover_text": " air",
     "verifier_text": " air",
     "exact_match": true,
     "margin": 0.0286
    },
    {
     "index": 62,
     "prover_text": " or",
     "verifier_text": " or",
     "exact_match": true,
     "margin": 0.0261
    },
    {
     "index": 63,
     "prover_text": " liquid",
     "verifier_text": " liquid",
     "exact_match": true,
     "margin": 0.0004
    },
    {
     "index": 64,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0185
    },
    {
     "index": 65,
     "prover_text": " then",
     "verifier_text": " then",
     "exact_match": true,
     "margin": 0.0205
    },
    {
     "index": 66,
     "prover_text": " out",
     "verifier_text": " out",
     "exact_match": true,
     "margin": 0.002
    },
    {
     "index": 67,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0139
    },
    {
     "index": 68,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0055
    },
    {
     "index": 69,
     "prover_text": " building",
     "verifier_text": " building",
     "exact_match": true,
     "margin": 0.0069
    },
    {
     "index": 70,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0293
    },
    {
     "index": 71,
     "prover_text": " Cooling",
     "verifier_text": " Cooling",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 72,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0133
    },
    {
     "index": 73,
     "prover_text": " therefore",
     "verifier_text": " therefore",
     "exact_match": true,
     "margin": 0.0282
    },
    {
     "index": 74,
     "prover_text": " not",
     "verifier_text": " not",
     "exact_match": true,
     "margin": 0.0168
    },
    {
     "index": 75,
     "prover_text": " an",
     "verifier_text": " an",
     "exact_match": true,
     "margin": 0.0179
    },
    {
     "index": 76,
     "prover_text": " accessory",
     "verifier_text": " accessory",
     "exact_match": true,
     "margin": 0.0125
    },
    {
     "index": 77,
     "prover_text": " but",
     "verifier_text": " but",
     "exact_match": true,
     "margin": 0.0227
    },
    {
     "index": 78,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0209
    },
    {
     "index": 79,
     "prover_text": " other",
     "verifier_text": " other",
     "exact_match": true,
     "margin": 0.0083
    },
    {
     "index": 80,
     "prover_text": " half",
     "verifier_text": " half",
     "exact_match": true,
     "margin": 0.0088
    },
    {
     "index": 81,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0254
    },
    {
     "index": 82,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0266
    },
    {
     "index": 83,
     "prover_text": " power",
     "verifier_text": " power",
     "exact_match": true,
     "margin": 0.0112
    },
    {
     "index": 84,
     "prover_text": " budget",
     "verifier_text": " budget",
     "exact_match": true,
     "margin": 0.0256
    },
    {
     "index": 85,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0271
    },
    {
     "index": 86,
     "prover_text": " which",
     "verifier_text": " which",
     "exact_match": true,
     "margin": 0.0018
    },
    {
     "index": 87,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0195
    },
    {
     "index": 88,
     "prover_text": " why",
     "verifier_text": " why",
     "exact_match": true,
     "margin": 0.0243
    },
    {
     "index": 89,
     "prover_text": " modern",
     "verifier_text": " modern",
     "exact_match": true,
     "margin": 0.0232
    },
    {
     "index": 90,
     "prover_text": " halls",
     "verifier_text": " halls",
     "exact_match": true,
     "margin": 0.0007
    },
    {
     "index": 91,
     "prover_text": " are",
     "verifier_text": " are",
     "exact_match": true,
     "margin": 0.0037
    },
    {
     "index": 92,
     "prover_text": " designed",
     "verifier_text": " designed",
     "exact_match": true,
     "margin": 0.0008
    },
    {
     "index": 93,
     "prover_text": " around",
     "verifier_text": " around",
     "exact_match": true,
     "margin": 0.0096
    },
    {
     "index": 94,
     "prover_text": " water",
     "verifier_text": " water",
     "exact_match": true,
     "margin": 0.0137
    },
    {
     "index": 95,
     "prover_text": " loops",
     "verifier_text": " loops",
     "exact_match": true,
     "margin": 0.0172
    },
    {
     "index": 96,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0227
    },
    {
     "index": 97,
     "prover_text": " heat",
     "verifier_text": " heat",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 98,
     "prover_text": " rejection",
     "verifier_text": " rejection",
     "exact_match": true,
     "margin": 0.0072
    },
    {
     "index": 99,
     "prover_text": " as",
     "verifier_text": " as",
     "exact_match": true,
     "margin": 0.007
    },
    {
     "index": 100,
     "prover_text": " much",
     "verifier_text": " much",
     "exact_match": true,
     "margin": 0.0184
    },
    {
     "index": 101,
     "prover_text": " as",
     "verifier_text": " as",
     "exact_match": true,
     "margin": 0.0185
    },
    {
     "index": 102,
     "prover_text": " around",
     "verifier_text": " around",
     "exact_match": true,
     "margin": 0.0057
    },
    {
     "index": 103,
     "prover_text": " compute",
     "verifier_text": " compute",
     "exact_match": true,
     "margin": 0.0038
    },
    {
     "index": 104,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.03
    }
   ],
   "exact_match_level_pct": 0.9905,
   "mean_logit_difference": 0.021,
   "result": "pass"
  },
  "liar": {
   "tokens": [
    "Data",
    " centres",
    " need",
    " a",
    " lot",
    " of",
    " cooling",
    " because",
    " the",
    " servers",
    " inside",
    " them",
    " generate",
    " a",
    " large",
    " amount",
    " of",
    " heat",
    " while",
    " they",
    " operate",
    ".",
    " Thousands",
    " of",
    " processors",
    " running",
    " continuously",
    " produce",
    " heat",
    " that",
    " must",
    " be",
    " removed",
    " to",
    " keep",
    " the",
    " equipment",
    " within",
    " safe",
    " operating",
    " temperatures",
    ".",
    " If",
    " the",
    " temperature",
    " rises",
    " too",
    " high",
    ",",
    " hardware",
    " can",
    " slow",
    " down",
    ",",
    " become",
    " unreliable",
    " or",
    " fail",
    " entirely",
    ".",
    " Cooling",
    " systems",
    " such",
    " as",
    " air",
    " conditioning",
    ",",
    " liquid",
    " cooling",
    " and",
    " hot",
    "-",
    "aisle",
    " containment",
    " are",
    " used",
    " to",
    " maintain",
    " stable",
    " conditions",
    " and",
    " protect",
    " the",
    " equipment",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "Data",
     "verifier_text": "Data",
     "exact_match": true,
     "margin": 0.0518
    },
    {
     "index": 1,
     "prover_text": " centres",
     "verifier_text": " centres",
     "exact_match": true,
     "margin": 0.0027
    },
    {
     "index": 2,
     "prover_text": " need",
     "verifier_text": " need",
     "exact_match": true,
     "margin": 0.0225
    },
    {
     "index": 3,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0318
    },
    {
     "index": 4,
     "prover_text": " lot",
     "verifier_text": " lot",
     "exact_match": true,
     "margin": 0.0592
    },
    {
     "index": 5,
     "prover_text": " of",
     "verifier_text": " all",
     "exact_match": false,
     "margin": 7.2662
    },
    {
     "index": 6,
     "prover_text": " cooling",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 1.1167
    },
    {
     "index": 7,
     "prover_text": " because",
     "verifier_text": " because",
     "exact_match": true,
     "margin": 0.0439
    },
    {
     "index": 8,
     "prover_text": " the",
     "verifier_text": " electricity",
     "exact_match": false,
     "margin": 3.6333
    },
    {
     "index": 9,
     "prover_text": " servers",
     "verifier_text": " it",
     "exact_match": false,
     "margin": 5.9559
    },
    {
     "index": 10,
     "prover_text": " inside",
     "verifier_text": " inside",
     "exact_match": true,
     "margin": 0.0141
    },
    {
     "index": 11,
     "prover_text": " them",
     "verifier_text": " into",
     "exact_match": false,
     "margin": 2.9488
    },
    {
     "index": 12,
     "prover_text": " generate",
     "verifier_text": " generate",
     "exact_match": true,
     "margin": 0.0389
    },
    {
     "index": 13,
     "prover_text": " a",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 4.0272
    },
    {
     "index": 14,
     "prover_text": " large",
     "verifier_text": " and",
     "exact_match": false,
     "margin": 3.2755
    },
    {
     "index": 15,
     "prover_text": " amount",
     "verifier_text": " amount",
     "exact_match": true,
     "margin": 0.0549
    },
    {
     "index": 16,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0435
    },
    {
     "index": 17,
     "prover_text": " heat",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 3.7343
    },
    {
     "index": 18,
     "prover_text": " while",
     "verifier_text": " while",
     "exact_match": true,
     "margin": 0.0494
    },
    {
     "index": 19,
     "prover_text": " they",
     "verifier_text": " can",
     "exact_match": false,
     "margin": 4.6754
    },
    {
     "index": 20,
     "prover_text": " operate",
     "verifier_text": " operate",
     "exact_match": true,
     "margin": 0.0248
    },
    {
     "index": 21,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0283
    },
    {
     "index": 22,
     "prover_text": " Thousands",
     "verifier_text": " Thousands",
     "exact_match": true,
     "margin": 0.0267
    },
    {
     "index": 23,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0583
    },
    {
     "index": 24,
     "prover_text": " processors",
     "verifier_text": " processors",
     "exact_match": true,
     "margin": 0.0459
    },
    {
     "index": 25,
     "prover_text": " running",
     "verifier_text": " running",
     "exact_match": true,
     "margin": 0.0505
    },
    {
     "index": 26,
     "prover_text": " continuously",
     "verifier_text": " in",
     "exact_match": false,
     "margin": 7.2605
    },
    {
     "index": 27,
     "prover_text": " produce",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 2.4086
    },
    {
     "index": 28,
     "prover_text": " heat",
     "verifier_text": " footprint",
     "exact_match": false,
     "margin": 5.2647
    },
    {
     "index": 29,
     "prover_text": " that",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 3.2624
    },
    {
     "index": 30,
     "prover_text": " must",
     "verifier_text": " must",
     "exact_match": true,
     "margin": 0.0432
    },
    {
     "index": 31,
     "prover_text": " be",
     "verifier_text": " be",
     "exact_match": true,
     "margin": 0.0317
    },
    {
     "index": 32,
     "prover_text": " removed",
     "verifier_text": " removed",
     "exact_match": true,
     "margin": 0.0235
    },
    {
     "index": 33,
     "prover_text": " to",
     "verifier_text": " wardrobe",
     "exact_match": false,
     "margin": 5.1667
    },
    {
     "index": 34,
     "prover_text": " keep",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 3.1815
    },
    {
     "index": 35,
     "prover_text": " the",
     "verifier_text": " Silicon",
     "exact_match": false,
     "margin": 0.6029
    },
    {
     "index": 36,
     "prover_text": " equipment",
     "verifier_text": " slows",
     "exact_match": false,
     "margin": 3.2067
    },
    {
     "index": 37,
     "prover_text": " within",
     "verifier_text": " within",
     "exact_match": true,
     "margin": 0.0203
    },
    {
     "index": 38,
     "prover_text": " safe",
     "verifier_text": " and",
     "exact_match": false,
     "margin": 2.0023
    },
    {
     "index": 39,
     "prover_text": " operating",
     "verifier_text": " operating",
     "exact_match": true,
     "margin": 0.0231
    },
    {
     "index": 40,
     "prover_text": " temperatures",
     "verifier_text": " fails",
     "exact_match": false,
     "margin": 7.9441
    },
    {
     "index": 41,
     "prover_text": ".",
     "verifier_text": " when",
     "exact_match": false,
     "margin": 1.5077
    },
    {
     "index": 42,
     "prover_text": " If",
     "verifier_text": " If",
     "exact_match": true,
     "margin": 0.0249
    },
    {
     "index": 43,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.019
    },
    {
     "index": 44,
     "prover_text": " temperature",
     "verifier_text": " hot",
     "exact_match": false,
     "margin": 6.6811
    },
    {
     "index": 45,
     "prover_text": " rises",
     "verifier_text": " rises",
     "exact_match": true,
     "margin": 0.0038
    },
    {
     "index": 46,
     "prover_text": " too",
     "verifier_text": " so",
     "exact_match": false,
     "margin": 2.9243
    },
    {
     "index": 47,
     "prover_text": " high",
     "verifier_text": " that",
     "exact_match": false,
     "margin": 3.7611
    },
    {
     "index": 48,
     "prover_text": ",",
     "verifier_text": " heat",
     "exact_match": false,
     "margin": 4.4339
    },
    {
     "index": 49,
     "prover_text": " hardware",
     "verifier_text": " hardware",
     "exact_match": true,
     "margin": 0.0278
    },
    {
     "index": 50,
     "prover_text": " can",
     "verifier_text": " can",
     "exact_match": true,
     "margin": 0.0577
    },
    {
     "index": 51,
     "prover_text": " slow",
     "verifier_text": " slow",
     "exact_match": true,
     "margin": 0.0464
    },
    {
     "index": 52,
     "prover_text": " down",
     "verifier_text": " down",
     "exact_match": true,
     "margin": 0.0325
    },
    {
     "index": 53,
     "prover_text": ",",
     "verifier_text": " out",
     "exact_match": false,
     "margin": 5.1549
    },
    {
     "index": 54,
     "prover_text": " become",
     "verifier_text": " continuously",
     "exact_match": false,
     "margin": 7.1751
    },
    {
     "index": 55,
     "prover_text": " unreliable",
     "verifier_text": " unreliable",
     "exact_match": true,
     "margin": 0.0284
    },
    {
     "index": 56,
     "prover_text": " or",
     "verifier_text": " or",
     "exact_match": true,
     "margin": 0.0325
    },
    {
     "index": 57,
     "prover_text": " fail",
     "verifier_text": " fail",
     "exact_match": true,
     "margin": 0.0344
    },
    {
     "index": 58,
     "prover_text": " entirely",
     "verifier_text": " entirely",
     "exact_match": true,
     "margin": 0.0125
    },
    {
     "index": 59,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0299
    },
    {
     "index": 60,
     "prover_text": " Cooling",
     "verifier_text": " into",
     "exact_match": false,
     "margin": 6.3565
    },
    {
     "index": 61,
     "prover_text": " systems",
     "verifier_text": " air",
     "exact_match": false,
     "margin": 1.461
    },
    {
     "index": 62,
     "prover_text": " such",
     "verifier_text": " or",
     "exact_match": false,
     "margin": 6.0478
    },
    {
     "index": 63,
     "prover_text": " as",
     "verifier_text": " liquid",
     "exact_match": false,
     "margin": 4.0541
    },
    {
     "index": 64,
     "prover_text": " air",
     "verifier_text": " air",
     "exact_match": true,
     "margin": 0.0064
    },
    {
     "index": 65,
     "prover_text": " conditioning",
     "verifier_text": " conditioning",
     "exact_match": true,
     "margin": 0.0002
    },
    {
     "index": 66,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0363
    },
    {
     "index": 67,
     "prover_text": " liquid",
     "verifier_text": " liquid",
     "exact_match": true,
     "margin": 0.0563
    },
    {
     "index": 68,
     "prover_text": " cooling",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 2.1958
    },
    {
     "index": 69,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0136
    },
    {
     "index": 70,
     "prover_text": " hot",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 4.9086
    },
    {
     "index": 71,
     "prover_text": "-",
     "verifier_text": "-",
     "exact_match": true,
     "margin": 0.0162
    },
    {
     "index": 72,
     "prover_text": "aisle",
     "verifier_text": " is",
     "exact_match": false,
     "margin": 7.6547
    },
    {
     "index": 73,
     "prover_text": " containment",
     "verifier_text": " therefore",
     "exact_match": false,
     "margin": 3.0409
    },
    {
     "index": 74,
     "prover_text": " are",
     "verifier_text": " are",
     "exact_match": true,
     "margin": 0.0454
    },
    {
     "index": 75,
     "prover_text": " used",
     "verifier_text": " an",
     "exact_match": false,
     "margin": 2.7206
    },
    {
     "index": 76,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0353
    },
    {
     "index": 77,
     "prover_text": " maintain",
     "verifier_text": " but",
     "exact_match": false,
     "margin": 3.0534
    },
    {
     "index": 78,
     "prover_text": " stable",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 4.2269
    },
    {
     "index": 79,
     "prover_text": " conditions",
     "verifier_text": " other",
     "exact_match": false,
     "margin": 2.7865
    },
    {
     "index": 80,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0117
    },
    {
     "index": 81,
     "prover_text": " protect",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 3.332
    },
    {
     "index": 82,
     "prover_text": " the",
     "verifier_text": " model",
     "exact_match": false,
     "margin": 1.726
    },
    {
     "index": 83,
     "prover_text": " equipment",
     "verifier_text": " power",
     "exact_match": false,
     "margin": 4.3478
    },
    {
     "index": 84,
     "prover_text": ".",
     "verifier_text": " budget",
     "exact_match": false,
     "margin": 3.3581
    }
   ],
   "exact_match_level_pct": 0.5059,
   "mean_logit_difference": 2.0141,
   "result": "fail"
  }
 },
 {
  "prompt": "Explain to a non-expert, in a short paragraph, what a GPU is for.",
  "honest": {
   "tokens": [
    "A",
    " GPU",
    " is",
    " a",
    " processor",
    " built",
    " to",
    " do",
    " the",
    " same",
    " simple",
    " arithmetic",
    " on",
    " thousands",
    " of",
    " numbers",
    " at",
    " once",
    " rather",
    " than",
    " one",
    " calculation",
    " after",
    " another",
    ".",
    " That",
    " was",
    " originally",
    " for",
    " drawing",
    " pixels",
    ",",
    " where",
    " every",
    " point",
    " on",
    " a",
    " screen",
    " needs",
    " the",
    " same",
    " treatment",
    ",",
    " but",
    " it",
    " turns",
    " out",
    " that",
    " training",
    " and",
    " running",
    " neural",
    " networks",
    " is",
    " the",
    " same",
    " kind",
    " of",
    " problem",
    ":",
    " enormous",
    " grids",
    " of",
    " numbers",
    " multiplied",
    " and",
    " added",
    " in",
    " parallel",
    ".",
    " So",
    " a",
    " GPU",
    " is",
    " what",
    " makes",
    " modern",
    " AI",
    " practical",
    ",",
    " turning",
    " work",
    " that",
    " would",
    " take",
    " a",
    " conventional",
    " processor",
    " days",
    " into",
    " something",
    " that",
    " finishes",
    " in",
    " minutes",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.0192
    },
    {
     "index": 1,
     "prover_text": " GPU",
     "verifier_text": " GPU",
     "exact_match": true,
     "margin": 0.0013
    },
    {
     "index": 2,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.012
    },
    {
     "index": 3,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0048
    },
    {
     "index": 4,
     "prover_text": " processor",
     "verifier_text": " processor",
     "exact_match": true,
     "margin": 0.0294
    },
    {
     "index": 5,
     "prover_text": " built",
     "verifier_text": " built",
     "exact_match": true,
     "margin": 0.0166
    },
    {
     "index": 6,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0094
    },
    {
     "index": 7,
     "prover_text": " do",
     "verifier_text": " do",
     "exact_match": true,
     "margin": 0.0077
    },
    {
     "index": 8,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0251
    },
    {
     "index": 9,
     "prover_text": " same",
     "verifier_text": " same",
     "exact_match": true,
     "margin": 0.021
    },
    {
     "index": 10,
     "prover_text": " simple",
     "verifier_text": " simple",
     "exact_match": true,
     "margin": 0.0244
    },
    {
     "index": 11,
     "prover_text": " arithmetic",
     "verifier_text": " arithmetic",
     "exact_match": true,
     "margin": 0.0189
    },
    {
     "index": 12,
     "prover_text": " on",
     "verifier_text": " on",
     "exact_match": true,
     "margin": 0.0007
    },
    {
     "index": 13,
     "prover_text": " thousands",
     "verifier_text": " thousands",
     "exact_match": true,
     "margin": 0.0
    },
    {
     "index": 14,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0293
    },
    {
     "index": 15,
     "prover_text": " numbers",
     "verifier_text": " numbers",
     "exact_match": true,
     "margin": 0.0078
    },
    {
     "index": 16,
     "prover_text": " at",
     "verifier_text": " at",
     "exact_match": true,
     "margin": 0.0043
    },
    {
     "index": 17,
     "prover_text": " once",
     "verifier_text": " once",
     "exact_match": true,
     "margin": 0.026
    },
    {
     "index": 18,
     "prover_text": " rather",
     "verifier_text": " rather",
     "exact_match": true,
     "margin": 0.0025
    },
    {
     "index": 19,
     "prover_text": " than",
     "verifier_text": " than",
     "exact_match": true,
     "margin": 0.0217
    },
    {
     "index": 20,
     "prover_text": " one",
     "verifier_text": " one",
     "exact_match": true,
     "margin": 0.0224
    },
    {
     "index": 21,
     "prover_text": " calculation",
     "verifier_text": " calculation",
     "exact_match": true,
     "margin": 0.0174
    },
    {
     "index": 22,
     "prover_text": " after",
     "verifier_text": " after",
     "exact_match": true,
     "margin": 0.0163
    },
    {
     "index": 23,
     "prover_text": " another",
     "verifier_text": " another",
     "exact_match": true,
     "margin": 0.0186
    },
    {
     "index": 24,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0135
    },
    {
     "index": 25,
     "prover_text": " That",
     "verifier_text": " That",
     "exact_match": true,
     "margin": 0.0235
    },
    {
     "index": 26,
     "prover_text": " was",
     "verifier_text": " was",
     "exact_match": true,
     "margin": 0.0188
    },
    {
     "index": 27,
     "prover_text": " originally",
     "verifier_text": " originally",
     "exact_match": true,
     "margin": 0.0208
    },
    {
     "index": 28,
     "prover_text": " for",
     "verifier_text": " for",
     "exact_match": true,
     "margin": 0.0234
    },
    {
     "index": 29,
     "prover_text": " drawing",
     "verifier_text": " drawing",
     "exact_match": true,
     "margin": 0.0243
    },
    {
     "index": 30,
     "prover_text": " pixels",
     "verifier_text": " pixels",
     "exact_match": true,
     "margin": 0.0205
    },
    {
     "index": 31,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0166
    },
    {
     "index": 32,
     "prover_text": " where",
     "verifier_text": " where",
     "exact_match": true,
     "margin": 0.0192
    },
    {
     "index": 33,
     "prover_text": " every",
     "verifier_text": " every",
     "exact_match": true,
     "margin": 0.0236
    },
    {
     "index": 34,
     "prover_text": " point",
     "verifier_text": " point",
     "exact_match": true,
     "margin": 0.0174
    },
    {
     "index": 35,
     "prover_text": " on",
     "verifier_text": " on",
     "exact_match": true,
     "margin": 0.0128
    },
    {
     "index": 36,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0061
    },
    {
     "index": 37,
     "prover_text": " screen",
     "verifier_text": " screen",
     "exact_match": true,
     "margin": 0.0021
    },
    {
     "index": 38,
     "prover_text": " needs",
     "verifier_text": " needs",
     "exact_match": true,
     "margin": 0.0111
    },
    {
     "index": 39,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0144
    },
    {
     "index": 40,
     "prover_text": " same",
     "verifier_text": " same",
     "exact_match": true,
     "margin": 0.0224
    },
    {
     "index": 41,
     "prover_text": " treatment",
     "verifier_text": " treatment",
     "exact_match": true,
     "margin": 0.0075
    },
    {
     "index": 42,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0258
    },
    {
     "index": 43,
     "prover_text": " but",
     "verifier_text": " but",
     "exact_match": true,
     "margin": 0.0215
    },
    {
     "index": 44,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0265
    },
    {
     "index": 45,
     "prover_text": " turns",
     "verifier_text": " turns",
     "exact_match": true,
     "margin": 0.0172
    },
    {
     "index": 46,
     "prover_text": " out",
     "verifier_text": " out",
     "exact_match": true,
     "margin": 0.0277
    },
    {
     "index": 47,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.029
    },
    {
     "index": 48,
     "prover_text": " training",
     "verifier_text": " training",
     "exact_match": true,
     "margin": 0.0137
    },
    {
     "index": 49,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0074
    },
    {
     "index": 50,
     "prover_text": " running",
     "verifier_text": " running",
     "exact_match": true,
     "margin": 0.0027
    },
    {
     "index": 51,
     "prover_text": " neural",
     "verifier_text": " neural",
     "exact_match": true,
     "margin": 0.0182
    },
    {
     "index": 52,
     "prover_text": " networks",
     "verifier_text": " networks",
     "exact_match": true,
     "margin": 0.0292
    },
    {
     "index": 53,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0267
    },
    {
     "index": 54,
     "prover_text": " the",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 0.4331
    },
    {
     "index": 55,
     "prover_text": " same",
     "verifier_text": " same",
     "exact_match": true,
     "margin": 0.0193
    },
    {
     "index": 56,
     "prover_text": " kind",
     "verifier_text": " kind",
     "exact_match": true,
     "margin": 0.0157
    },
    {
     "index": 57,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0049
    },
    {
     "index": 58,
     "prover_text": " problem",
     "verifier_text": " problem",
     "exact_match": true,
     "margin": 0.006
    },
    {
     "index": 59,
     "prover_text": ":",
     "verifier_text": ":",
     "exact_match": true,
     "margin": 0.0136
    },
    {
     "index": 60,
     "prover_text": " enormous",
     "verifier_text": " enormous",
     "exact_match": true,
     "margin": 0.0166
    },
    {
     "index": 61,
     "prover_text": " grids",
     "verifier_text": " grids",
     "exact_match": true,
     "margin": 0.0154
    },
    {
     "index": 62,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0219
    },
    {
     "index": 63,
     "prover_text": " numbers",
     "verifier_text": " numbers",
     "exact_match": true,
     "margin": 0.0106
    },
    {
     "index": 64,
     "prover_text": " multiplied",
     "verifier_text": " multiplied",
     "exact_match": true,
     "margin": 0.0147
    },
    {
     "index": 65,
     "prover_text": " and",
     "verifier_text": " and",
     "exact_match": true,
     "margin": 0.0272
    },
    {
     "index": 66,
     "prover_text": " added",
     "verifier_text": " added",
     "exact_match": true,
     "margin": 0.0281
    },
    {
     "index": 67,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0173
    },
    {
     "index": 68,
     "prover_text": " parallel",
     "verifier_text": " parallel",
     "exact_match": true,
     "margin": 0.0216
    },
    {
     "index": 69,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0134
    },
    {
     "index": 70,
     "prover_text": " So",
     "verifier_text": " So",
     "exact_match": true,
     "margin": 0.0141
    },
    {
     "index": 71,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0009
    },
    {
     "index": 72,
     "prover_text": " GPU",
     "verifier_text": " GPU",
     "exact_match": true,
     "margin": 0.0142
    },
    {
     "index": 73,
     "prover_text": " is",
     "verifier_text": " is",
     "exact_match": true,
     "margin": 0.0064
    },
    {
     "index": 74,
     "prover_text": " what",
     "verifier_text": " what",
     "exact_match": true,
     "margin": 0.0152
    },
    {
     "index": 75,
     "prover_text": " makes",
     "verifier_text": " makes",
     "exact_match": true,
     "margin": 0.0099
    },
    {
     "index": 76,
     "prover_text": " modern",
     "verifier_text": " modern",
     "exact_match": true,
     "margin": 0.0118
    },
    {
     "index": 77,
     "prover_text": " AI",
     "verifier_text": " AI",
     "exact_match": true,
     "margin": 0.0036
    },
    {
     "index": 78,
     "prover_text": " practical",
     "verifier_text": " practical",
     "exact_match": true,
     "margin": 0.0265
    },
    {
     "index": 79,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0041
    },
    {
     "index": 80,
     "prover_text": " turning",
     "verifier_text": " turning",
     "exact_match": true,
     "margin": 0.0209
    },
    {
     "index": 81,
     "prover_text": " work",
     "verifier_text": " work",
     "exact_match": true,
     "margin": 0.0149
    },
    {
     "index": 82,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0282
    },
    {
     "index": 83,
     "prover_text": " would",
     "verifier_text": " would",
     "exact_match": true,
     "margin": 0.0158
    },
    {
     "index": 84,
     "prover_text": " take",
     "verifier_text": " takes",
     "exact_match": false,
     "margin": 0.8558
    },
    {
     "index": 85,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0096
    },
    {
     "index": 86,
     "prover_text": " conventional",
     "verifier_text": " conventional",
     "exact_match": true,
     "margin": 0.0201
    },
    {
     "index": 87,
     "prover_text": " processor",
     "verifier_text": " processor",
     "exact_match": true,
     "margin": 0.006
    },
    {
     "index": 88,
     "prover_text": " days",
     "verifier_text": " days",
     "exact_match": true,
     "margin": 0.0046
    },
    {
     "index": 89,
     "prover_text": " into",
     "verifier_text": " into",
     "exact_match": true,
     "margin": 0.0052
    },
    {
     "index": 90,
     "prover_text": " something",
     "verifier_text": " something",
     "exact_match": true,
     "margin": 0.014
    },
    {
     "index": 91,
     "prover_text": " that",
     "verifier_text": " that",
     "exact_match": true,
     "margin": 0.0085
    },
    {
     "index": 92,
     "prover_text": " finishes",
     "verifier_text": " finishes",
     "exact_match": true,
     "margin": 0.0254
    },
    {
     "index": 93,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0188
    },
    {
     "index": 94,
     "prover_text": " minutes",
     "verifier_text": " minutes",
     "exact_match": true,
     "margin": 0.0086
    },
    {
     "index": 95,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0187
    }
   ],
   "exact_match_level_pct": 0.9792,
   "mean_logit_difference": 0.0288,
   "result": "pass"
  },
  "liar": {
   "tokens": [
    "A",
    " GPU",
    ",",
    " or",
    " graphics",
    " processing",
    " unit",
    ",",
    " is",
    " a",
    " special",
    " type",
    " of",
    " computer",
    " chip",
    " designed",
    " to",
    " handle",
    " many",
    " calculations",
    " at",
    " the",
    " same",
    " time",
    ".",
    " It",
    " was",
    " originally",
    " created",
    " to",
    " render",
    " images",
    " and",
    " video",
    " games",
    " quickly",
    ",",
    " but",
    " its",
    " ability",
    " to",
    " process",
    " large",
    " amounts",
    " of",
    " data",
    " in",
    " parallel",
    " makes",
    " it",
    " very",
    " useful",
    " for",
    " other",
    " tasks",
    " too",
    ".",
    " Today",
    " GPUs",
    " are",
    " widely",
    " used",
    " for",
    " artificial",
    " intelligence",
    ",",
    " scientific",
    " research",
    " and",
    " data",
    " analysis",
    ",",
    " where",
    " they",
    " can",
    " perform",
    " complex",
    " computations",
    " much",
    " faster",
    " than",
    " a",
    " regular",
    " processor",
    "."
   ],
   "comparison": [
    {
     "index": 0,
     "prover_text": "A",
     "verifier_text": "A",
     "exact_match": true,
     "margin": 0.0358
    },
    {
     "index": 1,
     "prover_text": " GPU",
     "verifier_text": " GPU",
     "exact_match": true,
     "margin": 0.0203
    },
    {
     "index": 2,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.052
    },
    {
     "index": 3,
     "prover_text": " or",
     "verifier_text": " or",
     "exact_match": true,
     "margin": 0.0265
    },
    {
     "index": 4,
     "prover_text": " graphics",
     "verifier_text": " graphics",
     "exact_match": true,
     "margin": 0.0341
    },
    {
     "index": 5,
     "prover_text": " processing",
     "verifier_text": " built",
     "exact_match": false,
     "margin": 0.8538
    },
    {
     "index": 6,
     "prover_text": " unit",
     "verifier_text": " unit",
     "exact_match": true,
     "margin": 0.0046
    },
    {
     "index": 7,
     "prover_text": ",",
     "verifier_text": " do",
     "exact_match": false,
     "margin": 2.9158
    },
    {
     "index": 8,
     "prover_text": " is",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 3.0751
    },
    {
     "index": 9,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.0557
    },
    {
     "index": 10,
     "prover_text": " special",
     "verifier_text": " special",
     "exact_match": true,
     "margin": 0.0019
    },
    {
     "index": 11,
     "prover_text": " type",
     "verifier_text": " type",
     "exact_match": true,
     "margin": 0.0485
    },
    {
     "index": 12,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0475
    },
    {
     "index": 13,
     "prover_text": " computer",
     "verifier_text": " computer",
     "exact_match": true,
     "margin": 0.035
    },
    {
     "index": 14,
     "prover_text": " chip",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 6.5634
    },
    {
     "index": 15,
     "prover_text": " designed",
     "verifier_text": " designed",
     "exact_match": true,
     "margin": 0.0261
    },
    {
     "index": 16,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0506
    },
    {
     "index": 17,
     "prover_text": " handle",
     "verifier_text": " once",
     "exact_match": false,
     "margin": 2.2974
    },
    {
     "index": 18,
     "prover_text": " many",
     "verifier_text": " rather",
     "exact_match": false,
     "margin": 1.929
    },
    {
     "index": 19,
     "prover_text": " calculations",
     "verifier_text": " calculations",
     "exact_match": true,
     "margin": 0.0537
    },
    {
     "index": 20,
     "prover_text": " at",
     "verifier_text": " at",
     "exact_match": true,
     "margin": 0.0337
    },
    {
     "index": 21,
     "prover_text": " the",
     "verifier_text": " the",
     "exact_match": true,
     "margin": 0.0039
    },
    {
     "index": 22,
     "prover_text": " same",
     "verifier_text": " same",
     "exact_match": true,
     "margin": 0.0488
    },
    {
     "index": 23,
     "prover_text": " time",
     "verifier_text": " another",
     "exact_match": false,
     "margin": 6.3641
    },
    {
     "index": 24,
     "prover_text": ".",
     "verifier_text": " which",
     "exact_match": false,
     "margin": 6.9658
    },
    {
     "index": 25,
     "prover_text": " It",
     "verifier_text": " It",
     "exact_match": true,
     "margin": 0.0062
    },
    {
     "index": 26,
     "prover_text": " was",
     "verifier_text": " results",
     "exact_match": false,
     "margin": 3.4631
    },
    {
     "index": 27,
     "prover_text": " originally",
     "verifier_text": " and",
     "exact_match": false,
     "margin": 0.8057
    },
    {
     "index": 28,
     "prover_text": " created",
     "verifier_text": " for",
     "exact_match": false,
     "margin": 1.2527
    },
    {
     "index": 29,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0235
    },
    {
     "index": 30,
     "prover_text": " render",
     "verifier_text": " render",
     "exact_match": true,
     "margin": 0.0119
    },
    {
     "index": 31,
     "prover_text": " images",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 6.3662
    },
    {
     "index": 32,
     "prover_text": " and",
     "verifier_text": " where",
     "exact_match": false,
     "margin": 2.2548
    },
    {
     "index": 33,
     "prover_text": " video",
     "verifier_text": " video",
     "exact_match": true,
     "margin": 0.0095
    },
    {
     "index": 34,
     "prover_text": " games",
     "verifier_text": " point",
     "exact_match": false,
     "margin": 7.6529
    },
    {
     "index": 35,
     "prover_text": " quickly",
     "verifier_text": " on",
     "exact_match": false,
     "margin": 3.4577
    },
    {
     "index": 36,
     "prover_text": ",",
     "verifier_text": ",",
     "exact_match": true,
     "margin": 0.0258
    },
    {
     "index": 37,
     "prover_text": " but",
     "verifier_text": " but",
     "exact_match": true,
     "margin": 0.0045
    },
    {
     "index": 38,
     "prover_text": " its",
     "verifier_text": " needs",
     "exact_match": false,
     "margin": 1.7561
    },
    {
     "index": 39,
     "prover_text": " ability",
     "verifier_text": " ability",
     "exact_match": true,
     "margin": 0.0279
    },
    {
     "index": 40,
     "prover_text": " to",
     "verifier_text": " to",
     "exact_match": true,
     "margin": 0.0015
    },
    {
     "index": 41,
     "prover_text": " process",
     "verifier_text": " treatment",
     "exact_match": false,
     "margin": 2.9745
    },
    {
     "index": 42,
     "prover_text": " large",
     "verifier_text": " large",
     "exact_match": true,
     "margin": 0.0364
    },
    {
     "index": 43,
     "prover_text": " amounts",
     "verifier_text": " amounts",
     "exact_match": true,
     "margin": 0.0294
    },
    {
     "index": 44,
     "prover_text": " of",
     "verifier_text": " of",
     "exact_match": true,
     "margin": 0.0412
    },
    {
     "index": 45,
     "prover_text": " data",
     "verifier_text": " turns",
     "exact_match": false,
     "margin": 5.0071
    },
    {
     "index": 46,
     "prover_text": " in",
     "verifier_text": " in",
     "exact_match": true,
     "margin": 0.0319
    },
    {
     "index": 47,
     "prover_text": " parallel",
     "verifier_text": " that",
     "exact_match": false,
     "margin": 5.3466
    },
    {
     "index": 48,
     "prover_text": " makes",
     "verifier_text": " training",
     "exact_match": false,
     "margin": 6.3971
    },
    {
     "index": 49,
     "prover_text": " it",
     "verifier_text": " it",
     "exact_match": true,
     "margin": 0.0037
    },
    {
     "index": 50,
     "prover_text": " very",
     "verifier_text": " very",
     "exact_match": true,
     "margin": 0.0423
    },
    {
     "index": 51,
     "prover_text": " useful",
     "verifier_text": " neural",
     "exact_match": false,
     "margin": 1.1464
    },
    {
     "index": 52,
     "prover_text": " for",
     "verifier_text": " for",
     "exact_match": true,
     "margin": 0.0553
    },
    {
     "index": 53,
     "prover_text": " other",
     "verifier_text": " is",
     "exact_match": false,
     "margin": 5.9326
    },
    {
     "index": 54,
     "prover_text": " tasks",
     "verifier_text": " the",
     "exact_match": false,
     "margin": 2.0413
    },
    {
     "index": 55,
     "prover_text": " too",
     "verifier_text": " same",
     "exact_match": false,
     "margin": 4.4475
    },
    {
     "index": 56,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0373
    },
    {
     "index": 57,
     "prover_text": " Today",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 3.6621
    },
    {
     "index": 58,
     "prover_text": " GPUs",
     "verifier_text": " GPUs",
     "exact_match": true,
     "margin": 0.0068
    },
    {
     "index": 59,
     "prover_text": " are",
     "verifier_text": " are",
     "exact_match": true,
     "margin": 0.0334
    },
    {
     "index": 60,
     "prover_text": " widely",
     "verifier_text": " widely",
     "exact_match": true,
     "margin": 0.0412
    },
    {
     "index": 61,
     "prover_text": " used",
     "verifier_text": " grids",
     "exact_match": false,
     "margin": 5.4093
    },
    {
     "index": 62,
     "prover_text": " for",
     "verifier_text": " of",
     "exact_match": false,
     "margin": 1.6975
    },
    {
     "index": 63,
     "prover_text": " artificial",
     "verifier_text": " artificial",
     "exact_match": true,
     "margin": 0.0325
    },
    {
     "index": 64,
     "prover_text": " intelligence",
     "verifier_text": " intelligence",
     "exact_match": true,
     "margin": 0.0255
    },
    {
     "index": 65,
     "prover_text": ",",
     "verifier_text": " and",
     "exact_match": false,
     "margin": 6.6826
    },
    {
     "index": 66,
     "prover_text": " scientific",
     "verifier_text": " scientific",
     "exact_match": true,
     "margin": 0.0077
    },
    {
     "index": 67,
     "prover_text": " research",
     "verifier_text": " in",
     "exact_match": false,
     "margin": 1.658
    },
    {
     "index": 68,
     "prover_text": " and",
     "verifier_text": " parallel",
     "exact_match": false,
     "margin": 7.4719
    },
    {
     "index": 69,
     "prover_text": " data",
     "verifier_text": ".",
     "exact_match": false,
     "margin": 2.8801
    },
    {
     "index": 70,
     "prover_text": " analysis",
     "verifier_text": " analysis",
     "exact_match": true,
     "margin": 0.0146
    },
    {
     "index": 71,
     "prover_text": ",",
     "verifier_text": " a",
     "exact_match": false,
     "margin": 6.9347
    },
    {
     "index": 72,
     "prover_text": " where",
     "verifier_text": " where",
     "exact_match": true,
     "margin": 0.0203
    },
    {
     "index": 73,
     "prover_text": " they",
     "verifier_text": " is",
     "exact_match": false,
     "margin": 6.6883
    },
    {
     "index": 74,
     "prover_text": " can",
     "verifier_text": " what",
     "exact_match": false,
     "margin": 0.905
    },
    {
     "index": 75,
     "prover_text": " perform",
     "verifier_text": " perform",
     "exact_match": true,
     "margin": 0.0568
    },
    {
     "index": 76,
     "prover_text": " complex",
     "verifier_text": " complex",
     "exact_match": true,
     "margin": 0.0484
    },
    {
     "index": 77,
     "prover_text": " computations",
     "verifier_text": " computations",
     "exact_match": true,
     "margin": 0.0216
    },
    {
     "index": 78,
     "prover_text": " much",
     "verifier_text": " much",
     "exact_match": true,
     "margin": 0.0415
    },
    {
     "index": 79,
     "prover_text": " faster",
     "verifier_text": ",",
     "exact_match": false,
     "margin": 6.4164
    },
    {
     "index": 80,
     "prover_text": " than",
     "verifier_text": " than",
     "exact_match": true,
     "margin": 0.0028
    },
    {
     "index": 81,
     "prover_text": " a",
     "verifier_text": " a",
     "exact_match": true,
     "margin": 0.044
    },
    {
     "index": 82,
     "prover_text": " regular",
     "verifier_text": " regular",
     "exact_match": true,
     "margin": 0.0251
    },
    {
     "index": 83,
     "prover_text": " processor",
     "verifier_text": " processor",
     "exact_match": true,
     "margin": 0.0273
    },
    {
     "index": 84,
     "prover_text": ".",
     "verifier_text": ".",
     "exact_match": true,
     "margin": 0.0544
    }
   ],
   "exact_match_level_pct": 0.5882,
   "mean_logit_difference": 1.684,
   "result": "fail"
  }
 }
];
