import express from 'express';
import { deleteposts, getCartItems, tambah } from '../controllers/keranjang.controller.js';

const router = express.Router();

router.post('/keranjang', tambah);
router.get('/getItems', getCartItems);
router.delete('/deletelist/:postId', deleteposts);

export default router;