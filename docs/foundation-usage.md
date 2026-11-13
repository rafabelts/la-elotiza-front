# Design system foundation usage

This foundation implements the **POS-specific** palette and patterns in [design-system.md](design-system.md) and [the interactive prototype](prototipo/prototipo-elotiza.dc.html). The generic Organic stylesheet bundled with the prototype has different colors and headings; the POS page's own values take precedence. The responsive behavior below is an implementation choice because the prototype does not specify breakpoints.

## Tokens and styling

Figtree is loaded locally in `src/app/layout.tsx`. Tailwind 4 theme tokens and component styles live in `src/app/globals.css`. Use semantic theme utilities such as `bg-background`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-brand`, and `rounded-card`. Additional tokens cover placeholder, disabled, hover, success and danger colors; control/input/dialog radii; and segment/dialog shadows. The 4 px Tailwind spacing scale supplies the spacing values documented in the prototype. Keep category-specific product colors with the future catalog feature until product cards exist.

Use dark text on the orange brand fill. Small text on warm tints uses deeper orange or brown. The placeholder token is darkened from the prototype's `#A19D95` to `#736E66` for a measured 4.8:1 contrast ratio on the cream input background. The global 2 px `:focus-visible` outline uses the deep orange token with a 2 px offset. Motion is suppressed under `prefers-reduced-motion: reduce`. The shared controls have at least 44 px touch height; segmented navigation buttons retain the prototype's 40 px height.

## Shared component inventory

Import individual components from `@/components/ui/<file>`; there is no barrel export.

| Component | Reuse and states |
| --- | --- |
| `Button` | Brand, ink, outline, ghost, and danger actions; default/large sizes; native disabled behavior. Defaults to `type="button"`; pass `type="submit"` for forms. |
| `Card` | Neutral surface for sections, articles, or generic groups. Choose `as` for semantic context and supply a heading/accessible label when used as a region. |
| `Badge` | Textual state label with neutral, warm, warning, or ready tone. Supply the actual state text; color alone carries no meaning. |
| `Field` | Labeled native input with optional hint and error. Pass a stable `id`; errors set `aria-invalid` and are included in `aria-describedby`. The parent owns form validation. |
| `SegmentedControl` | Controlled set of native toggle buttons for filters/selection, with group label, `aria-pressed`, disabled item support, and wrap on narrow screens. Parent owns the selected value. |
| `OptionChip` | Native toggle button for a product option, exposing `selected` with `aria-pressed`. Parent owns option rules and value. |
| `QuantityStepper` | Controlled quantity selector with labeled increment/decrement buttons, min/max bounds, and a polite output announcement. Parent owns quantity and any remove-at-one behavior. |
| `Dialog` | Native modal dialog with labeled title, Escape/close button, browser focus containment, and focus restoration. Parent owns `open` and `onClose`. Actions belong in children. |

These components contain presentation and basic UI behavior only. They contain no product, order, authentication, pricing, API, or mock logic. `ProductCard`, `OrderCard`, navigation, ticket, and PIN controls remain feature-specific until their milestones define data and interaction contracts.

## Accessibility and responsive decisions

Prefer native buttons, inputs, and the browser's modal `<dialog>` behavior. Keep action text and error messages visible. Use the `Field` error prop for validation messages near their control; errors retain their `aria-describedby` link and use `role="alert"` when they appear. The existing `AppShell` retains its skip link and focusable main landmark. The placeholder page now consumes `Card` and `Badge` without changing its behavior.

Cards and dialogs use viewport-aware width, and segmented controls wrap instead of clipping. Dialogs have a capped viewport height and internal scrolling. The existing shell wraps at narrow widths. These adaptations should be revisited with actual functional screens, at mobile widths and 200% zoom, because the source prototype provides desktop layouts but no explicit responsive breakpoints. Manual assistive technology and browser visual checks are still required before claiming WCAG 2.2 AA compliance.
