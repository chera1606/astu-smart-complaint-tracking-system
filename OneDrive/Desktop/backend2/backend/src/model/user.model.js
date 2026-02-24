import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        default: 'student'
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: function () {
            return this.role === 'staff';
        }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
