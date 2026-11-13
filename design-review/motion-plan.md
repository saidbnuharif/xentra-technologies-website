# Xentra Technologies — Cinematic Scroll Experience: Analysis & Motion Plan

**Status:** proposal for review. No site code has changed for this plan.
**Prepared:** 12 November 2026
**Reference:** screen capture of a YouTube Short ("Smooth Scroll Down Animation", 13.2 s). The demo website is a creative studio site ("Scarabynth") in purple on black.

---

## 1. What the reference actually does

I extracted 40 frames from the clip and studied the demo site. It loops through three scenes:

| Time | Scene | What happens on scroll |
|---|---|---|
| 0–1.5 s | **Intro**: full-bleed purple particle burst behind a centred paragraph, small stat "+78" and round icon buttons | The burst expands and dims; the text block lifts away |
| 1.5–5 s | **Hero**: huge serif display type "©SCARABYNTH / BORN OF / MYTH" with a 3D creature placed *between* the letters | The 3D object sits in front of some letters and behind others (depth layering). Lines are revealed and removed through masks, one line at a time. |
| 5–9 s | **Second scene**: "BORN [crystal] NATURE" with labels "BUILT FOR THE FUTURE" / "WE TRANSCEND DIMENSIONS" | "BORN" stays on screen while the second word changes (MYTH → NATURE). The headline splits left and right to make room for a new 3D object, which morphs out of the previous one. Small labels fade in at the corners. |
| 9–13 s | Loops back to the intro | — |

**The techniques that make it feel cinematic:**
1. **A pinned stage with scrubbed scenes.** The page stays in place while scroll drives a sequence of scenes. Content changes inside one frame instead of new sections sliding up.
2. **Display typography as the main event.** Huge words, masked line-by-line reveals, and words that split apart around an object.
3. **Interleaved depth.** One 3D object sits between layers of type, so text and object share the same space.
4. **Continuity between scenes.** One object turns into the next, and a key word stays while its partner changes. Nothing simply fades out and back in.
5. **Quiet microcopy.** Small uppercase labels in the corners appear late in each scene.
6. **One accent colour on near-black.** Everything else is restrained.
7. **Smoothness from easing, not hijacking.** The movement is eased (scrub smoothing). Nothing in the clip needs a smooth-scroll library; the same feel comes from smoothed ScrollTrigger scrubbing on native scroll.

**Not adopted:**
- the purple palette, organic or creature imagery, and video backgrounds
- giant serif type: Xentra's identity is Geist sans, electric blue, silver and black
- an intro particle burst replacing the hero: your hero must show the full 3D X on load

---

## 2. Audit: what we already have

| Piece | Where | Reuse |
|---|---|---|
| GSAP + ScrollTrigger + SplitText, one registration | `components/motion/gsap.ts` | Foundation for everything |
| Declarative reveals (`data-reveal` up/fade/clip/line/lines, groups, parallax, draw) | `MotionRoot.tsx` | Keep for small reveals; extend with scene and scrub attributes |
| Hero 3D X (three.js, lazy-loaded, paused off screen, tilts with scroll) | `hero/mark-scene.ts` | Stays the **only** three.js scene; gains scroll-driven camera and light movement |
| Pinned, scrubbed, snapping services showcase | `ServicesExperience.tsx` | Keep as is (approved) |
| Scroll-linked stage timeline with spark | `ProcessTimeline.tsx` | Basis for the Approach journey |
| Network sphere (SVG, turns only while visible) | `why/NetworkSphere.tsx` | Basis for the About network visual |
| Particle field (fixed canvas, tone-aware, light on mobile) | `effects/ParticleField.tsx` | Gains gentle per-section behaviour |
| Section edges, cursor spotlight, visibility flag, accent text | `ui/*` | Shared visual language |

**Measured baseline** (production build, phone, CPU slowed 4×): about 42% main-thread load while idle on Home. This is the ceiling to stay under. CLS is 0, and reduced motion and no-JS fallbacks exist everywhere.

---

## 3. Motion design system (proposal)

**One rule above all:** each section gets **one signature moment**. Everything else is quiet support (masked line reveals, small fades).

| Token | Value |
|---|---|
| Ease (in-view reveals) | `power3.out` / CSS `cubic-bezier(.2,.7,.2,1)` |
| Ease (scrubbed scenes) | `none` on the timeline, with smoothing from `scrub: 0.8` (desktop) and `scrub: 0.4` (touch) |
| Durations | 0.45 s UI · 0.8 s reveals · 1.2 s cinematic entrances |
| Stagger | 0.07 s words · 0.12 s items |
| Typography reveal | Masked lines (SplitText); words split apart around a visual where a section has one |
| Depth | 3 parallax planes: background light (slow), visual (medium), type (native speed) |
| Continuity | Each section hands one element to the next: a light trail, a colour, or a shape |

