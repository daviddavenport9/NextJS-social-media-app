import { hashPassword } from "../../../util/auth";
import { connectToDatabase } from "../../../util/db";

async function handler(req, res) {
  if (req.method === "POST") {
    // res.status(201).json({ message: "Created user!" });
    const data = req.body;
    const { email, password, username } = data;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7 || !username
    ) {
      res.status(422).json({
        message:
          "Invalid input - password should also be at least 7 characters long",
      });
      return;
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({
      email: email,
    });

    if (existingUser) {
      res.status(422).json({ message: "User already exists" });
      client.close();
      return;
    }

    const formattedUsername = "@" + username;

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
      username: formattedUsername,
      firstName: '',
      lastName: '',
      bio: '',
      dob: '',
      profilePic: 'https://res.cloudinary.com/dmvtlczp8/image/upload/v1647548976/my-uploads/fxc5h42ca8ynw2gg8vk4.png'
    });

    res.status(201).json({ message: "Created user!" });
    client.close();

  }
}

export default handler;
