import { Fragment, useState } from "react";
import Posts from "../../components/Posts/Posts";
import {getSession } from "next-auth/client";
import { connectToDatabase } from "../../util/db";


function FeedPage(props) {
  return (
    <Fragment>
      <Posts allPosts={props.posts} username={props.username} email={props.email}/>
    </Fragment>
  );
}

export async function getServerSideProps(context) {


 const client = await connectToDatabase();
  const postsCollection =  client.db().collection("posts");
  const posts = await postsCollection.find().sort({_id: -1}).toArray();

  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
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
          username: user.username,
          email: session.user.email
      }
  }
}

export default FeedPage;
