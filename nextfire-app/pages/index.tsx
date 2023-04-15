import Image from "next/image";
import { Inter } from "next/font/google";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <h1>Sign Up</h1>
      <button onClick={() => toast.success("hello toast!")}> Toast Me!</button>
      <div>
        <Loader show />
      </div>
    </main>
  );
}
