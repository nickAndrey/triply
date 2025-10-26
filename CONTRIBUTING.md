# PR Self-Check

> For each changed file/feature, run through the checks below. If a check fails, do a quick mitigation in the PR and open a follow-up ticket for deeper work if needed.

---

## 1) Component Rendering

### ✅ Check: "Does this component re-render only on relevant inputs?"

- **How to verify**
  - React DevTools: enable _Highlight updates_ → exercise UI that should be inert.
  - `Profiler` trace for the interaction.
- **If it fails — quick mitigation**
  - Replace inline callbacks/props with stable refs or `useCallback` only for the immediate child causing re-renders.
  - Move non-critical props out of render (pass IDs, not full objects).
- **If it fails — deeper fix**
  - Add `React.memo` to heavy child components and ensure props are stable.
  - Refactor component boundaries: split big components into smaller, focused components.
- **When to accept / skip**
  - Skip memoization for tiny components (< ~1–2ms render) — measure first.

---

## 2) Inline objects / arrays in props

### ✅ Check: "Are we passing literals or new objects/arrays each render?"

- **How to verify**
  - Search code for object/array literals in JSX (grep for `={{` or `={[`), or run eslint rule `react/jsx-no-constructed-context-values` / `no-new-array-in-props` (custom).
  - DevTools re-render highlight will often indicate it.
- **If it fails — quick mitigation**
  - Use `useMemo` with narrow dependency arrays to stabilize config objects used as props.
- **If it fails — deeper fix**
  - Break complex config into primitives or move config to parent scope (module constant) where it doesn't recreate.
- **When to accept / skip**
  - If the object is trivial (single primitive) and component cheap, skip memoization.

---

## 3) Pure rendering & side effects

### ✅ Check: "Is render free of side effects (no fetches, no DOM reads/writes)?"

- **How to verify**
  - Code review: scan for `fetch`, `localStorage`, `getBoundingClientRect`, `window.*` inside JSX/functional body.
- **If it fails — quick mitigation**
  - Move side effects into `useEffect` / `useLayoutEffect` as appropriate.
- **If it fails — deeper fix**
  - Extract effectful logic into custom hooks; ensure isolation and memoization.
- **When to accept / skip**
  - Minor synchronous reads of constants are OK; anything with IO or layout MUST be extracted.

---

## 4) State colocated / lifted only when necessary

### ✅ Check: "Is state colocated with the components that actually use it?"

- **How to verify**
  - Trace state origin — if a parent holds state only used by a small child, that's a red flag.
- **If it fails — quick mitigation**
  - Move state into child component for the PR if low-risk.
- **If it fails — deeper fix**
  - Introduce local store (Zustand/Jotai) or prop drilling refactor to reduce parent re-renders.
- **When to accept / skip**
  - If state must be shared among many components (cross-page), keep global; otherwise colocate.

---

## 5) Derived state duplication

### ✅ Check: "Are derived values stored in state instead of computed?"

- **How to verify**
  - Search for state variables that look like `filtered`, `sorted`, `count` derived from another state.
- **If it fails — quick mitigation**
  - Replace stored derived state with `useMemo` computed values.
- **If it fails — deeper fix**
  - Re-evaluate state shape; store canonical source of truth only.
- **When to accept / skip**
  - Persisted or user-editable derived state may be justified.

---

## 6) Keys in lists

### ✅ Check: "Are list keys stable, unique, and not indexes?"

- **How to verify**
  - Code review: ensure `key={item.id}` (or stable UUID) rather than `index`.
- **If it fails — quick mitigation**
  - Use a stable unique id property; if missing, generate one at data ingestion (not in render).
- **If it fails — deeper fix**
  - Add a dedicated stable id on server or preprocess list items in reducer/loader.
- **When to accept / skip**
  - Temporary dev debugging lists may use index, but **never** on re-orderable lists.

---

## 7) Large lists / virtualization

### ✅ Check: "Is virtualization used when rendering large lists (> ~50–100 items)?"

- **How to verify**
  - Run the UI with a realistic dataset; check long paint times or jank.
  - Lighthouse / DevTools Timeline shows scripting spikes.
- **If it fails — quick mitigation**
  - Replace synchronous list with paginated or lazy-chunk render (e.g., render first 30 items).
- **If it fails — deeper fix**
  - Integrate `react-window` / `react-virtuoso` and memoize item renderers.
- **When to accept / skip**
  - For small lists (< 50) or where virtualization breaks UX (e.g., certain animations), skip.

---

## 8) Code splitting & heavy libs

### ✅ Check: "Are heavy third-party libs lazy-loaded or code-split?"

- **How to verify**
  - Bundle analysis (`vite-bundle-visualizer`, `webpack-bundle-analyzer`); inspect chunk that increased.
  - `network` panel — look for large JS bundles loaded on page load.
- **If it fails — quick mitigation**
  - Convert `import X from 'big-lib'` to dynamic `import()` inside a lazy component or handler.
- **If it fails — deeper fix**
  - Move library usage into a dedicated micro-bundle or server component; consider lighter alternatives.
- **When to accept / skip**
  - If lib is central to initial UX and small, keep it; otherwise lazy-load.

---

## 9) Server Components & Suspense uses

### ✅ Check: "Can data-heavy or CPU-heavy parts be server-rendered (RSC) or suspended?"

