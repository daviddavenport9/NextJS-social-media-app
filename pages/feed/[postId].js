import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../util/db";

function PostDetailPage(props) {
  const post = props.selectedPost;

  return (
    <div>
      <h1>{post.postText}</h1>
    </div>
  );
}

export async function getStaticProps(context) {
  const postId = context.params.postId;


  const client = await connectToDatabase();

  const postsCollection = client.db().collection("posts");

  const post = await postsCollection.findOne({
      _id: ObjectId(postId)
  });

  return {
    props: {
      selectedPost: JSON.parse(JSON.stringify(post))
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
    fallback: false,
  };
}

export default PostDetailPage;
