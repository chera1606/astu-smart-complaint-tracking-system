import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
