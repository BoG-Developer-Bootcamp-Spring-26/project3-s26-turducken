import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User from "../../../server/mongodb/models/User";
import connectDb from "../../../server/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const token = req.cookies['auth-token'];

        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is missing!");
        }

        const decoded = jwt.verify(token, secret) as { userId: string };

        await connectDb();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            userId: user._id,
            admin: user.admin,
            fullName: user.fullName,
            email: user.email,
        });

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}