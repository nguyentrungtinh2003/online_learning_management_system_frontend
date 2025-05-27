import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const Dropdown = ({
  options = [],
  selected,
  onChange,
  placeholder = "Select",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = options.find((opt) => opt.value === selected);

  return (
    <div className={`relative text-sm ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full dark:text-darkText font-semibold flex items-center border-2 border-gray-300 dark:border-darkBorder bg-wcolor dark:bg-darkBackground pl-3 py-1 rounded focus:outline-none text-left"
      >
        {currentOption?.label || placeholder}
        <RiArrowDropDownLine fontSize={25}/>
      </button>

      {isOpen && (
        <ul className="absolute mt-1 dark:text-darkText w-full bg-wcolor dark:bg-darkBackground border-2 border-gray-200 dark:border-darkBorder rounded shadow-md z-10">
        {options.map((opt, index) => (
          <React.Fragment key={opt.value}>
            <li
              onClick={() => handleSelect(opt.value)}
              className="px-3 font-semibold py-2 rounded cursor-pointer hover:bg-focolor dark:hover:bg-darkBorder transition-colors"
            >
              {opt.label}
            </li>
            {index < options.length - 1 && (
              <hr className="border-t border-gray-400 dark:border-darkSubtext mx-1" />
            )}
          </React.Fragment>
        ))}
      </ul>      
      )}
    </div>
  );
};

export default Dropdown;
