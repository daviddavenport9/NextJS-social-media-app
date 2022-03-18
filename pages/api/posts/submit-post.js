import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  if (!req.body.postText || req.body.postText.trim().length === 0) {
    res.status(401).json({ message: "Invalid Post: Must contain characters!" });
    return;
  }

  const session = await getSession({
    req: req,
  });

  if (!session) {
    res.status(401).json({ message: "Not allowed - must be logged in!" });
    return;
  }

  const username = req.body.username;
  const postText = req.body.postText;
  const postTime = req.body.postTime;
  const postDate = req.body.postDate;

  const client = await connectToDatabase();

  const db = client.db();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({
    username: username,
  });

  await db.collection("posts").insertOne({
    username: username,
    email: session.user.email,
    postText: postText,
    postTime: postTime,
    postDate: postDate,
    profilePic: user.profilePic
  });

  res.status(201).json({
    username: username,
    postText: postText,
    postTime: postTime,
    postDate: postDate,
  });
  client.close();
}

export default handler;
