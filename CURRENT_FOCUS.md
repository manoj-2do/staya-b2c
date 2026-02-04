# Home Landing Page Behavior Enhancement

## Objective
Enhance the **Home Landing** page so that when a search is performed for any category (Hotel, Flights, Packages):

- The corresponding **list view section** is displayed below the search widget.
- The **Hero section** is hidden.
- The **browser path updates** to reflect the category search.
- **Logo, “More” options, and search icon** remain visible.
- All changes occur **without routing** or page reloads.
- Folder structure must remain unchanged.

---

## Page Structure

Home View
│
├─ Header
│ └─ Category Widget with Search Form (search icon stays constant)
│
├─ Hero Section
│ └─ Home Data (can be blank initially)
│
└─ List View Section (Hotel / Flights / Packages)
└─ Initially hidden


---

## Behavior on Search

1. **User Action**
   - User selects a category (Hotel / Flights / Packages) in the category widget.
   - User clicks the **Search** button.

2. **Page Updates**
   - **Hero Section** → Hide smoothly.
   - **Corresponding List View Section** → Make **visible** below the search widget:
     - Hotel → `home/hotel-list`
     - Flights → `home/flights-list`
     - Packages → `home/packages-list`
   - **Header / Category Widget** → Remains visible.
     - Search icon remains **constant**.
   - **Logo and “More” options** → Remain visible.
   - **Browser path** → Update according to category:
     - Hotels → `/hotels/search`
     - Flights → `/flights/search`
     - Packages → `/packages/search`
   - **No routing or page reload**.

3. **Animation / Transition**
   - Category widget → **Fade out smoothly**.
   - Search widget → **Take place of category widget** with smooth animation.
   - Hero section → **Fade out**.
   - List view section → **Fade/slide in** below search widget.
   - Ensure **layout stability**, no flickers or jumps.

---

## Constraints

- **Do not change folder structure**.
- **Do not hide the logo or “More” options**.
- **Search widget icon remains constant**.
- Focus on:
  - Component visibility toggling.
  - Smooth animations.
  - Browser path update without routing.
- List view sections must exist **inside home folder** and only appear after search.

---

## Implementation Notes

- Use **state management** or reactive variables to toggle visibility of Hero and List View sections.
- Use **CSS transitions** or **animation libraries** for smooth fade-in/fade-out.
- Update the browser path with **`history.pushState`** or framework-specific equivalent without triggering navigation.
- Ensure **all categories** (Hotel, Flights, Packages) follow the same pattern.
- Maintain **visual continuity** for header, logo, search widget, and “More” options.

---

## Summary

- Hero section → Hidden on search.
- Corresponding list view → Visible on search.
- Header remains → Logo, search widget, and “More” options stay constant.
- Browser path updates → Reflect category search, no page reload.
- Smooth animations → Fade/slide transitions for category, hero, and list view sections.c