import express from 'express';
import { allReport, deleteOrder, getAllReports, getTodayReport, laporan, markReportAsDone } from '../controllers/report.controller.js';

const router = express.Router();

router.post('/laporan', laporan);
router.get('/getreport', getAllReports);
router.put('/done/:id', markReportAsDone);
router.get('/getallreport', allReport);
router.delete('/deleteorder', deleteOrder);
router.get('/today', getTodayReport);

export default router;