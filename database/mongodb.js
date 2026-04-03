import mongoose from 'mongoose';
import {NODE_ENV, DB_URL} from "../config/env.js";


console.log('DB_URL:', DB_URL ? 'exists' : 'MISSING');
console.log('NODE_ENV:', NODE_ENV);

if (!DB_URL) {
    throw new Error('MongoDB URL is missing');
}

const connectMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectMongoDB;