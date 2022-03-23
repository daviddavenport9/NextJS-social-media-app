import UserProfile from "../../components/UserProfile/UserProfile";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";

function ProfilePage(props) {
  return (
    <div>
      <UserProfile
        firstName={props.firstname}
        lastName={props.lastname}
        bio={props.bio}
        dob={props.dob}
        username={props.username}
        profilePic={props.profilePic}
        posts={props.posts}
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

  const postsCollection =  client.db().collection("posts");
  const posts = await postsCollection.find({
    username: user.username
  }).sort({_id: -1}).toArray();



  return {
    props: {
      session,
      userEmail,
      username: user.username,
      firstname: user.firstName,
      lastname: user.lastName,
      bio: user.bio,
      dob: user.dob,
      profilePic: user.profilePic,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}

export default ProfilePage;
