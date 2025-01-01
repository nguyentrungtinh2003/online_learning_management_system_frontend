import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Container,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import axios from "axios";
import URL from "../../config/URLconfig";
import { useParams } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaGraduationCap,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data by ID
    axios
      .get(`${URL}/api/auth/user/${id}`)
      .then((response) => {
        setUser(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching user data");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-100">
      <Card className="shadow-lg border-0 p-4" style={{ borderRadius: "15px" }}>
        <Row>
          <Col md={4} className="text-center">
            <img
              src={user.img || "https://via.placeholder.com/150"}
              alt={user.username}
              className="img-fluid rounded-circle mb-3"
              style={{ width: "180px", height: "180px", objectFit: "cover" }}
            />
            <h4 className="text-primary">{user.username}</h4>
            <p className="text-muted">{user.roleEnum}</p>
          </Col>
          <Col md={8}>
            <Row>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Email</p>
                <h6 className="text-dark">
                  <FaEnvelope className="me-2 text-primary" /> {user.email}
                </h6>
              </Col>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Phone</p>
                <h6 className="text-dark">
                  <FaPhone className="me-2 text-primary" /> {user.phoneNumber}
                </h6>
              </Col>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Address</p>
                <h6 className="text-dark">
                  <FaMapMarkerAlt className="me-2 text-primary" />{" "}
                  {user.address}
                </h6>
              </Col>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Birth Day</p>
                <h6 className="text-dark">
                  <FaBirthdayCake className="me-2 text-primary" />{" "}
                  {user.birthDay}
                </h6>
              </Col>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Courses Enrolled</p>
                <h6 className="text-dark">
                  <FaGraduationCap className="me-2 text-primary" />{" "}
                  {user.coursesCount || 0}
                </h6>
              </Col>
              <Col md={6} className="mb-3">
                <p className="mb-1 text-muted">Date Joined</p>
                <h6 className="text-dark">
                  <MdOutlineDateRange className="me-2 text-primary" />{" "}
                  {new Date(user.date).toLocaleDateString()}
                </h6>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" className="px-4">
            Edit Profile
          </Button>
          <Button variant="outline-secondary" className="ms-3 px-4">
            View Progress
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default ViewUser;
