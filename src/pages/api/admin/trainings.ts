import type { NextApiRequest, NextApiResponse } from "next";
import TrainingLog from "../../../../server/mongodb/models/TrainingLog";
import connectDb from "../../../../server/mongodb/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectDb();
      const logs = await TrainingLog.find();
      
      return res.status(200).json(logs);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(500).json({ message: "Method not supported" });
  }
}