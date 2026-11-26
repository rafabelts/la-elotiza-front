# Provisional catalog contract

This contract supports roadmap milestone 2 only. The product names, prices, availability, and option rules are derived from the interactive prototype and are **not an approved live menu**. Confirm them with the menu owner before production use.

## Boundaries

- `src/features/catalog/types.ts` defines catalog, product, category, option group, option, and selection shapes.
- `src/features/catalog/mock-service.ts` contains the prototype-derived, asynchronous in-memory read source.
- `src/features/catalog/service.ts` exposes `CatalogReadService.readCatalog(): Promise<Catalog>`; the source can be replaced without modifying presentation components. No REST paths are assumed.
- `src/features/catalog/use-catalog.ts` reads through TanStack Query under the `["catalog"]` key. A successful read replaces the browser's last-known catalog snapshot. If a later read fails, the hook returns that snapshot with `source: "saved"` and its `savedAt` timestamp; without a valid snapshot, it retains the error and retry state.
- `src/features/catalog/cache.ts` stores a versioned snapshot in browser `localStorage` and validates its timestamp and nested catalog shape before reuse. Missing, malformed, incompatible, or unavailable storage never prevents a fresh catalog read. There is no fixed cache expiry; the UI must identify saved data and warn that products and prices may be outdated.
- `src/features/catalog/rules.ts` owns conditional availability, cardinality validation, and pricing. Prices use integer MXN cents. A size group's price replaces the product's base price; paid options and charges above an included topping allowance add to it.

`CatalogProduct.allowsSpecialInstructions` is provisional product metadata controlling whether the order configurator offers a special-instructions field. The mock marks drinks `false`; food, the bag of chips, and cutlery remain `true`, including non-drink items listed under the Bebidas category. A future backend contract must provide or map this behavior explicitly.

Selections are keyed by option group ID and contain arrays of option IDs, including one-element arrays for single-choice groups. Duplicate IDs, unavailable options, unknown groups, missing mandatory choices, and invalid quantities fail validation. The price functions support incomplete selections for a live preview; accepting a configuration must use `validateConfiguration`.

## API integration decisions

The catalog API will supply products and prices when this feature is connected to the backend. The current mock is demonstration data, not a shared or live menu. The API response shape, endpoint, authentication, refresh policy, and any location or tenant scope for cached data still need to be defined for that integration. The current cache keeps only menu data on a device that previously loaded it. It does not make the application shell load without a network connection, persist orders, queue submissions, or confirm cached prices for a sale. If a catalog request fails, the UI offers a retry; an existing valid snapshot remains available for browsing and configuration.
