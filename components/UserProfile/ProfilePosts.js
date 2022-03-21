import classes from "./ProfilePosts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function ProfilePosts(props) {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  function toggleLike() {
    setLiked(!liked);
  }

  const changeColor = liked ? "red" : "white";

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
    router.replace("/profile");
  }

  return (
    <div>
      <hr />
      <h1 id={classes.postsHeader}>Posts</h1>
      {props.posts && (
        <ul>
          {props.posts.map((post) => (
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
                  </ul>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfilePosts;
