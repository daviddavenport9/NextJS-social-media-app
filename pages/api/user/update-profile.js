import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../util/db";

async function handler(req, res) {
  if (req.method !== "PATCH") {
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const bio = req.body.bio;
  const dob = req.body.dob;
  const profilePic = req.body.profilePic;


  const client = await connectToDatabase();
  const usersCollection = client.db().collection("users");
  const user = await usersCollection.findOne({
    email: userEmail,
  });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { firstName: firstName, lastName: lastName, bio: bio, dob: dob, profilePic: profilePic} }
  );

  client.close();
  res.status(200).json({ message: "Profile updated!"});

}

export default handler;
