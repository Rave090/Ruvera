# CLAUDE.md — Ruvera Engineering Guide

> This document is the single source of truth for all architectural, coding, and design decisions in the **Ruvera** project. Every contributor and every AI-assisted session must follow these rules without exception.

---

## 1. Project Overview

**Ruvera** is a production-grade, AI-powered skincare mobile application built with React Native (Expo). It serves three distinct user roles — **Normal Users**, **Vendors**, and **Dermatologists** — each with dedicated feature sets and access scopes.

### Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native (Expo SDK ~54) |
| Language | TypeScript (strict mode) |
| State Management | Zustand |
| Offline Database | WatermelonDB |
| Network Layer | Custom API client (Axios-based) |
| On-Device ML | TensorFlow Lite / React Native Vision Camera |
| Federated Learning | On-device model update protocol |
| Navigation | Expo Router (file-based) |
| Styling | Centralized theme + StyleSheet tokens |

### User Roles

#### Normal Users
- Face scan via camera or gallery
- On-device AI skin analysis
- AI-powered product recommendations
- Real-time chat, audio, and video consultation with dermatologists
- Full e-commerce flow: browse, cart, checkout, order tracking

#### Vendors
- Product listing and inventory management
- Sales analytics dashboard
- Order and fulfillment tracking
- Payment management

#### Dermatologists
- Patient list and profile management
- Text, audio, and video consultation
- Access to patient scan history
- Editable clinical notes per patient

---

## 2. Architecture Principles

These principles are non-negotiable and apply to every file written in this project.

### 2.1 Separation of Concerns

Every file has exactly one responsibility. UI, business logic, and data access are always in separate files. No exceptions.

- Components render UI only — no business logic, no API calls
- Hooks encapsulate behavior and side effects
- Services own all external communication (API, DB)
- Stores own global reactive state
- Utils are pure functions with no side effects

### 2.2 SOLID Principles

- **Single Responsibility** — one file, one concern
- **Open/Closed** — extend via composition, not modification
- **Liskov Substitution** — typed interfaces must be honored
- **Interface Segregation** — small, focused TypeScript interfaces
- **Dependency Inversion** — components depend on abstractions (hooks/services), not implementations

### 2.3 Feature-Based Modularity

All user-facing features live under `/src/features/`. Each feature is a self-contained vertical slice that owns its own components, hooks, store slice, and types. Cross-feature dependencies must be minimized and always go through the shared layers (`/components`, `/hooks`, `/services`).

### 2.4 No Monolithic Files

- No file should exceed ~300 lines
- If a file grows beyond that, split it immediately
- Prefer many small focused files over a few large ones

### 2.5 Reuse Over Duplication

If a UI pattern, hook, or utility is used in more than one place, it must be extracted into the shared layer. Never copy-paste logic between features.

---

## 3. Folder Structure

