import { Link } from "react-router-dom";
import Transitions from "../components/effects/Transitions.js";
import Credits from "../components/misc/Credits.js";
import Stars from "../components/effects/Stars.js";
import { getCookie } from "../utils/Functions.js";

export default function Home() {
  return (
    <Transitions>
      <Stars />
      <div className="flex flex-col h-screen text-5xl md:text-8xl bg-transparent text-neutral-200 ">
        <p className="align-middle justify-center m-auto mb-10 bg-black rounded animate-bouncepulse bg-opacity-50">
          Asteroids
        </p>
        <Link
          to="/play"
          className="text-2xl md:text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-8 md:px-10 mb-5 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
        >
          Play
        </Link>
        {getCookie("userID") && (
          <Link
            to="/profile"
            className="text-2xl md:text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-8 md:px-10 mb-5 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
          >
            Profile
          </Link>
        )}
        <Link
          to="/leaderboard"
          className="text-2xl md:text-4xl m-auto justify-center align-middle text-center mt-5 py-4 px-8 md:px-10 outline-double outline-4 hover:animate-colorpulse bg-opacity-90 bg-black"
        >
          Leaderboard
        </Link>
      </div>
      <Credits />
    </Transitions>
  );
}
