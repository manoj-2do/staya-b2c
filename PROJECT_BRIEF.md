# Product Brief — Staya (V1)

## Problem

Many travel platforms overwhelm users with too much information, dense layouts, and complex flows. Users often arrive casually to explore deals or dream about trips, but leave because the experience feels like work.

Staya solves this by presenting travel options in a clean, structured, and easy-to-digest way, turning browsing and booking into a smooth experience rather than a stressful task.

---

## Target User

Travelers who:
- Prefer visually clean, well-structured websites  
- Want to browse travel options without pressure  
- Look for deals, offers, and “best price” opportunities  
- Value a smooth, modern digital experience  

---

## Core User Loop

The main repeat behavior:

1. User visits Staya  
2. Browses hotels, flights, or packages  
4. Selects an option and moves into a booking flow  
5. Returns later to plan another trip  

Even when not booking, users should enjoy browsing and exploring.

---

## V1 Scope
Version 1 focuses on **Hotels booking** as the primary functional flow.

### Included in V1

1. **Homepage**
   - Clear entry points for:
     - Hotels
     - Flights
     - Holiday Packages
   - Flights and Packages visible but not fully interactive

2. **Hotels Booking Flow**
   - Search → results → details → booking steps (simplified but realistic flow)
   - Designed as a guided, low-friction experience

3. **API-Based Authentication (System Level)**
   - No user login/signup
   - System uses an API Key to fetch a token
   - Token is used across the platform for hotel data and booking actions

4. **Deals / Offers Presence (UI Level)**
   - Visual space for deals and special offers
   - Helps reinforce the “come back to check prices” behavior

---

## Out of Scope (Not in V1)
- No user account system  
- No user login or signup  
- No full implementation of Flights booking  
- No full implementation of Holiday Packages booking  
- No complex personalization features  

---

## Success Criteria for V1

V1 is successful if:
- Users can land on the homepage and clearly understand where to go  
- The Hotels flow feels simple, guided, and not overwhelming  
- The interface feels calm, modern, and not cluttered  
- The system authentication (API key → token) works reliably in the background  
