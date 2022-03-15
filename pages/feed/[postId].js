import { ObjectId } from "mongodb";
import IndividualPost from "../../components/Posts/IndividualPost";
import { connectToDatabase } from "../../util/db";
import { useSession, getSession } from "next-auth/client";

function PostDetailPage(props) {
  const post = props.selectedPost;

  return (
    <div>
      <IndividualPost getSelectedPost={post} getComments={props.comments}/>
    </div>
  );
}

export async function getStaticProps(context) {
  const postId = context.params.postId;

  const client = await connectToDatabase();

  const postsCollection = client.db().collection("posts");
  const commentsCollection = client.db().collection("comments");

  const comments = await commentsCollection.find({
    postId: postId
  }).sort({_id: -1}).toArray();

  const post = await postsCollection.findOne({
      _id: ObjectId(postId)
  });

  if (!comments){
    return {
      props: {
        selectedPost: JSON.parse(JSON.stringify(post))
      }
    }
  }

  return {
    props: {
      selectedPost: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
}

export async function getStaticPaths() {
  const client = await connectToDatabase();

  const postsCollection = client.db().collection("posts");

  const posts = await postsCollection.find().toArray();

  const paths = posts.map((post) => ({ params: {postId: post._id.toString() } }));

  return {
    paths: paths,
    fallback:"blocking",
  };
}

export default PostDetailPage;
