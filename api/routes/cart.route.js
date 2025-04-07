import express from 'express';
import { getCartItems, tambah } from '../controllers/keranjang.controller.js';

const router = express.Router();

router.post('/keranjang', tambah);
router.get('/getItems', getCartItems);

export default router;