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

const ManagementUser = () => {
  // Sample data for users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/api/auth/all-user`).then((response) => {
      setUsers(response.data.data);
    });
  });

  return (
    <div className="relative">
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
              <th>Status</th>
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
                  <td className="">
                    {user.statusUserEnum === "Online" ? (
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
                  <td className="flex justify-center items-center">
                    <Button variant="outlined" startIcon={<RemoveRedEyeIcon />}>
                      <a href={`/view-user/${user.id}`}>View</a>
                    </Button>
                    <Button
                      variant="outlined"
                      className="mx-2"
                      startIcon={<EditIcon />}
                    >
                      <a href={`/admin-update-user/${user.id}`}>Edit</a>
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />}>
                      <a href={`/view-user/${user.id}`}>Delete</a>
                    </Button>
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
