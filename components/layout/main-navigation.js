import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

import classes from "./main-navigation.module.css";

function MainNavigation() {
  const [session, loading] = useSession();

  function logoutHandler() {
    signOut();
  }
  return (
    <header className={classes.header}>
      <Link href="/feed">
        <a>
          <div className={classes.logo}>Feeder</div>
        </a>
      </Link>
      <nav>
        <ul>
          <li>
            <Link href={"/feed"}>Feed</Link>
          </li>
          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {!session && (
          <li>
            <Link href="/">Login/Register</Link>
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
