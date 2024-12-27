import React, { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CourseLanding() {
  const divs = [
    <div
      className="text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 h-[400px] sm:h-[350px] md:h-[400px] w-full mt-10 p-10 rounded-3xl bg-cover bg-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      style={{
        backgroundImage: "linear-gradient(to right, #30cfd033, #33086733),url('https://wallpapercave.com/wp/wp10167060.jpg')",
      }}
      key="1"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
        Master Web Development
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg">
        Become a full-stack web developer. Learn HTML, CSS, JavaScript, and
        popular frameworks like React and Node.js. Build dynamic and interactive
        web applications.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-l from-rose-700 via-red-500 to-yellow-200 h-[400px] sm:h-[350px] md:h-[400px] mt-10 p-10 rounded-3xl bg-cover bg-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      style={{
        backgroundImage:
          "linear-gradient(to right, #30cfd033, #33086733),url('https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png')",
      }}
      key="2"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
        Python for Data Science
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg">
        Unlock the power of data with Python. Learn data analysis, machine
        learning, and data visualization. Build intelligent applications and
        make data-driven decisions.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-r from-rose-400 via-cyan-400 to-teal-500 h-[400px] sm:h-[350px] md:h-[400px] mt-10 p-10 rounded-3xl bg-cover bg-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      style={{
        backgroundImage: "linear-gradient(to right, #30cfd033, #33086733),url('https://i.imgur.com/lkanFrg.jpg')",
      }}
      key="3"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
        Mobile App Development
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg">
        Create stunning mobile apps for iOS and Android. Learn Swift, Kotlin,
        and cross-platform frameworks like Flutter. Bring your app ideas to
        life.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-l from-purple-400 via-blue-300 to-teal-200 h-[400px] sm:h-[350px] md:h-[400px] mt-10 p-10 rounded-3xl bg-cover bg-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      style={{
        backgroundImage:
          "linear-gradient(to right, #30cfd033, #33086733),url('https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp')",
      }}
      key="4"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
        Game Development
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg">
        Immerse yourself in the world of game development. Learn game engines
        like Unity and Unreal Engine. Create 2D and 3D games.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-500 h-[400px] sm:h-[350px] md:h-[400px] mt-10 p-10 rounded-3xl bg-cover bg-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      style={{
        backgroundImage:
          "linear-gradient(to right, #30cfd033, #33086733),url('https://static.vecteezy.com/system/resources/previews/006/198/869/non_2x/internet-security-protection-from-hacker-attacking-cyber-attack-and-network-security-concept-free-photo.jpg')",
      }}
      key="5"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
        Cybersecurity Fundamentals
      </h1>
      <p className="text-white text-sm sm:text-base md:text-lg">
        Protect digital systems from cyber threats. Learn ethical hacking,
        network security, and cloud security. Become a cybersecurity expert.
      </p>
    </div>,
  ];

  const [currentDivIndex, setCurrentDivIndex] = useState(0);

  const handleButtonClick = (index) => {
    setCurrentDivIndex(index);
  };
  const totalPages = divs.length;

  const handlePrevClick = () => {
    if (currentDivIndex > 0) {
      setCurrentDivIndex(currentDivIndex - 1);
    } else {
      setCurrentDivIndex(currentDivIndex + totalPages - 1);
    }
  };

  const handleNextClick = () => {
    if (currentDivIndex < totalPages - 1) {
      setCurrentDivIndex(currentDivIndex + 1);
    } else {
      setCurrentDivIndex(currentDivIndex - totalPages + 1);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDivIndex((prevIndex) => (prevIndex + 1) % divs.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-[400px] mt-8 m-10 relative">
      <button
        className="p-2 absolute mt-[180px] left-0 bg-opacity-50 text-white hover:bg-opacity-75 rounded-full"
        onClick={handlePrevClick}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </button>
      <button
        className="p-2 absolute right-0 mt-[180px] bg-opacity-50 text-white hover:bg-opacity-75 rounded-full"
        onClick={handleNextClick}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </button>
      {divs[currentDivIndex]}
      <div className="flex m-2 justify-center space-x-2">
        {divs.map((_, index) => (
          <button
            key={index}
            className="bg-gray-300 rounded-2xl h-2 w-10 transition-all duration-300 hover:w-12"
            style={{
              width: currentDivIndex === index ? "60px" : "40px",
            }}
            onClick={() => handleButtonClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
