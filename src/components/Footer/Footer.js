import React from "react";

export default function Footer() {
  return (
    <div>
      <div className="bg-slate-900 text-slate-300">
        <div className="p-20 grid grid-cols-3 place-items-center">
          <div>
            <div className="flex text-2xl font-bold items-center">
              <img className="h-14 mr-4 rounded-full" src="image2.jpg" />
              <h3 className="text-xl font-semibold text-white-800">
                Code Arena
              </h3>
            </div>
            <ul className="mt-4">
              <li>Phone: 0334023469</li>
              <li>Email: contact@codearena.edu.com</li>
              <li>Address: 314 Nguyen Huu Tho, District 7, Ho Chi Minh City</li>
            </ul>
          </div>
          <div className=" items-center">
            <p className="font-bold text-2xl">About Us</p>
            <ul className="mt-4">
              <li>Introduce</li>
              <li>Products & Services</li>
              <li>Q&A</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
          <div className="items-center">
            <p className="font-bold text-2xl">Follow Us</p>
            <ul className="mt-4">
              <li className="flex items-center">
                <img className="h-14 mr-2" src="youtube.svg" />
                Youtube
              </li>
              <li className="flex items-center">
                <img className="h-14 mr-2" src="facebook-ico.svg" />
                Facebook
              </li>
              <li className="flex items-center">
                <img className="h-14 mr-2 mt-2 bg-gray-400" src="tiktok.svg" />
                Tiktok
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
