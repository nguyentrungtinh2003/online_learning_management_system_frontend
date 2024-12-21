import React from "react";

const SectionCoursePro = () => {
  const courses = [
    {
      title: "Web Development Pro",
      price: "100 USD",
      coin: "5000 Coins",
      students: "2000+ Students",
      lessons: "50+ Lessons",
      imgSrc: "https://wallpapercave.com/wp/wp10167060.jpg",
    },
    {
      title: "Mobile App Development",
      price: "150 USD",
      coin: "7000 Coins",
      students: "1500+ Students",
      lessons: "40+ Lessons",
      imgSrc: "https://i.imgur.com/lkanFrg.jpg",
    },
    {
      title: "Python for Data Science",
      price: "120 USD",
      coin: "6000 Coins",
      students: "1800+ Students",
      lessons: "45+ Lessons",
      imgSrc:
        "http://pluspng.com/img-png/python-logo-png-big-image-png-2400.png",
    },
    {
      title: "Game Development",
      price: "130 USD",
      coin: "6500 Coins",
      students: "1700+ Students",
      lessons: "50+ Lessons",
      imgSrc:
        "https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp",
    },
    {
      title: "Python for Data Science",
      price: "120 USD",
      coin: "6000 Coins",
      students: "1800+ Students",
      lessons: "45+ Lessons",
      imgSrc:
        "http://pluspng.com/img-png/python-logo-png-big-image-png-2400.png",
    },
    {
      title: "Game Development",
      price: "130 USD",
      coin: "6500 Coins",
      students: "1700+ Students",
      lessons: "50+ Lessons",
      imgSrc:
        "https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp",
    },
  ];

  return (
    <div className="mt-10 p-5">
      <h2 className="text-4xl font-bold text-center mb-8">
        Our Premium Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl"
          >
            <img
              src={course.imgSrc}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-2xl font-semibold text-gray-800">
                {course.title}
              </h3>
              <p className="text-lg text-gray-600 mt-2">
                Price: {course.price}
              </p>
              <p className="text-lg text-gray-600 mt-1">Coins: {course.coin}</p>
              <p className="text-lg text-gray-600 mt-1">
                Students: {course.students}
              </p>
              <p className="text-lg text-gray-600 mt-1">
                Lessons: {course.lessons}
              </p>
              <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCoursePro;
