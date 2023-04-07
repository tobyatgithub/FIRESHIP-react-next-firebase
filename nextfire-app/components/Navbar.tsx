import Link from "next/link";

export default function Navbar(): JSX.Element {
  const user: { photoURL: string } = { photoURL: "ok" };
  const username: string | null = null;
  //   const { user, username } = {"ok", "ba"};
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {username && (
          //dsa
          <>
            <li className="push-left">
              <Link href="/admin">
                <button>Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href="/${username}">
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {!username && (
          //dsa
          <Link href="/enter">
            <button className="btn-blue">Log In</button>
          </Link>
        )}
      </ul>
    </nav>
  );
}
