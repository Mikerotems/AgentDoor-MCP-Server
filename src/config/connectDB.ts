import mongoose from "mongoose"

export const connectDB = async () => {
    const dbUri = "mongodb://localhost/mcp"
    if (!dbUri) {
        throw new Error("DBURI environment variable is not set")
    }

    await mongoose.connect(dbUri)
    console.log("mongoDB connected successfully")
};
