import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/model/user.model.js';
import Category from './src/model/category.model.js';
import generateId from './src/utils/idGenerator.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...', process.env.MONGO_DB);

        // ✅ FIXED HERE (only this part changed)
        await mongoose.connect(process.env.MONGO_DB);

        console.log('MongoDB connected successfully for seeding');

        // Create categories with IDs
        console.log('Clearing old categories...');
        await Category.deleteMany();
        console.log('Inserting new categories...');
        const cats = await Category.insertMany([
            { categoryId: 'DEP-00001', name: 'Hardware Support' },
            { categoryId: 'DEP-00002', name: 'Software/Network Support' },
            { categoryId: 'DEP-00003', name: 'Facilities' }
        ]);
        console.log('Categories created successfully');

        // Create Users with IDs
        console.log('Clearing old users...');
        await User.deleteMany();
        console.log('Generating password hash...');

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        console.log('Inserting new users...');
        await User.insertMany([
            { userId: 'USR-00001', name: 'Admin User', email: 'admin@test.com', password: hash, role: 'admin' },
            { userId: 'USR-00002', name: 'Hardware Staff', email: 'staff@test.com', password: hash, role: 'staff', departmentId: cats[0]._id },
            { userId: 'USR-00003', name: 'Student User', email: 'student@test.com', password: hash, role: 'student' }
        ]);

        console.log('\n=============================================');
        console.log('SUCCESS! TEST ACCOUNTS CREATED.');
        console.log('Password for all users: password123');
        console.log('- admin@test.com (Admin Dashboard)');
        console.log('- staff@test.com (Staff Dashboard)');
        console.log('- student@test.com (Student Dashboard)');
        console.log('=============================================\n');

        process.exit(0);
    } catch (err) {
        console.error('SEEDING FAILED WITH ERROR:', err);
        process.exit(1);
    }
};

seedDB();