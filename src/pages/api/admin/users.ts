import type { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../server/mongodb/models/User";
import connectDb from "../../../../server/mongodb/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await connectDb();

      const { lastId, limit = "15" } = req.query;
      const pageSize = parseInt(limit as string);
      const query = lastId ? { _id: { $gt: lastId } } : {};
      const users = await User.find(query)
        .select("-password")
        .sort({ _id: 1 }) 
        .limit(pageSize)
        .lean();
      
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    } 
  } else {
      return res.status(500).json({ message: "Method not supported" });
  }
}