# Attribute updates are dropped when a conditional component is removed in the same render

1. `pnpm install && pnpm dev`
2. Click **Pay**. The button fades for 1.5s (`class="pay busy"`, `aria-busy="true"`), then "Card declined" shows.
3. Click **Pay** again. The page says `busy signal: true`, but the button doesn't fade and has no `aria-busy`.

The second click sets `error.value = ""` (which removes `<Alert>`) and `busy.value = true` in the same tick. The button's `class` and `aria-busy` updates from that render are lost. Every later click behaves the same.

| Click | `busy` signal | button `class` | `aria-busy` |
| --- | --- | --- | --- |
| 1 | true | `pay busy` | `true` |
| 2 | true | `pay` | none |

It only happens when the removed conditional is a component. A plain `{error.value && <p>…</p>}` in the same spot works.

Real-world impact: in our checkout the Pay button's busy state got out of sync after a declined card, and the shopper couldn't retry.

Workaround: put the conditional in its own component that reads the signal:

```tsx
const Err = component$<{ error: Signal<string> }>(({ error }) =>
  error.value ? <Alert message={error.value} /> : null,
);

<Err error={error} />
```

Version: 2.0.0-rc.2. The route is in `src/routes/index.tsx`.
