import React from "react";
import { FormControl, InputGroup, Button, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5"; // Biểu tượng lịch

const Header = () => {
  return (
    <div className="shadow-sm flex justify-center items-center">
      <Container className="flex justify-between items-center p-2">
        {/* Logo */}
        <h4 className="text-primary fw-bold m-0">Admin Dashboard</h4>

        <div className="relative hidden lg:block w-[50%]">
          <input
            type="text"
            placeholder="Search courses..."
            className="border rounded-full pl-10 pr-4 py-1 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-50"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Nút ngày */}
        <Button variant="outline-primary" className="flex items-center mb-1">
          <IoCalendarOutline className=""/>
          Apr 17, 2023
        </Button>
      </Container>
    </div>
  );
};

export default Header;
