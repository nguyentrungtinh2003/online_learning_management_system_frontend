import React from "react";
import { CiSearch } from "react-icons/ci";
import { PiBellRingingLight } from "react-icons/pi";

const Header = () => {
  return (
    <div className="text-slate-700 p-2 flex justify-between w-full">
      <div className="border-2 flex items-center justify-center rounded-lg py-1 px-2 font-semibold">
        <CiSearch />
        <input placeholder="Search..." className="px-2" />
      </div>
      <div className="flex">
        <div className="p-2 border-2 w-fit rounded-lg">
          <PiBellRingingLight />
        </div>
        <div className="py-1 px-2 border-2 rounded-lg mx-1">
          <img className="h-6" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTohFwdU4sY3J7mARcwIlradG-A3ojX5-1dfA&s" />
        </div>
      </div>
    </div>
  );
};

export default Header;
