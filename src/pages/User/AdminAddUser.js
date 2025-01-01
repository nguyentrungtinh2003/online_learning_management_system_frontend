import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDay: "",
    address: "",
    roleEnum: "USER", // Default value, can be changed
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "user",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (image) {
      data.append("img", image);
    }

    try {
      const response = await axios.post(
        `${URL}/api/auth/admin-register-user`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message || "User created successfully!");
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error occurred while creating user."
      );
      setMessage("");
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5">Add New User</Card.Header>
        <Card.Body>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBirthDay" className="mb-3">
              <Form.Label>Birth Day</Form.Label>
              <Form.Control
                type="date"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                required
              />
            </Form.Group>

            <Form.Group controlId="formRoleEnum" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="roleEnum"
                value={formData.roleEnum}
                onChange={handleInputChange}
                required
              >
                <option value="USER">USER</option>
                <option value="TEACHER">TEACHER</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create User
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminAddUser;
