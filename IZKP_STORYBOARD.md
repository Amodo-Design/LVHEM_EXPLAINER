# Zero-knowledge inference verification — storyboard

This is the zero-knowledge (IZKP) edition of the presentation. It explains one
claim, "only approved model X is serving inference", checked in a way that
never gives the verifier the model. It is an explanation: it runs no model and
produces no proof.

Open `izkp/index.html` through the local server (`/izkp/` on the deployed
image). The recomputation presentation (`presentation.html`) is unchanged.

## The idea in five steps

| Step | What happens | Who does it |
| --- | --- | --- |
| 1. Seal | A fingerprint of the model is made and given to the verifier. The model stays where it is. | Prover |
| 2. Serve and record | Users are served as normal. Every answer that leaves is added to the verifier's record. | Certifier |
| 3. Sample | One recorded answer is picked at random. | Verifier |
| 4. Prove | A proof is produced that the picked answer came from the sealed model. | Prover |
| 5. Check | The proof is checked against the fingerprint and the record. | Verifier |

Each step is one view with one caption. Nothing else is said on screen.

## Views

| View | Caption | Visual action |
| --- | --- | --- |
| Claim | (card) Prover makes a claim that is checked by the verifier. | Beige card over the full data hall. |
| Data hall | none | 256 racks, fast fabric and frontend Ethernet. |
| Zoom | none | Three racks in focus, the rest faded to 18%. |
| Inference units | Split the cluster into "inference units" | Fast links fade while the racks move apart. |
| Certifier | Fit the Network Certifier | A sealed unit is lowered onto the exit tray. A verifier console appears outside the boundary. |
| Certifier, close | Nothing leaves without passing through it | Camera moves in; three tags name its parts. |
| Prover | Add a prover beside the model | One ordinary rack, banded violet, joins the units. |
| 1. Seal | Seal the model. Only a fingerprint leaves | A fingerprint travels out through the certifier and stays beside the verifier's screen. |
| 2. Serve and record | Serve users as normal. Every answer is recorded | Green records travel from the certifier to the verifier; the list on its screen grows row by row. |
| 3. Sample | The verifier picks one answer at random | One row on the screen turns orange; a request travels in to the prover. |
| 4. Prove | The prover shows it came from the sealed model | The prover rack glows while it works; a proof travels out. |
| 5. Check | The verifier checks the proof. It never sees the model | The screen turns green; a tick appears. |
| Console | (interactive) | Two data centres claim sealed model X; one has swapped it. The forward arrow walks both through recorded, picked, proved, checked. |
| Contact | (closing slide) | |

The first seven views, the hardware and the name tags are shared with the
zero-knowledge walkthrough on `claude/upbeat-newton-ik12rq`
(`src/zk_scene.js`, `src/scene_tags.js`). This edition adds views 2 and 3 of
the five, and splits its single "prove an answer" view into prove and check.

## The same story, flat

`izkp/steps.html` shows the five steps as a flat diagram with the same five
captions: data centre, model, prover, certifier, users and verifier as boxes,
with labelled chips travelling along the links. It needs no WebGL and loads
at once, for a laptop without a GPU or a slide that has to be a picture. The
forward arrow after step 5 picks another answer.

## Scope: what this does and does not claim

- **Nothing is computed.** The 3D views are animation. The console's answers
  are fixtures written for the page, and its "proving" is a three-second wait.
- **A fingerprint, not the model.** "Sealed" means the prover has committed to
  one set of weights before serving starts. How that commitment is tied to the
  weights actually loaded in the racks is a requirement, not something the
  animation shows.
- **The verifier chooses, and the prover cannot predict the choice.** The
  walkthrough shows one pick. Unpredictable sampling is a requirement of the
  scheme.
- **Only a sample is proved.** Proving costs far more than serving, so the
  verifier asks for proofs of some answers, not all. A passing sample is
  evidence about the sampled answer; it is not a proof about every answer that
  left the data centre.
- **The record must be complete.** The check is only as good as the
  certifier's record of what left. The certifier therefore has to be trusted
  by both sides and impossible to bypass. Tamper evidence, attestation and the
  hardware that would provide them are not depicted.
- **Answers are recorded in the clear here.** A version in which the verifier
  holds only a commitment to each answer, and never reads it, is not shown.
- **A swapped model fails by having nothing to show.** In the console, the
  data centre that swapped its model cannot produce a proof for its answer
  against the sealed fingerprint. A correct answer from the wrong model fails
  too: example 4 is there to make that point.
- **The inference-unit split is inherited.** Removing the fast fabric and
  separating the racks comes from the inference-only proposal that the
  recomputation walkthrough explains (`INSTALLATION_STORYBOARD.md`). Its
  caveats apply here unchanged.

## Design files

`design/izkp/` holds the mockups this edition was built from: a one-page
poster of the whole scheme, the five step frames, the console, and a
storyboard of the 3D views. See `design/izkp/README.md`.
