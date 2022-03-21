import classes from "./ProfileBlurb.module.css";

function ProfileBlurb(props) {
  return (
    <div className={classes.blurbContainer}>
      <img src={props.profilePic} />
      <h1>
        {props.firstName} {props.lastName}
      </h1>
      <h2>{props.username}</h2>
      <p>{props.dob}</p>
      <p>{props.bio}</p>
   
    </div>
  );
}

export default ProfileBlurb;
