import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  if (!req.body.comment || req.body.comment.trim().length === 0) {
    res.status(401).json({ message: "Invalid Post: Must contain characters!" });
    return;
  }

  const session = await getSession({
    req: req,
  });

  if (!session) {
    res.status(401).json({ message: "Not allowed!" });
    return;
  }

  const data = req.body;
  const { comment, postTime, postDate, email, postId } = data;

  const client = await connectToDatabase();
  const db = client.db();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({
    email: email,
  });

  await db.collection("comments").insertOne({
    comment: comment,
    username: user.username,
    postId: postId,
    postTime: postTime,
    postDate: postDate,
  });

  res
    .status(201)
    .json({
      comment: comment,
      username: user.username,
      postId: postId,
      postTime: postTime,
      postDate: postDate,
    });
  client.close();
}

export default handler;
