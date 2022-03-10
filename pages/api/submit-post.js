import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";

async function handler(req, res) {
    if (req.method !== "POST") {
      return;
    }
  
    const session = await getSession({
      req: req,
    });
  
    if (!session) {
      res.status(401).json({ message: "Not allowed!" });
      return;
    }

    const userEmail = session.user.email;
    const postText = req.body.postText;
    const postTime = req.body.postTime;
    const postDate = req.body.postDate;

    const client = await connectToDatabase();

    const db = client.db();

    await db.collection("posts").insertOne({
            email: userEmail,
            postText: postText,
            postTime: postTime,
            postDate: postDate
    });

    res.status(201).json({ message: "Created post!" });
    client.close();

}

export default handler;