```
/src
├── app/                        # Expo Router — file-based navigation entry points only
│   ├── (auth)/                 # Auth stack screens
│   ├── (user)/                 # Normal user tab/stack screens
│   ├── (vendor)/               # Vendor-specific screens
│   ├── (dermatologist)/        # Dermatologist-specific screens
│   └── _layout.tsx             # Root layout
│
├── components/                 # Shared, role-agnostic UI primitives
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Typography/
│   ├── Avatar/
│   ├── Badge/
│   ├── Modal/
│   ├── Loader/
│   └── ...
│
├── features/                   # Feature-based vertical slices
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types.ts
│   ├── skin-scan/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types.ts
│   ├── consultation/
│   ├── ecommerce/
│   ├── vendor/
│   └── dermatologist/
│
├── hooks/                      # Shared, reusable hooks (not feature-specific)
│   ├── useDebounce.ts
│   ├── useAppState.ts
│   ├── useNetworkStatus.ts
│   └── ...
│
├── services/                   # All external communication
│   ├── api/
│   │   ├── client.ts           # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── consultation.service.ts
│   │   └── ...
│   └── storage/
│       ├── secureStorage.ts    # expo-secure-store wrappers
│       └── asyncStorage.ts
│
├── store/                      # Zustand stores
│   ├── auth.store.ts
│   ├── cart.store.ts
│   ├── user.store.ts
│   └── ...
│
├── db/                         # WatermelonDB configuration and models
│   ├── index.ts                # Database instance
│   ├── schema.ts               # Full DB schema
│   ├── migrations/
│   └── models/
│       ├── User.ts
│       ├── Product.ts
│       ├── ScanResult.ts
│       ├── Order.ts
│       └── ...
│
├── ml/                         # On-device ML logic — isolated from all UI
│   ├── faceDetection/
│   │   ├── detector.ts         # Camera frame processor
│   │   └── types.ts
│   ├── skinAnalysis/
│   │   ├── analyzer.ts         # TFLite inference engine
│   │   ├── preprocessor.ts     # Image → tensor pipeline
│   │   └── types.ts
│   └── federatedLearning/
│       ├── trainer.ts          # Local model fine-tuning
│       ├── aggregator.ts       # Gradient extraction
│       └── consentGate.ts      # Consent check before any FL operation
│
├── navigation/                 # Navigation helpers and typed route params
│   ├── RootNavigator.tsx
│   └── types.ts
│
├── theme/                      # Design system
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── shadows.ts
│   ├── borderRadius.ts
│   └── index.ts                # Re-exports all tokens
│
└── utils/                      # Pure utility functions
    ├── formatters.ts
    ├── validators.ts
    ├── dateUtils.ts
    ├── imageUtils.ts
    └── ...
```

### What Goes Where

| Folder | Contains | Does NOT contain |
|---|---|---|
| `app/` | Expo Router screen files, layout wrappers | Business logic, API calls, stores |
| `components/` | Reusable UI primitives shared across features | Feature-specific UI, business logic |
| `features/*/components/` | UI components used only within that feature | Logic from other features |
| `features/*/hooks/` | Feature-specific React hooks | Direct API calls, store mutations |
| `features/*/services/` | Feature-specific API adapters | UI code, state |
| `features/*/store/` | Zustand slice for this feature | API calls, DB queries |
| `hooks/` | Shared hooks used in 2+ features | Feature-specific logic |
| `services/api/` | HTTP service classes, API client | UI, state, DB |
| `store/` | Global Zustand stores (auth, cart, etc.) | Component logic |
| `db/` | WatermelonDB models, schema, migrations | UI, API calls |
| `ml/` | All ML inference, preprocessing, FL | UI rendering, navigation |
| `theme/` | Design tokens only | Logic, components |
| `utils/` | Pure functions, no side effects | Hooks, state, API |

---

## 4. Coding Rules

### 4.1 TypeScript

- Strict mode must be enabled (`"strict": true` in `tsconfig.json`)
- No `any` types — use `unknown` + type guards when the type is genuinely uncertain
- All function parameters and return types must be explicitly typed
- Use `interface` for object shapes; `type` for unions, intersections, and aliases
- All API response shapes must have a typed interface in the relevant `types.ts`
- Enums are only used for stable, named constant sets (e.g., `UserRole`, `OrderStatus`)

### 4.2 Component Rules

- Every component is a named function (no anonymous default exports)
- Props interface is defined directly above the component in the same file
- Components must not contain business logic — extract into a custom hook
- Components must not contain API calls — delegate to a service via a hook
- Components must not import from `services/` directly
- All styles use the theme system — no inline `style={{ color: '#fff' }}`
- Never use the raw `<Text>` component — always use `<Typography>`
- Never use raw `<TouchableOpacity>` or `<Pressable>` for actionable elements — use `<Button>`

### 4.3 Hooks

- Hook files are prefixed with `use` (e.g., `useSkinAnalysis.ts`)
- A hook returns only what the consumer needs — no over-returning
- Side effects go inside `useEffect` with correct dependency arrays
- Expensive computations are memoized with `useMemo`
- Callbacks passed as props are wrapped in `useCallback`

