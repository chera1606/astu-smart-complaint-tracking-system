import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    trackingId: {
        type: String,
        unique: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    attachments: [{
        type: String // URL or file path
    }],
    remarks: [{
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Add text index for search
complaintSchema.index({ title: 'text', description: 'text', category: 'text' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
