import { useRef } from "react";
import { useSession } from "next-auth/client";

async function submitPost(userEmail, postText, postDate, postTime) {
    const response = await fetch("/api/submit-post", {
        method: "POST",
        body: JSON.stringify({
          userEmail,
          postText,
          postDate,
          postTime
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

function CreatePost() {
  const [session, loading] = useSession();
  const postInput = useRef();

  async function submitHandler(event) {
    event.preventDefault();
    const postText = postInput.current.value;
    const userEmail = session.user.email;
    const time = new Date();
    const postTime = time.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const postDate = time.toLocaleDateString();

    try {
        await submitPost(userEmail, postText, postDate, postTime);
    }catch (error){
        console.log(error);
    }
  }
  return (
    <div>
      <form onSubmit={submitHandler}>
        <textarea rows={4} ref={postInput}></textarea>
        <button>Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
