import { auth, googleAuthProvider } from "../lib/firebase";
import type { AppProps } from "next/app";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Enter(props: AppProps) {
  const { user, username } = useContext(UserContext);
  console.log("props = ", props);

  return (
    <main>
      {!!user && (!username ? <UsernameForm /> : <SignOutButton />)}
      {!user && <SignInButton />}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" />
      Sign in with Google
    </button>
  );
}

function SignOutButton() {
  const signOutWithGoogle = () => {
    auth.signOut();
  };
  return (
    <button className="btn-google" onClick={signOutWithGoogle}>
      Sign Out
    </button>
  );
}

function UsernameForm() {
  return (
    <button className="btn-google" onClick={() => {}}>
      ah
    </button>
  );
}
