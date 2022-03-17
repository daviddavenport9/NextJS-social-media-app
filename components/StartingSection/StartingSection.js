import { useState, useRef } from "react";
import classes from "./StartingSection.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { toaster } from "evergreen-ui";

async function createUser(email, password, username) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      username
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function StartingSection() {
  const [isLogin, setIsLogin] = useState(true);
  const emailInput = useRef();
  const passwordInput = useRef();
  const usernameInput = useRef();
  const router = useRouter();
  const [isError, setIsError] = useState();

  const customNotify = () => {
    toaster.notify(isError);
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsError(null);
    const enteredEmail = emailInput.current.value;
    const enteredPassword = passwordInput.current.value;
    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result.error) {
        router.replace("/feed");
      } else {
        setIsError(result.error);
      }
    } else {
    const enteredUsername = usernameInput.current.value;
      try {
        const result = await createUser(enteredEmail, enteredPassword, enteredUsername);
        toaster.notify("Account successfully created!");
        setIsLogin(!isLogin);
        emailInput.current.value = "";
        passwordInput.current.value = "";
      } catch (error) {
        setIsError(error.toString());
      }
    }
  }

  function switchMode() {
    setIsLogin(!isLogin);
    emailInput.current.value = "";
    passwordInput.current.value = "";
    setIsError(null);
  }

  return (
    <div className={classes.container}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required ref={emailInput} />
        </div>
        <div>
          {!isLogin && (
            <div className={classes.control}>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" required ref={usernameInput} />
            </div>
          )}
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required ref={passwordInput} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" className={classes.toggle} onClick={switchMode}>
            {isLogin ? "Create new account" : "Log in with existing account"}
          </button>
        </div>
        {isError && <div>{customNotify()}</div>}
      </form>
    </div>
  );
}

export default StartingSection;
