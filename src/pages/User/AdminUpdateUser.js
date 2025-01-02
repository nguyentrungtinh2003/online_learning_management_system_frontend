import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
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

const AdminUpdateUser = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDay: "",
    address: "",
    roleEnum: "STUDENT", // hoặc "TEACHER"
  });

  useEffect(() => {
    // Lấy thông tin user từ API
    axios
      .get(`${URL}/api/auth/user/${id}`)
      .then((response) => {
        setUser(response.data.data);
        setUpdatedData({
          username: response.data.data.username,
          password: response.data.data.password,
          email: response.data.data.email,
          phoneNumber: response.data.data.phoneNumber,
          address: response.data.data.address,
          birthDay: response.data.data.birthDay,
          roleEnum: response.data.data.roleEnum || "STUDENT",
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      });
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
    setSelectedImage(event.target.files[0]); // Lưu file ảnh để gửi
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(updatedData)], { type: "application/json" })
    );
    if (selectedImage) {
      formData.append("img", selectedImage);
    }

    axios
      .put(`${URL}/api/auth/update-user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Cập nhật thành công:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      });
  };

  return (
    <div className="mx-10 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8 relative shadow">
      <button className="absolute top-0 right-0 m-2">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </button>
      {/* Form thông tin người dùng */}
      <div className="col-span-2 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Cập nhật thông tin người dùng
        </h2>
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={updatedData.username}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={updatedData.password}
            onChange={handleInputChange}
            type="password"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={updatedData.email}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={updatedData.phoneNumber}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Birth Day"
            name="birthDay"
            value={updatedData.birthDay}
            onChange={handleInputChange}
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={updatedData.address}
            onChange={handleInputChange}
            variant="outlined"
          />
          <TextField
            select
            fullWidth
            label="Role"
            name="roleEnum"
            value={updatedData.roleEnum}
            onChange={handleInputChange}
            SelectProps={{ native: true }}
            variant="outlined"
          >
            <option value="STUDENT">STUDENT</option>
            <option value="TEACHER">TEACHER</option>
          </TextField>
        </div>
      </div>
      {/* Hình ảnh đại diện */}
      <div className="flex flex-col items-center justify-center bg-white rounded">
        <img
          className="h-60 w-60 rounded-full border-4 border-gray-300 mb-6"
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
              : user.img || "default-image-url"
          }
          alt="Profile"
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Upload Profile Image
          <VisuallyHiddenInput type="file" onChange={handleImageChange} />
        </Button>
      </div>
    </div>
  );
};

export default AdminUpdateUser;
