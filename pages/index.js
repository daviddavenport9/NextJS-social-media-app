import StartingSection from "../components/StartingSection/StartingSection";
import {getSession } from "next-auth/client";


function HomePage() {
  return (
    <div>
      <StartingSection />
    </div>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: "/feed",
        permanent: false,
      },
    };
  }
  else{
    return{
      props: {

      }
    }
  }
}

export default HomePage;
