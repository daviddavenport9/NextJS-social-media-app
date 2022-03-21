import { getSession } from "next-auth/client";
import { useState } from "react";
import { useEffect } from "react";
import ProfileBlurb from "./ProfileBlurb";
import ProfileForm from "./ProfileForm";
import ProfilePosts from "./ProfilePosts";
import classes from "./UserProfile.module.css";

function UserProfile(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        window.location.href = "/";
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>;
  }

  function showModal() {
    setShow(!show);
  }
  

  return (
    <div>
      <ProfileBlurb
        firstName={props.firstName}
        lastName={props.lastName}
        bio={props.bio}
        dob={props.dob}
        profilePic={props.profilePic}
        username={props.username}
      />
      {show && (
        <div className={classes.outerModal}>
          <div className={classes.modal}>
          <span className={classes.close} onClick={showModal}>&times;</span>
            <ProfileForm
              firstName={props.firstName}
              lastName={props.lastName}
              bio={props.bio}
              dob={props.dob}
              profilePic={props.profilePic}
              username={props.username}
            />
          </div>
        </div>
      )}
      <div className={classes.actions}>
        <button onClick={showModal}>Edit Profile</button>
      </div>
      <ProfilePosts posts={props.posts} />
    </div>
  );
}

export default UserProfile;
