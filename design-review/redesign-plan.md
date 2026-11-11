# Xentra Technologies — Website Design Transformation Plan

**Status (11 Nov 2026):** implemented step by step. H1–H7 and P1–P4 approved by the user; P5 (case studies + Privacy styling) awaiting approval. Nothing committed yet.
**Reference:** the attached cinematic dark/blue concept. It's used for its direction, not as a copy.
**Prepared:** 11 November 2026

---

## 1. Audit of the current site

### 1.1 Architecture (kept as it is)

| Layer | What exists | Notes |
|---|---|---|
| Framework | Next 16 App Router, `cacheComponents`, server components by default | Pages are static. Client components are used only for motion and interaction. |
| Content | `lib/content/*` with an approved/draft model | Drafts render only in review builds. This is how unconfirmed copy stays off the live site. |
| Design tokens | `app/globals.css`: brand palette (`--xt-*`), section tones (`tone-black / navy / light / white`), Tailwind v4 theme mapping | Every component reads semantic tokens, so a section's tone can change without rewriting the component. |
| Motion | `components/motion/gsap.ts` (GSAP + ScrollTrigger + SplitText via `useGSAP`), `MotionRoot` declarative reveals (`data-reveal`, `data-parallax`, `data-draw`) | No Lenis; native scroll. Reduced motion is handled centrally through `MEDIA`. |
| Atmosphere | `ParticleField`: a fixed blue/silver canvas that adapts to each section's tone and runs lighter on mobile | Already matches the reference's "atmospheric particles". |
| Layout | `SiteShell` (Navbar, MobileNav, Footer, MotionRoot), `PageHeader`, `Section`, `SectionHeading`, `Container` | |

### 1.2 Pages and sections today

| Page | Sections |
|---|---|
| Home | Hero (approved visual and animations) → Company intro (light) → Services overview (navy cards) → Why Xentra (hidden in production until its copy is approved) → How We Work preview (light, scroll-linked timeline) → Enquiry band |
| About | Page header → Mission/values (draft) → Leadership (Technical Head hidden until the portrait arrives) |
| Services | Page header → Service catalogue (2 groups, 8 services, per-service WhatsApp and email) |
| How We Work | Page header → full 5-stage timeline |
| Contact | Enquiry picker (service selection → WhatsApp/email with a prefilled message) |
| Case studies | Template only (hidden, returns 404 in production) |
| Privacy | Draft, not indexed |

### 1.3 Observations

1. **The approved pinned-scroll Services showcase is currently not shown on any page.** It was taken off Home when the site became multi-page, pending earlier decision B. The code (`Services.tsx` + `ServicesExperience.tsx`) is intact. This plan brings it back as the homepage service showcase (section 5, step H3).
2. **In production, Home is short (about 3,400px).** Several sections wait for approved copy from the content review, so the redesign is best paired with that content going in.
3. **The current site already alternates dark and light bands, like the reference.** What the reference adds is depth (glass, light, layered visuals), curved transitions between bands, and more presence in the hero.

---

## 2. Reading the reference

