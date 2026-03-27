import type { NextApiRequest, NextApiResponse } from "next";
import Animal from "../../../../server/mongodb/models/Animal";
import connectDb from "../../../../server/mongodb/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectDb();
      const animals = await Animal.find();
      
      return res.status(200).json(animals);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(500).json({ message: "Method not supported" });
  }
}