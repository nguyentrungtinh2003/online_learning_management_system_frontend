import React, { useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const progressData = [
  { day: "Mon", completed: 2 },
  { day: "Tue", completed: 3 },
  { day: "Wed", completed: 1 },
  { day: "Thu", completed: 4 },
  { day: "Fri", completed: 3 },
];

const topicProgress = [
  { name: "JavaScript", value: 50 },
  { name: "React", value: 30 },
  { name: "CSS", value: 20 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const courses = [
  { title: "React Fundamentals", completed: 7, total: 10 },
  { title: "Advanced JavaScript", completed: 5, total: 12 },
  { title: "CSS for Developers", completed: 8, total: 8 },
];

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    {children}
  </button>
);

const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 rounded h-3">
    <div
      className="bg-blue-500 h-3 rounded"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export default function LearningProgress() {
  return (
    <div className="h-full w-full bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">📚 Learning Tracker</h1>
        <Button>Profile</Button>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Progress Overview */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <Progress value={60} />
          <p className="mt-2">60% completed</p>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Topic Progress */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Topic Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={topicProgress}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {topicProgress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Current Courses</h2>
        <div className="grid gap-4 mt-4">
          {courses.map((course, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-medium">{course.title}</h3>
              <Progress value={(course.completed / course.total) * 100} />
              <p className="mt-2">
                {course.completed} / {course.total} Lessons Completed
              </p>
              <Button className="mt-2">Continue Learning</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
