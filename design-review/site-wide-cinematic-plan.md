# Xentra Technologies — Site-wide Cinematic Plan

**Status:** proposal for review. Apart from the Hero → About transition (built, awaiting review), no code has changed for this plan.
**Prepared:** 12 November 2026
**Reference:** the earlier reference video (analysis in `motion-plan.md`) and the metallic-X circuit artwork you sent. No new screen recording was attached to the latest brief; if it differs, please re-send it.

---

## 1. Audit — the site today

| Page | Sections (in order) | Tone | Current motion | Gap against the brief |
|---|---|---|---|---|
| **Home** | Hero | black | 3D X, CSS/GSAP text entrance, scroll exit | ✅ rebuilt: name / X / tagline |
| | About (intro) | black | X pops up from the energy curve, circuit traces | ✅ rebuilt; copy is still two full paragraphs (brief asks for short statements) |
| | Services showcase | black | pinned two-panel showcase (old 2 groups) | Old group names, not the 8 approved services; panel layout, not "holographic, connected" |
| | Why Xentra | navy | network sphere + 4 reason cards | Doesn't express Strategy · Technology · Growth |
| | Industries | black | 10 icon tiles | A plain grid; long for a "short" homepage |
| | How We Work (preview) | light | step timeline | Not a "journey"; no progress indicators |
| | Enquiry band | black | light trails | No X; trails don't converge on the CTA |
| **About** | Background (globe + words) | white | pinned globe scene | Globe, not the X / ecosystem |
| | Mission & Vision | navy | horizon dial | ✅ approved; needs to join the thread |
| | Values · Commitment · Enquiry | light · black · black | reveals | Independent fades |
| **Services** | Header · 8-card catalog · Approach · Vision · Enquiry | black · white · … | cards rise + tilt (just approved) | A card grid — the brief asks to avoid plain grids |
| **How We Work** | Process (full) · Enquiry | light · black | timeline | Not a five-stage animated journey |
| **Contact** | Header · picker · direct links | black · navy | reveals | No X finale |
| **Privacy / Case studies** | text | white | reveals | Keep calm; system styling only |
| **Footer** | — | black | — | No closing thread |

**Already in place and reused (no new dependencies):**
- **GSAP / ScrollTrigger / SplitText** (`components/motion/gsap.ts`) and declarative reveals (`MotionRoot`).
- **One three.js scene** (`mark-scene.ts`, lazy-loaded, paused off screen), now with exit, pop-up and fit APIs.
- **Energy-curve geometry** (`energy-curve.ts`), with one path split across sections.
- **Global particle canvas** (`ParticleField.tsx`: blue and silver, adapts to the section tone, light on phones).

---

## 2. Global system (every page)

| Layer | What | How (performance) |
|---|---|---|
| **Atmosphere** | Black / navy grounds, electric-blue pools of light, silver highlights | CSS gradients only |
| **Particles** | The existing field becomes continuous with scroll: particles drift slightly against the scroll direction and gather where a section asks for it (`data-particles="calm \| gather"`) | The same single canvas; no extra loops |
| **Energy thread** | Thin glowing blue curves that leave one section's focal object and arrive at the next one's, drawn by scroll, always **behind text** | Generalise `HeroAboutStage` into a page-level **`XStage`**: one controller per page, SVG windows per section (as now), redrawn only on scroll |
| **The X** | The official geometry, used deliberately (see §4) | **One WebGL canvas per page at most.** It moves between slots while invisible and pops up at each one. Elsewhere, the flat SVG X as a small motif |
| **Typography** | Short statements, masked line reveals, silver gradient for the wordmark, blue gradient for the accent phrase | Existing tokens |
| **Section transitions** | The exit of one section hands over to the entrance of the next: the thread arrives, then the section's object answers | No new pins except those listed in §3 |

**Rules carried over:**
- No effect ever covers text or buttons. The thread sits under text; the canvas sits only over its own slot.
- Native scroll. At most **one pinned scene per page**.
- Reduced motion: a finished static frame everywhere. No JS / no WebGL: SVG X and full content.
- Phone budget: about 45% idle main thread (measured the same way as before).

---

## 3. Section by section

