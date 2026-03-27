import type { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2"
import User from "@/server/mongodb/models/User"
import connectDb from "@/server/mongodb/index"

interface VerifyApiData {
    userId?: string;
    admin?: boolean;
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<VerifyApiData>,
  ) {
  const { email, password } = req.body
  await connectDb()

  const user = await User.findOne({ email })
  
  const result = user ? await argon2.verify(user.password, password) : false

  return result 
    ? res.status(200).json({
        userId: user._id,
        admin: user.admin,
        message: "Successfully verified user!",
    })
    : res.status(500).json({
        message: "Invalid email or password",
    });
}