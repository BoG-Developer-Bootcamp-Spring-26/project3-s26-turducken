import mongoose from 'mongoose';

export default async function connectDb() {
    try {
        await mongoose.connect(process.env.DB_URL!);
        console.log("Connected!");
    } catch (e) {
        console.log("Unable to connect", e);
    }
}