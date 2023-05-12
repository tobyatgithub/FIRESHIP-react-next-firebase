import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";

// next will auto run this code when this page is requested
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <h1>User Profile</h1>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
