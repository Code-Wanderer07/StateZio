---
name: Cyber-Educational Logic
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#ddb8ff'
  on-secondary: '#490080'
  secondary-container: '#7c03d3'
  on-secondary-container: '#dfbcff'
  tertiary: '#b4c5ff'
  on-tertiary: '#002a78'
  tertiary-container: '#85a3ff'
  on-tertiary-container: '#003490'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6800b4'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  bento-gap: 20px
---

## Brand & Style

The design system is engineered for **StateZio**, a visual automata simulator that sits at the intersection of high-level mathematics and futuristic software engineering. The brand personality is "Cyber-Educational"—it is intellectually rigorous yet visually exhilarating. It aims to evoke a sense of focused immersion, transforming abstract theory into tangible, glowing logic.

The design style leverages **Glassmorphism** and **Bento-box** layouts to create a highly organized, modular interface. The aesthetic utilizes deep translucent layers, vibrant background blurs, and precise neon accents to simulate a high-tech terminal or a futuristic laboratory workbench. The emotional response should be one of clarity, mastery, and technological empowerment.

## Colors

The palette is rooted in a deep-space foundation of **Deep Slate (#020617)**. This provides a high-contrast backdrop for vibrant neon "data flows."

- **Primary (Cyan - #06b6d4):** Used for successful state transitions, active path highlighting, and primary calls to action.
- **Secondary (Electric Purple - #9333ea):** Used for non-deterministic branches, complex logic intersections, and secondary interactive elements.
- **Tertiary (Royal Blue - #2563eb):** Used for steady-state system information and subtle interface cues.
- **Functional Accents:** Glow effects should use these hex codes with 40-60% opacity to simulate light emission without vibrating against the dark background.

In **Light Mode**, the neutral shifts to a crisp **#F8FAFC**, while surfaces adopt a high-transparency white glass (`rgba(255, 255, 255, 0.7)`) with the same vibrant accent colors for high legibility.

## Typography

This design system uses a dual-font strategy to distinguish between UI navigation and technical data.

1.  **Outfit (Sans-Serif):** The primary UI face. Its geometric, open curves maintain a modern, friendly educational feel. Used for headers, descriptions, and buttons.
2.  **JetBrains Mono (Monospace):** The "Logic Face." Used for all automata symbols (Σ, δ, q0), terminal trace logs, and mathematical expressions. It provides the necessary precision for character alignment in logic strings.

For mobile, `display-lg` scales down to 32px. All code-based text should maintain a minimum of 14px for readability on high-density displays.

## Layout & Spacing

The layout is governed by a **Bento-box grid philosophy**. Content is divided into distinct, functional modules with varying sizes that fit together into a cohesive viewport.

- **Desktop:** A 12-column fluid grid within a maximum 1600px container. Use a 20px gap for "Bento" tiles.
- **Module Margins:** Every internal module uses a 24px inner padding (`container-padding`).
- **Floating Toolbar:** A central tool dock is positioned as a "floating pill" at the bottom-center of the canvas, detached from the grid.
- **Mobile:** Transition to a single-column stack. Bento tiles reflow vertically. The terminal log collapses into a bottom-sheet.

## Elevation & Depth

Depth is created through **refraction rather than heavy shadows**. 

- **Surface Tiers:** 
  - *Tier 1 (Canvas):* The background #020617.
  - *Tier 2 (Bento Tiles):* Glassmorphic surfaces with `backdrop-filter: blur(12px)` and a 1px border of `border_glass`.
  - *Tier 3 (Floating Menus/Modals):* Higher blur (20px) and a subtle outer glow using the Primary color at 15% opacity.
- **Glows:** Active states (like a currently processing state in the simulator) should use a `box-shadow` with a 20px blur radius, matching the primary cyan color to simulate a neon light source.

## Shapes

The design system uses an exaggerated "friendly-tech" roundness.

- **Bento Tiles:** Use `rounded-3xl` (1.5rem / 24px) to create the signature modular look.
- **Buttons & Pills:** Use full pill rounding for primary actions and toolbars.
- **Input Fields:** Use `rounded-lg` to maintain a slightly more functional, structured appearance amidst the softer outer containers.
- **States (Nodes):** Circular shapes for automata states, with thick 2px strokes.

## Components

- **Bento Cards:** Semi-transparent glass containers. Headers within these cards should use `label-caps` in the tertiary color.
- **Floating Pill Toolbar:** A `rounded-full` container holding icon-only or icon+label actions. Use a Primary color glow for the "Play/Simulate" button.
- **Terminal Trace Logs:** A dark, `JetBrains Mono` driven block with 0.8 opacity. Success lines use Cyan text; error lines use a high-saturation Red-Pink.
- **LaTeX Math Blocks:** Rendered using `Outfit` for variables but `JetBrains Mono` for operators. These sit on a subtle `surface_glass` platter.
- **Buttons:**
  - *Primary:* Cyan background, black text, no border.
  - *Secondary:* Glass background, Cyan border, Cyan text.
- **Inputs:** Dark backgrounds with a 1px border that glows Cyan on `:focus`.