| Element in the reference | Use? | How |
|---|---|---|
| Deep black/navy hero with cinematic type, blue-highlighted words | **Yes** | Larger display type, and the last phrase of the headline highlighted in the electric-blue gradient. |
| Large 3D chrome "X" with orbit rings, crystals and rocky terrain | **Partly — needs your decision (D1)** | The X is the logo mark. Rendering it in 3D creates new artwork from the logo (the logo rule says never alter it), and rock or crystal scenery needs image assets the project doesn't have. See D1. |
| Stats row: "01+ Industries", "100% Focused on Growth", "∞ Limitless Possibilities" | **No** | These are design placeholders, not company facts. The slot is reused for three factual capability labels: *Business Growth · Digital Services · Business Software*. |
| Section rail on the right (01 Home … 05 Contact) | **Yes, desktop only** | Home-page progress rail that jumps to sections and shows the current one. Hidden on tablet and mobile. |
| Light/dark toggle in the header | **No** | The site keeps one fixed brand identity, and the logo is approved for black surfaces only. |
| "Work" nav item, "Discuss a Project" button | **Adapted** | Navigation stays on the current five pages, since there's no approved case-study content. The header button stays on WhatsApp, the approved journey. |
| White glass band with service cards breaking out of it, curved edges | **Yes** | Curved, angled transitions between dark and light bands. Glass service cards with 3D tilt on hover (desktop). |
| Globe with "Strategy / Technology / Automation / Growth" labels | **Yes, adapted** | An SVG network sphere for Why Xentra, labelled with Xentra's real service groups. No photographic globe. |
| Process row with icons and connecting arrows | **Yes** | Merged with the existing scroll-linked 5-stage timeline (your approved five stages, not the reference's four). |
| Light trails, glow, particles | **Yes** | SVG/CSS light trails plus the existing particle field. Cursor-responsive lighting on desktop only. |

**Not taken from the reference:** its headline ("Make technology work for your business.") and its service list (SEO & lead generation, AI & automation, branding & social media as cards). The site uses the approved headline and the confirmed service groups.

---

## 3. Shared design system (additions)

Everything goes into `globals.css` tokens and a few small components, so each section shares one visual language.

| Area | Addition |
|---|---|
| **Surfaces** | `--glass` (translucent navy with backdrop blur and a 1px silver hairline), `--glass-light` (white glass for light bands), `--glow-blue` (layered blue shadow scale: sm/md/lg). |
| **Accent text** | A `text-accent-gradient` utility (electric blue → light blue) for one highlighted phrase per heading, never more. |
| **Metallic** | A `metal` gradient (silver-50 → silver-400) for hairlines, icon strokes and the hero's orbit details. |
| **Typography** | Hero display size increased about 15% on desktop (`clamp`). The eyebrow style (small caps, wide tracking, blue) is kept, as is Geist. |
| **Section transitions** | A `SectionEdge` component: an SVG curve or angle at the top/bottom of a band, coloured by the neighbouring tone. No layout shift, because its height is reserved. |
| **Light** | `AmbientLight` (radial blue/silver glows positioned per section) and `LightTrail` (an SVG stroke with an animated dash). |
| **Interaction** | `useCursorLight`: one shared, throttled pointer handler that sets CSS variables `--mx/--my` on the hovered element, used for card spotlight and tilt. Fine pointer only, and off under reduced motion. |
| **Motion language** | Durations: 0.45s (UI), 0.8s (reveals), 1.2s (cinematic). One easing family (`power3.out`, CSS `cubic-bezier(.2,.7,.2,1)`). Stagger: 0.07s (words), 0.12s (items). All through the existing `MotionRoot` / `useGSAP`; no new libraries. |

**Performance rules:**
- Animate `transform` and `opacity` only.
- `backdrop-filter` only on a few large panels; the mobile fallback is a solid translucent fill.
- No WebGL or three.js (that would be a new dependency, which needs your approval).

---

## 4. Reusable components

**Reused as they are:**
- `SiteShell`, `Navbar`, `MobileNav`, `Footer` (restyled only)
- `Container`, `Section`, `SectionHeading`, `PageHeader`
- `ButtonLink`, `WhatsAppCta`, `WhatsAppFloat`
- `MotionRoot`, `gsap.ts`, `ParticleField`
- `HeroIntroMotion` (entrance, replay, magnetic)
- `HeroVisual` and `HeroVisualMotion`
- `ProcessTimeline`
- `Services` / `ServicesExperience` (pinned)
- `ServiceCatalog`, `EnquiryPicker`
- `TechnicalLeadProfile`, `MissionValues`

**New, small and shared:**
- `SectionEdge`
- `AmbientLight`
- `LightTrail`
- `GlassCard` (with optional cursor spotlight and tilt)
- `SectionRail` (home only)
- `NetworkSphere` (Why Xentra)
- `useCursorLight`

---

## 5. Section-by-section plan (each step is shown to you for approval before the next)

| Step | Section | What changes |
|---|---|---|
| **H1** | **Homepage hero** | Larger cinematic type with a blue-gradient highlight. Upgraded "ecosystem" visual: orbit rings in perspective, floating glass panels with depth, light trails, a horizon glow, and cursor-responsive light on desktop. Factual capability strip in place of the reference's stats. A scroll cue. The existing entrance, replay, magnetic CTAs and WhatsApp link are kept. |
| H2 | Header + navigation | Glass header that condenses on scroll, refined active indicator and button glow. Mobile menu restyled, with its behaviour unchanged. |
| H3 | What we do / Services showcase | The pinned-scroll showcase returns to Home, restyled with glass panels and mapped to the three confirmed service groups. Short "what we do" intro with a curved light band. |
| H4 | Why Xentra | Dark band with the network sphere (labels = service groups) and four commitments from the content review. Shown only once their copy is approved. |
| H5 | Our approach | Glass timeline with icons, connecting light line and the existing scroll-linked progress. |
| H6 | Industries + final CTA | Three industry groups as layered glass panels; enquiry band with a light-trail backdrop. |
| H7 | Footer | Deep navy with a metallic hairline, the logo on black, link groups, contact and a subtle glow. |
| P1 | About | Cinematic page header, then mission/vision split panel, values grid, philosophy statement, then the restyled Leadership section. |
| P2 | Services page | Group headers with their own visual motif, glass service cards, and enquiry CTAs (journey unchanged). |
| P3 | How We Work | A large interactive timeline, plus the software delivery steps as a second track. |
| P4 | Contact | Glass enquiry panel; picker, WhatsApp and email unchanged; "what happens next" steps. |
| P5 | Case studies | Template restyled. Stays hidden until real, approved work exists. |

Content: sections pick up the approved copy from the content review as it's confirmed. Placeholders never show in production.

---

## 6. Functionality that needs special protection

| Feature | Risk during the redesign | Protection |
|---|---|---|
| WhatsApp integration (number, prefilled messages, new tab, accessible labels) | Restyled buttons losing `href`/`rel` or labels | Shared `WhatsAppCta` only. The journey test checks every link on every page. |
| Navigation, active page, mobile menu (focus trap, Esc, scroll lock, outside tap) | Header restyle breaking `inert`/aria state | Behaviour code untouched. The regression script runs after H2. |
| Pinned Services scroll (snap, counter, keyboard jumps) | Glass/backdrop effects hurting scroll performance, or new transforms breaking pin spacing | Restyle inside existing markup; no transforms on pinned ancestors; performance check on a throttled mobile profile. |
| Hero entrance, replay, magnetic, smooth scroll | New visual layers fighting the existing timelines | New layers join the same timeline; the hero test runs after H1. |
| SEO (titles, canonical, one H1 per page, heading order) | Decorative text becoming headings | Decorative labels are `aria-hidden`; the journey test checks a single H1 on every page. |
| Enquiry journeys (`?service=` preselect, email subject) | Contact restyle | Picker logic untouched; journey test. |
| Draft and approval gating | New sections showing placeholder copy in production | New sections read through `isVisible` / `CopyText`; the production build is checked for drafts. |
| Reduced motion, keyboard, no-JS | Cinematic effects hiding content | Everything renders visible without JS; reduced motion gets static compositions; focus-visible styles on every interactive element. |
| Logo | Recolouring or cropping in new compositions | The official lockup only, on black surfaces only. |

---

## 7. Decisions needed

- **D1 — Hero centrepiece.** Option A (recommended): upgrade the approved ecosystem visual with the reference's depth (perspective orbit rings, glass panels, light trails, horizon glow, cursor light). It uses no logo derivative and no new assets. Option B: a 3D chrome X like the reference. That creates new artwork from the logo mark, and photographic quality needs a professionally rendered image from your brand designer (or WebGL, a new dependency).
- **D2 — Scenery images** (rocks, crystals, a photographic globe). Recommendation: none. Build the atmosphere from light, particles and line graphics, so nothing looks like stock or AI imagery and pages stay fast.
- **D3 — Hero copy during the redesign.** You chose to apply the new headline with the rest of the content. Step H1 therefore keeps the current headline, with "Limitless Possibilities." highlighted in blue. Its layout is sized to fit the approved new headline later without rework.
