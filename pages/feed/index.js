import { Fragment, useState } from "react";
import CreatePost from "../../components/Posts/CreatePost";
import Posts from "../../components/Posts/Posts";
import { useSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";


function FeedPage(props) {
  const [session, loading] = useSession();
  return (
    <Fragment>
      {session && <CreatePost />}
      <hr></hr>
      <Posts allPosts={props.posts}/>
    </Fragment>
  );
}

export async function getServerSideProps(context) {

 const client = await connectToDatabase();
  const postsCollection =  client.db().collection("posts");
  const posts = await postsCollection.find().sort({_id: -1}).toArray();
  client.close();

  return{
      props: {
          posts: JSON.parse(JSON.stringify(posts))
      }
  }
}

export default FeedPage;
