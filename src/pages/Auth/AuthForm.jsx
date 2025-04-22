import React, { useState, useRef, useEffect } from "react";
import { FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa"; // Import Font Awesome icons
import "./AuthForm.css";
import axios from "axios";
import URL from "../../config/URLconfig";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ToastContainer, toast, Slide } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import gglogo from "../../assets/google-color.svg";

export default function AuthForm() {
  const [fromLogin, setFromLogin] = useState({
    username: "",
    password: "",
  });
  const [fromData, setFromData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOtpPassword, setShowOtpPassword] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpResetPassword, setOtpResetPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);
  const handleInputChangeLogin = (event) => {
    const { name, value } = event.target;
    setFromLogin((prevFromLogin) => ({
      ...prevFromLogin,
      [name]: value,
    }));
  };

  const handelInputChange = (e) => {
    const { name, value } = e.target;
    setFromData({
      ...fromData,
      [name]: value,
    });
  };

  const handelInputChangeEmailOTP = (e) => {
    setEmailOTP(e.target.value);
  };

  const handelLogin = () => {
    setLoginLoading(true);
    console.log(loginLoading);

    console.log(fromLogin);
    console.log(document.cookie);
    axios
      .post(`${URL}/login`, fromLogin, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLoginLoading(false);
        const userData = response.data?.data;
        const token = response.data?.token;

        if (!userData || !userData.id) {
          console.error("Lỗi dữ liệu trả về:", response.data);
          toast.error("Đăng nhập thất bại: Sai định dạng dữ liệu!", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          return;
        }

        localStorage.setItem("id", userData.id);
        localStorage.setItem("token", token);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("img", userData.img);
        localStorage.setItem("coin", userData.coin);
        localStorage.setItem("role", userData.roleEnum);
        console.log(userData);
        console.log(document.cookie);

        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });

        setTimeout(() => {
          window.location.replace("/");
        }, 3000);
      })
      .catch((error) => {
        setLoginLoading(false);
        console.error(
          "Error login:",
          error.response ? error.response.data : error.message
        );
        toast.error("Đăng nhập thất bại!", {
          position: "top-right",
          autoClose: 3000,
          transition: Slide,
        });
      });
  };

  //--- login google ----
  const handleGoogleLogin = () => {
    window.location.href = `https://codearena-backend-dev.onrender.com/oauth2/authorization/google`;
  };

  const handelRegister = () => {
    setRegisterLoading(true);
    axios.post(`${URL}/user-register`, fromData).then((response) => {
      console.log(response.data);
      console.log("Register success");
    });
  };
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isCreatePassword, setIsCreatePassword] = useState(false);
  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer.classList.add("animate");

    setTimeout(() => {
      formContainer.classList.remove("animate");
    }, 1000); // Duration of animation
  }, [isLogin]);

  // logic forgot password and reset password
  const [count, setCount] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  //--------------------------//
  const handelSendOTP = () => {
    setOtpLoading(true);
    axios
      .post(`${URL}/forgot-password`, { email: emailOTP })
      .then((response) => {
        console.log("Send OTP success !", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };
  //--------------------------//
  const resetPassword = {
    email: emailOTP,
    otp: otpResetPassword,
    password: newPassword,
  };
  const handelResetPassword = () => {
    setChangePassLoading(true);
    axios
      .post(`${URL}/reset-password`, resetPassword)
      .then((response) => {
        console.log("Reset password success !", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  useEffect(() => {
    let intervalId;
    if (isCounting) {
      //--- func send OTP ---
      handelSendOTP();
      intervalId = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(intervalId);
            setIsCounting(false);
            setIsForgotPassword(false);
            setIsCreatePassword(true);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId); // Dọn dẹp interval khi component unmount
  }, [isCounting]);

  const handleClick = () => {
    setCount(10);
    setIsCounting(true);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />
      <div
        className="h-auto shadow-lg rounded-lg sm:w-96 md:w-1/3 lg:w-1/4 p-8 bg-white"
        ref={formContainerRef}
      >
        {isForgotPassword || isCreatePassword ? (
          <div className="flex items-center mb-2">
            <button
              onClick={() => {
                setIsLogin(true);
                setIsCreatePassword(false);
                setIsForgotPassword(false);
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" className="mr-4 mb-2" />
            </button>
            <h1 className="text-center text-2xl font-semibold text-gray-500 mb-2">
              Forgot Password
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold text-2xl text-gray-700 mb-10">
            <button
              className={`px-10 py-3 rounded-2xl transition-all duration-300 ${
                isLogin
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => {
                setIsLogin(true);
                setIsForgotPassword(false);
              }}
            >
              <FaSignInAlt size={24} /> {/* Sign In Icon */}
            </button>
            <button
              className={`px-10 py-3 rounded-2xl transition-all duration-300 ${
                !isLogin
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => {
                setIsLogin(false);
                setIsForgotPassword(false);
              }}
            >
              <FaUserPlus size={24} /> {/* Sign Up Icon */}
            </button>
          </div>
        )}

        {isForgotPassword ? (
          <div className="grid space-y-4">
            <div className="flex">
              <input
                className="border-2 w-full h-12 pl-4 rounded-xl text-lg"
                type="email"
                placeholder="Enter your email"
                id="email"
                name="email"
                value={emailOTP}
                onChange={handelInputChangeEmailOTP}
              />
              <button
                className="ml-2 bg-cyan-500 text-white rounded-xl px-3 text-xs font-semibold hover:bg-cyan-400"
                disabled={isCounting}
                onClick={() => handleClick()}
              >
                {otpLoading ? (
                  <Spinner animation="border" variant="white" />
                ) : (
                  "OTP"
                )}
              </button>
            </div>
            {/* <input
              className="border-2 h-12 pl-4 rounded-xl text-lg"
              type="number"
              placeholder="Enter your OTP"
              id="otpcode"
              name="otpcode"
              onChange={handelInputChange}
            />
            <button
              className="bg-cyan-500 text-white rounded-xl h-12 text-xl font-semibold hover:bg-cyan-400"
              onClick={() => {
                setIsForgotPassword(false);
                setIsCreatePassword(true);
              }}
            >
              Verify Code
            </button> */}
            <p className="text-rose-600 text-sm text-center mt-4">
              Back to Sign In?
              <a
                href="#"
                className="cursor-pointer ml-1"
                onClick={() => setIsForgotPassword(false)}
              >
                Click here
              </a>
            </p>
          </div>
        ) : isCreatePassword ? (
          <div className="grid space-y-4">
            <input
              className="border-2 h-12 pl-4 rounded-xl text-lg"
              type="password"
              placeholder="OTP"
              id="otp"
              name="otp"
              value={resetPassword.otp}
              onChange={(e) => setOtpResetPassword(e.target.value)}
            />
            <div className="relative">
              <input
                className="border-2 h-12 pl-4 pr-10 rounded-xl text-lg w-full"
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <input
                className="border-2 h-12 pl-4 pr-10 rounded-xl text-lg w-full"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              onClick={() => handelResetPassword()}
              className="bg-cyan-500 text-white rounded-xl h-12 text-xl font-semibold hover:bg-cyan-400"
            >
              {changePassLoading ? (
                <Spinner animation="border" variant="white" />
              ) : (
                "Change"
              )}
            </button>
          </div>
        ) : isLogin ? (
          <div className="grid space-y-4">
            <input
              className="border-2 h-12 pl-4 rounded-xl text-lg"
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              value={fromLogin.username}
              onChange={handleInputChangeLogin}
            />
            <div className="relative">
              <input
                className="border-2 h-12 pl-4 pr-10 rounded-xl text-lg w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                name="password"
                value={fromLogin.password}
                onChange={handleInputChangeLogin}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <a
              className="text-rose-600 text-sm text-center block"
              href="#"
              onClick={() => {
                setIsForgotPassword(true);
              }}
            >
              Forget your Password? Click here!
            </a>

            <button
              onClick={() => handelLogin()}
              disabled={loginLoading}
              className="bg-cyan-500 text-white rounded-xl h-12 text-xl font-semibold hover:bg-cyan-400"
            >
              {console.log("Rendering with loginLoading:", loginLoading)}
              {loginLoading ? (
                <Spinner animation="border" variant="white" />
              ) : (
                "Sign In"
              )}
            </button>
            <p className="text-center text-lg m-2">Or</p>
            <button className="border-2 flex items-center justify-center rounded-2xl py-2 w-full hover:bg-cyan-300">
              <img
                className="ml-3 w-6"
                src={gglogo}
                alt="Google logo"
              />
              <p className="ml-4" onClick={() => handleGoogleLogin()}>
                Login with Google
              </p>
            </button>
            <p className="text-rose-600 text-sm text-center mt-4">
              You don't have an account?{" "}
              <a
                href="#"
                className="cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Sign Up Now
              </a>
            </p>
          </div>
        ) : (
          <div className="grid space-y-4">
            <input
              className="border-2 h-12 pl-4 rounded-xl text-lg"
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              value={fromData.username}
              onChange={handelInputChange}
            />
            <input
              className="border-2 h-12 pl-4 rounded-xl text-lg"
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={fromData.email}
              onChange={handelInputChange}
            />
            <div className="relative">
              <input
                className="border-2 h-12 pl-4 pr-10 rounded-xl text-lg w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                name="password"
                value={fromData.password}
                onChange={handelInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <input
                className="border-2 h-12 pl-4 pr-10 rounded-xl text-lg w-full"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              onClick={() => {
                handelRegister();
              }}
              className="bg-cyan-500 text-white rounded-xl h-12 text-xl font-semibold hover:bg-cyan-400"
            >
              {registerLoading ? (
                <Spinner animation="border" variant="white" />
              ) : (
                "Sign Up"
              )}
            </button>
            <p className="text-rose-600 text-sm text-center">
              You already have an account?{" "}
              <a
                href="#"
                className="cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Sign In Now
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
