import UserProfile from "../components/UserProfile/UserProfile";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../util/db";

function ProfilePage(props) {
  return (
    <div>
      <UserProfile
        firstName={props.firstname}
        lastName={props.lastname}
        bio={props.bio}
        dob={props.dob}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userEmail = session.user.email;
  const client = await connectToDatabase();

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({
    email: userEmail,
  });

  return {
    props: {
      session,
      userEmail,
      firstname: user.firstName,
      lastname: user.lastName,
      bio: user.bio,
      dob: user.dob,
    },
  };
}

export default ProfilePage;
