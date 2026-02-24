import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "data in text is required!"],
        trim: true
    },
    embedding: {
        type: [Number],
        required: [true, "embedded data is required!"],
        trim: true
    }
})

export const Data = mongoose.model("Data", DataSchema)
