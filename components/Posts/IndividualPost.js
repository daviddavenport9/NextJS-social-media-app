import classes from "./IndividualPost.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useRef, useState, useEffect } from "react";
import { toaster } from "evergreen-ui";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";

function IndividualPost(props) {
  const [liked, setLiked] = useState(false);
  const [commentsArray, setCommentsArray] = useState(props.getComments);
  const commentInputRef = useRef();
  const [isError, setIsError] = useState();
  const [showComments, setShowComments] = useState(false);
  const [session, loading] = useSession();
  const router = useRouter();

  function toggleLike() {
    setLiked(!liked);
    if (!liked) {
    }
  }

  const customNotify = () => {
    toaster.notify(isError);
  };

  async function submitComment(comment, postTime, postDate, email, postId) {
    const response = await fetch("/api/posts/submit-comment", {
      method: "POST",
      body: JSON.stringify({
        comment,
        postTime,
        postDate,
        email,
        postId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    setCommentsArray((commentsArray) =>
      [...commentsArray, data].sort().reverse()
    );

    return data;
  }

  async function submitHandler(event) {
    event.preventDefault();
    const enteredComment = commentInputRef.current.value;
    const time = new Date();
    const postTime = time.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const postDate = time.toLocaleDateString();
    const email = session.user.email;
    const postId = props.getSelectedPost._id;

    try {
      const returnData = await submitComment(
        enteredComment,
        postTime,
        postDate,
        email,
        postId
      );

      console.log(returnData.profilePic);
      commentInputRef.current.value = "";
       router.replace("/feed/" + postId);
    } catch (error) {
      setIsError(error.toString());
    }
  }

  function toggleComments() {
    setShowComments(!showComments);
  }

  async function deleteHandler(postId) {
    postId = props.getSelectedPost._id;
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
    router.push("/feed");
  }

  async function deleteHandlerComment(commentId){
    const postId = props.getSelectedPost._id;
    const response = await fetch("/api/posts/delete-comment", {
      method: "DELETE",
      body: JSON.stringify({
        commentId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    router.replace("/feed/" + postId);
  }

  const changeColor = liked ? "red" : "white";

  return (
    <Fragment>
      <div className={classes.indivPostContainer}>
        <div className={classes.topLine}>
          <h4>{props.getSelectedPost.username}</h4>
          <img src={props.getSelectedPost.profilePic} height="40px" />
        </div>
        <p>{props.getSelectedPost.postText}</p>
        {props.getSelectedPost.postPic && (
        <img src={props.getSelectedPost.postPic} height="300px"/>
        )}
        <div className={classes.dateTimeFormat}>
          <p>{props.getSelectedPost.postTime}</p>
          <p>{props.getSelectedPost.postDate}</p>
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
            {props.getSelectedPost.username === props.username && (
              <li>
                <button className={classes.likeBtn} onClick={deleteHandler}>
                  <FontAwesomeIcon icon={faTrash} style={{ color: "white" }} />
                </button>
                <p>Delete post</p>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div id={classes.comments}>
        <h2>Comments</h2>
      </div>

      <div className={classes.actions}>
        <button onClick={toggleComments}>
          {!showComments ? "Show Comments" : "Hide Comments"}
        </button>
      </div>
      {showComments && (
        <div>
          <div className={classes.indivPostContainer}>
            <form onSubmit={submitHandler}>
              <div className={classes.actions}>
                <textarea rows={3} ref={commentInputRef}></textarea>
                <button>Submit comment!</button>
              </div>
            </form>
            {isError && <div>{customNotify()}</div>}
          </div>
          <ul className={classes.allPostsContainer}>
            {props.getComments.map((comment) => (
              <div key={comment._id} className={classes.indivPostContainer}>
                <li>
                  <div className={classes.topLine}>
                    <h4>{comment.username}</h4>
                    <img src={comment.profilePic} height="40px" />
                 
                  </div>
                  <p>{comment.comment}</p>
               
                  <div className={classes.dateTimeFormat}>
                    <p>{comment.postTime}</p>
                    <p>{comment.postDate}</p>
                  </div>
                 
                  {comment.username === props.username && (
                    
                    <div>
                    <hr></hr>
                    <button className={classes.likeBtn} onClick={() => deleteHandlerComment(comment._id)}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: "white" }} />
                    </button>
                    <p>Delete comment</p>
                    </div>
                )}
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
}

export default IndividualPost;
