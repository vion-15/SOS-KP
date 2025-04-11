import express from 'express';
import { getTodayReport, getYesterdayReport, saveDayReport } from '../controllers/dayReport.controller.js';

const router = express.Router();

router.post('/save', saveDayReport);
router.get('/today', getTodayReport);
router.get('/yesterday', getYesterdayReport);

export default router;