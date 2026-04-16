import type { NextApiRequest, NextApiResponse } from "next";
import TrainingLog from "../../../../server/mongodb/models/TrainingLog";
import connectDb from "../../../../server/mongodb/index";
import User from "../../../../server/mongodb/models/User";
import Animal from "../../../../server/mongodb/models/Animal";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectDb();
      const logs = await TrainingLog.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $lookup: {
            from: "animals",
            localField: "animal",
            foreignField: "_id",
            as: "animalDetails"
          }
        },
        {
          $unwind: "$userDetails"
        },
        {
          $unwind: "$animalDetails"
        },
        {
          $project: {
            title: 1,
            user: 1,
            animal: 1,
            date: 1,
            description: 1,
            hours: 1,
            userName: "$userDetails.fullName",
            animalName: "$animalDetails.name",
            animalBreed: "$animalDetails.breed"
          }
        }
      ]);
      
      return res.status(200).json(logs);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(500).json({ message: "Method not supported" });
  }
}