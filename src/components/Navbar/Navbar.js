import React from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom'

export default function Navbar() {
  return ( 
    <div className="fix-top w-full border-b-2 border-gray-300 h-16 flex justify-between font-sans">
      <div className="flex w-auto min-h-full">
        <img className="h-auto w-auto p-2 ml-4" src="logoCode.jpg" alt="" />
        <div id="logoName" className="">
          <p className="text-4xl leading-none m-0 pt-2 text-cyan-400">Code</p>
          <p className="text-2xl leading-[0] m-0 p-0">Arena</p>
        </div>
      </div>
      <ul className="flex text-gray-600 text-lg">
        <li className="cursor-pointer content-center font-semibold mr-10 hover:text-cyan-400">
          About The Course
        </li>
        <li className="cursor-pointer content-center font-semibold mr-10 hover:text-cyan-400">
          Feature
        </li>
        <li className="cursor-pointer content-center font-semibold mr-10 hover:text-cyan-400">
          Training Format
        </li>
        <li className="cursor-pointer content-center font-semibold mr-10 hover:text-cyan-400">
          Review
        </li>
        <li className="cursor-pointer content-center font-semibold mr-4 hover:text-cyan-400">
          Media
        </li>
      </ul>
      <button className="hover:shadow-custom rounded-2xl font-bold text-lg text-gray-600 hover:bg-cyan-300 font-semibold h-auto m-2 px-10 border-2 w-fit col-start-3">
        <Link to={"/login"}>Start Leaning</Link>
        </button>
    </div>
  );
}
