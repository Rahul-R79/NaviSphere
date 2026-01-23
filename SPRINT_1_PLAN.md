# 🏃 Sprint 1: The Foundation (Features 1 & 2)

This plan details the "Full Setup" for the first two critical features.

## 🌿 Git Strategy

- **Main Branch**: `main` (Production ready)
- **Feature Branches**:
  - Developer A: `feature/map-engine`
  - Developer B: `feature/map-viewer`

---

## 🏗️ Feature 1: Map Data Engine (Backend)

**Owner**: Developer A
**Branch**: `feature/map-engine`
**Goal**: Create the API to read/write the JSON database and handle image uploads.

### Step 1: File Utilities (`Backend/utils/fileHandler.js`)

- Create helper functions: `readData()`, `writeData()`
- Ensure it handles concurrency (locking not needed for low traffic, but good to keep in mind).

### Step 2: Controller Logic (`Backend/controllers/map.controller.js`)

- `getMap`: Read `maps.json` -> Return JSON.
- `saveMap`: Receive JSON body -> Write to `maps.json`.
- `uploadMapImage`: Use `multer` -> Save to `uploads/` -> Return URL.

### Step 3: Routes (`Backend/routes/map.routes.js`)

- `GET /api/map`
- `POST /api/map`
- `POST /api/map/upload`

### Step 4: Server Entry (`Backend/index.js`)

- Import and use `mapRoutes`.
- Serve static files from `uploads/` directory.

---

## 📱 Feature 2: Interactive Map Viewer (Frontend)

**Owner**: Developer B
**Branch**: `feature/map-viewer`
**Goal**: A highly performant Canvas component that can render the map data.

### Step 1: Global Store (`Frontend/src/store/useAppStore.js`)

- Use `Redux`.
- State: `nodes`, `edges`, `mapImage`, `scale`.
- Actions: `setMapData()`, `updateNode()`.

### Step 2: Map Canvas `Frontend/src/Components/Map/MapCanvas.jsx`

- **Structure**:
  - `<div ref={containerRef}>` (Wrapper with `overflow: hidden`)
  - `<div ref={contentRef}>` (The movable "World")
    - `<img src={mapImage} />` (Background)
    - `<svg>` (Overlay for Edges/Lines)
    - `{nodes.map(n => <div className="node" />)}` (Overlay for Nodes)
- **Interaction**:
  - Use `useGesture` to handle drag (pan) and pinch (zoom).
  - Update `transform: translate(x,y) scale(s)` on the content div.

### Step 3: Integration Page (`Frontend/src/Pages/MapBuilder.jsx`)

- Mount `<MapCanvas />`.
- Fetch data from `GET /api/map` on mount.
- Load data into Store.

---

## 🧪 Verification & Merge

1.  **Backend Test**: Use Postman/Curl to POST a dummy node and GET it back.
2.  **Frontend Test**: Hardcode a dummy node in the store, verify it appears on the Canvas.
3.  **Merge**: usage of `git merge` or Pull Request flow.
