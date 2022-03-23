import UserProfile from "../../components/UserProfile/UserProfile";
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";
import ProfileBlurb from "../../components/UserProfile/ProfileBlurb";
import ProfilePosts from "../../components/UserProfile/ProfilePosts";

function OtherProfilePage(props) {
  return (
    <div>
      <ProfileBlurb
        firstName={props.firstName}
        lastName={props.lastName}
        bio={props.bio}
        dob={props.dob}
        profilePic={props.profilePic}
        username={props.username}
      />
      <ProfilePosts posts={props.posts} loggedInUser={props.loggedInUser} />
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

  const profileId = context.params.profileId;
  const username = "@" + profileId;
  const userEmail = session.user.email;

  const client = await connectToDatabase();
  const usersCollection = client.db().collection("users");

  const userLoggedin = await usersCollection.findOne({
    email: userEmail
  });

 
  const user = await usersCollection.findOne({
    username: username,
  });

  const postsCollection = client.db().collection("posts");
  const posts = await postsCollection
    .find({
      username: user.username,
    })
    .sort({ _id: -1 })
    .toArray();

  return {
    props: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      dob: user.dob,
      profilePic: user.profilePic,
      posts: JSON.parse(JSON.stringify(posts)),
      loggedInUser: userLoggedin.username
    },
  };
}

export default OtherProfilePage;
