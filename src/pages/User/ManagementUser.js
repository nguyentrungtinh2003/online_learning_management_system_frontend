import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCircle, FaEye, FaPlus } from "react-icons/fa";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const ManagementUser = () => {
  // Sample data for users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/api/auth/all-user`).then((response) => {
      setUsers(response.data.data);
    });
  });

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
                    <FaCircle style={{ color: "green" }} />
                  ) : (
                    <FaCircle style={{ color: "red" }} />
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
