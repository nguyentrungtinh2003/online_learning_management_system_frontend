import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";

export default function UserViewCourse() {
  const { id } = useParams();

  // Viết hàm get course by id de hien thi thong tin chi tiet khoa hoc

  const buyCourse = (courseId) => {
    axios
      .post(`${URL}/courses/buy/${localStorage.getItem("id")}/${courseId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error " + error.message);
      });
  };
  return (
    <div className="flex-1 h-screen py-3 ">
      <div className="bg-white h-full overflow-y-auto shadow rounded-2xl">
        <Navbar />
        <div className="flex w-full h-fit px-10 gap-12">
          <div className=" space-y-4 text-gray-700 w-[50%] text-lg font-semibold">
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Course Introduction
              </h1>
              <p className="text-2xl font-bold">Basic JavaScript</p>
              <p>
                This course is designed for beginners who want to learn the
                fundamentals of JavaScript, one of the most popular programming
                languages for web development. You will explore key concepts
                such as variables, data types, functions, loops, and events. By
                the end of the course, you will be able to write simple
                JavaScript programs and interact with web pages dynamically. No
                prior programming experience is required!
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                What You Will Learn?
              </h1>
              <ul>
                <li>Understanding JavaScript syntax and basic operations</li>
                <li>Working with variables, data types, and functions</li>
                <li>Implementing loops and conditional statements</li>
                <li>Handling user interactions with events</li>
                <li>Manipulating the DOM to dynamically update web pages</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                What You Will Learn?
              </h1>
              <ul>
                <li>Module 1: Introduction to JavaScript & Setup</li>
                <li>Module 2: Variables, Data Types & Operators</li>
                <li>Module 3: Functions & Scope</li>
                <li>Module 4: Loops & Conditional Statements</li>
                <li>Module 5: DOM Manipulation & Events</li>
              </ul>
            </div>
          </div>
          <div className="w-[50%] flex flex-col max-h-full">
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">Instructor</h1>
              <p className="flex items-center gap-2 font-bold text-xl">
                Lecture: <h2 className="text-fcolor">Nguyen Trung Tinh</h2>
              </p>
              <p>
                This course is taught by experienced JavaScript developers who
                have worked on real-world projects and have years of teaching
                experience.
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Ranking & Reviews
              </h1>
              <div className="flex items-center w-full gap-40">
                <p className="font-bold text-8xl">4.0</p>
                <div className="font-bold text-xl">400 reviews</div>
              </div>
              <div className="">
                <p className="text-2xl font-bold my-2">
                  The most helpful review
                </p>
                <div className="border p-3">
                  <p className="font-bold">
                    Bài học hữu ích và hay nhất mà tôi từng học
                  </p>
                  <p>
                    giảng viên dạy dễ hiểu, có nhiều bài tập tương tác và hỗ trợ
                    người dùng rất tích cực
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl text-fcolor font-bold">
                Pricing & Enrollment
              </h1>
              <h1 className="font-bold text-2xl flex gap-2">
                Price: <p className="text-rose-400">Free</p>
              </h1>
            </div>
            <div className="flex-col flex-1 flex">
              <button
                onClick={() => buyCourse(id)}
                className="bg-scolor border hover:shadow-lg hover:scale-105 duration-500 text-xl py-3 px-20 font-bold rounded mt-auto self-end"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
