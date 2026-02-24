import Complaint from '../../model/complaint.model.js';
import generateId from '../../utils/idGenerator.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private/Student
export const createComplaint = async (req, res) => {
    try {
        const { departmentId, title, description, category, priority, location } = req.body;

        if (!departmentId || !title || !description || !category || !location) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const trackingId = await generateId('CMP', Complaint);

        const complaint = new Complaint({
            trackingId,
            studentId: req.user._id,
            departmentId,
            title,
            description,
            category,
            priority: priority || 'Medium',
            location,
            attachments: req.file ? [req.file.path] : [] // Assuming single file upload for now, can be updated for multiple
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's own complaints
// @route   GET /api/complaints/student
// @access  Private/Student
export const getStudentComplaints = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const complaints = await Complaint.find({ studentId: req.user._id, ...keyword, ...statusFilter })
            .populate('departmentId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get department complaints
// @route   GET /api/complaints/department
// @access  Private/Staff
export const getDepartmentComplaints = async (req, res) => {
    try {
        // Staff should only see complaints for their department
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};

        const complaints = await Complaint.find({ departmentId: req.user.departmentId, ...keyword, ...statusFilter })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints/all
// @access  Private/Admin
export const getAllComplaints = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { category: { $regex: req.query.keyword, $options: 'i' } }
                ]
            }
            : {};

        const statusFilter = req.query.status ? { status: req.query.status } : {};
        const departmentFilter = req.query.departmentId ? { departmentId: req.query.departmentId } : {};


        const complaints = await Complaint.find({ ...keyword, ...statusFilter, ...departmentFilter })
            .populate('studentId', 'name email')
            .populate('departmentId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('studentId', 'name email')
            .populate('departmentId', 'name')
            .populate('remarks.staffId', 'name role');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization checks
        if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        if (req.user.role === 'staff' && complaint.departmentId._id.toString() !== req.user.departmentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status and add remark
// @route   PUT /api/complaints/:id/status
// @access  Private/Staff/Admin
export const updateComplaintStatus = async (req, res) => {
    try {
        const { status, remark } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization checks
        if (req.user.role === 'staff' && complaint.departmentId.toString() !== req.user.departmentId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        if (status) {
            complaint.status = status;
        }

        if (remark) {
            complaint.remarks.push({
                staffId: req.user._id,
                message: remark
            });
        }

        const updatedComplaint = await complaint.save();
        res.status(200).json(updatedComplaint);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get analytics (admin only)
// @route   GET /api/complaints/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

        // Aggregate by category
        const byCategory = await Complaint.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Aggregate by department
        const byDepartment = await Complaint.aggregate([
            { $group: { _id: "$departmentId", count: { $sum: 1 } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'department' } },
            { $unwind: '$department' },
            { $project: { departmentName: '$department.name', count: 1 } }
        ]);

        res.status(200).json({
            totalComplaints,
            pendingComplaints,
            resolvedComplaints,
            resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : 0,
            byCategory,
            byDepartment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
