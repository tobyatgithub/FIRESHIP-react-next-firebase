import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";
import { firestore, fromMillis, postToJSON } from "@/lib/firebase";
import toast from "react-hot-toast";
import MetaTags from "@/components/Metatags"

import { useState } from "react";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

const LIMIT = 5;

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    if (posts.length == 0) {
      setPostsEnd(true);
      return;
    }
    setLoading(true);
    const last = posts[posts.length - 1];
    // find the timestamp of the last post
    // type will be different depend on fetch from server or client :(
    const cursor = typeof last?.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <main>
      <MetaTags title="Home" description="Home page" />
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {postsEnd && 'You have reached the end!'}
      {/* <h1>Sign Up</h1> */}
      {/* <button onClick={() => toast.success("hello toast!")}> Toast Me!</button> */}
      {/* <div>
        <Loader show />
      </div> */}
    </main>
  );
}
