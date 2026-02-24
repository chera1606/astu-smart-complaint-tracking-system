import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("✅ Database connected successfully!")
    } catch (error) {
        console.log("❌ Database connection fails!")
    }
}