### Home (kept short)
| # | Section | Tone | Signature motion | Thread |
|---|---|---|---|---|
| 1 | **Hero** — name / 3D X / tagline / 2 CTAs | black | X builds; on scroll it dissolves into the thread | starts under the X |
| 2 | **About** — X + one statement + one short line + link | black | X pops up from the thread. As you scroll on, its circuit traces grow into a small **business ecosystem**: nodes light up and links connect (labels = the approved service group names) | arrives at the X; leaves from the ecosystem's last node |
| 3 | **Services** — the **8 approved core services** as floating holographic glass tiles, connected by lines, around a small X motif | navy-black | Tiles drift in depth (parallax). On hover / tap a tile lifts, glows and shows its name plus one approved point; links pulse toward it. Desktop: a short pin while the constellation assembles. **Replaces the old 2-group showcase.** | arrives at the constellation's centre |
| 4 | **Why Xentra** — Strategy · Technology · Growth triad | navy | Three nodes draw a triangle with scroll; the 4 approved reasons attach to it one by one; energy travels around the triangle. Replaces the sphere. | enters at "Strategy", leaves from "Growth" |
| 5 | **Industries** — 10 approved names | black | A compact orbiting ring / marquee of names along one curved line (not a grid) | the thread *is* the ring's line |
| 6 | **How We Work** — 5 stages, preview | **light** (contrast) | A horizontal journey: progress line fills, stage markers light in turn, numbers count | blue thread turns into the progress line |
| 7 | **Contact finale** — metallic X + WhatsApp CTA | black | The X returns (same canvas, third slot) while blue light trails converge on it and on the WhatsApp button | all threads end here |
| — | **Footer** | black | One last faint curve closes under the logo | ends |

### About page
| Section | Tone | Motion | X |
|---|---|---|---|
| Header / Background | black (from white) | The 3D X (slot 1) with "Strategy. Technology. Growth." parting around it — the globe goes | 3D |
| Mission & Vision | navy | Approved horizon dial; the thread arrives at its pivot | motif |
| Values | light | 6 values as connected nodes along a line (cards kept, linked) | — |
| Commitment + Contact finale | black | As Home #7 | 3D (slot 2) |

### Services page
| Section | Tone | Motion | X |
|---|---|---|---|
| Header | black | Short statement; the thread starts at a small X motif | motif |
| 8 services | navy-black | **Option A (recommended):** a holographic "spine". The services alternate left and right along one vertical energy thread, and each card is a translucent glass panel joined to the thread by a node that lights as you reach it (the content and the just-approved rise and tilt stay). **Option B:** keep the approved card grid here and do the holographic treatment on Home only. | — |
| Approach (5 stages) | light | Same journey component as How We Work | — |
| Vision + Contact finale | black | As Home #7 | 3D |

### How We Work page
| Section | Tone | Motion |
|---|---|---|
| Five-stage journey | **light** | **The one pin on this page** (desktop): a horizontal track, with the progress line filling and the stages arriving one by one. Phones: a vertical track with a sticky progress indicator. |
| Contact finale | black | As Home #7, with the 3D X |

### Contact page
Header → picker → **finale**: a large 3D X, light trails converging, the WhatsApp CTA directly under it. The WhatsApp behaviour stays unchanged.

### Leadership
Not included until real portraits exist (no generated people). When added: masked portrait reveals with subtle parallax, no 3D.

### Privacy / Case studies
Global atmosphere, particles and reveals only. No X, no thread (keeps legal text calm).

---

## 4. Where the 3D X appears

| Page | 3D slots (one canvas, moving) | SVG motif |
|---|---|---|
| Home | Hero → About → Contact finale | Services centre, Why centre |
| About | Background → Contact finale | Mission & Vision pivot |
| Services | Contact finale | Header |
| How We Work | Contact finale | — |
| Contact | Finale | — |
| Privacy, Case studies | — | — |

Geometry and proportions always come from `mark-geometry.ts` (traced from the official logo). The navbar logo is untouched.

## 5. Dark / light map

Dark is the default (black, navy). **Light sections:** How We Work (journey), About › Values, Services › Approach — contrast moments where the blue thread becomes the progress line. All others are dark.

---

## 6. Order of work (each one shown for review)

1. **Hero → About** — built (this review).
2. **Global layer:** `XStage` (multi-slot single canvas and threads across pages), particle scroll continuity, Contact finale (all pages, since it closes every page).
3. **Home About → ecosystem growth**, and shorter Home copy.
4. **Home Services constellation.**
5. **Why Xentra triad.**
6. **Industries ring.**
7. **How We Work journey** (Home preview and page, light).
8. **About page** (X replaces the globe; Values linked).
9. **Services page** (option A or B).
10. **Contact page, footer, secondary pages; site-wide performance and accessibility pass.**

## 7. Decisions needed from you

1. **Five stages:** How We Work uses *Understand · Research and analyse · Agree on a plan · Execute · Measure and refine*, while the services sheet uses *Discover · Analyze · Strategize · Execute · Optimize*. Which set is official everywhere?
2. **Services page:** option A (holographic spine) or B (keep the approved grid)?
3. **Home About copy:** shorten to the statement plus the first sentence of the overview (the full overview stays on About)?
4. **Industries on Home:** keep as a compact ring, or move it to the Services page?
