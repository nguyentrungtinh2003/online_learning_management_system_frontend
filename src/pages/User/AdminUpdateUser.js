import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Col, Row, InputGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import URL from "../../config/URLconfig";

const AdminUpdateUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    img: null,
    birthDay: "",
    address: "",
    point: "",
    coin: "",
    rankEnum: "",
    roleEnum: "",
    statusUserEnum: "",
    date: "",
    enabled: false,
  });

  useEffect(() => {
    // Fetch current user details by userId when the component mounts
    axios
      .get(`${URL}/api/auth/user/${id}`)
      .then((response) => {
        setFormData({
          ...formData,
          ...response.data.data,
        });
        console.log("User details fetched successfully:", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      img: e.target.files[0],
    });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    formDataToSend.append(
      "user",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    if (formData.img) {
      formDataToSend.append("img", formData.img);
    }

    axios
      .put(`${URL}/api/auth/update-user/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("User updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="mt-100">
      <h1>Admin Update User</h1>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="birthDay">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="coin">
              <Form.Label>Coin</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter coin amount"
                name="coin"
                value={formData.coin}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="point">
              <Form.Label>Point</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter points"
                name="point"
                value={formData.point}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="rankEnum">
              <Form.Label>Rank</Form.Label>
              <Form.Control
                as="select"
                name="rankEnum"
                value={formData.rankEnum}
                onChange={handleChange}
              >
                <option value="">Select Rank</option>
                <option value="BRONZE">Bronze</option>
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="roleEnum">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="roleEnum"
                value={formData.roleEnum}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="statusUserEnum">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="statusUserEnum"
                value={formData.statusUserEnum}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="enabled">
              <Form.Check
                type="checkbox"
                label="Enabled"
                name="enabled"
                checked={formData.enabled}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="img">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control type="file" name="img" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit}>
          Update User
        </Button>
      </Form>
    </div>
  );
};

export default AdminUpdateUser;
