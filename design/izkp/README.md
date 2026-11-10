# IZKP edition — design mockups

The mockups the zero-knowledge edition (`izkp/`) was built from. They were
drawn on a Claude Design canvas and exported here as plain HTML, one file per
frame, with a PNG of each in `png/`. Open any `.html` file in a browser; no
server is needed.

| File | Frame | Built as |
| --- | --- | --- |
| `Main.html` | Poster: the whole scheme on one page (1440 × 900) | Not built yet. A handout or a single slide. |
| `P1-Seal.html` … `P5-Check.html` | The five steps as a flat diagram (1280 × 720) | `izkp/steps.html` |
| `S1-Claims.html` … `S6-Prover.html` | Storyboard: the claim and fitting the hardware | `izkp/index.html`, views 1 to 7 |
| `S7-Seal.html` … `S11-Check.html` | Storyboard: one check, step by step | `izkp/index.html`, views 8 to 12 |
| `C1-Console.html` | The console in its final state | `izkp/console.html` |
| `C2-Closing.html` | Closing slide | the presentation's contact slide |

The storyboard frames use renders of the real 3D scene as backdrops
(`img/`), with the caption, watermark and arrows drawn over them as editable
text. Change a caption in the mockup first, then in the `caption` map in
`src/install_viewer.js`.

## Visual rules these follow

Taken from `presentation.html`, so the edition reads as the same family:

- **One idea per view, one sentence per idea.** The caption is the only prose
  on screen. If a view needs two sentences, it is two views.
- **Iceberg Light.** Background `#e8e9ec`, hardware `#33374c`. Colour means
  role and nothing else: blue `#2d539e` is user traffic, orange `#c57339` is
  the certifier and whatever the verifier has picked, green `#668e3d` is the
  record and a pass, violet `#7759b4` is the prover, the fingerprint and the
  proof.
- **Captions in IBM Plex Serif** on a warm beige panel at the lower left.
  **Labels in IBM Plex Mono.** No other typefaces.
- **Two round arrows** at the bottom centre are the only controls.
- **The same five captions everywhere**: the 3D presentation, the flat page
  and the poster use the same words for the same step.

## Regenerating

The exports are generated from the canvas files; edit the canvas, then export
again. The canvas itself is private to its owner. If you only need to change
one frame, editing the `.html` here directly is fine: each file is
self-contained and uses the fonts in `assets/fonts/`.
