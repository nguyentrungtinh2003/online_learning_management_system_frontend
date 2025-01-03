import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCoins } from "react-icons/fa";
import URL from "../../config/URLconfig";
import axios from "axios";

export default function Navbar() {
  useEffect(() => {
    axios
      .get(`${URL}/api/auth/user`, { withCredentials: true })
      .then((response) => {
        console.log(response.data.data);
        const { email, name, picture } = response.data.data;
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
        console.log(localStorage.getItem("img"));
      })
      .catch(() => {});
  }, []);

  const handleGoogleLogout = async () => {
    try {
      await axios.get(`${URL}/api/auth/logout/google`, {
        withCredentials: true,
      }); // Gửi yêu cầu logout Google
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("img");
      localStorage.removeItem("email");
      localStorage.removeItem("img");
      window.location.href = "/"; // Chuyển về trang login hoặc home
    } catch (error) {
      console.error("Google Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 px-20">
      <div className="min-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center space-x-3">
              <img className="h-12 w-auto" src="logoCode.png" alt="Logo" />
              <div>
                <p className="text-2xl font-bold text-cyan-500">Code</p>
                <p className="text-lg text-gray-600 font-semibold">Arena</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-8">
            <Link
              to="/about"
              className="text-gray-600 hover:text-cyan-500 transition duration-300"
            >
              About
            </Link>
            <Link
              to="/courses"
              className="text-gray-600 hover:text-cyan-500 transition duration-300"
            >
              Courses
            </Link>
            <Link
              to="/trainers"
              className="text-gray-600 hover:text-cyan-500 transition duration-300"
            >
              Trainers
            </Link>
            <Link
              to="/reviews"
              className="text-gray-600 hover:text-cyan-500 transition duration-300"
            >
              Reviews
            </Link>
            <Link
              to="/media"
              className="text-gray-600 hover:text-cyan-500 transition duration-300"
            >
              Media
            </Link>
          </div>

          {/* Search + Coins + Points + User */}
          <div className="flex items-center space-x-6 w-[65%] justify-between">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search courses..."
                className="border rounded-full pl-10 pr-4 py-1 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>

            {/* Coins */}
            <div className="flex items-center space-x-2">
              <FaCoins className="text-yellow-500" />
              <span className="text-gray-600 font-medium">1200 Coins</span>
            </div>

            {/* Points
            <div className="flex items-center space-x-1">
              <span className="text-gray-600 font-medium">Points:</span>
              <span className="text-cyan-500 font-bold">75</span>
            </div> */}

            {/* User */}
            <div className="flex items-center cursor-pointer hover:text-cyan-500">
              {localStorage.getItem("username") ? (
                <>
                  <img
                    src={
                      localStorage.getItem("token")
                        ? localStorage.getItem("img")
                        : "http://pngimg.com/uploads/google/google_PNG19635.png"
                    }
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                    style={{
                      width: "50px", // Cố gắng chỉ định kích thước rõ ràng
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover", // Đảm bảo ảnh không bị co giãn sai tỷ lệ
                    }}
                  />
                  <span className="text-gray-600">
                    {localStorage.getItem("username")}
                  </span>
                  <button
                    onClick={() => {
                      handleGoogleLogout();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
                    <Link to="/login" className="no-underline text-white">
                      Start Learning
                    </Link>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
