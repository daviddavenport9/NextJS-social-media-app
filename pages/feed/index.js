import { Fragment, useState } from "react";
import CreatePost from "../../components/Posts/CreatePost";
import Posts from "../../components/Posts/Posts";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";


function FeedPage(props) {
  const [session, loading] = useSession();
  return (
    <Fragment>
      {session && <CreatePost username={props.username}/>}
      <hr></hr>
      <Posts allPosts={props.posts}/>
    </Fragment>
  );
}

export async function getServerSideProps(context) {


 const client = await connectToDatabase();
  const postsCollection =  client.db().collection("posts");
  const posts = await postsCollection.find().sort({_id: -1}).toArray();

  const session = await getSession({ req: context.req });
 if (!session){
   return {
     props: {
      posts: JSON.parse(JSON.stringify(posts)),

     }
   }
 }

  const usersCollection = client.db().collection("users");
  const userEmail = session.user.email;
  const user = await usersCollection.findOne({
    email: userEmail,
  });


  client.close();

  return{
      props: {
          posts: JSON.parse(JSON.stringify(posts)),
          username: user.username
      }
  }
}

export default FeedPage;
