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
    <div className="px-4 py-5">
      <h2 className="text-4xl text-rose-600 font-bold text-center mb-8">
        Top-Tier Learning Experience
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
            <div className="p-4 h-full flex-col justify-between">
              <div className="font-bold">
                <h3 className="text-2xl font-bold text-gray-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Price: {course.price}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Coins: {course.coin}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Students: {course.students}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lessons: {course.lessons}
                </p>
              </div>
              <button className="w-full mt-4 py-2 bg-scolor text-xl font-semibold text-black rounded-lg hover:bg-fcolor transition-all duration-300">
                Unlock Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCoursePro;
