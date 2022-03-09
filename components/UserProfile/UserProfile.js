import { useSession, getSession } from "next-auth/client";
import { useState } from "react";
import { useEffect } from "react";
import classes from './UserProfile.module.css'

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
          window.location.href= '/';
      } else {
      setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>;
  }

  return (
    <div>
      <h1>Your User Profile</h1>
    </div>
  );
}

export default UserProfile;
