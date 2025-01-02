import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCircle, FaEye, FaPlus } from "react-icons/fa";
import { Table, Card, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast, Slide } from "react-toastify";
import { FaMedal, FaCrown, FaStar } from "react-icons/fa";

const ManagementUser = () => {
  // Sample data for users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/api/auth/all-user`).then((response) => {
      setUsers(response.data.data);
    });
  });

  const handelDeleteUser = (id, name) => {
    const confirmAction = window.confirm(
      `Bạn có muốn xoá người dùng ${name} không ?`
    );
    if (confirmAction) {
      axios
        .delete(`${URL}/api/auth/delete-user/${id}`)
        .then((response) => {
          toast.success("Xoá người dùng thành công !", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          toast.error("Lỗi khi xoá người dùng !", {
            position: "top-right",
            autoClose: 3000,
            transition: Slide,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    }
  };

  //-----get color medal -----
  const getMedalColor = (rank) => {
    return rank === "BRONZE"
      ? "#cd7f32" // Màu đồng
      : rank === "SILVER"
      ? "#c0c0c0" // Màu bạc
      : rank === "GOLD"
      ? "#ffd700" // Màu vàng
      : rank === "PLATINUM"
      ? "#e5e4e2" // Màu bạch kim
      : rank === "DIAMOND"
      ? "#00c3ff" // Màu kim cương
      : "#ff4500"; // Mặc định (cho các giá trị không hợp lệ)
  };

  return (
    <div className="relative">
      <ToastContainer />
      <div className="my-2 flex justify-end items-center">
        <Button variant="outlined" startIcon={<AddIcon />}>
          <a href="/add-user">New User</a>
        </Button>
      </div>
      <div className="mx-2">
        {/* Users Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>FullName</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Point</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Is Delete</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="overflow-hidden">
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.address}</td>
                  <td>{user.point}</td>
                  <td>
                    <FaMedal
                      color={getMedalColor(user.rankEnum)}
                      size={30}
                    ></FaMedal>
                  </td>
                  <td className="">
                    {user.statusUserEnum === "ACTIVE" ? (
                      <div className="flex justify-center items-center">
                        <FaCircle className="mr-2" style={{ color: "green" }} />
                        <p>Online</p>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center">
                        <FaCircle className="mr-2" style={{ color: "red" }} />
                        <p>Offline</p>
                      </div>
                    )}
                  </td>
                  <td>
                    {user.isDelete === true ? (
                      <Badge variant="danger">Yes</Badge>
                    ) : (
                      <Badge variant="success">No</Badge>
                    )}
                  </td>
                  <td className="flex justify-center items-center">
                    <Button
                      variant="outlined"
                      startIcon={<RemoveRedEyeIcon />}
                      href={`/view-user/${user.id}`}
                    ></Button>
                    <Button
                      variant="outlined"
                      className="mx-2"
                      startIcon={<EditIcon />}
                      href={`/admin-update-user/${user.id}`}
                    ></Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handelDeleteUser(user.id, user.username)}
                    ></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ManagementUser;
