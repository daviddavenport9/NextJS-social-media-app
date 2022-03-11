import { useRef, useState } from "react";
import { useSession } from "next-auth/client";
import classes from "./CreatePost.module.css";
import {toaster } from 'evergreen-ui';


async function submitPost(userEmail, postText, postDate, postTime) {
  const response = await fetch("/api/posts/submit-post", {
    method: "POST",
    body: JSON.stringify({
      userEmail,
      postText,
      postDate,
      postTime,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}



function CreatePost() {
  const [session, loading] = useSession();
  const postInput = useRef();
  const [isError, setIsError] = useState();

  const customNotify = () => {
    toaster.notify(isError);
  }

  async function submitHandler(event) {
    event.preventDefault();
    const postText = postInput.current.value;
    const userEmail = session.user.email;
    const time = new Date();
    const postTime = time.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const postDate = time.toLocaleDateString();

    try {
      await submitPost(userEmail, postText, postDate, postTime);
      postInput.current.value = "";
    } catch (error) {
      setIsError(error.toString());
    }
  }
  return (
    <div className={classes.container}>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <textarea rows={4} ref={postInput}></textarea>
        </div>
        <div className={classes.actions}>
        <button>Post</button>
        </div>
      </form>
      {isError &&( <div>{customNotify()}</div>)}
    </div>
  );
}

export default CreatePost;
