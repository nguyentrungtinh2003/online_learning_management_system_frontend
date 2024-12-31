import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCircle } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
const ManagementUser = () => {
  // Sample data for users
  const users = [];
  for (let i = 0; i < 5; i++) {
    users.push({
      id: i + 1,
      username: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phoneNumber: `+1234567890${i}`,
      address: `123 Main St, Anytown, CA ${i + 10000}`,
      statusUserEnum: Math.random() > 0.5 ? "Online" : "Offline",
    });
  }

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   axios.get(`${URL}/api/auth/all-user`).then((response) => {
  //     setUsers(response.data.data);
  //   });
  // });

  return (
    <div className="container mt-20">
      {/* Users Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
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
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>
                  {user.statusUserEnum === "Online" ? (
                    <div className="flex items-center m-0 pt-3 justify-center box-border">
                      <FaCircle style={{ color: "green" }} />
                      <p className="pl-2">Online</p>
                    </div>
                  ) : (
                    <div className="flex items-center m-0 pt-3 justify-center box-border">
                      <FaCircle style={{ color: "red" }} />
                      <p className="pl-2">Offline</p>
                    </div>
                  )}
                </td>
                <td>
                  <Button variant="warning" className="mr-2">
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="danger">
                    <FaTrashAlt /> Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ManagementUser;
