# Coding & Engineering Rules

## Core Principles

1. Always prefer **simple, clear solutions** over complex ones.  
2. Avoid **code duplication**. Before adding new logic, check whether similar functionality already exists in the codebase.  
3. Keep the codebase **clean, well-organized, and easy to navigate**.  
4. Refactor files once they grow beyond **200–300 lines** to keep them modular and readable.  

---

## Making Changes

5. Only make changes that are **explicitly requested** or clearly related to the task.  
6. When fixing a bug, **do not introduce new patterns or technologies** unless absolutely necessary.  
7. If a new approach is required, **remove the old implementation** to avoid duplicate logic or mixed patterns.

---

## Architecture & Structure
8. Do not place business logic directly inside UI components.  
9. Avoid adding one-off or temporary scripts inside the main source folders.  

---

## Environment & Configuration Rules

10. Code must work correctly across **development, test, and production** environments.  
11. Never hardcode environment-specific values such as URLs, keys, or configuration settings.  
12. Never modify or overwrite `.env` files without explicit confirmation.  
13. Do not access `process.env` directly inside features or components.  
14. Always use the centralized configuration from:  
   `src/lib/config/env.ts`

---

## Content & Localisation Rules

17. **Do not hardcode user-facing strings or image URLs** in components or pages.  
18. Keep all copy and asset references in a **separate content file** (e.g. `src/lib/content.ts` or per-locale files under `src/lib/`) so localisation can be introduced later without touching UI code.  
19. Components and pages must read text and image URLs from this content layer, not from inline literals.

---

## Test Data Rules

15. Mocking and stubbing are allowed **only in test files**.  
16. Never introduce fake, stubbed, or mock data into development or production runtime code paths.  
