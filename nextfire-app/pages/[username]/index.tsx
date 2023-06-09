import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";

// next will auto run this code when this page is requested
export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);

  // if no user, short circuit to 404 page
  if (!userDoc) {
    // this object  will tell next to render a 404 page by default
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;


  user = userDoc.data();
  const postsQuery = userDoc.ref
    .collection('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5);

  posts = (await postsQuery.get()).docs.map(postToJSON);

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
