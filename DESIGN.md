# Design System Specification

## 1. Overview & Creative North Star: "Quiet Intelligence"

The "Quiet Intelligence" design system governs a digital environment built for intense focus, tailored toward developers, writers, and knowledge workers. It operates as a highly technical tool that refuses to feel like a machine. The interface serves as a calm, distraction-free canvas where the user's content—whether complex code, dense prose, or analytical reasoning—remains the undisputed focal point.

The visual thesis relies on the intersection of an integrated development environment (IDE) and high-end editorial design. It utilizes a restrained, monochromatic palette to lower cognitive load and reduce eye strain over long sessions, introducing moments of elegant, humanizing typography to offset the inherent coldness of artificial intelligence.

The posture is explicitly restrained and premium. It avoids loud gamification, aggressive branding, and dense chrome. It provides tools exactly when needed and dissolves into the background when not.

> **Content is the interface. Chrome must remain functionally invisible until summoned.**

---

## 2. Colors

The color system operates almost entirely on a monochromatic scale, using precise variations in lightness to define architecture and hierarchy.

### Core Tones

- **Base Canvas (`#191818` inferred):** The deepest layer of the application. Used for the primary background to absorb light and push content forward.
- **Primary Text (`#EDEDED` inferred):** An off-white used for core readability. Pure white is strictly avoided for body text to prevent halation and eye fatigue.
- **Primary Action (`#FFFFFF`):** Pure stark white is reserved exclusively for primary action buttons (e.g., "Create share link") to guarantee immediate visual dominance.

### Accent Logic

Accents are used with extreme austerity.

- **Brand Accent (Peach/Orange):** Used solely for the AI's avatar/logo mark to inject warmth.
- **System Accent (Subtle Blue/Purple):** Used exclusively for active selection states and active toggles to clearly denote user choice against the grey canvas.

### Neutral / Grey Token System

- **Secondary Text / Metadata:** A mid-grey used for timestamps, helper text, and inactive tab labels.
- **Muted Elements:** Deep greys used for disabled icons and placeholders.
- **Code Syntax Base:** Text within markdown code formats utilizes a faint pink/salmon tint to differentiate technical strings from standard prose without requiring a jarring background shift.

### Surface Hierarchy & Nesting

Elevation is communicated through lightness.

- **Level 0 (Base):** Deepest off-black.
- **Level 1 (Panels/Inputs):** A slightly lighter grey (`#2B2A2A` inferred).
- **Level 2 (Modals/Popovers):** Lighter still, establishing the highest z-index plane.

### Special Rules

The system strictly prohibits gradients and relies on an "opacity-only neutrals" approach for hover states to maintain visual harmony regardless of the underlying layer.

---

## 3. Typography

The typographic system relies on a dual-voice approach: one for human connection, one for functional clarity, utilizing the IBM Plex family for distinct structural roles.

- **Display/Headline Voice:** **IBM Plex Serif**, a high-contrast, elegant font. Used exclusively for greetings and high-level brand moments (e.g., "Afternoon, Kevin"). It establishes an editorial, sophisticated tone.
- **Body/Data/Input Voice:** A clean, highly legible geometric Sans-Serif. Used for all structural UI, chat logs, and standard content. Engineered for dense data consumption.
- **Technical Voice:** **IBM Plex Mono**, utilized strictly for code blocks and inline code execution, ensuring perfect vertical alignment and distinct visual separation from prose.
- **Hierarchy Behavior:** Visual weight is established through opacity/color brightness rather than dramatic shifts in font size. Titles are medium/semibold in off-white; secondary information is regular weight in mid-grey.
- **Casing, Spacing, and Tracking Patterns:** Strict sentence case for all UI elements and labels. Tracking is loose on the serif display font and tight/neutral on the sans-serif body to maximize readability.

### Iconography

Icons utilize a lightweight, outlined style (approximately 1.5px stroke weight) with rounded terminals. They are functional, utilitarian, and monochromatic. Solid fill states are reserved solely for indicating an active or selected tool.

---

## 4. Elevation & Depth

The system eschews skeuomorphism and complex glassmorphism in favor of a flat, layered tonal architecture.

- **Tonal Layering:** Depth is achieved by lightening the background color. The closer an element is to the user, the lighter its grey value.
- **Shadows:** Drop shadows are used exclusively for highest-elevation components (modals, popovers, and floating input prompts). These shadows are large-radius, diffused, and ambient, meant to separate the surface from the canvas without drawing a hard, distracting edge.
- **Floating Surfaces:** The primary input mechanism frequently acts as a floating surface over the canvas, anchoring the user's interaction point while allowing content to scroll beneath.
- **State Changes:** Hover states do not lift elements. Instead, they apply a subtle, translucent white overlay to the element's background, mimicking a momentary highlight rather than physical movement.

---

## 5. Components

### Buttons

- **Primary Buttons:** Pill-shaped (fully rounded corners). Filled with stark pure white. Text is high-contrast black.
- **Secondary/Icon Buttons:** Transparent or matching the surface background. Displayed as floating text or icons. Hover states apply a subtle grey background with heavily rounded corners.

### Input Fields

- **Floating Prompts:** Large, pill-shaped or deeply rounded rectangular containers. They sit on a Level 1 or Level 2 surface color. Placeholder text uses the secondary grey token.
- **Action Rows within Inputs:** Tooling inside the input field (e.g., file attachments, model selection) sits at the bottom of the container, using distinctly smaller typography and muted iconography.

### Navigation

- **Sidebar Lists:** Flat and borderless. Active states are indicated by an increase in text brightness and a faint, full-width grey background block.

### Cards / Panels

- **Selection Rows:** Used in modals for choosing options. Deeply rounded rectangles (approx 12-16px radius). By default, they lack borders.
- **Selected State:** When active, the panel receives a thin, 1px system accent border (blue) and a corresponding checkmark icon, pulling it forward visually.

### Modals / Popovers

- **Visual Construction:** Floating elements with a distinct, soft ambient shadow.
- **Corner Radius:** Deeply rounded (approx 16-20px), softening the technical environment.
- **Alignment:** Headers and body text are strictly left-aligned. The close action (X) is placed in the top right corner.

### Lists / Tables

- **Inline Code / Tags:** Rendered as small, heavily rounded rectangles (pills) with a distinct dark background tint and specialized typography color to break out of standard text flow.

---

## 6. Do's and Don'ts

### Do

- Reserve the elegant **IBM Plex Serif** typography exclusively for top-level, non-functional brand moments and greetings.
- Rely on tonal contrast (lighter greys) to establish component hierarchy rather than introducing hard borders.
- Use heavily rounded corners (pills) for primary input mechanisms and major actions to soften the dense, technical environment.
- Ensure the primary action button on any screen is the highest-contrast element (stark white).

### Don't

- Do not use pure white (`#FFFFFF`) for body text; it breaks the low-strain mandate of the dark environment.
- Do not introduce bright colors or gradients into structural UI elements.
- Do not use hard drop shadows or sharp borders to separate stacked panes; rely on ambient diffusion and tonal shifts.
- Do not center-align functional text or modal contents. Maintain a strict left-aligned reading axis.
