import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCoins } from "react-icons/fa";
import URL from "../../config/URLconfig";
import axios from "axios";

export default function Navbar() {
  useEffect(() => {
    fetchUserInfo();
    fetchUserGoogle();
  }, []);

  const fetchUserGoogle = () => {
    axios
      .get(`${URL}/user-google`, { withCredentials: true })
      .then((response) => {
        console.log(response.data.data);
        const { id, email, name, picture } = response.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
        console.log(localStorage.getItem("img"));
      })
      .catch(() => {});
  };

  const fetchUserInfo = () => {
    axios
      .get(`${URL}/user-info`, { withCredentials: true })
      .then((response) => {
        console.log(response.data.data);
        const { id, email, name, picture } = response.data.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", name);
        localStorage.setItem("img", picture);
        console.log(localStorage.getItem("img"));

        console.log(localStorage.getItem("token"));
      })
      .catch(() => {});
  };

  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const searchResults = [
    "Khoá học Java backend cho người mới",
    "Khoá học JavaScript cho người mới",
    "Làm chủ Axios trong React",
  ];

  const handleSelect = (value) => {
    setInputValue(value); // Cập nhật giá trị input
    setIsFocused(false); // Ẩn form kết quả
  };

  const handleGoogleLogout = async () => {
    try {
      await axios.get(`${URL}/logout/google`, {
        withCredentials: true,
      }); // Gửi yêu cầu logout Google
      localStorage.removeItem("id");
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

  const handleLogout = async (username) => {
    try {
      // await axios.get(`${URL}/api/logout/${username}`, {
      //   withCredentials: true,
      // }); // Gửi yêu cầu logout Google
      localStorage.removeItem("id");
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
    <nav className="px-4 py-3 flex-1">
      <div className="flex justify-between items-center">
        {/* Search Bar */}
        <div className="flex-1 justify-center w-full ml-4 relative w-full">
          <div className="flex w-[50%] justify-center gap-2 items-center border p-2 rounded-xl">
            <FaSearch className="text-gray-500 cursor-pointer" />
            <input
              type="text"
              value={inputValue}
              placeholder="Search courses..."
              className="w-full text-sm focus:outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Tránh mất focus ngay khi click vào danh sách
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* Results - Hiện khi isFocused = true */}
          {isFocused && (
            <div
              className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-10"
              onMouseDown={(e) => e.preventDefault()} // Giữ form khi click vào danh sách
            >
              <ul className="max-h-48 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-gray-700 hover:bg-focolor cursor-pointer"
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User or Login */}
        <div className="flex items-center space-x-4">
          {localStorage.getItem("username") ? (
            <>
              <img
                src={
                  localStorage.getItem("token")
                    ? localStorage.getItem("img")
                    : "http://pngimg.com/uploads/google/google_PNG19635.png"
                }
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-gray-600">
                {localStorage.getItem("username")}
              </span>
              <button
                onClick={() => {
                  // handleGoogleLogout();
                  handleLogout(localStorage.getItem("username"));
                }}
                className="text-cyan-500 hover:text-cyan-700 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button className="bg-fcolor hover:bg-scolor text-lg text-black font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300">
              <Link to="/login" className="no-underline text-white">
                Start Learning
              </Link>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
