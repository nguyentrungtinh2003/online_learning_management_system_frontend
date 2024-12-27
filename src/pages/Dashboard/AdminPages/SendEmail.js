import Checkbox from "@mui/material/Checkbox";
import React from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function SendEmail() {
  return (
    <>
      <div className="flex justify-between border-b-2">
        <div className="flex items-center">
          <Checkbox />
          <details className="relative">
            <summary></summary>
            <ul className="absolute w-40 cursor-pointer bg-gray-50 z-50">
              <li className="hover:shadow-xl hover:bg-gray-100 px-3 m-2">
                All email
              </li>
              <li className="hover:shadow-xl hover:bg-gray-100 px-3 m-2">
                Have not read
              </li>
              <li className="hover:shadow-xl hover:bg-gray-100 px-3 m-2">
                Have ever read
              </li>
            </ul>
          </details>
          <button className="hover:bg-blue-50 hover:rounded-xl p-1">
            <ReplayIcon fontSize="medium" />
          </button>
        </div>
        <button className="hover:bg-blue-50 text-gray-500 flex items-center border-1 rounded-2xl px-4 mb-2">
          <AddIcon fontSize="large" />
          <p className="text-lg font-bold ml-2">New</p>
        </button>
      </div>
      <div className="hover:drop-shadow-md grid grid-cols-5 border-b-2 bg-sky-50 gap-2 font-semibold">
        <div className="flex items-center">
          <button>
            <Checkbox />
          </button>
          <button>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
          </button>
          <p>Google Play</p>
        </div>
        <div className="col-start-2 col-span-3 place-content-center">
          <p>Your bill of order on 27th December</p>
        </div>
        <div className="relative place-content-center">
          <p>10:30</p>
          <button className="absolute right-5 bottom-2 hover:bg-sky-100 hover:rounded-xl px-1">
          <MoreVertIcon/>
          </button>
        </div>
      </div>
      <div className="hover:drop-shadow-md grid grid-cols-5 border-b-2 bg-sky-50 gap-2 font-semibold">
        <div className="flex items-center">
          <button>
            <Checkbox />
          </button>
          <button>
          <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
          </button>
          <p>Google Play</p>
        </div>
        <div className="col-start-2 col-span-3 place-content-center">
          <p>Your bill of order on 26th December</p>
        </div>
        <div className="relative place-content-center">
          <p>26/12/2024</p>
          <button className="absolute right-5 bottom-2 hover:bg-sky-100 hover:rounded-xl px-1">
          <MoreVertIcon/>
          </button>
        </div>
      </div>
    </>
  );
}
