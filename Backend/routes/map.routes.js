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

// Multer setup for image uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/route', getRoute); // Must be before /:id
router.get('/', getMap);
router.get('/:id', getMap);
router.post('/', saveMap);
router.post('/upload', upload.single('mapImage'), uploadMapImage);
router.delete('/:id', deleteMap); // DELETE route for removing maps

export default router;
