import express from 'express';
import { getAllReports, getReportByDate, getTodayReport, getYesterdayReport, saveDayReport } from '../controllers/dayReport.controller.js';

const router = express.Router();

router.post('/save', saveDayReport);
router.get('/today', getTodayReport);
router.get('/yesterday', getYesterdayReport);
router.get('/by-date/:date', getReportByDate);
router.get('/getdayreport', getAllReports);

export default router;