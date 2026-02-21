import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/User.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/get/:userid', getUser); // ✅ Public or Protected based on your need
router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);

export default router;