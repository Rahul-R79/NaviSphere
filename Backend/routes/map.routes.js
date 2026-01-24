import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getMap,
  saveMap,
  uploadMapImage,
  getRoute,
  deleteMap,
} from '../controllers/map.controller.js';

const router = express.Router();

// Multer setup for image uploads (memory storage for Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Routes
router.get('/route', getRoute); // Must be before /:id
router.get('/', getMap);
router.get('/:id', getMap);
router.post('/', saveMap);
router.post('/upload', upload.single('mapImage'), uploadMapImage);
router.delete('/:id', deleteMap); // DELETE route for removing maps

export default router;
