import React from "react";
import { FormControl, InputGroup, Button, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5"; // Biểu tượng lịch

const Header = () => {
  return (
    <div className="bg-white shadow-sm py-3">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo */}
        <h4 className="text-primary fw-bold m-0">My Dashboard</h4>

        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder="Search courses..."
            className="border rounded-full pl-10 pr-4 py-1 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-200"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Nút ngày */}
        <Button variant="outline-primary" className="d-flex align-items-center">
          <IoCalendarOutline className="me-2" />
          Apr 17, 2023
        </Button>
      </Container>
    </div>
  );
};

export default Header;
