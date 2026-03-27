import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@/types/types";
import { createUser, getUser } from "../../../server/mongodb/actions/user";
import connectDb from "../../../server/mongodb/index";
import argon2 from "argon2";

interface UserApiData {
    userData?: Partial<UserData>;
    message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserApiData>,
) {
  if (req.method === 'POST') {
    try {
        if (!req.body.fullName || !req.body.email || !req.body.password || req.body.admin === undefined) {
            return res.status(400).json({
                message: "Full name, email, password, and admin are required for creating a user!"
            });
        }
        let hash = "";
        try {
            hash = await argon2.hash(req.body.password);
        } catch (err) {
            return res.status(500).json({
                message: "Error encrypting password!"
            });
        }
        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash,
            admin: req.body.admin,
        } as UserData;
        await connectDb();
        const user = await createUser(userData);
        res.status(200).json({
            userData: userData,
            message: "User successfully created!",
        });
    } catch (e) {
        res.status(500).json({
            message: "There was an error when adding your user to the database."
        });
    }
  } else {
    res.status(500).json({
        message: "This API doesn't support this HTTP method!",
    });
  }
}
