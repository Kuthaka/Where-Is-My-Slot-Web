import mongoose from "mongoose";
import logger from "../core/logger/logger";

const connectDB = async () => {
    try {
        if(!process.env.DATABASE_URL) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        const connect = await mongoose.connect(process.env.DATABASE_URL)
        logger.info(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectDB;


