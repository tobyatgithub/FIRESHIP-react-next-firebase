import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import type { AppProps } from "next/app";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
// import debounce from "lodash.debounce";
import { debounce } from "lodash";

export default function Enter(props: AppProps) {
  const { user, username } = useContext(UserContext);
  console.log("props = ", props);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
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
  const doingDebug = true;
  const [formValue, setFormValue] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (event: { target: { value: string } }) => {
    const val = event.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username: String) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form action="" onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="Find a Good Name"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          {!!doingDebug && (
            <>
              <h3>Debug State</h3>
              <div>
                Username : {formValue}
                <br />
                Loading: {loading.toString()}
                <br />
                Username Valid: {isValid.toString()}
              </div>
            </>
          )}
        </form>
      </section>
    )
  );
}

function UsernameMessage({
  username,
  isValid,
  loading,
}: {
  username: String;
  isValid: boolean;
  loading: boolean;
}) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That usernmae is taken!</p>;
  } else {
    return <p></p>;
  }
}
