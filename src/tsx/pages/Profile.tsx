import { useEffect, useState } from "react";
import { callAPI, checkIfLogin, deleteCookies } from "../utils/Functions";
import { useNavigate } from "react-router-dom";
import { User as UserIcon } from "react-feather";
import { GAMES, ProfileStatsProp, STATUS_CODES, User } from "../utils/Types";
import AlertModal from "../components/modals/AlertModal";
import LoadingScreen from "../components/effects/LoadingScreen";
import LinkButton from "../components/misc/LinkButton";
import EditModal from "../components/modals/EditModal";
import Transitions from "../components/effects/Transitions";
import Stars from "../components/effects/Stars";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [highscore, setHighscore] = useState<ProfileStatsProp>({
    score: 0,
    level: 0,
    gamesPlayed: 0,
  });
  const [editModal, setEditModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  useEffect(() => {
    if (!editModal) {
      setLoading(true);
      checkIfLogin().then((user) => {
        if (!user) {
          navigate("/login");
          return navigate(0);
        }
        callAPI(
          `/users/${user._id}/highscore?gameType=${GAMES.ASTEROIDS}`,
          "GET",
        ).then((res) => {
          if (res.status !== STATUS_CODES.SUCCESS) return setErrorModal(true);
          console.log(res.highscore);
          setHighscore({
            score: res.highscore.score,
            gamesPlayed: res.gamesPlayed,
            level: res.highscore.level,
          });
        });
        setUser(user);
        setLoading(false);
      });
    }
  }, [navigate, editModal]);
  const logout = () => {
    localStorage.clear();
    deleteCookies();
    navigate("/");
    return navigate(0);
  };
  return (
    <Transitions>
      <Stars />
      <div className="text-white bg-black/80 w-full h-screen my-auto flex">
        <div className="m-auto align-middle w-full justify-center flex flex-col ">
          <div className="flex flex-col lg:flex-row mx-auto gap-8">
            {user?.avatar !== "" ? (
              <img
                src={user?.avatar}
                className="rounded-xl max-w-72 mx-auto my-auto"
              />
            ) : (
              <UserIcon size={250} className="m-auto justify-center" />
            )}
            <div className="flex flex-col my-auto align-middle text-center lg:text-left ">
              <p className="text-5xl 2xs:text-6xl sm:text-8xl font-bold animate-bouncepulse ">
                {user?.username}
              </p>
              <p className="text-2xl md:text-3xl text-secondary font-semibold animate-colorpulse">
                {user?.email}
              </p>
              <p className="text-lg md:text-xl text-accent-300 animate-colorpulse">
                Date Joined:{" "}
                {(() => {
                  const d = new Date(user?.dateJoined ?? 0);
                  return (
                    [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
                    " " +
                    [d.getHours(), d.getMinutes(), d.getSeconds()].join(":")
                  );
                })()}
              </p>
            </div>
          </div>
          <hr className="w-1/2 lg:w-3/4 mx-auto border-background-800 my-3 border-2"></hr>
          <div className="flex flex-col lg:flex-col-reverse mb-6">
            <div className="flex gap-8 mx-auto justify-center lg:mb-6">
              <LinkButton text="Home" route="/" />
              <LinkButton
                text="Edit Profile"
                action={() => setEditModal(true)}
              />
              <LinkButton text="Logout" action={() => setLogoutModal(true)} />
            </div>
            <hr className="w-3/4 lg:w-1/2 mx-auto border-background-800 my-3 border-2"></hr>
            <div className="flex flex-col mx-auto gap-4">
              <p className="text-3xl animate-colorpulse">
                Highscore: {highscore.score}
              </p>
              <p className="text-3xl animate-colorpulse">
                Level: {highscore.level}
              </p>
              <p className="text-3xl animate-colorpulse">
                Games Played: {highscore.gamesPlayed}
              </p>
            </div>
          </div>
        </div>
        <LoadingScreen loading={loading} />
        <EditModal setIsOpen={setEditModal} isOpen={editModal} />
        <AlertModal
          title={"Error"}
          text={"There was an error fething the data!"}
          isOpen={errorModal}
          setIsOpen={setErrorModal}
        />
        <AlertModal
          title={"Confirmation"}
          text={"Are you sure you want to logout?"}
          action={logout}
          cancel
          isOpen={logoutModal}
          setIsOpen={setLogoutModal}
        />
      </div>
    </Transitions>
  );
}
