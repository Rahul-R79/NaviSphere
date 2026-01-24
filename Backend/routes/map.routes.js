import express from 'express';
import multer from 'multer';
import {
  getMap,
  saveMap,
  uploadMapImage,
  getRoute,
  deleteMap,
} from '../controllers/map.controller.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

router.get('/route', getRoute);
router.get('/', getMap);
router.get('/:id', getMap);
router.post('/', saveMap);
router.post('/upload', upload.single('mapImage'), uploadMapImage);
router.delete('/:id', deleteMap);

export default router;
