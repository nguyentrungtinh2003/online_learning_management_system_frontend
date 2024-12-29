import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const Profile = () => {
  return (
    <div className="mt-20 grid grid-cols-3 gap-2 h-[600px]">
      <div className="grid min-h-full relative place-items-center">
        <div className="h-full p-2 mt-32">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
          </svg>
          <div className="grid place-items-center">
            <p className="font-bold text-2xl">BZONE 3</p>
          </div>
          <div className="grid place-items-center">
            <p>56/100</p>
            <div className="w-[80%] border-2">
              <p className="h-2 bg-gray-300 w-[56%]"></p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-red-200">a</div>
    </div>
  );
};

export default Profile;
