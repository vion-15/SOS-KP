// routes/storeStatus.route.js
import express from 'express';
import { updateStoreStatus, getStoreStatus, updateStoreStatusOnLogout } from '../controllers/storeStatus.controller.js';

const router = express.Router();

router.get('/status', getStoreStatus); // untuk ambil status toko
router.patch('/status', updateStoreStatus); // untuk update status toko
router.patch('/logout', updateStoreStatusOnLogout);

export default router;
