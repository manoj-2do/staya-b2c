# Tech Stack — Staya

This document defines the approved technologies and architectural direction for the Staya project.

Staya follows **Clean Code Architecture** principles with a **feature-first and scene-based structure**.

Do not introduce major new frameworks or architectural patterns unless absolutely necessary.

---

## Frontend

- Framework: **Next.js (App Router)**
- Language: **TypeScript**
- Rendering Strategy:
  - Prefer **Server Components** where possible
  - Use **Client Components** only when interactivity is required

---

## Styling & UI System

- Styling Framework: **Tailwind CSS**
- Component Library: **shadcn/ui**

### UI Rules
- Always prefer **shadcn components** before building custom ones
- Extend existing components instead of duplicating styles
- Use consistent spacing, typography, and layout patterns
- Avoid cluttered or overly dense interfaces

### Color System
- **Primary Color:** Purple (CTAs, active states, highlights)
- **Base/Secondary:** White and light neutrals
- Visual style should feel similar in cleanliness and spacing to Airbnb, but using purple instead of red.

---

## Architecture Philosophy

Staya uses **Clean Architecture + Feature-First Design + Scene-Based UI Structure**

This ensures:
- Separation of concerns
- Scalable feature development
- Clear boundaries between UI, logic, and API communication

### Architectural Layers

| Layer | Responsibility |
|------|----------------|
UI Layer | Pages, layouts, and scene components |
Feature Layer | Business logic and feature-specific structure |
Service Layer | API communication |
Shared Layer | Reusable utilities, hooks, and components |

---

## Feature-First Folder Structure
All product functionality lives inside **src/** and follows the feature-wise folder structure template below (each feature has `scenes/`, `components/`, `hooks/`, `services/`, `models/`, `utils/`, and `index.ts`).

---

## Environment Configuration

Staya must support multiple environments: **development, test, and production**.

### Environment Files

The project must include:
.env.example
.env.development
.env.test
.env.production

- `.env.example` documents required variables (no real secrets)
- Environment-specific values must never be hardcoded in the codebase

### Environment Access Rules

All environment variables must be accessed through:
src/frontend/core/config/env.ts

This file centralizes configuration and prevents direct environment access in random parts of the application.

Example structure:

- API base URL
- API authentication URL
- API keys (server-side only)

### Security Rules

- Variables prefixed with `NEXT_PUBLIC_` may be used in the browser
- Secret keys must only be used server-side
- Never expose private keys in client components

### Feature wise folder structure template 

features/
└── hotels/
    │
    ├── scenes/                          # Each user step = isolated scene
    │   ├── HotelSearch/
    │   │   ├── components/               # UI only for HotelSearch
    │   │   ├── hooks/                    # Hooks only HotelSearch needs
    │   │   ├── services/                 # API logic only for this scene
    │   │   ├── types/                    # Scene-specific types
    │   │   └── HotelSearchScene.tsx
    │   │
    |   └──...
    │   
    │
    ├── components/                      # Shared across ALL hotel scenes
    │   ├── HotelCard.tsx
    │   └── HotelImageGallery.tsx
    │
    ├── hooks/                           # Feature-wide hooks
    │   └── useHotelFilters.ts
    │
    ├── services/                        # Feature-wide API logic
    │   └── hotelApi.ts
    │
    ├── models/                          # Feature-wide domain models
    │   ├── Hotel.ts
    │   ├── Room.ts
    │   └── Booking.ts
    │
    ├── utils/                           # Helpers only Hotels use
    │   └── priceFormat.ts
    │
    └── index.ts                         # Public exports for feature
