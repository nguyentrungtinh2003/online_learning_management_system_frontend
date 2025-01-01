import React, { useState, useEffect } from "react";
import RankLevel from "../../components/RankLevel/RankLevel";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import axios from "axios";
import URL from "../../config/URLconfig";

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
  const [selectedImage, setSelectedImage] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    axios
      .get(`${URL}/api/auth/user/${localStorage.getItem("id")}`)
      .then((response) => {
        setUsers(response.data.data);
      });
  });

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="mt-20 grid grid-cols-3 gap-2 h-[700px]">
      <RankLevel />
      <div className="col-span-2 text-slate-500 grid grid-cols-2 place-items-center">
        <div className="w-full">
          <div className="mt-20">
            <TextField
              className="mt-4 w-full"
              required
              id="outlined-required"
              label="User Name"
              defaultValue={users.username}
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
          </div>
        </div>
        <div className="place-items-center p-40">
          <img
            id="input"
            className="border-8 w-fit rounded-[50%] h-auto mb-4 mt-10"
            src={selectedImage || users.img}
            alt="Selected or default image"
          />
          <Button
            className="h-fit"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Change Your Image
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageChange}
              multiple
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
