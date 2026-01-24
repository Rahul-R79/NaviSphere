import express from 'express';
import { findDestination } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/find-destination', findDestination);

export default router;
