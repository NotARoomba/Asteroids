import { useEffect, useState } from "react";
import LinkButton from "../components/misc/LinkButton";
import { callAPI, checkIfLogin, setCookie } from "../utils/Functions";
import { STATUS_CODES } from "../utils/Types";
import AlertModal from "../components/modals/AlertModal";
import VerificationModal from "../components/modals/VerificationModal";
import { Link, useNavigate } from "react-router-dom";
import Transitions from "../components/effects/Transitions";
import LoadingScreen from "../components/effects/LoadingScreen";
import Stars from "../components/effects/Stars";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState(["Error", "An error occured!"]);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(false);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  const parseLogin = async () => {
    setLoading(true);
    const doesExist = await callAPI("/users/check", "POST", {
      email,
    });
    if (doesExist.status !== STATUS_CODES.GENERIC_ERROR) {
      setLoading(false);
      if (doesExist.status !== STATUS_CODES.EMAIL_IN_USE)
        return setAlert("There is no account with that email!");
      const res = await callAPI("/verify/send", "POST", {
        email,
        service: "Asteroids Verification",
      });
      if (res.status === STATUS_CODES.ERROR_SENDING_CODE)
        return setAlert("There was an error sending the code!");
      else setVerification(true);
    }
  };
  const checkLogin = async (v: boolean) => {
    if (!v) return setAlert("The verification code is incorrect!");
    setVerification(false);
    setAlert("You are now logged in!", "Success");
    const res = await callAPI(`/users/${email}`, "GET");
    if (res.status === STATUS_CODES.SUCCESS) {
      setCookie("userID", res.user._id);
      navigate("/");
      navigate(0);
    } else {
      setAlert("There was an error logging you in!", "Error");
    }
  };
  useEffect(() => {
    setLoading(true);
    checkIfLogin().then((l) => {
      if (l) {
        return navigate("/profile");
      }
      setLoading(false);
    });
  }, [navigate]);
  return (
    <Transitions>
      <Stars />
      <div className=" bg-black/80 text-white text-center h-screen w-full flex">
        <div className="m-auto justify-center h-full w-full align-middle text-center">
          <p className="text-4xl my-4 font-semibold mt-20">Login</p>
          <hr className="w-4/12 mx-auto mb-4"></hr>
          <div className="text-2xl justify-center mx-auto flex flex-col">
            <p>Email</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                parseLogin();
              }}
            >
              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.currentTarget.value.toLocaleLowerCase())
                }
                className="mx-auto my-2 bg-transparent text-center outline-double rounded text-white"
              />
            </form>
            <Link
              to="/signup"
              className=" text-neutral-300 text-center text-lg hover:underline transition-all duration-300 w-fit mx-auto "
            >
              Need to sign up?
            </Link>
            <div className="flex gap-4 w-fit mx-auto">
              <LinkButton disabled={loading} text="Cancel" route="/" />
              <LinkButton
                disabled={loading}
                text="Submit"
                action={parseLogin}
              />
            </div>
          </div>
          <LoadingScreen loading={loading} />
        </div>
        <VerificationModal
          setIsOpen={setVerification}
          isOpen={verification}
          email={email}
          action={checkLogin}
        />
        <AlertModal
          title={alertMsg[0]}
          text={alertMsg[1]}
          isOpen={alertModal}
          setIsOpen={setAlertModal}
        />
      </div>
    </Transitions>
  );
}
