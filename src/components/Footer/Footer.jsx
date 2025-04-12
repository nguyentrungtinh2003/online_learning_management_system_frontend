import React from "react";

export default function Footer() {
  return (
    <div>
      <div className="bg-slate-900 text-lg font-bold text-slate-300 h-fit">
        <div className="p-16 flex justify-between items-top">
          <div className="space-y-4">
            <div className="flex text-2xl font-bold items-center">
              <img className="h-14 mr-4 rounded-full" src="image2.jpg" />
              <h3 className="text-xl font-bold text-white-800">
                Code Arena
              </h3>
            </div>
            <ul className="">
              <li>Phone: 0334023469</li>
              <li>Email: contact@codearena.edu.com</li>
              <li>Address: 314 Nguyen Huu Tho, District 7, Ho Chi Minh City</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-2xl">About Us</p>
            <ul className="">
              <li>Introduce</li>
              <li>Products & Services</li>
              <li>Q&A</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
          <div className="items-center space-y-4 mx-10">
            <p className="font-bold text-2xl">Follow Us</p>
            <ul className="">
              <li className="flex items-center">
                <img className="h-10 mr-2" src="youtube.svg" />
                Youtube
              </li>
              <li className="flex items-center">
                <img className="h-10 mr-2" src="facebook-ico.svg" />
                Facebook
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
