import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCircle, FaEye, FaPlus } from "react-icons/fa";
import { Table, Button, Card, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const ManagementUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/api/auth/all-user`).then((response) => {
      setUsers(response.data.data);
    });
  }, []);

  return (
    <div className="container mt-100">
      <Button className="m-2">
        <FaPlus /> Add User
      </Button>
      <Card className="mb-4">
        <Card.Header as="h5" className="text-center">
          User Management
        </Card.Header>
        <Card.Body>
          {/* Users Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Img</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Coins</th>
                <th>Points</th>
                <th>Rank</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {/* Placeholder for user image */}
                      <img
                        src={user.img || "https://via.placeholder.com/50"}
                        alt="User Avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.address}</td>
                    <td>{user.roleEnum}</td>
                    <td>{user.coins}</td>
                    <td>{user.points}</td>
                    <td>{user.rankEnum}</td>

                    <td>
                      {user.statusUserEnum === "Online" ? (
                        <Badge bg="success">
                          <FaCircle className="mr-2" />
                          Online
                        </Badge>
                      ) : (
                        <Badge bg="danger">
                          <FaCircle className="mr-2" />
                          Offline
                        </Badge>
                      )}
                    </td>
                    <td>{user.date}</td>
                    <td>
                      <Button variant="info" className="mr-2">
                        <FaEye /> View
                      </Button>
                      <Button variant="warning" className="mr-2">
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="danger" className="mr-2">
                        <FaTrashAlt /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagementUser;
