import type { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@/types/types";
import { createUser, deleteUser, getUser } from "../../../server/mongodb/actions/user";
import connectDb from "../../../server/mongodb/index";
import argon2 from "argon2";
import { deleteAnimalsByUser } from "../../../server/mongodb/actions/animal";
import { deleteTrainingLogsByUser } from "../../../server/mongodb/actions/trainingLog";

interface UserApiData {
    userId?: string;
    userData?: Partial<UserData>;
    message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserApiData>,
) {
    if (req.method === 'GET') {
        try {
            if (!req.query.userId) {
                return res.status(500).json({
                    message: "Getting a user requires a userId!"
                });
            }
            await connectDb();
            const user = await getUser(req.query.userId as string);
            if (!user) {
                res.status(500).json({
                    message: "User not found!"
                });
            } else {
                res.status(200).json({
                    userData: {
                        fullName: user.fullName,
                        email: user.email,
                        admin: user.admin,
                    },
                    message: "User successfully retrieved!"
                })
            }
        } catch (e) {
            res.status(500).json({
                message: "There was an error when getting your user from the database."
            });
        }
    } else if (req.method === 'POST') {
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
                userData: user,
                message: "User successfully created!",
            });
        } catch (e) {
            res.status(500).json({
                message: `There was an error when adding your user to the database. ${e}`
            });
        }
    }
    else if (req.method === 'DELETE') {
        try {
            if (!req.body.userId) {
                return res.status(400).json({
                    message: "Deleting a user requires a userId!"
                });
            }
            await connectDb();
            await deleteUser(req.body.userId);
            await deleteAnimalsByUser(req.body.userId);
            await deleteTrainingLogsByUser(req.body.userId);

            res.status(200).json({
                message: "Successfully deleted the user, along with all their animals and training logs!",
            });
        } catch (e) {
            res.status(500).json({
                message: `There was an error when adding your user to the database. ${e}`
            });
        }
    } else {
        res.status(500).json({
            message: "This API doesn't support this HTTP method!",
        });
    }
}
