import React, { useState, useEffect, useRef } from "react";
import RankLevel from "../../components/RankLevel/RankLevel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const [isIntroduce, setIsIntroduce] = useState(true);
  const [isRanks, setIsIsRanks] = useState(false);
  const [isCourse, setIsCourse] = useState(false);

  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    formContainer.classList.add("animate");

    setTimeout(() => {
      formContainer.classList.remove("animate");
    }, 1000); // Duration of animation
  }, [isIntroduce]);

  const id = localStorage.getItem("id");
  const [selectedImage, setSelectedImage] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   axios.get(`${URL}/api/auth/user/${id}`).then((response) => {
  //     setUsers(response.data.data);
  //   });
  // }, [id]);

  // const handleImageChange = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => setSelectedImage(e.target.result);
  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // };

  return (
    <div className="mx-20 mt-100 mb-10 ">
      <div className="h-[370px] border-b-2">
        <div className="relative">
          <div class="bg-cyan-300 h-60 rounded-2xl m-2 bg-gradient-to-b from-transparent to-blue-500"></div>
          <div className="absolute top-40 left-10 z-50">
            <img
              className="bg-white border-8 border-slate-50 w-48 rounded-[50%] h-48"
              src={
                "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
              }
            />
          </div>
        </div>
      </div>
      <div ref={formContainerRef}>
        <ul className="flex">
          <button
            className={`m-2 p-2 hover:text-cyan-300 ${
              isIntroduce ? "border-b-2 border-cyan-300" : ""
            }`}
            onClick={() => {
              setIsIntroduce(true);
              setIsCourse(false);
              setIsIsRanks(false);
            }}
          >
            Introduce
          </button>
          <button
            className={`m-2 p-2 hover:text-cyan-300 ${
              isRanks ? "border-b-2 border-cyan-300" : ""
            }`}
            onClick={() => {
              setIsIntroduce(false);
              setIsCourse(false);
              setIsIsRanks(true);
            }}
          >
            Rank
          </button>
          <button
            className={`m-2 p-2 hover:text-cyan-300 ${
              isCourse ? "border-b-2 border-cyan-300" : ""
            }`}
            onClick={() => {
              setIsIntroduce(false);
              setIsCourse(true);
              setIsIsRanks(false);
            }}
          >
            My Courses
          </button>
        </ul>
      </div>
      {isIntroduce ? (
        <div className="text-slate-500">
          <div className="grid grid-cols-2 gap-8">
            <div className="">
              <TextField
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="User Name"
                defaultValue={users.username} // Access first user's data
              />
              <TextField
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="Email"
                defaultValue={users.email}
              />
              <TextField
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="Phone Number"
                defaultValue={users.phoneNumber}
              />
            </div>
            <div>
              <TextField
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="Date Of Birth"
                defaultValue={users.birthDay}
                type="Date"
              />
              <TextField
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="Address"
                defaultValue={users.address}
              />
              <TextField
                select
                className="mt-4 w-full"
                required
                id="outlined-required"
                label="Role"
                SelectProps={{ native: true }}
                defaultValue={users.roleEnum}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
              </TextField>
            </div>
            <div>
              <Button variant="outlined">Save</Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {isRanks ? (
        <div className="h-100 grid grid-cols-3 m-2 gap-8 p-4 rounded-xl">
          <RankLevel />
          <div className="grid col-span-2 text-xl p-4">
            <ul>
              <li className="w-full border-l-8 border-cyan-300 px-3 py-1 mb-4 rounded-lg">
                Watched Video +8 points
              </li>
              <li className="w-full border-l-8 border-cyan-300 px-3 py-1 mb-4 rounded-lg">
                Watched Video +8 points
              </li>
              <li className="w-full border-l-8 border-cyan-300 px-3 py-1 mb-4 rounded-lg">
                Watched Video +8 points
              </li>
              <li className="w-full border-l-8 border-cyan-300 px-3 py-1 mb-4 rounded-lg">
                Watched Video +8 points
              </li>
              <li className="w-full border-l-8 border-cyan-300 px-3 py-1 mb-4 rounded-lg">
                Watched Video +8 points
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
      {isCourse ? (
        <div className="p-4 py-2 grid place-items-center">
          <p className="text-2xl font-bold text-slate-500 mb-4">
            Courses attended
          </p>
          <div className="border-b-2 mx-20 pb-4 flex justify-center mx-[15%] mb-4">
            <div className="flex items-center">
              <div className="h-36 bg-cyan-300 w-80 rounded-2xl" />
              <div className="col-span-2 ml-10 text-xl text-slate-500">
                <p className="text-2xl font-bold">
                  Xây Dựng Website với ReactJS
                </p>
                <p>
                  Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học
                  này là bạn có thể làm hầu hết các dự án thường gặp với
                  ReactJS. Cuối khóa học này bạn
                </p>
              </div>
            </div>
          </div>
          <div className="border-b-2 mx-20 pb-4 flex justify-center mx-[15%] mb-4">
            <div className="flex items-center">
              <div className="h-36 bg-cyan-300 w-80 rounded-2xl" />
              <div className="col-span-2 ml-10 text-xl text-slate-500">
                <p className="text-2xl font-bold">
                  Xây Dựng Website với ReactJS
                </p>
                <p>
                  Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học
                  này là bạn có thể làm hầu hết các dự án thường gặp với
                  ReactJS. Cuối khóa học này bạn
                </p>
              </div>
            </div>
          </div>
          <div className="border-b-2 mx-20 pb-4 flex justify-center mx-[15%] mb-4">
            <div className="flex items-center">
              <div className="h-36 bg-cyan-300 w-80 rounded-2xl" />
              <div className="col-span-2 ml-10 text-xl text-slate-500">
                <p className="text-2xl font-bold">
                  Xây Dựng Website với ReactJS
                </p>
                <p>
                  Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học
                  này là bạn có thể làm hầu hết các dự án thường gặp với
                  ReactJS. Cuối khóa học này bạn
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;
