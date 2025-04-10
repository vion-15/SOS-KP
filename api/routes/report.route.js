import express from 'express';
import { getAllReports, laporan, markReportAsDone } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/laporan', laporan);
router.get('/getreport', getAllReports);
router.put('/done/:id', markReportAsDone);

export default router;