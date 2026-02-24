import express from 'express';
import { registerUser, loginUser, getMe } from './auth.controller.js';
import { protect, admin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', protect, admin, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
