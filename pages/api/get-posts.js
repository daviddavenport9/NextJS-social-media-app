import { connectToDatabase } from "../../util/db";

async function handler(req, res) {
  if (req.method !== "GET") {
    return;
  }

  const client = await connectToDatabase();

  const postsCollection = client.db().collection("posts").find().toArray();

  res.status(201).json({ posts: postsCollection });
  client.close();
}

export default handler;
