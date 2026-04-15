import type { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2";
import User from "../../../../server/mongodb/models/User";
import connectDb from "../../../../server/mongodb/index";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

interface VerifyApiData {
    userId?: string;
    admin?: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VerifyApiData>,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed" });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        await connectDb();

        const user = await User.findOne({ email });
        const isPasswordValid = user ? await argon2.verify(user.password, password) : false;
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is missing in environment variables!");
        }

        const token = jwt.sign({ userId: user._id.toString() }, secret, {
            expiresIn: "7d", // Token lasts for 7 days
        });

        const cookie = serialize("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: "/",
        });

        res.setHeader("Set-Cookie", cookie);
        return res.status(200).json({
            userId: user._id,
            admin: user.admin,
            message: "Successfully verified user!",
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "An internal server error occurred.",
        });
    }
}