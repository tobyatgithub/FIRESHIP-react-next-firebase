import Image from "next/image";
import { Inter } from "next/font/google";
import Loader from "../components/Loader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <h1>Sign Up</h1>
      <div>
        <Loader show />
      </div>
    </main>
  );
}
