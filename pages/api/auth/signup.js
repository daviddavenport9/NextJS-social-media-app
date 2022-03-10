import { hashPassword } from "../../../util/auth";
import { connectToDatabase } from "../../../util/db";

async function handler(req, res) {
  if (req.method === "POST") {
    // res.status(201).json({ message: "Created user!" });
    const data = req.body;
    const { email, password } = data;
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
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

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
      firstName: '',
      lastName: '',
      bio: '',
      dob: '',
      profilePic: ''
    });

    res.status(201).json({ message: "Created user!" });
    client.close();

  }
}

export default handler;
