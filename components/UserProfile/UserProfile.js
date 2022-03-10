import { getSession } from "next-auth/client";
import { useState } from "react";
import { useEffect } from "react";
import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";

function UserProfile(props) {
  const [isLoading, setIsLoading] = useState(true);

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

  async function updateUser(profileData) {
    const response = await fetch("/api/user/update-profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <div>
      <h1 className={classes.section}>Your User Profile</h1>
      <ProfileForm
        onUpdateProfile={updateUser}
        firstName={props.firstName}
        lastName={props.lastName}
        bio={props.bio}
        dob={props.dob}
        profilePic={props.profilePic}
      />
    </div>
  );
}

export default UserProfile;
