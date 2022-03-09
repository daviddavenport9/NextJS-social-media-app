import UserProfile from "../components/UserProfile/UserProfile";
import { getSession } from "next-auth/client";


function ProfilePage() {
  return (
    <div>
      <UserProfile />
    </div>
  );
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
  
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  
    return {
      props: {
        session,
      },
    };
  }

export default ProfilePage;
