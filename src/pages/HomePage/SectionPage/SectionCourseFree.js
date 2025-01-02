import React from "react";

// Dữ liệu giả định cho các khóa học
const courses = [
  {
    id: 1,
    title: "Web Development for Beginners",
    duration: "3 hours",
    students: "1,200 students",
    lectures: "10 lectures",
    img: "https://wallpapercave.com/wp/wp10167060.jpg",
  },
  {
    id: 2,
    title: "Master React JS",
    duration: "4 hours",
    students: "3,500 students",
    lectures: "15 lectures",
    img: "https://wallpapercave.com/wp/wp4924002.png",
  },
  {
    id: 3,
    title: "Introduction to Python",
    duration: "5 hours",
    students: "2,000 students",
    lectures: "12 lectures",
    img: "http://pluspng.com/img-png/python-logo-png-big-image-png-2400.png",
  },
  {
    id: 4,
    title: "Complete Data Science Guide",
    duration: "6 hours",
    students: "4,000 students",
    lectures: "20 lectures",
    img: "https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png",
  },
  {
    id: 5,
    title: "Introduction to Python",
    duration: "5 hours",
    students: "2,000 students",
    lectures: "12 lectures",
    img: "http://pluspng.com/img-png/python-logo-png-big-image-png-2400.png",
  },
  {
    id: 6,
    title: "Complete Data Science Guide",
    duration: "6 hours",
    students: "4,000 students",
    lectures: "20 lectures",
    img: "https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png",
  },
  // Thêm nhiều khóa học nếu cần
];

export default function SectionCourseFree() {
  return (
    <section id="section-course-free" className="py-12 bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-cyan-500 mb-8">
          Free Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={course.img}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{course.duration}</p>
                <p className="text-sm text-gray-600 mt-1">{course.students}</p>
                <p className="text-sm text-gray-600 mt-1">{course.lectures}</p>
                <button className="mt-4 w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-400 transition duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
