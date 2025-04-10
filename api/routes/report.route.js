import express from 'express';
import { getAllReports, laporan } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/laporan', laporan);
router.get('/getreport', getAllReports);

export default router;