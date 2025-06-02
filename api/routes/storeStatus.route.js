// routes/storeStatus.route.js
import express from 'express';
import { updateStoreStatus, getStoreStatus, updateStoreStatusOnLogout } from '../controllers/storeStatus.controller.js';

const router = express.Router();

router.get('/status', getStoreStatus); 
router.patch('/status', updateStoreStatus); 
router.patch('/logout', updateStoreStatusOnLogout);

export default router;
