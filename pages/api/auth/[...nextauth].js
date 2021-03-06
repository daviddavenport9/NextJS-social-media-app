import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../util/auth";
import { connectToDatabase } from "../../../util/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
            client.close();
          throw new Error("Email or password incorrect");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Email or password incorrect");
        }

        return {
          email: user.email,
        };

        client.close();
      },
    }),
  ],
});
