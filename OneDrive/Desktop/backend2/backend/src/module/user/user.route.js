import express from 'express';
import { getUsers, getUserById, deleteUser, updateUser } from './user.controller.js';
import { protect, admin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

export default router;
