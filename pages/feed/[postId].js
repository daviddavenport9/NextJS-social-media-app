import { ObjectId } from "mongodb";
import IndividualPost from "../../components/Posts/IndividualPost";
import { connectToDatabase } from "../../util/db";
import { useSession, getSession } from "next-auth/client";

function PostDetailPage(props) {
  const post = props.selectedPost;

  return (
    <div>
      <IndividualPost getSelectedPost={post} getComments={props.comments} username={props.username}/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const postId = context.params.postId;

  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await connectToDatabase();

  const postsCollection = client.db().collection("posts");
  const commentsCollection = client.db().collection("comments");
  const usersCollection = client.db().collection("users");

  const comments = await commentsCollection
    .find({
      postId: postId,
    })
    .sort({ _id: -1 })
    .toArray();

  const post = await postsCollection.findOne({
    _id: ObjectId(postId),
  });

  const userEmail = session.user.email;
  const user = await usersCollection.findOne({
    email: userEmail,
  });

  if (!comments) {
    return {
      props: {
        selectedPost: JSON.parse(JSON.stringify(post)),
         username: user.username
      },
    };
  }

  return {
    props: {
      selectedPost: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
      username: user.username
    },
  };
}

export default PostDetailPage;
