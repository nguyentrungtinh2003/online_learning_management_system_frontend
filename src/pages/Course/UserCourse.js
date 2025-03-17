import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";

export default function UserCourse() {
  return (
    <div className="flex-1 px-3 py-6">
      <AdminNavbar />
      <div className="bg-white shadow h-full px-4 py-6 space-y-4">
        <div className="space-y-4">
          <p className="text-fcolor font-bold text-3xl">Finished Courses</p>
          <div className="w-64 h-fit border hover:shadow-2xl duration-1000 rounded-2xl">
            <div className="h-32 bg-fcolor rounded-t-2xl "></div>
            <div className="px-3 py-2 text-xs font-semibold space-y-1">
              <h1 className="text-2xl font-bold">Basic JavaScript</h1>
              <h2>Finished 60/60 lessons</h2>
              <p className="flex gap-2">
                Lecture: <h3 className="text-fcolor">Nguyen Trung Tinh</h3>
              </p>
              <button className="w-full mt-2 bg-scolor rounded-lg text-xs p-2 font-bold">
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-fcolor font-bold text-3xl">Following Courses</p>
          <div className="w-64 h-fit border hover:shadow-2xl duration-1000 rounded-2xl">
            <div className="h-32 bg-fcolor rounded-t-2xl "></div>
            <div className="px-3 py-2 text-xs font-semibold space-y-1">
              <h1 className="text-2xl font-bold">Basic JavaScript</h1>
              <h2>Finished 60/60 lessons</h2>
              <p className="flex gap-2">
                Lecture: <h3 className="text-fcolor">Nguyen Trung Tinh</h3>
              </p>
              <button className="w-full mt-2 bg-scolor rounded-lg text-xs p-2 font-bold">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
