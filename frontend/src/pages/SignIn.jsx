import { useState } from "react";
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [inputClicked, setInputClicked] = useState({
    userName: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );
      console.log(result);

      setLoading(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px] justify-center">
          <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
            <span>Sign In to </span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          {/* userName */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onFocus={() => setInputClicked({ ...inputClicked, userName: true })}
          >
            <label
              htmlFor="userName"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.userName ? "top-[-20px]" : ""
              }`}
            >
              Enter Your User Name
            </label>
            <input
              type="text"
              id="userName"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          {/* password */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onFocus={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                inputClicked.password ? "top-[-20px]" : ""
              }`}
            >
              Enter Your Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!showPassword ? (
              <IoIosEye
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <IoIosEyeOff
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          <p
            className="cursor-pointer text-gray-800 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot your password?
          </p>

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader color="white" size={30} /> : "Sign In"}
          </button>
          <p
            className="cursor-pointer text-gray-800"
            onClick={() => navigate("/signup")}
          >
            You do not have an account?{" "}
            <span className="border-b-2 border-b-black pb-[3px] text-black">
              Sign Up
            </span>
          </p>
        </div>

        <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
          <img src={logo1} alt="Image" className="w-[50%]" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
