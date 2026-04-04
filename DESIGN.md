# Design System Specification: The Cognitive Canvas (Dark Mode)

## 1\. Overview \& Creative North Star: The Cognitive Canvas

This design system moves beyond the utility of a standard interface and into the realm of a "Cognitive Canvas." Our goal is to create a digital environment that feels like a high-end, obsidian-toned studio—a place where AI-generated insights and human creativity merge without the friction of traditional UI "noise."

**Creative North Star: "Obsidian Intelligence"**
We reject the "flat" web. We embrace depth through tonal layering, intentional asymmetry, and editorial-grade typography. The "Cognitive Canvas" principle dictates that the UI should feel like a singular, expansive surface where elements emerge from the shadows rather than being boxed into grids. We use high-contrast indigo accents against a deep, slate-obsidian void to direct focus with surgical precision.

\---

## 2\. Colors: Tonal Depth \& The "No-Line" Rule

In this system, we do not use lines to define space. We use light. By shifting background tones, we create a sense of architecture without the visual clutter of 1px borders.

### The Palette

* **The Void (Background):** `#0c1324` (Surface/Surface Dim). This is our base obsidian.
* **The Primary Pulse:** `#c0c1ff` (Primary) / `#4b4dd8` (Primary Container). Our signature indigo, evolved for dark mode to ensure it vibrates against the obsidian background without causing eye strain.
* **The Warm Accent:** `#ffb695` (Tertiary). Reserved for AI insights, "aha" moments, and creative sparks.

### The "No-Line" Rule

**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning.

* Boundaries are defined by shifting from `surface` to `surface-container-low`.
* Floating menus must utilize `surface-bright` with a `backdrop-blur`.
* **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline-variant` at **15% opacity**. Never 100%.

### Glass \& Gradient Implementation

To move beyond a "template" feel, use **Glassmorphism** for all floating overlays.

* **Example:** A floating AI command bar should use `surface-container-highest` with a 12px blur and a subtle gradient from `primary` to `primary-container` at 5% opacity.

\---

## 3\. Typography: The Editorial Hierarchy

We utilize a pairing of **Space Grotesk** (Display) and **Inter** (Body) to create an authoritative, "high-end journal" aesthetic.

* **Display (Space Grotesk):** High-contrast, tight letter spacing. Used for "Cognitive Anchors"—the main takeaways on a screen.
* **Body (Inter):** Generous line height (1.6) to ensure legibility against the obsidian background.
* **Hierarchy as Identity:**

  * `display-lg` (3.5rem) is used sparingly to break the grid, often overlapping two background containers to unify them.
  * `label-md` (0.75rem) is always in `on-surface-variant` to keep metadata secondary to the primary thought.

\---

## 4\. Elevation \& Depth: Tonal Layering

Traditional shadows look "muddy" in deep dark modes. Instead, we use **Tonal Layering**.

### The Layering Principle

Think of the UI as a series of nested obsidian plates.

1. **Level 0 (Background):** `surface` (#0c1324).
2. **Level 1 (Sections):** `surface-container-low` (#151b2d).
3. **Level 2 (Cards/Modules):** `surface-container` (#191f31).
4. **Level 3 (Interactive/Active):** `surface-container-high` (#23293c).

### Ambient Shadows

For floating elements (Modals, Popovers), use a "Tinted Shadow":

* **Blur:** 40px - 60px.
* **Color:** `primary` (#c0c1ff) at **4% opacity**. This creates a subtle indigo "glow" rather than a dark shadow, making the element appear to emit light.

\---

## 5\. Components

### Buttons: The "Pulse" Action

* **Primary:** Solid `primary-container` background with `on-primary-container` text. High-contrast indigo focus.
* **Secondary:** No background. `primary` text. Upon hover, a `surface-container-highest` background fades in.
* **Rounding:** `0.375rem` (md) for a sharp, professional look. Avoid "pill" shapes for buttons to maintain the editorial vibe.

### Cards \& Lists: The "Seamless" Feed

* **No Dividers:** Lists are separated by 16px of `surface-container-lowest` whitespace.
* **Nesting:** AI-generated content cards should sit within a `surface-container` using a subtle `primary` gradient (2% opacity) to signify its "intelligent" origin.

### Input Fields: The "Canvas" Entry

* **Resting State:** `surface-container-lowest` background. No border.
* **Active State:** `outline` glow (15% opacity) with a subtle vertical "blinking" primary bar on the left edge.

### Signature Component: The "Cognitive Hub"

A specialized container for AI-orchestrated data. It uses `surface-variant` with a 20px backdrop-blur and a `tertiary\\\_fixed` (#ffdbcc) label to signify high-priority cognitive insights.

\---

## 6\. Do’s and Don’ts

### Do:

* **Use Asymmetry:** Place a `display-md` headline off-center to create visual tension and interest.
* **Layer with Intent:** Ensure that every "layer" move is purposeful. If a container is higher, it must be more important.
* **Focus on Legibility:** Ensure `on-surface` text remains at least 4.5:1 contrast ratio against all surface tiers.

### Don't:

* **Don't use pure black (#000000):** It creates "smearing" on OLED screens and feels "cheap." Stick to the obsidian/slate-950 palette.
* **Don't use 100% white text:** Use `on-surface` (#dce1fb) to reduce eye fatigue.
* **Don't use "Drop Shadows":** Use tonal shifts or indigo-tinted ambient glows only.
* **Don't use dividers:** If you feel the need for a line, increase your padding or shift your background color instead.

