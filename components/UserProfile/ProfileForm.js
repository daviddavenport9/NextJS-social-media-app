import { getSession } from "next-auth/client";
import { useEffect, useRef, useState } from "react";
import classes from "../StartingSection/StartingSection.module.css";
import classes2 from "./ProfileForm.module.css";
import { toaster } from "evergreen-ui";
import { useRouter } from "next/router";

function ProfileForm(props) {
  const [email, setEmail] = useState();
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const bioInput = useRef();
  const dobInput = useRef();
  const profilePictureInput = useRef();
  const router = useRouter();

  console.log(props.profilePic);

  useEffect(() => {
    getSession().then((session) => {
      setEmail(session.user.email);
    });
  }, []);

  async function updateUser(firstName, lastName, bio, dob, profilePic) {
    const formData = new FormData();
    formData.append("file", profilePic);
    formData.append("upload_preset", "my-uploads");

    const profilePicData = await fetch(
      "https://api.cloudinary.com/v1_1/dmvtlczp8/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    const profilePicPath = profilePicData.secure_url;

    const response = await fetch("/api/user/update-profile", {
      method: "PATCH",
      body: JSON.stringify({
        firstName,
        lastName,
        bio,
        dob,
        profilePic: profilePicPath,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredFirstName = firstNameInput.current.value;
    const enteredLastName = lastNameInput.current.value;
    const enteredBio = bioInput.current.value;
    const enteredDob = dobInput.current.value;
    const enteredProfilePic = profilePictureInput.current.files[0];

    try {
      await updateUser(
        enteredFirstName,
        enteredLastName,
        enteredBio,
        enteredDob,
        enteredProfilePic
      );
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
  }

  const customNotify = () => {
    toaster.notify("Profile Information Updated!");
  };

  return (
    <div className={classes2.container}>
      <form onSubmit={submitHandler}>
        <h1 style={{color: 'white'}}>Edit Info</h1>
        <div className={classes.control}>
          <label htmlFor="Email">Email: </label>
          <input type="email" id="email" value={email} disabled />
        </div>
        <div className={classes.control}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            defaultValue={props.username}
            disabled
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="profilePic">Profile Picture: </label>
          <input
            type="file"
            id="profilePic"
            accept="image/png, image/jpeg, image/jpg"
            ref={profilePictureInput}
            name="profilePic"
          />
          <img src={props.profilePic} />
        </div>
        <div className={classes.control}>
          <label htmlFor="firstName">First Name: </label>
          <input
            type="text"
            id="firstName"
            ref={firstNameInput}
            defaultValue={props.firstName}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="lastName">Last Name: </label>
          <input
            type="text"
            id="lastName"
            ref={lastNameInput}
            defaultValue={props.lastName}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            rows="3"
            ref={bioInput}
            defaultValue={props.bio}
          ></textarea>
        </div>
        <div className={classes.control}>
          <label htmlFor="DOB">Date of Birth: </label>
          <input type="date" ref={dobInput} defaultValue={props.dob} />
        </div>
        <div className={classes.actions}>
          <button onClick={customNotify}>Update Information</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;
