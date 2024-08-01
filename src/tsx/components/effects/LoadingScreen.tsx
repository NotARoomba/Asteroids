import { Triangle } from "react-loader-spinner";
import { LoadingScreenProps } from "../../utils/Types";

export default function LoadingScreen({
  loading,
  children,
}: LoadingScreenProps) {
  return (
    <div
      className={
        "absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80" +
        (loading ? " flex animate-show" : " animate-hide")
      }
    >
      <div className="m-auto flex flex-col">
        <Triangle
          visible={loading}
          height="200"
          width="200"
          wrapperStyle={{ margin: "auto" }}
          color="#ffffff"
          ariaLabel="triangle-loading"
          wrapperClass={loading ? " flex animate-show" : " animate-hide"}
        />
        {children}
      </div>
    </div>
  );
}
