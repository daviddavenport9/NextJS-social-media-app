import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/db";
import { ObjectId } from "mongodb";


async function handler(req, res) {
  if (req.method !== "DELETE") {
    return;
  }

  const session = await getSession({
    req: req,
  });

  if (!session) {
    res.status(401).json({ message: "Not allowed!" });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  await db.collection("comments").deleteOne({
      _id: ObjectId(req.body.commentId)
  })

    res.status(201).json({ message: "Deleted Comment!" });

}

export default handler;