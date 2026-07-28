# TraderFrame Brand Lab

Interactive, runnable brand identity system for evaluating TraderFrame logo, typography, primary color, generated color scales, semantic colors, radius, density, dark/light presentation, product components, applications, and developer tokens.

## Run locally

From the repository root:

```bash
pnpm install
pnpm --filter @traderframe/brand-lab dev
```

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

## Production build

```bash
pnpm --filter @traderframe/brand-lab build
pnpm --filter @traderframe/brand-lab preview
```

## Included system views

- Brand foundation and canonical product wedge
- Refined TraderFrame logo family and construction preview
- Live primary-color selection with generated 50–900 scale
- Stable evidence, supporting, caution, and contradicting semantic colors
- Heading, body, and data font selectors
- Live radius, density, and light/dark controls
- Typography hierarchy and data treatment
- Product action, evidence, market-context, and decision components
- Dashboard, application icon, and campaign examples
- Live JSON implementation token output

## Product source of truth

The language follows the GateZero/TraderFrame product direction:

- Every trade begins with evidence.
- No trade without evidence. No execution without risk approval.
- Operator-owned decisions.
- Bounded outcomes: reject, watch, paper simulate.

## Implementation note

The lab is intentionally dependency-light. It uses Vite and browser-native JavaScript/CSS so design decisions can be tested without introducing a UI framework into the repository.
