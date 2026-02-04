# Homescreen — Staya

## Goal

Design a clean, welcoming homepage that introduces the three main travel categories and encourages users to begin exploring without overwhelming them.

The homepage should feel calm, modern, and spacious — similar in visual balance to Airbnb, but using Staya’s purple accent color.

---

## Purpose of This Screen

- Provide clear entry points into:
  - Hotels
  - Flights
  - Holiday Packages
- Allow users to browse comfortably without pressure
- Set the tone for a smooth, experience-focused travel platform

This is a **discovery and entry screen**, not a booking screen.

---

## Main Sections

### 1. Header + Hero Section

This section combines navigation and the primary search entry.

#### 1.1 Top Navigation Bar

Layout:

- **Left:** Staya logo  
- **Center:** Tab-style buttons with icons  
  - Hotels  
  - Flights  
  - Holidays  
- **Right:**  
  - “More” menu button  
  - Call/support icon button  

Rules:

- Clean and lightweight
- No dropdown-heavy or complex menus
- Tabs should look interactive but only Hotels is active in V1

---

#### 1.2 Hero Travel Widget Area

Centered below the navigation.

Contains:

- A tabbed travel widget:
  - Hotel Widget (Active)
  - Flight Widget (Visible but inactive)
  - Holiday Widget (Visible but inactive)

For V1:
- Only the **Hotel tab** is active
- Show a **Hotel Search Form UI only**
- No real search logic or API calls

---

### 2. Background Styling

- Use a travel-themed background image
- Apply a soft overlay to ensure text and UI remain readable
- Background should feel inspirational but not distracting

---

## Global App Behavior (Applies to Entire Application)

These are **global UX rules**, not limited to the homescreen.

### Network Status Awareness

The application should be wrapped with a global network status handler.

#### When the user is offline:

- Show a **global pinned notification bar at the top** of the screen
- Message example:  
  **"You're offline. Some features may not work."**
- If the user tries to interact with something that requires network:
  - Show a subtle notification/toast indicating that internet is required

#### When connection is restored:

- Show a temporary notification:  
  **"You're back online."**

Rules:

- This should be implemented as a **global layout-level feature**
- It should not be handled individually inside each component

---

## Out of Scope (Do NOT Implement)

- No real search functionality
- No booking flows
- No API integration
- No authentication or token handling
- No navigation to feature pages yet
- No deals logic or pricing logic

This phase is **visual structure and layout only**.

---

## Future Enhancements (Not for Now)

- Personalized offers
- Dynamic deals section
- Recently viewed trips
- Location-based suggestions
