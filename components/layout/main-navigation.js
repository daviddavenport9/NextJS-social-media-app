import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

import classes from "./main-navigation.module.css";
import { useRouter } from "next/router";


function MainNavigation() {
  const [session, loading] = useSession();


  function logoutHandler(){
    signOut();

  }
  return (
    <header className={session ? classes.header : null}>
        {session && (
      <Link href="/">
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
        )}
      <nav>
        <ul>
          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
