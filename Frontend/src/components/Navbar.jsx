import React, { useContext } from "react";
import "remixicon/fonts/remixicon.css";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../contexts/UserContext";
import incomeImg from "../assets/income.png";
import spendingImg from "../assets/spending.png";
import Loading from "./Loading";

const Navbar = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const handleLogout = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        window.location.reload();
        localStorage.removeItem("token");
        navigate("/login");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="absolute top-0 left-2 md:hidden block">
        <i
          onClick={() => setNavbarOpen((prev) => !prev)}
          className={`text-3xl ${navbarOpen ? ' ri-menu-2-line ' : 'ri-close-line'}`}
        ></i>
      </div>
        <section className={` ${navbarOpen ? 'hidden' : 'md:block' } absolute md:relative z-40 p-4 homeMenuDriven h-full md:w-[22vw]`}>
          <div className="flex flex-col h-full justify-between gap-3">
            <div className=" flex flex-col gap-1">
              <div className="mb-4 profile md:flex flex-col items-center justify-center gap-3">
                <div className="bg-white/70 flex items-center justify-center p-1 px-2 rounded-full">
                  <i className="ri-user-3-fill text-xl"></i>
                </div>
                <div>
                  <p className="font-semibold"> {user?.name} </p>
                  <button
                    onClick={() => navigate("/user/edit-profile")}
                    className="bg-white/70 text-black px-3 hover:bg-white/50 ease duration-100 py-1 text-xs md:text-base rounded-md mt-1"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/50 duration-100 ease"
                  } px-2 my-2 md:my-0 md:text-base text-2xl rounded-lg flex items-center gap-2`
                }
              >
                <i className="ri-line-chart-line"></i>
                <h3 className="leading-9 hidden md:block">Dashboard</h3>
              </NavLink>

              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/50 duration-100 ease"
                  } px-2 my-2 md:my-0 md:text-base text-2xl rounded-lg flex items-center gap-2`
                }
              >
                <i className="ri-folder-5-line"></i>
                <h3 className="leading-9 hidden md:block">Projects</h3>
              </NavLink>

              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/50 duration-100 ease"
                  } px-2 my-2 md:my-0 md:text-base text-2xl rounded-lg flex items-center gap-2`
                }
              >
                <i className="ri-wallet-line"></i>
                <h3 className="leading-9 hidden md:block">View Transactions</h3>
              </NavLink>

              <NavLink
                to="/incomes"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/50 duration-100 ease"
                  } px-2 my-2 md:my-0 md:text-base text-2xl rounded-lg flex items-center gap-2`
                }
              >
                <img className="w-5" src={incomeImg} alt="Incomes" />
                <h3 className="leading-9 hidden md:block">Incomes</h3>
              </NavLink>

              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/50 duration-100 ease"
                  } px-2 my-2 md:my-0 md:text-base text-2xl rounded-lg flex items-center gap-2`
                }
              >
                <img className="md:w-5 w-6" src={spendingImg} alt="Expenses" />
                <h3 className="leading-9 hidden md:block">Expenses</h3>
              </NavLink>
            </div>

            {loading ? (
              <Loading loading={loading} />
            ) : (
              <div>
                <button
                  onClick={handleLogout}
                  className="px-2 rounded-lg flex items-center gap-2 hover:bg-white/50 duration-100 ease w-full p-1 md:text-base text-2xl"
                >
                  <i className="ri-logout-box-r-line"></i>
                  <h3 className="hidden md:block">Logout</h3>
                </button>
              </div>
            )}
          </div>
        </section>
    </>
  );
};

export default Navbar;
