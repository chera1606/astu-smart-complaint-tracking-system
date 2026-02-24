import express from 'express';
import {
    createComplaint,
    getStudentComplaints,
    getDepartmentComplaints,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    getAnalytics
} from './complaint.controller.js';
import { protect, admin, staff } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

// Student Routes
router.route('/')
    .post(protect, upload.single('attachment'), createComplaint); // Assuming student posts here

router.route('/student')
    .get(protect, getStudentComplaints);

// Staff Routes
router.route('/department')
    .get(protect, staff, getDepartmentComplaints);

router.route('/:id/status')
    .put(protect, staff, updateComplaintStatus); // Staff and Admin can update (staff middleware allows admin)

// Admin Routes
router.route('/all')
    .get(protect, admin, getAllComplaints);

router.route('/analytics')
    .get(protect, admin, getAnalytics);

// General Private Routes
router.route('/:id')
    .get(protect, getComplaintById);

export default router;
