import React, { useState, useEffect, useRef } from "react";
import RankLevel from "../../components/RankLevel/RankLevel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { FaCoins } from "react-icons/fa";
import axios from "axios";
import URL from "../../config/URLconfig";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const [tab, setTab] = useState("introduce");
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const formContainerRef = useRef(null);

  const userId = localStorage.getItem("id");

  // useEffect(() => {
  //   axios.get(`${URL}/api/auth/user/${userId}`).then((response) => {
  //     setUser(response.data.data);
  //   });
  // }, [userId]);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer?.classList.add("animate");
    setTimeout(() => {
      formContainer?.classList.remove("animate");
    }, 1000);
  }, [tab]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="profile-container mx-20 mt-10 mb-10">
      {/* Header Section */}
      <div className="header-section relative">
        <div className="cover-image bg-gradient-to-b from-cyan-300 to-blue-500 h-60 rounded-2xl m-2"></div>
        <div className="profile-info absolute top-40 left-10 z-1 flex items-center">
          <img
            className="profile-avatar bg-white border-8 border-slate-50 w-48 rounded-full h-48 shadow-lg"
            src={
              selectedImage ||
              "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
            }
            alt="Profile"
          />
          <div className="mt-20">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-semibold text-gray-800">
                {user.username || `Nguyen trung Tinh`}
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {user.email || "admin@gmail.com"}
            </p>

            {/* Coins */}
            <div className="flex items-center mt-2 space-x-3">
              <FaCoins className="text-yellow-500 text-xl" />
              <span className="text-gray-700 font-medium text-lg">
                {user.coin || 1900000}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs flex justify-center mt-8">
        {[
          { label: "Introduce", key: "introduce" },
          { label: "Rank", key: "rank" },
          { label: "My Courses", key: "courses" },
        ].map((item) => (
          <button
            key={item.key}
            className={`tab-button m-2 px-4 py-2 rounded-lg ${
              tab === item.key
                ? "bg-blue-400 text-black"
                : "bg-gray-100 text-black-700"
            } hover:bg-blue-300 transition`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="content-section mt-6" ref={formContainerRef}>
        {tab === "introduce" && (
          <div className="introduce-section text-slate-500">
            <div className="grid grid-cols-2 gap-8 p-6 bg-white shadow rounded-lg">
              <div>
                <label>Username</label>
                <TextField
                  className="mt-2 w-full"
                  required
                  value={user.username}
                />
                <label className="mt-2">Email</label>
                <TextField
                  className="mt-2 w-full"
                  required
                  value={user.email}
                />
                <label className="mt-2">Phone Number</label>
                <TextField
                  className="mt-2 w-full"
                  required
                  value={user.phoneNumber}
                />
              </div>
              <div>
                <label>Birth Day</label>
                <TextField
                  className="mt-2 w-full "
                  required
                  value={user.birthDay}
                  type="date"
                />
                <label className="mt-2">Address</label>
                <TextField
                  className="mt-2 w-full"
                  required
                  value={user.address}
                />
                <label className="mt-2">Role</label>
                <TextField
                  select
                  className="mt-2 w-full"
                  required
                  SelectProps={{ native: true }}
                  value={user.roleEnum}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="TEACHER">TEACHER</option>
                </TextField>
              </div>
              <div className="col-span-2 flex justify-end">
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === "rank" && (
          <div className="rank-section grid grid-cols-3 gap-6 p-6 bg-white shadow-lg rounded-xl">
            <RankLevel />
            <div className="col-span-2 p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-2xl font-semibold text-gray-700 mb-6">
                Activity Log
              </p>
              <ul className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="activity-item w-full flex items-center border-l-8 border-cyan-400 bg-white px-4 py-3 rounded-md shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-gray-600 font-medium">
                      Watched Video +8 points
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div className="courses-section p-6 py-2 bg-white rounded-lg shadow-lg">
            <p className="text-2xl font-bold text-slate-500 mb-4 text-center">
              Courses
            </p>
            <div className="course-list border p-4 rounded-lg max-h-[500px] overflow-y-auto">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="course-item border-b-2 pb-4 flex justify-center mb-4"
                >
                  <div className="flex items-center">
                    <div className="course-thumbnail h-36 bg-cyan-300 w-80 rounded-2xl"></div>
                    <div className="ml-10 text-xl text-slate-500">
                      <p className="text-2xl font-bold">
                        Xây Dựng Website với ReactJS
                      </p>
                      <p>
                        Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của
                        khóa học này là bạn có thể làm hầu hết các dự án thường
                        gặp với ReactJS.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
