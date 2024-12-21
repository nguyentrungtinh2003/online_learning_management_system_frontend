import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaCircle } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";

const ManagementUser = () => {
  // Sample data for users
  const [users, setUsers] = useState([
    {
      id: 1,
      FullName: "Trung Tinh",
      Email: "trungtinhn300@gmail.com",
      Phone: "0798948708",
      Address: "Long An",
      Status: "Online",
    },
    {
      id: 2,
      FullName: "Trọng Hiếu",
      Email: "tronghieulne@gmail.com",
      Phone: "0398776",
      Address: "TP HCM",
      Status: "Offline",
    },
    {
      id: 3,
      FullName: "Văn Tấn",
      Email: "vantan22@gmail.com",
      Phone: "0388667887",
      Address: "Ninh Thuận",
      Status: "Online",
    },
  ]);

  const handleEdit = (id) => {
    // Handle edit functionality here
    console.log(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete functionality here
    setUsers(users.filter((user) => user.id !== id));
  };

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
                <td>{user.FullName}</td>
                <td>{user.Email}</td>
                <td>{user.Phone}</td>
                <td>{user.Address}</td>
                <td>
                  {user.Status === "Online" ? (
                    <FaCircle style={{ color: "green" }} />
                  ) : (
                    <FaCircle style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(user.id)}
                    className="mr-2"
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user.id)}
                  >
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