- **How to verify**
  - Identify components that fetch/substantially compute on mount or do heavy transforms on the client.
- **If it fails — quick mitigation**
  - Add an interim `Suspense` fallback to reduce main-thread blocking.
- **If it fails — deeper fix**
  - Convert to Server Component (RSC) or move data fetching to route loader (framework-specific).
- **When to accept / skip**
  - Use RSC for non-interactive heavy render work; keep interactive UI on client.

---

## 10) Context & global state churn

### ✅ Check: "Does a Context/provider value change frequently and blow up consumer renders?"

- **How to verify**
  - DevTools: watch consumers while context updates. Search for `Context.Provider value={{...}}` inline.
- **If it fails — quick mitigation**
  - Memoize provider value with `useMemo`, or split provider into two providers (static vs dynamic).
- **If it fails — deeper fix**
  - Replace context with a subscription-based store (Zustand) or selector-based store (RTK with selectors).
- **When to accept / skip**
  - Context is fine for static values (theme, locale); avoid for high-frequency state.

---

## 11) Network & duplicate requests

### ✅ Check: "Are identical requests deduplicated and cached?"

- **How to verify**
  - DevTools Network panel: trigger same view and inspect duplicate XHR/Fetch calls.
  - Check for repeated fetches during rerenders.
- **If it fails — quick mitigation**
  - Centralize fetch logic using React Query / SWR or add basic in-memory dedupe in hook.
- **If it fails — deeper fix**
  - Introduce shared caching layer / use server/cache headers / adopt framework data fetching patterns.
- **When to accept / skip**
  - Very small apps may not need it; larger apps must dedupe.

---

## 12) Hydration & interaction performance

### ✅ Check: "Is Time-to-Hydrate (TTH) / First Input Delay (FID) acceptable?"

- **How to verify**
  - Run Lighthouse (Production build) → check First Contentful Paint (FCP), Time to Interactive (TTI), Hydration timings. Use Web Vitals (real-user monitoring) to measure FID and LCP.
  - Instrument RUM if available (Sentry/Datadog).
- **If it fails — quick mitigation**
  - Defer non-essential client scripts (load after interaction), mark expensive updates with `startTransition`, lazy-load non-critical components.
  - Prioritize interactive parts: ensure buttons/forms hydrate first (split hydration).
- **If it fails — deeper fix**
  - Move more work to Server Components or server rendering (reduce client JS), introduce streaming SSR, split hydration by route or component (islands architecture).
  - Audit and remove large blocking dependencies; reduce JS bundle.
- **When to accept / skip**
  - Accept small regressions if intentional trade-off (e.g., large analytics lib) but document in PR and file follow-up.

---

## 13) Styling & DOM size

### ✅ Check: "Is DOM minimal and styles not causing runtime cost?"

- **How to verify**
  - Lighthouse / Chrome Rendering: check DOM node count and style recalculation time.
  - Search for inline style objects or heavy runtime CSS-in-JS in changed files.
- **If it fails — quick mitigation**
  - Move inline styles to CSS classes; extract heavy style computations out of render.
- **If it fails — deeper fix**
  - Adopt compiled CSS (Tailwind, vanilla-extract). Reduce nesting and wrappers.
- **When to accept / skip**
  - Dynamic inline styles for rare animations are OK; avoid for general layout.

---

## 14) Profiling & test validation

### ✅ Check: "Did you profile the production build and confirm improvement/non-regression?"

- **How to verify**
  - Build a production bundle and run: React Profiler + Chrome Performance trace on a representative device/emulation.
  - Compare before/after traces or add PR artifact that records key metrics.
- **If it fails — quick mitigation**
  - Revert the change or throttle feature rollout (feature flag) and open a performance ticket.
- **If it fails — deeper fix**
  - Create a benchmark task, isolate the regression, and schedule a dedicated optimization sprint.
- **When to accept / skip**
  - If change is unrelated to performance and profiling is impractical for this PR, at least add a note and ticket to validate in integration testing.

---

## PR checklist (copy/paste into PR body)

- [ ] Verified render boundaries with React DevTools (no unexpected flashes).
- [ ] Confirmed no inline object props that cause child churn (or used `useMemo` with reason).
- [ ] Ensured state is colocated and derived state is `useMemo` not stored.
- [ ] Large lists are paginated/virtualized or deliberately justified.
- [ ] Heavy libs are lazy-loaded; bundle impact checked.
- [ ] Data fetching deduped / server rendered where appropriate.
- [ ] Measured hydrate/interaction using lighthouse/Prod build or RUM; mitigations noted.
- [ ] Added notes in PR describing any performance trade-offs and follow-up tickets.

---

## Closing guidance (practical rules)

- **Measure first.** Don’t add `useCallback`/`useMemo` as ritual—only where profiler indicates wasted renders or expensive recalculations.
- **Short fixes in PR, big refactors as follow-ups.** If a change would require large refactor (store rewrite, RSC migration), add a TODO ticket and include a small mitigation in the PR.
- **Document trade-offs in PR description.** If you accept a regression for feature parity, state why and add a rollback/optimize ticket.
- **Add tests/benchmarks for recurring hot paths.** If you optimized a complex flow, include a small benchmark script or profiling screenshot in the PR.
