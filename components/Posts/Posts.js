import classes from "./Posts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";

function Posts(props) {
  const [liked, setLiked] = useState(false);

  function toggleLike() {
    setLiked(!liked);
    if (!liked) {
    }
  }

  function getTimeSincePost(postTime, postDate) {
    const currentDateTime = new Date();

    const currentDate = currentDateTime.toLocaleDateString();

    const date = currentDate - postDate;

    console.log(date);
  }

  const changeColor = liked ? "red" : "white";


  return (
    <div>
      <ul className={classes.allPostsContainer}>
        {props.allPosts.map((post) => (
          <div className={classes.indivPostContainer}>
            <li key={post._id}>
              <h5>{post.username}</h5>
              <p>{post.postText}</p>
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
                      <button className={classes.likeBtn} link>
                        <FontAwesomeIcon
                          icon={faComment}
                          style={{ color: "white" }}
                        />
                      </button>
                    </Link>

                    <p>Leave a comment</p>
                  </li>
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
