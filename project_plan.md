# Hospital Route Navigator (PathPulse) - Project Plan

## 🚀 Problem Statement

Navigating large hospitals is stressful and confusing. Physical signs are often missed, and GPS doesn't work indoors.
**Goal:** Build a "Waze for Indoors" that runs in the browser (PWA), works offline, and requires no expensive hardware (beacons/sensors).

## 💡 Unique & Creative Features

1.  **"Touch Compass" Navigation**:
    - A floating 3D arrow on screen points physically to the destination.
    - Uses device orientation (compass) or swipe-to-rotate.
    - "Follow the Arrow" is universally understood.
2.  **Key Decision Points (KDP)**:
    - We don't need Street View _everywhere_.
    - Show photos only at **junctions** (turns, stairs, lifts).
    - Reduces data usage significantly for offline offline.
3.  **Crowdsourced "Hazard" Reporting**:
    - Staff/Users can tap "Spill here" or "Corridor Blocked".
    - Instantly updates route weights (simulated for Hackathon).
4.  **"Emergency Red Line"**:
    - One-tap "Panic Button" for emergencies.
    - Clears UI, high-contrast, fastest path to ER.
5.  **Admin "Map Builder"**:
    - A built-in editor to uploading floor plans and drawing nodes/edges.
    - Essential for setting up the demo quickly.

## 🛠 Tech Stack (The "Free & Fast" Stack)

- **Frontend**: React + Vite + Tailwind CSS
- **State**: Zustand (Global Store)
- **Routing**: Custom A\* (A-Star) Algorithm on Weighted Graph
- **Offline**: PWA (Service Workers + Cache API)
- **Backend**: Node.js + Express
- **Database**: JSON Files (No database setup required for speed)

## 🗺 Data Structure

- **Nodes**: `{ id, x, y, type (turn|room), imgUrl }`
- **Edges**: `{ from, to, distance, weight }`
- **Map**: `{ id, floorName, imageSrc, nodes[], edges[] }`

## 📋 Implementation Roadmap

### Phase 1: Setup & Core (Hours 1-4)

- [ ] Initialize Repository (Frontend/Backend)
- [ ] Setup PWA & Manifest
- [ ] Create `MapCanvas` Component (Pan/Zoom support)

### Phase 2: The Map Builder (Hours 4-10)

- [ ] Admin Interface to upload Floor Plans
- [ ] Click-to-add Nodes, Drag-to-connect Edges
- [ ] Save map data to Backend (JSON)

### Phase 3: Pathfinding & Navigation (Hours 10-20)

- [ ] Implement A\* Algorithm
- [ ] Build "Turn-by-Turn" Card UI
- [ ] Implement "Touch Compass" Logic

### Phase 4: Polish & Unique Features (Hours 20-30)

- [ ] Add "Emergency Mode"
- [ ] Add Search Functionality
- [ ] Make it look "Premium" (Dark mode, smooth animations)

### Phase 5: Testing & Presentation (Hours 30-36)

- [ ] Offline verification
- [ ] Prepare Demo Video / Walkthrough
