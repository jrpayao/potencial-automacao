# Design System Documentation: Architectural Intelligence

## 1. Overview & Creative North Star
**Creative North Star: The Sovereign Architect**
This design system moves beyond the generic "enterprise dashboard" to create a high-end, editorial experience tailored for government automation. The aesthetic is one of **Architectural Intelligence**—blending the authoritative weight of a sovereign institution with the frictionless precision of modern automation. 

We break the "template" look by rejecting standard structural lines in favor of **Tonal Layering**. The UI should feel like a series of meticulously stacked sheets of fine paper and frosted glass. It is data-dense but breathes through intentional white space, creating a tool that feels less like a spreadsheet and more like a high-performance flight deck.

---

## 2. Colors: Tonal Depth vs. Flat Surfaces
The color palette uses deep, institutional blues to establish trust, contrasted with a vibrant, functional spectrum for status signaling.

### Color Tokens & Roles
*   **Primary Dark (`#000033`):** Reserved exclusively for the 256px Sidebar. It acts as the "anchor" of the application.
*   **Primary (`#003461`):** Used for high-emphasis actions and key interactive states.
*   **Functional Spectrum:**
    *   `success`: `#22c55e` (High Priority / High Potential)
    *   `warning`: `#eab308` (Backlog / Medium Potential)
    *   `error`: `#ef4444` (Discard / Low Potential)
*   **Administrative Hierarchy (Badges):**
    *   Superadmin: `#7b1fa2` | Admin: `#1565c0` | Analista: `#00695c` | Visualizador: `#546e7a`

### The "No-Line" Rule
To achieve a premium editorial feel, **prohibit 1px solid borders for sectioning.** Boundaries must be defined through:
1.  **Background Shifts:** Place a `surface_container_low` component on a `surface` background.
2.  **Tonal Transitions:** Use the `surface_container` tiers (Lowest to Highest) to create "nested" depth.
3.  **Signature Texture:** Apply a subtle linear gradient to main CTAs (e.g., `primary` to `primary_container`) to provide "visual soul" that flat colors lack.

### Glass & Gradient
The 64px Header should utilize **Glassmorphism**. Use a semi-transparent `surface` color with a `backdrop-blur` (12px–20px). This allows content to bleed through as the user scrolls, creating a sense of depth and integration.

---

## 3. Typography: Editorial Precision
The use of **Inter** must be intentional. We favor a "high-contrast" scale where display text is large and authoritative, while data labels are microscopic but ultra-legible.

*   **Display & Headlines:** Use `display-md` (2.75rem) for main dashboard headers to ground the page. Maintain a tight `letter-spacing` (-0.02em).
*   **Titles:** `title-lg` (1.375rem) should be used for card titles, providing a clear entry point for the eye.
*   **The Data Layer:** `label-md` and `label-sm` are the workhorses for automation metrics. These should be set in Medium or Semi-Bold weights to ensure readability in dense evaluation tables.
*   **Body:** `body-md` (0.875rem) is our default for descriptions and help text, providing enough breathing room for long-form government documentation.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. In this design system, we convey hierarchy through **Tonal Layering**.

### The Layering Principle
Depth is achieved by stacking `surface-container` tiers. 
*   **Base:** `surface` (`#f8f9fa`)
*   **Content Section:** `surface_container_low`
*   **Interactive Card:** `surface_container_lowest` (Pure White)

### Ambient Shadows
When an element must float (e.g., a modal or a floating action button), use **Ambient Shadows**.
*   **Blur:** 24px–40px.
*   **Opacity:** 4%–8%.
*   **Color:** Tint the shadow with the `on_surface` token (a deep navy/black) rather than pure grey to mimic natural light within the blue-tinted environment.

### The "Ghost Border" Fallback
If accessibility requires a border, use a **Ghost Border**: the `outline_variant` token at **15% opacity**. Never use 100% opaque borders for containers.

---

## 5. Components

### Cards & Lists
*   **Radius:** 12px.
*   **Constraint:** Forbid divider lines. Separate list items using `0.6rem` (Spacing 3) of vertical white space or a subtle background toggle (zebra striping using `surface_container_low`).

### Buttons
*   **Primary:** Flat, high-contrast using `primary` with `on_primary` text. 
*   **Pills:** Use the 16px radius for status badges to create a distinct visual "object" that contrasts with the angularity of form fields.

### Inputs (Automation Fields)
*   **Radius:** 8px.
*   **Style:** Outlined, but using the **Ghost Border** rule. On focus, the border opacity jumps to 100% using the `primary` token.
*   **Density:** Fields should be compact (`label-sm` for floating labels) to accommodate the dense nature of automation evaluation data.

### Automation Maturity Chips
*   **Visual:** Use the `secondary_container` as a base with a left-aligned 4px "status bar" of the functional color (Success/Warning/Danger). This provides a quick visual scan without overwhelming the UI with saturated backgrounds.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Align primary content to a 12-column grid, but use "off-grid" placement for decorative elements or secondary metadata to break the template feel.
*   **Prioritize Breathing Room:** Use the Spacing Scale (especially `1.75rem` and `2.25rem`) to separate major logical groups.
*   **Layer Surfaces:** Think of the UI as a physical stack. The most important information should be on the "topmost" (brightest/whitest) layer.

### Don't:
*   **Don't use 1px solid dividers:** This is the hallmark of "basic" enterprise software. Use space and color shifts instead.
*   **Don't use default Material shadows:** They are too heavy and "muddy." Always use our diffused Ambient Shadow specs.
*   **Don't crowd the Sidebar:** The `000033` sidebar is a place of calm. Use generous padding (24px) for navigation items.
*   **Don't use high-contrast borders for inputs:** It creates visual "noise" that distracts from the automation data.