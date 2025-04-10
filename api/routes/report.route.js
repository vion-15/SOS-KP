import express from 'express';
import { allReport, getAllReports, laporan, markReportAsDone } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/laporan', laporan);
router.get('/getreport', getAllReports);
router.put('/done/:id', markReportAsDone);
router.get('/getallreport', allReport);

export default router;