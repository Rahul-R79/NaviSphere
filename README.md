# NaviSphere 📍

**Next-Gen Indoor Navigation System for Large Complexes**

NaviSphere is an advanced indoor wayfinding application designed for universities, hospitals, corporate offices, and airports. It solves the "getting lost" problem by providing real-time, interactive navigation without relying on GPS.

![PathPulse Demo](https://media.giphy.com/media/llmrnMkLqcssM6sYG7/giphy.gif)

---

## ✨ Key Features

- **🗺️ Interactive Map Navigator**: Smooth, pan-and-zoom capable indoor maps with intuitive controls.
- **🧠 AI Smart Search**: Powered by Google Gemini. Ask _"Where can I get coffee?"_ and the AI routes you to the Canteen.
- **📱 Progressive Web App (PWA)**: Installable on iOS and Android. Works **Offline** once cached!
- **✏️ Admin Map Builder**: Drag-and-drop editor to upload floor plans, draw paths, and place nodes effortlessly.
- **☁️ Cloud Integration**: Images stored securely on Cloudinary.
- **🧭 Smart Routing**: Uses A\* Algorithm and Dijkstra to find the shortest path between any two points.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **AI**: Google Gemini Pro (Generative AI)
- **Storage**: JSON (Data), Cloudinary (Images)
- **PWA**: Vite PWA Plugin, Service Workers

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Git
- Cloudinary Account (Free)
- Google AI Studio Key (Free)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/Rahul-R79/NaviSphere.git
    cd NaviSphere
    ```

2.  **Install Dependencies**

    ```bash
    # Install root dependencies (if any) or navigate to folders
    cd Frontend && npm install
    cd ../Backend && npm install
    ```

3.  **Configure Environment Variables**
    - **Backend**: Create `Backend/.env`

      ```env
      PORT=3000
      FRONTEND_URL=http://localhost:5173

      # Cloudinary Credentials (Required for Map Uploads)
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret

      # Gemini API Key (Required for AI Search)
      GEMINI_API_KEY=your_gemini_key
      ```

    - **Frontend**: Create `Frontend/.env`

      ```env
      # Local Development
      VITE_API_BASE_URL=http://localhost:3000/api

      # For Production (uncomment when deploying)
      # VITE_API_BASE_URL=https://your-app.onrender.com/api
      ```

4.  **Run Locally**
    You can run both servers concurrently (if configured) or in separate terminals.

    **Terminal 1 (Backend)**:

    ```bash
    cd Backend
    npm run dev
    ```

    **Terminal 2 (Frontend)**:

    ```bash
    cd Frontend
    npm run dev
    ```

    OPEN `http://localhost:5173` to view the app.

---

## 🧠 AI Features

NaviSphere uses **Google Gemini** to understand natural language.

- **User Types**: _"I have a headache"_
- **AI Analyzes**: Looks at map nodes (Medical Room, Pharmacy, etc.)
- **Result**: Automatically selects "Medical Room" as destination.

---

## 📱 Mobile & Offline (PWA)

- **Android**: Tapping the "Install" button adds it to the home screen.
- **iOS**: Tap "Share" -> "Add to Home Screen".
- **Offline Mode**: Once loaded, maps are cached. You can navigate without internet!

---

**Developed with ❤️ by Rahul R**
