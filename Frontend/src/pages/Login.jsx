import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../contexts/UserContext";
import Loading from "../components/Loading";

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const { setUser } = useContext(UserDataContext);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users/login`,
      formData,
      {
        withCredentials: true,
      }
    );

    if (response.data.statusCode === 200) {
      localStorage.setItem("token", response.data.store.token);
      setUser(response.data.store.user);
      navigate("/");
    } else {
      alert(response.data.message);
    }
    
    setLoading(false);
    formRef.current.reset();
  };

  return (
    <>
      <div className='flex flex-col md:flex-row items-center p-5 h-screen w-full bg-no-repeat bg-cover bg-[url("https://img.freepik.com/premium-vector/stock-market-investment-trading-graph-graphic-concept-suitable-financial-investment_258787-30.jpg?w=996")]'>
        <aside className="hidden h-full w-full md:w-1/2 md:flex items-center justify-center">
          <div className="w-2/3">
            <h1 className="registerTitle text-emerald-500 text-5xl text-center font-semibold">
              FinTrack
            </h1>
            <p className="registerP text-lg text-center my-5 leading-8">
              Welcome back! Please log in to access your account and continue
              managing your finances.
            </p>
          </div>
        </aside>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          <section className="md:mt-0 mt-20 w-full md:w-1/2 flex items-center justify-center">
            <div className="h-fit w-full md:w-[62%] p-4 py-12 rounded-xl bg-white shadow-lg shadow-black/50">
              <h1 className="text-center text-3xl font-semibold mb-10">
                Login
              </h1>
          
              <form
                ref={formRef}
                onSubmit={handleLogin}
                className="flex flex-col gap-4 my-4 px-5"
              >
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  placeholder="Email"
                  className="w-full p-2 rounded-md outline-none border-[1px] border-black/20"
                />
                <input
                  type="password"
                  name="password"
                  autoComplete="off"
                  placeholder="Password"
                  className="w-full p-2 rounded-md outline-none border-[1px] border-black/20"
                />

                <button
                  type="submit"
                  className="mt-4 mx-5 py-2 text-white rounded-md bg-emerald-400 hover:bg-emerald-500 ease duration-75 block justify-self-end"
                >
                  Login to Account
                </button>
                <p className="text-center">
                  Don't have an Account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Create now!
                  </span>
                </p>
              </form>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Login;
