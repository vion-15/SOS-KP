import express from 'express';
import { signOut, test, updateUser } from '../controllers/user.controler.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.post('/signout', signOut);

export default router;