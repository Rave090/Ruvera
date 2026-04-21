# CLAUDE.md — Ruvera

## Core Behavior
- Do exactly what is asked. Nothing more.
- Do not modify unrelated code or refactor unless asked.
- Ask before any architectural change, new dependency, or folder structure change.

## Project
Ruvera is an AI-powered skincare app (React Native / Expo SDK ~54). Three roles: Normal Users, Vendors, Dermatologists.
Stack: TypeScript (strict), Zustand, WatermelonDB, Axios, TFLite + Vision Camera, Expo Router.

## Architecture
- Feature-based structure under `/src/features/` — each feature owns its components, hooks, services, store, types.
- Shared primitives live in `/src/components/`, `/src/hooks/`, `/src/services/`, `/src/store/`.
- Call chain is strict: Component → Hook → Service → API Client. Never skip a layer.
- One Axios instance only: `/src/services/api/client.ts`.
- UI reads from WatermelonDB. API responses are persisted before rendering.
- All WatermelonDB writes inside `database.write()` transactions.

## Code Standards
- TypeScript strict mode. No `any`. Explicit param and return types.
- `interface` for object shapes. `type` for unions/aliases.
- No inline styles — use `/src/theme/` tokens only.
- Never use raw `<Text>` — use `<Typography>`. Never raw `<Pressable>` — use `<Button>`.
- No comments unless the WHY is non-obvious.
- No file over ~300 lines — split it.
- No `console.log`, commented-out code, or TODO blocks committed.

## State
- One Zustand store per domain. Stores hold no API logic or UI logic.
- Server state (API data) belongs in WatermelonDB, not Zustand.
- Use granular selectors — never destructure the entire store in a component.

## AI & Privacy (non-negotiable)
- Face images must NEVER leave the device. All ML runs on-device (TFLite).
- Only anonymized skin params may be sent to backend via `skinParams.service.ts`.
- Federated learning requires explicit user consent via `consentGate.ts` — opt-in only.
- Gradients must have differential privacy noise applied before upload.

## Naming
| Type | Convention |
|---|---|
| Component | PascalCase |
| Hook | `useXxx.ts` |
| Service | `xxx.service.ts` |
| Store | `xxx.store.ts` |
| DB Model | PascalCase |

## Output
- Minimal, precise changes only.
- State which files will be created or modified before doing so.
- No explanations unless asked. Stay strictly within scope.
