import { Link } from "react-router-dom";
import { LinkButtonProps } from "../../utils/Types";

export default function LinkButton({
  route,
  action,
  text,
  disabled,
}: LinkButtonProps) {
  return route ? (
    <Link
      to={route}
      className={
        "lg:w-40 xl:w-44 min-w-fit justify-center text-neutral-200 placeholder:text-neutral-400 bg-neutral-900 outline-double rounded  py-1  px-10 hover:animate-colorpulse text-center transition-all duration-300 text-lg md:text-xl font-bold mx-auto my-2 "
      }
    >
      {text}
    </Link>
  ) : (
    <button
      disabled={disabled}
      onClick={action}
      className={
        " lg:w-40 xl:w-44 min-w-fit justify-center text-neutral-200 placeholder:text-neutral-400 bg-neutral-900 outline-double rounded  py-1  px-10 hover:animate-colorpulse text-center transition-all duration-300 text-lg md:text-xl font-bold mx-auto my-2 "
      }
    >
      {text}
    </button>
  );
}
