import classes from "./Posts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import Link from "next/link";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { toaster } from "evergreen-ui";


function Posts(props) {
  const [liked, setLiked] = useState(false);
  const [session, loading] = useSession();
  const postInput = useRef();
  const [isError, setIsError] = useState();
  const router = useRouter();

  async function submitPost(username, postText, postDate, postTime) {
    const response = await fetch("/api/posts/submit-post", {
      method: "POST",
      body: JSON.stringify({
        username,
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

  const customNotify = () => {
    toaster.notify(isError);
  };

  async function submitHandler(event) {
    event.preventDefault();
    const postText = postInput.current.value;
    const username = props.username;

    console.log(username);
    const time = new Date();
    const postTime = time.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const postDate = time.toLocaleDateString();

    try {
      await submitPost(username, postText, postDate, postTime);
      postInput.current.value = "";
      router.replace("/feed");
    } catch (error) {
      setIsError(error.toString());
    }
  }

  async function deleteHandler(postId) {
    const response = await fetch("/api/posts/delete-post", {
      method: "DELETE",
      body: JSON.stringify({
        postId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    router.replace("/feed");
  }

  function toggleLike() {
    setLiked(!liked);
  }

  function getTimeSincePost(postTime, postDate) {
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toLocaleDateString();
  }

  const changeColor = liked ? "red" : "white";

  return (
    <div>
      <div className={classes.container}>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <textarea rows={4} ref={postInput}></textarea>
          </div>
          <div className={classes.actions}>
            <button>Post</button>
          </div>
        </form>
        {isError && <div>{customNotify()}</div>}
      </div>
      <hr></hr>
      <ul className={classes.allPostsContainer}>
        {props.allPosts.map((post) => (
          <div className={classes.indivPostContainer} key={post._id}>
            <li>
              <div className={classes.topLine}>
                <h5>{post.username}</h5>
                <img src={post.profilePic} height="40px" />
              </div>
              <p>{post.postText}</p>
              <div className={classes.dateTimeFormat}>
                <p>{post.postTime}</p>
                <p>{post.postDate}</p>
              </div>
              <hr></hr>
              <div className={classes.interactContainer}>
                <ul>
                  <li>
                    <button className={classes.likeBtn} onClick={toggleLike}>
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ color: changeColor }}
                      />
                    </button>
                    <p>Like</p>
                  </li>
                  <li>
                    <Link href={"/feed/" + post._id}>
                      <button className={classes.likeBtn}>
                        <FontAwesomeIcon
                          icon={faComment}
                          style={{ color: "white" }}
                        />
                      </button>
                    </Link>
                    <p>Leave a comment</p>
                  </li>
                  {props.username === post.username && (
                    <li>
                      <button
                        className={classes.likeBtn}
                        onClick={() => deleteHandler(post._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "white" }}
                        />
                      </button>
                      <p>Delete Post</p>
                    </li>
                  )}
                </ul>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