### 4.4 File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Component | PascalCase | `ProductCard.tsx` |
| Hook | camelCase prefixed `use` | `useProductSearch.ts` |
| Service | camelCase with `.service` suffix | `product.service.ts` |
| Store | camelCase with `.store` suffix | `cart.store.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Types file | lowercase | `types.ts` |
| DB Model | PascalCase | `Product.ts` |
| Theme token file | camelCase | `colors.ts` |

### 4.5 Imports

- Absolute imports only — configure `tsconfig.json` path aliases (e.g., `@components/`, `@features/`, `@theme/`)
- No `../../../` relative imports beyond one level up
- Group imports: React → React Native → third-party → internal (auto-sorted by Prettier/ESLint)

---

## 5. UI Guidelines

### 5.1 Theme System

The theme is the only source of design values. All tokens are defined in `/src/theme/` and imported through the barrel `@theme`.

```
colors.ts       — brand palette, semantic colors (error, success, warning, info)
spacing.ts      — consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64...)
typography.ts   — font families, sizes, weights, line heights
borderRadius.ts — radius scale (sm, md, lg, full)
shadows.ts      — elevation/shadow presets
```

**Rules:**
- Never hardcode color hex values, pixel sizes, or font sizes outside theme files
- Never hardcode spacing values (use `theme.spacing.md` not `16`)
- If a new design token is needed, add it to the theme file — do not inline it

### 5.2 Required Reusable Primitives

These must be built before any feature work begins. All feature components must use them.

| Component | Purpose |
|---|---|
| `<Typography>` | All text rendering — accepts `variant` prop (heading, subheading, body, caption, label) |
| `<Button>` | All interactive actions — accepts `variant` (primary, secondary, ghost, destructive), `size`, `loading`, `disabled` |
| `<Input>` | All text inputs — handles label, error state, helper text, icons |
| `<Card>` | All content containers with elevation/shadow |
| `<Avatar>` | User/profile image with fallback initials |
| `<Badge>` | Status indicators, counts |
| `<Loader>` | Loading spinner / skeleton variants |
| `<Modal>` | Bottom sheet and center modal variants |

### 5.3 Responsive Design

- Use `useWindowDimensions` for dimension-dependent logic
- Never hardcode pixel widths for layout containers
- Use `flexbox` for all layouts
- Use `%` or `flex` values — never fixed `width: 375`
- Safe area must always be respected using `useSafeAreaInsets`

### 5.4 Accessibility

- Every interactive element must have an `accessibilityLabel`
- Images must have `accessibilityRole="image"` and meaningful labels
- Color contrast must meet WCAG AA minimum (4.5:1 for normal text)

---

## 6. State Management Strategy

### 6.1 Zustand Usage

- One store per feature domain (e.g., `auth.store.ts`, `cart.store.ts`, `consultation.store.ts`)
- Stores are located in `/src/store/` for global concerns and `/src/features/*/store/` for feature-specific state
- Each store exports a typed interface for its state and a typed interface for its actions
- Stores must not contain API logic — they receive data from services via hooks
- Stores must not contain UI logic

### 6.2 Store Structure Pattern

Every store follows this consistent shape:

```
State interface     — pure data fields
Actions interface   — functions that mutate state
Selectors          — exported selector functions (not inline in components)
Store definition   — create()(set, get) with state + actions combined
```

### 6.3 Selector Pattern

- Never destructure the entire store in a component — always use granular selectors
- Define named selectors exported from the store file to prevent inline selectors causing re-renders
- Components subscribe only to the slice of state they actually render

### 6.4 Server State vs. Client State

- **Server state** (data fetched from API) should not live in Zustand — use React Query or SWR if caching and refetching are required
- **Client state** (UI state, session, cart, preferences) belongs in Zustand
- WatermelonDB is the source of truth for offline-persisted data — Zustand should not duplicate it

---

## 7. Networking Strategy

### 7.1 API Client

A single Axios instance is created in `/src/services/api/client.ts`. This is the only HTTP client in the application. No other file creates an Axios instance or calls `fetch` directly.

The client handles:
- Base URL configuration per environment
- Request interceptor: attaches `Authorization: Bearer <token>` header
- Response interceptor: normalizes error shapes into a typed `ApiError`
- Automatic token refresh on 401 (with request queue to prevent duplicate refreshes)
- Retry logic for network failures (3 attempts with exponential backoff)
- Request/response logging in development only

### 7.2 Service Layer Pattern

Every API domain has a dedicated service file:

```
auth.service.ts          — login, register, refresh, logout
user.service.ts          — profile CRUD
product.service.ts       — browse, search, details
order.service.ts         — place, track, history
consultation.service.ts  — scheduling, messaging, session
vendor.service.ts        — inventory, listings, analytics
dermatologist.service.ts — patient management, notes
skinParams.service.ts    — submit extracted skin parameters (NOT images)
```

Each service function:
- Accepts typed parameters
- Returns a typed response (wrapped in a `Result<T, ApiError>` pattern)
- Never throws uncaught exceptions — errors are returned, not thrown

### 7.3 No Direct API Calls in Components or Hooks at Root Level

The call chain is strictly:

```
Screen / Component
     ↓ calls
Feature Hook (useProductSearch, usePlaceOrder...)
     ↓ calls
Service (product.service.ts, order.service.ts...)
     ↓ calls
API Client (client.ts)
     ↓ sends
HTTP Request
```

Breaking this chain at any point is a violation.

### 7.4 Error Handling

- All API errors are typed as `ApiError { code, message, statusCode }`
- Features handle their own error display — the service does not render or alert
- Network connectivity is checked before requests using the `useNetworkStatus` hook
- Offline-first features fall back to WatermelonDB when the network is unavailable

---

## 8. Database Strategy (WatermelonDB)

### 8.1 Offline-First Principle

WatermelonDB is the primary data store for user-facing features. The app must be fully functional offline for all read operations and most write operations.

- All data that a user needs to see must be stored locally in WatermelonDB
- API responses must be persisted to the local DB before being rendered
- The UI always reads from WatermelonDB, never directly from API responses

### 8.2 Models

All model files live in `/src/db/models/`. Every model:
- Extends `Model` from `@nozbe/watermelondb`
- Declares all columns with `@field`, `@date`, `@relation`, and `@children` decorators
- Exports a typed interface for its column set
- Defines explicit relations to other models

Core models include:

```
User             — id, role, email, displayName, createdAt
ScanResult       — id, userId, analysedAt, skinType, conditions[], parametersJson
Product          — id, vendorId, name, category, price, stockCount, imageUrls[]
Order            — id, userId, status, totalAmount, createdAt
OrderItem        — id, orderId, productId, quantity, unitPrice
Consultation     — id, userId, dermatologistId, scheduledAt, status, notes
Message          — id, consultationId, senderId, content, sentAt, type
PatientNote      — id, dermatologistId, userId, content, updatedAt
VendorProduct    — id, vendorId, productId (join)
```

### 8.3 Schema and Migrations

- The full schema is declared once in `/src/db/schema.ts`
- Every schema change requires a migration file in `/src/db/migrations/`
- Migration files are numbered sequentially and never modified after release
- Breaking schema changes require a new migration — never edit an existing one

### 8.4 Sync Strategy

WatermelonDB sync is handled via the `synchronize()` API:

- Sync runs on app foreground and after any write operation
- Sync endpoint returns `{ changes: { created, updated, deleted }, timestamp }`
- Conflicts are resolved server-wins by default
- Sync status is tracked in a dedicated `sync.store.ts` Zustand slice
- Failed syncs are queued and retried with exponential backoff

### 8.5 Performance

- Always use `@lazy` and `@children` for relations — avoid eager loading
- Use `observe()` only for components that must react to live changes
- Batch all writes inside a single `database.write()` call
- Never call WatermelonDB queries inside `render` — use `withObservables` or hooks with `useEffect`

---

## 9. AI & Privacy Rules

These rules are absolute and must never be violated.

### 9.1 Face Data — On-Device Only

- **Face images MUST NEVER be transmitted to any server**, internal or external
- All face detection and skin analysis runs exclusively on-device using TFLite models
- The camera frame processor pipeline in `/src/ml/faceDetection/detector.ts` terminates locally — no frame bytes leave the device
- Image buffers are cleared from memory immediately after inference

### 9.2 What Can Leave the Device

Only the following extracted, anonymized parameters may be sent to the backend via `skinParams.service.ts`:

```
skinType          (enum: oily | dry | combination | normal | sensitive)
conditions[]      (enum array: acne | rosacea | hyperpigmentation | ...)
hydrationScore    (float 0–1)
uniformityScore   (float 0–1)
textureScore      (float 0–1)
analysedAt        (timestamp)
```

No pixel data, no image hashes, no face embeddings, no biometric identifiers.

### 9.3 Federated Learning

- FL training runs on-device in `/src/ml/federatedLearning/trainer.ts`
- Only gradient updates (not raw data) may be submitted to the aggregation server
- Differential privacy noise must be applied to gradients before upload
- `/src/ml/federatedLearning/consentGate.ts` must be called before any FL operation — if consent is not granted, FL is fully disabled for that user
- FL participation is opt-in, never opt-out by default

### 9.4 User Consent

- Consent for camera access, skin analysis, and federated learning are separate, independent consent flows
- Consent state is stored in `expo-secure-store` and in WatermelonDB
- Any feature that touches face data must check consent before proceeding
- Revoking consent must immediately stop all data collection and purge locally stored scan results

### 9.5 Data Retention

- Scan results are stored locally and only synced if the user consents to cloud backup
- Users can delete all their data from within the app — this triggers a server-side purge request
- No scan data is retained in logs, analytics events, or crash reports

---

## 10. Developer Discipline Rules

### 10.1 Scope Control

- **DO NOT implement more than what is explicitly requested** — no bonus features, no speculative abstractions
- **DO NOT assume unstated requirements** — ask before guessing
- If a requirement is ambiguous, stop and ask for clarification before writing code
- A component asked for one feature should not silently grow other features

### 10.2 Before Any Major Decision

- **ALWAYS ask before** making architectural changes that affect more than one feature
- **ALWAYS ask before** introducing a new dependency
- **ALWAYS ask before** changing the folder structure
- **ALWAYS suggest** a better approach if one exists — explain the trade-off, then wait for approval

### 10.3 Code Quality Gate

Before any code is considered done:

- [ ] TypeScript compiles with zero errors
- [ ] No `any` types introduced
- [ ] No inline styles introduced
- [ ] No raw `<Text>` components used
- [ ] No direct API calls inside components
- [ ] All new UI uses theme tokens
- [ ] No logic duplicated from an existing hook or utility
- [ ] WatermelonDB writes are inside `database.write()` transactions
- [ ] No face image data flows toward any network call

### 10.4 Response Format (for AI-assisted sessions)

When implementing a feature:
1. State clearly which files will be created or modified
2. Implement only the files relevant to the request
3. Do not refactor unrelated code in the same response
4. If a dependency (e.g., a shared component) does not exist yet, flag it and stop — do not create it unless asked

### 10.5 Commit Discipline

- Commits are scoped to one feature or fix at a time
- Commit message format: `<type>(<scope>): <short description>` — e.g., `feat(skin-scan): add hydration score to analysis output`
- Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- Never commit commented-out code, `console.log` statements, or TODO blocks

---

## Appendix: Quick Reference Card

| Rule | Short Form |
|---|---|
| No API in components | Use a hook → service → client chain |
| No inline styles | Use `theme.*` tokens only |
| No raw `<Text>` | Always use `<Typography>` |
| No face data to server | On-device ML only |
| No FL without consent | Check `consentGate` first |
| No large files | Split at ~300 lines |
| No cross-feature imports | Go through shared layers |
| No `any` types | Use typed interfaces |
| No monolithic stores | One store per feature domain |
| No assumptions | Ask when requirements are unclear |

---

*This document is the single source of truth for the Ruvera project. If this document conflicts with any other instruction, this document wins. Update it as the architecture evolves.*
