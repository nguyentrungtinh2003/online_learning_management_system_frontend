import React from "react";
import { Nav } from "react-bootstrap";
import { FaChartLine, FaUsers, FaTasks, FaHome } from "react-icons/fa"; // Import các biểu tượng

const Sidebar = () => {
  return (
    <div className="bg-white text-black vh-100 p-2 flex flex-column border-r-2">
      {/* Tiêu đề */}
      <h5 className="mb-4 fw-bold text-uppercase text-center">Dashboard</h5>

      {/* Menu điều hướng */}
      <Nav className="flex-column">
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaHome className="me-2" /> Overview
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaChartLine className="me-2" /> Analytics
        </Nav.Link>
        <Nav.Link
          href="/all-user"
          className="text-black d-flex align-items-center py-2"
        >
          <FaUsers className="me-2" /> Clients
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaTasks className="me-2" /> Courses
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaTasks className="me-2" /> Lessions
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaTasks className="me-2" /> Quizs
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-black d-flex align-items-center py-2"
        >
          <FaTasks className="me-2" />
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
