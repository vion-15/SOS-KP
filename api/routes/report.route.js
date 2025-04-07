import express from 'express';
import { laporan } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/laporan', laporan);

export default router;