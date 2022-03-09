import { getSession } from "next-auth/client";
import { useEffect, useRef, useState } from "react";
import classes from "../StartingSection/StartingSection.module.css";
import {toaster } from 'evergreen-ui';



function ProfileForm(props) {
  const [email, setEmail] = useState();
  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const bioInput = useRef();
  const dobInput = useRef();

  useEffect(() => {
    getSession().then((session) => {
      setEmail(session.user.email);
    });
  }, []);

  function submitHandler(event) {
    event.preventDefault();
    const enteredFirstName = firstNameInput.current.value;
    const enteredLastName = lastNameInput.current.value;
    const enteredBio = bioInput.current.value;
    const enteredDob = dobInput.current.value;

    props.onUpdateProfile({
      firstName: enteredFirstName,
      lastName: enteredLastName,
      bio: enteredBio,
      dob: enteredDob,
    });
  }

  const customNotify = () => {
    toaster.notify('Profile Information Updated!');
  }


  return (
    <div className={classes.container}>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="Email">Email: </label>
          <input type="email" id="email" value={email} disabled />
        </div>
        <div className={classes.control}>
          <label htmlFor="firstName">First Name: </label>
          <input type="text" id="firstName" ref={firstNameInput} defaultValue={props.firstName} />
        </div>
        <div className={classes.control}>
          <label htmlFor="lastName">Last Name: </label>
          <input type="text" id="lastName" ref={lastNameInput} defaultValue={props.lastName}/>
        </div>
        <div className={classes.control}>
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" rows="3" ref={bioInput} defaultValue={props.bio}></textarea>
        </div>
        <div className={classes.control}>
          <label htmlFor="DOB">Date of Birth: </label>
          <input type="date" ref={dobInput} defaultValue={props.dob}/>
        </div>
        <div className={classes.actions}>
          <button onClick={customNotify}>Update Information</button>
        </div>
      </form>
      
    </div>
  );
}

export default ProfileForm;
