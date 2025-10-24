import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [inputClicked, setInputClicked] = useState({ email: false, otp: false, newPassword: false, confirmNewPassword: false });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
  setLoading(true);
    try {
      if (step === 1) {
        // Gửi OTP về email
        const result = await axios.post(`${serverUrl}/api/auth/forgot-password`, { email });
        console.log(result.data);
        setMessage("OTP has been sent to your email");
        setStep(2);
      }

      if (step === 2) {
        // Xác minh OTP
        const result = await axios.post(
          `${serverUrl}/api/auth/verify-otp`,
          { email, otp }
        );
        console.log(result.data);
        setMessage("OTP verification successful");
        setStep(3);
      }

      if (step === 3) {
        // Reset mật khẩu
        if (newPassword !== confirmNewPassword) {
            setMessage("Password and password confirmation do not match");
            setLoading(false);
            return;
        }
        const result = await axios.post(
          `${serverUrl}/api/auth/reset-password`,
          {
            email,
            newPassword,
          }
        );
        console.log(result.data);
        setMessage("Password reset successful");
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      {step == 1 && (
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
          {/* LEFT SIDE - Form */}
          <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px] justify-center">
            <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
              <span>Forgot Password</span>
              <img src={logo} alt="" className="w-[70px]" />
            </div>

            {/* Email Input */}
            <div
              className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
              onFocus={() => setInputClicked({ ...inputClicked, email: true })}
            >
              <label
                htmlFor="email"
                className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                  inputClicked.email ? "top-[-20px]" : ""
                }`}
              >
                Enter Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <span
                className={`text-sm text-center ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </span>
            )}

            <button
              className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="white" /> : "Send OTP"}
            </button>

            <p
              className="cursor-pointer text-gray-800"
              onClick={() => navigate("/signin")}
            >
              Back to{" "}
              <span className="border-b-2 border-b-black pb-[3px] text-black">
                Sign In
              </span>
            </p>
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
            <img src={logo1} alt="Image" className="w-[50%]" />
          </div>
        </div>
      )}

      {step == 2 && (
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
          {/* LEFT SIDE - Form */}
          <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px] justify-center">
            <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
              <span>Forgot Password</span>
              <img src={logo} alt="" className="w-[70px]" />
            </div>

            <div
              className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
              onFocus={() => setInputClicked({ ...inputClicked, otp: true })}
            >
              <label
                htmlFor="otp"
                className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                  inputClicked.otp ? "top-[-20px]" : ""
                }`}
              >
                Enter Your OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {message && (
              <span
                className={`text-sm text-center ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </span>
            )}

            <button
              className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? <ClipLoader size={25} color="white" /> : "Submit OTP"}
            </button>

            <p
              className="cursor-pointer text-gray-800"
              onClick={() => navigate("/signin")}
            >
              Back to{" "}
              <span className="border-b-2 border-b-black pb-[3px] text-black">
                Sign In
              </span>
            </p>
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
            <img src={logo1} alt="Image" className="w-[50%]" />
          </div>
        </div>
      )}

      {step == 3 && (
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
          {/* LEFT SIDE - Form */}
          <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px] justify-center">
            <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
              <span>Reset Password</span>
              <img src={logo} alt="" className="w-[70px]" />
            </div>

            <div
              className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
              onFocus={() =>
                setInputClicked({ ...inputClicked, newPassword: true })
              }
            >
              <label
                htmlFor="newPassword"
                className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                  inputClicked.newPassword ? "top-[-20px]" : ""
                }`}
              >
                Enter Your New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <div
              className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
              onFocus={() =>
                setInputClicked({ ...inputClicked, confirmNewPassword: true })
              }
            >
              <label
                htmlFor="confirmNewPassword"
                className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                  inputClicked.confirmNewPassword ? "top-[-20px]" : ""
                }`}
              >
                Enter Your Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmNewPassword"
                className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
            {message && (
              <span
                className={`text-sm text-center ${
                  message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </span>
            )}

            <button
              className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={25} color="white" />
              ) : (
                "Reset Password"
              )}
            </button>

            <p
              className="cursor-pointer text-gray-800"
              onClick={() => navigate("/signin")}
            >
              Back to{" "}
              <span className="border-b-2 border-b-black pb-[3px] text-black">
                Sign In
              </span>
            </p>
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
            <img src={logo1} alt="Image" className="w-[50%]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
