# PathPulse Production Deployment Checklist

## Issues Found & Fixes Applied

### ✅ COMPLETED

1. **API URL Configuration (Frontend)**
   - Created `Frontend/.env` with `VITE_API_BASE_URL`
   - Updated `Frontend/src/utils/api.js` to use environment variable
   - Updated `MapNavigator.jsx` to use `API_BASE_URL` constant

### ⚠️ REMAINING FIXES NEEDED

2. **MapBuilder.jsx** - Replace hardcoded URLs
   - Line 34: `axios.get('http://localhost:3000/api/map')`
   - Line 111: `axios.post('http://localhost:3000/api/map/upload', ...)`
   - Line 193: `axios.post('http://localhost:3000/api/map', ...)`

   **Fix**: Add at top of file:

   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
   ```

   Then replace all URLs with `${API_BASE_URL}/...`

3. **NodeProperties.jsx** - Replace hardcoded URL
   - Line 100: `axios.post('http://localhost:3000/api/map/upload', ...)`

   **Fix**: Same as above

## Production Deployment Steps

### Backend (Node.js/Express)

#### Option A: Render.com (Recommended - Free Tier)

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository (Backend folder)
5. Set environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   ```
6. Deploy!
7. Copy the deployed URL (e.g., `https://pathpulse-api.onrender.com`)

#### Option B: Railway.app

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select Backend folder
4. Add environment variables
5. Deploy
6. Get deployment URL

### Frontend (React/Vite)

#### Option A: Vercel (Recommended - Free)

1. Go to https://vercel.com
2. Import Git Repository (Frontend folder)
3. **IMPORTANT**: Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```
   (Use the backend URL from step above)
4. Deploy!

#### Option B: Netlify

1. Go to https://netlify.com
2. Import from Git (Frontend folder)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add Environment Variable: `VITE_API_BASE_URL`
6. Deploy

---

## Critical Configurations

### 1. CORS (Backend)

Current setup in `Backend/index.js`:

```javascript
app.use(cors());
```

**For Production**, update to:

```javascript
app.use(
  cors({
    origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:5173'],
    credentials: true,
  })
);
```

### 2. Environment Variables (Backend)

Create `Backend/.env.production`:

```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

Update `Backend/index.js`:

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
```

### 3. Static Files (Backend)

The `/uploads` route is correctly configured:

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

**Important**: Most free hosting platforms have **ephemeral file systems**. Uploaded images will be lost on restart.

**Solution**: Use Cloudinary (already in .env)

- Sign up at https://cloudinary.com (Free tier)
- Get credentials
- Add to backend environment variables

---

## localStorage Compatibility

✅ **localStorage works in production!**

- No changes needed
- Data persists per-domain
- PWA makes it even more reliable

---

## Testing Before Production

### Local Test with Production Build

#### Frontend:

```bash
cd Frontend
npm run build
npm run preview
```

Access at http://localhost:4173

#### Backend:

```bash
cd Backend
NODE_ENV=production npm start
```

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed with correct `VITE_API_BASE_URL`
- [ ] CORS configured with frontend domain
- [ ] Test login flow
- [ ] Test map navigation
- [ ] Test map builder (admin)
- [ ] Test PWA install
- [ ] Test offline mode
- [ ] Mobile responsiveness verified

---

## Quick Fix Commands

### Update all API calls to use environment variable:

```bash
# In Frontend folder
# Create a new file: src/config.js
echo "export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';" > src/config.js
```

Then in ALL files, replace:

```javascript
import { API_BASE_URL } from '../config';
// or
import { API_BASE_URL } from '../../config';
```

---

## Recommended Deployment Flow

1. **Fix remaining hardcoded URLs** (MapBuilder.jsx, NodeProperties.jsx)
2. **Deploy Backend** to Render/Railway
3. **Update Frontend .env** with backend URL
4. **Deploy Frontend** to Vercel/Netlify
5. **Test everything**
6. **Setup custom domain** (optional)

Would you like me to fix the remaining files now?
