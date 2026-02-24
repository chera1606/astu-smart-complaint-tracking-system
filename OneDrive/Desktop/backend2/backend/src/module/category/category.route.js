import express from 'express';
import { getCategories, createCategory, deleteCategory } from './category.controller.js';
import { protect, admin } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getCategories) // All authenticated users can see categories
    .post(protect, admin, createCategory);

router.route('/:id')
    .delete(protect, admin, deleteCategory);

export default router;