**New shared building blocks** (small, reusable, no new libraries):
- **`SceneTimeline`:** a client wrapper for scrubbed scene sequences. It handles pinning on desktop only, scroll length, reduced motion (static final frame) and clean-up.
- **`SplitHeadline`:** masked line or word reveals, plus an option to part words around a central visual.
- **`DepthLayer`:** declarative parallax planes (`data-depth="1|2|3"`) driven by one shared ScrollTrigger per section.
- **Motion budget:** looping animations run only while their section is on screen, using the existing InViewFlag and ScrollTrigger toggle pattern.

---

## 4. Section by section

| Section | Signature moment | Scroll type |
|---|---|---|
| **Hero** | The 3D X is fully visible on load (as now). On scroll, the camera dollies in, the X turns, its rim light sweeps, and the headline lines exit through masks while the X lifts away. Ends by handing a light trail to the next section. | **Normal scroll** with scrubbed camera and light. A pin would delay the content and isn't needed. |
| **About** (Home intro and About page) | A business-network globe: connections draw between nodes **as you scroll**, and the headline words part around it as in the reference ("BORN ⟨object⟩ NATURE" becomes "Strategy ⟨globe⟩ Growth"). Built from the existing SVG sphere; no second three.js scene. | **Short pin on desktop** (about one screen), normal scroll on phones |
| **Mission & Vision** | Direction and expansion: a horizon line with a compass-like beam that turns from Mission to Vision, while rings expand outward as the Vision text arrives. | Normal scroll, scrubbed |
| **Services** (Home showcase) | Already pinned and approved. Adds a clearer depth hand-off between panels (outgoing card recedes, incoming one rises from depth). | **Pinned** (existing) |
| **Services** (Services page) | Progressive reveal: cards rise from depth in a cascade, tilt slightly toward the cursor, and their five points tick in. | Normal scroll |
| **Why Xentra** | A Strategy · Technology · Growth triad: three nodes with energy flowing between them, each reason card lighting its matching link. Replaces the generic sphere here, which moves to About. | Normal scroll, scrubbed flow |
| **Our Approach** | Scroll-linked journey: a glowing path draws through the five stages and the active stage enlarges. On How We Work it becomes a horizontal journey. | Home: normal scroll. How We Work page: **pinned horizontal track on desktop** |
| **Leadership** | Removed from the site at your request (12 Nov). When real portraits are supplied: clip-path portrait reveals with name and designation typography transitions. | — (not built until photos exist) |
| **Contact** (closing band and Contact page) | Cinematic close: light trails converge from the edges onto the WhatsApp button, the heading resolves line by line, and particles drift toward the call to action. | Normal scroll |

**Pinned sections total:** Home has two (About intro and the existing Services showcase), and How We Work has one (the Approach track). All pins are desktop-only and switched off with reduced motion. Every other section uses native scroll with scrubbed or in-view timelines.

---

## 5. Performance and mobile

- **Native scroll stays.** No smooth-scroll library. The reference's smoothness comes from scrub smoothing, which we can match. A library would only be considered after measuring a specific problem.
- **One three.js scene** (the hero). Every other visual is SVG or CSS, and animates only `transform` and `opacity`.
- **Loops pause off screen.** This already applies to the hero scene, the sphere and the light trails, and will apply to anything new.
- **Phones and tablets (below 1024px, or short screens):** no pinning, shorter timelines, lighter scrub smoothing, smaller visuals, and the particle field stays in its light mobile mode. Touch devices get no cursor effects.
- **Reduced motion:** no pins and no scrubbing; each section shows its final composed frame. No JS: all content is visible, as today.
- **Budget checked after every section:**
  - idle main-thread load on a throttled phone ≤ about 45% (baseline 42%)
  - CLS 0, and LCP no worse than today
  - no new console errors
  - full regression suites plus TypeScript, ESLint and a production build

---

## 6. Order of work (each section shown for approval before the next)

1. **Hero:** confirm it as approved, or approve the scroll camera/light exit described above.
2. **About:** network globe with scroll-drawn connections and words parting around it.
3. **Mission & Vision**
4. **Services:** page cascade, plus the showcase depth hand-off
5. **Why Xentra:** Strategy · Technology · Growth triad
6. **Our Approach:** Home journey and How We Work horizontal track
7. **Contact:** cinematic close
8. **Site-wide pass:** particle behaviour per section, final performance check

Nothing is committed, pushed or deployed without your approval.
