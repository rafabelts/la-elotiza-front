# UI foundation architecture

This foundation precedes the functional milestones in [ROADMAP.md](ROADMAP.md). Its source of truth is the La Elotiza POS prototype in `docs/prototipo/prototipo-elotiza.dc.html`, interpreted alongside [design-system.md](design-system.md). The separate `docs/prototipo/_ds/organic-*` guide describes a generic theme whose colors and typography conflict with the POS screens; it is not used to replace the POS visual language.

## Module boundaries

| Location | Responsibility |
| --- | --- |
| `src/app/` | App Router routes, root layout, provider composition, and global Tailwind theme. Keep pages as Server Components unless browser state is needed. |
| `src/components/app-shell.tsx` | Existing shared, server-rendered frame and skip link. It remains a setup shell until the session/navigation milestone defines actual routes and permissions. |
| `src/components/ui/` | Small, data-independent presentational controls used by more than one documented screen. Each component has a named export in its own file. No barrel or broad component framework is needed. |
| `src/lib/query-client.ts` | Existing TanStack Query configuration. It remains available for later server-state integration, without adding query hooks for this milestone. |

Future product-specific components such as `ProductCard`, `OrderCard`, `OrderSidebar`, staff/PIN views, comanda and ticket previews belong with their functional feature when its data and behavior are defined. No `src/features/`, `src/hooks/`, or `src/types/` directory is created merely to anticipate those milestones.

## Shared component contracts

The UI controls use native elements and public React types. Presentation accepts content and callbacks through props, with no imports from services, mock fixtures, or TanStack Query.

| Component | Contract and role | Component boundary |
| --- | --- | --- |
| `Button` | Native button attributes, with `variant: 'brand' \| 'ink' \| 'outline' \| 'ghost' \| 'danger'` and `size: 'default' \| 'large'`; supports native `type`, `disabled`, and accessible name. | Shared across actions in sale, payment, staff, and cash close. |
| `Field` / text input | A label and native input attributes, with optional hint and error. Label uses `htmlFor`; hint/error IDs are reflected in `aria-describedby`; error sets `aria-invalid`. A caller may pass a stable `id`. | Shared across customer, note, money, and staff forms; validation rules belong to features. |
| `Card` | Surface wrapper with native HTML attributes and children; no product/order data props. | Shared visual surface for summary, metric, and form regions. |
| `Badge` | Text content and `tone: 'neutral' \| 'warm' \| 'warning' \| 'ready'`, plus native span attributes. Tone never substitutes for visible status text. | Shared status and metadata display. |
| `SegmentedControl` | Group label, `items: { value, label, disabled? }[]`, selected `value`, and `onValueChange(value)`. Native buttons expose `aria-pressed`; the group has an accessible label. | Shared selection pattern for order filters, payment method, and roles; data rules remain outside. |
| `OptionChip` | Native button attributes and selected state exposed through `aria-pressed`; native `disabled`. | Reusable option affordance for later product configuration. |
| `QuantityStepper` | Accessible `label`, numeric `value`, optional `min`/`max`, and `onChange(nextValue)`. Native decrement/increment buttons disable at bounds. | Shared quantity affordance; cart removal at one is a later feature rule and is not encoded here. |
| `Dialog` | `open`, `title`, `onClose`, and children on native `<dialog>`, with an ID-bound heading. Opening, Escape close, and focus return are handled at the control boundary. | Shared modal shell; payment, configuration, cancellation, and ticket content stays feature-local. |

These are foundation contracts, not domain or backend specifications. Only implement the controls that can be given complete, accessible behavior without inventing a product workflow. Component variants are limited to those observed in the POS design documentation.

## Server and client boundaries

Static surfaces, badges, and the existing shell can render on the server. Controls that own browser interaction or hooks, particularly the segmented control, quantity stepper, and dialog, need a `"use client"` boundary. A Server Component page may compose these client controls through serializable props when the later feature owns state; this milestone does not move the page or shell to the client. Native button and input elements support direct reuse in client components without importing data access code.

The existing `Providers` boundary remains in the root layout. No API endpoints, mock services, domain entities, server-state hooks, or additional dependencies are required. Those are introduced only with confirmed feature contracts. No secrets or PIN examples from the prototype are copied into runtime code.

## Styling and accessibility conventions

`src/app/globals.css` is the single source for semantic Tailwind tokens, Figtree, shared focus styling, and reduced-motion behavior. Component styles use the tokens and existing Tailwind utilities. Interactive controls use native semantics, visible focus, text labels, and disabled attributes. Touch targets should be approximately 44 by 44 pixels when used as primary controls. Error messages are associated with their fields and announced through appropriate roles. The documented responsive widths are proposals because the prototype has no explicit media-query contract; actual narrow and desktop layouts must be visually verified.

## Trade-offs and assumptions

- Small, direct component props keep the foundation reusable while avoiding a polymorphic `as` API, state framework, or style helper dependency.
- No product-specific navigation is added to the setup shell: session and route behavior belongs to roadmap milestone 1.
- The POS-specific palette, Figtree type, rounded surfaces, and three-color header stripe are observed. Responsive breakpoint values and some normalized spacing tokens are documented proposals rather than exact prototype rules.
- The existing Query provider is preserved, but this visual foundation does not fetch or cache data.
