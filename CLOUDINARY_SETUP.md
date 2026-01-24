# Cloudinary Setup Guide

## ✅ Cloudinary Integration Complete!

PathPulse now uses Cloudinary for image storage instead of local file system. This ensures images persist forever, even in production!

---

## 🔑 Get Your Cloudinary Credentials

### Step 1: Sign Up for Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a **FREE account** (no credit card required)
3. Verify your email

### Step 2: Get Your Credentials

1. Log in to your Cloudinary dashboard
2. You'll see your credentials on the homepage:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Update Backend .env File

Open `Backend/.env` and update these lines:

```env
PORT=3000
FRONTEND_URL=

# Cloudinary Configuration (REQUIRED)
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name_here
CLOUDINARY_API_KEY=your_actual_api_key_here
CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

**Example:**

```env
CLOUDINARY_CLOUD_NAME=dpqx7ymz8
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## 🚀 How It Works Now

### Upload Flow:

```
User uploads image
    ↓
Frontend → /api/map/upload
    ↓
Backend receives file in memory (not saved to disk)
    ↓
Upload to Cloudinary ☁️
    ↓
Cloudinary returns permanent URL
    ↓
URL stored in database
```

### Example URLs:

- **Old (Local)**: `http://localhost:3000/uploads/1769228024702-243159053.png`
- **New (Cloudinary)**: `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/pathpulse/maps/image.png`

---

## ✅ Benefits

### Development:

- ✅ No need to commit large image files to Git
- ✅ Clean uploads folder
- ✅ Works same as before from user perspective

### Production:

- ✅ **Images never disappear** on server restart
- ✅ **Fast CDN delivery** worldwide
- ✅ **Free tier**: 25GB storage + 25GB bandwidth/month
- ✅ **Automatic optimization** and transformations

---

## 🧪 Testing

### Step 1: Configure Cloudinary

Update the `.env` file with real credentials (see above)

### Step 2: Restart Backend

```bash
# Backend will restart automatically with nodemon
# Or manually restart if needed
```

### Step 3: Upload a Test Image

1. Go to Map Builder (`/admin/builder`)
2. Upload a map image
3. Check the URL in DevTools Network tab
4. Should start with `https://res.cloudinary.com/...`

### Step 4: Verify in Cloudinary

1. Log in to Cloudinary dashboard
2. Go to Media Library
3. Look for `pathpulse/maps` folder
4. Your uploaded images should be there!

---

## 🔧 Technical Changes Made

### Backend Updates:

1. **NEW**: `config/cloudinary.js` - Cloudinary configuration
2. **UPDATED**: `controllers/map.controller.js` - Upload to Cloudinary
3. **UPDATED**: `routes/map.routes.js` - Memory storage instead of disk
4. **INSTALLED**: `cloudinary` and `streamifier` packages

### Frontend:

- ✅ No changes needed! Works exactly the same

---

## 📦 Image Organization

All images are uploaded to: `pathpulse/maps/` folder in your Cloudinary account

This keeps everything organized and easy to manage.

---

## 🆓 Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month
- **Images/Videos**: Unlimited

**This is MORE than enough for most apps!**

---

## ⚠️ Important Notes

1. **Don't commit credentials** to Git (.env is gitignored)
2. **For production**, add the same credentials to your hosting provider's environment variables
3. **Images are permanent** - deleted maps won't delete images from Cloudinary
4. **Use the cleanup tool** in Cloudinary dashboard to remove unused images

---

## 🎉 You're All Set!

Once you add your Cloudinary credentials to `.env`, image uploads will work in both development AND production!

No more lost images! 🚀
