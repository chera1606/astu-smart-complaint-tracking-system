import User from '../../model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generateId from '../../utils/idGenerator.js';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, departmentId } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate unique User ID
        const userId = await generateId('USR-', User);

        // Create user
        const userData = {
            userId,
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        };

        if (role === 'staff' && departmentId) {
            userData.departmentId = departmentId;
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                departmentId: user.departmentId,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    res.status(200).json(req.user);
};
