# 🤝 Team Work Distribution (2 Developers)

To maximize speed and minimize conflicts for the 36-hour hackathon, we will split work by **Feature Domain** rather than Frontend/Backend.

**Developer A: The "Core Engine" (Map & Data)**
_Focus: Data Integrety, Tools, Algorithms._

**Developer B: The "Experience" (UI & Hardware)**
_Focus: Patient Journey, PWA, Visuals._

---

## 👨‍💻 Developer A: "The Map Architect"

**Responsibilities:** Backend API, Map Builder Tool, Pathfinding Algorithm.

### 1. Backend & Data (Hours 1-4)

- [ ] Create `backend/data/maps.json` structure.
- [ ] Build API endpoints (`GET /map`, `POST /map`).
- [ ] Handle Image Uploads (multer) for floor plans.

### 2. Map Builder "Admin" UI (Hours 4-15)

- [ ] **Canvas Editor**: Build the tool that allows clicking on a map image to drop nodes `(x, y)`.
- [ ] **Graph Logic**: dragging lines between nodes to create Edges.
- [ ] **Node Types**: UI to assign types to nodes (e.g., "Elevator", "Room 101", "Turn").
- [ ] **Save Button**: POST the graph to the backend.

### 3. Pathfinding Logic (Hours 15-25)

- [ ] Implement **A\* Algorithm** (weighted by distance).
- [ ] Optimization: Ensure the path avoids "Hazards" (if implemented).
- [ ] Export function: `getPath(startId, endId) -> [Nodes]`

---

## 👩‍💻 Developer B: "The Navigator"

**Responsibilities:** PWA Offline Shell, Mobile UI, Sensors, Polish.

### 1. PWA & Routing Shell (Hours 1-5)

- [ ] Setup `vite-plugin-pwa` for full offline support.
- [ ] Create the **Mobile Layout** (Bottom Navigation, Search Bar).
- [ ] Ensure "Install App" prompt works.

### 2. Navigation Experience (Hours 5-15)

- [ ] **Turn-by-Turn UI**: Create distinct Cards for steps ("Turn Left", "Go Straight").
- [ ] **Visual Assets**: Place dummy photos at key nodes to test the "KDP" (Key Decision Point) idea.
- [ ] **Search Component**: Fuzzy search for Room Names (e.g. "xray" -> "X-Ray Dept").

### 3. Sensors & "Touch Compass" (Hours 15-25)

- [ ] **Device Orientation**: Use `window.addEventListener('deviceorientation')` to rotate the compass arrow.
- [ ] **Touch Interaction**: Allow swiping the arrow if sensors fail.
- [ ] **Emergency Mode**: Create the "Red Button" UI that overrides everything.

---

## 🔄 Integration Points (Sync Meetings)

These are the moments you MUST merge and test together.

1.  **Metric Lock (Hour 4)**: Agree exactly on the JSON structure of a "Node" and "Edge". (Developer A defines, Developer B consumes).
2.  **API Handoff (Hour 10)**: Developer A delivers the `GET /map` endpoint; Developer B connects the PWA to fetch it.
3.  **Path Visualization (Hour 20)**: Developer A provides the `path array`; Developer B draws it on the `MapCanvas`.
