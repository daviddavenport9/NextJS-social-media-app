import classes from "./IndividualPost.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useRef, useState } from "react";
import { toaster } from "evergreen-ui";
import { useSession } from "next-auth/client";


function IndividualPost(props) {
  const [liked, setLiked] = useState(false);
  const [commentsArray, setCommentsArray] = useState(props.getComments);
  const commentInputRef = useRef();
  const [isError, setIsError] = useState();
  const [showComments, setShowComments] = useState(false);
  const [session, loading] = useSession();


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
    setCommentsArray((commentsArray) => [...commentsArray, data].sort().reverse());

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
      commentInputRef.current.value = "";
    } catch (error) {
      setIsError(error.toString());
    }
  }

  function toggleComments() {
    setShowComments(!showComments);
  }

  const changeColor = liked ? "red" : "white";

  return (
    <Fragment>
      <div className={classes.indivPostContainer}>
        <h4>{props.getSelectedPost.username}</h4>
        <p>{props.getSelectedPost.postText}</p>
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
            <li>
              <button className={classes.likeBtn}>
                <FontAwesomeIcon icon={faComment} style={{ color: "white" }} />
              </button>
              <p>Leave a comment</p>
            </li>
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
            {commentsArray.map((comment) => (
              <div key={comment._id} className={classes.indivPostContainer}>
                <li>
                <div>
                  <h4>{comment.username}</h4>
                </div>
                  <p>{comment.comment}</p>
                  <hr></hr>
                  <div className={classes.dateTimeFormat}>
                    <p>{comment.postTime}</p>
                    <p>{comment.postDate}</p>
                  </div>
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
