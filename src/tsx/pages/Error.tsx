import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col h-screen text-8xl bg-black text-neutral-200">
      <p className="align-middle justify-center m-auto mb-10">404</p>
      <Link
        to="/"
        className="text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-10 outline-double hover:outline-neutral-400 hover:text-neutral-300"
      >
        Home
      </Link>
    </div>
  );
}
