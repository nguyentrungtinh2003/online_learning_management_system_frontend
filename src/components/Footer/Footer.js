import React from "react";

export default function Footer() {
  return (
    <div>
      <div className="h-[500px] bg-slate-900 text-slate-300">
        <div className="p-20 grid grid-cols-3">
          <div>
            <div className="flex text-2xl font-bold justify-left items-center">
              <img className="h-14 mr-4 " src="logoCode.png" />
              <p>Code Arena</p>
            </div>
            <ul className="mt-4">
              <li>Phone: 0334023469</li>
              <li>Email: contact@codearena.edu.com</li>
              <li>Address: 314 Nguyen Huu Tho, District 7, Ho Chi Minh City</li>
            </ul>
          </div>
          <div className="justify-left items-center">
            <p className="font-bold text-2xl">About Us</p>
            <ul className="mt-4">
              <li>Phone: 0334023469</li>
              <li>Email: contact@codearena.edu.com</li>
              <li>Address: 314 Nguyen Huu Tho, District 7, Ho Chi Minh City</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
