import React, { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CourseLanding() {
  const divs = [
    {
      title: "Master Web Development",
      description:
        "Become a full-stack web developer. Learn HTML, CSS, JavaScript, and popular frameworks like React and Node.js. Build dynamic and interactive web applications.",
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://wallpapercave.com/wp/wp10167060.jpg')",
    },
    {
      title: "Python for Data Science",
      description:
        "Unlock the power of data with Python. Learn data analysis, machine learning, and data visualization. Build intelligent applications and make data-driven decisions.",
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png')",
    },
    {
      title: "Mobile App Development",
      description:
        "Create stunning mobile apps for iOS and Android. Learn Swift, Kotlin, and cross-platform frameworks like Flutter. Bring your app ideas to life.",
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://i.imgur.com/lkanFrg.jpg')",
    },
    {
      title: "Game Development",
      description:
        "Immerse yourself in the world of game development. Learn game engines like Unity and Unreal Engine. Create 2D and 3D games.",
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp')",
    },
    {
      title: "Cybersecurity Fundamentals",
      description:
        "Protect digital systems from cyber threats. Learn ethical hacking, network security, and cloud security. Become a cybersecurity expert.",
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://static.vecteezy.com/system/resources/previews/006/198/869/non_2x/internet-security-protection-from-hacker-attacking-cyber-attack-and-network-security-concept-free-photo.jpg')",
    },
  ];

  const [currentDivIndex, setCurrentDivIndex] = useState(0);
  const totalPages = divs.length;

  const handlePrevClick = () => {
    setCurrentDivIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentDivIndex((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDivIndex((prevIndex) => (prevIndex + 1) % totalPages);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [totalPages]);

  return (
    <div className="h-fit my-4 mx-2 flex flex-col items-center">
      <div className="flex w-full dark:text-gray-300 justify-between items-center space-x-2">
        <button
          className="hover:bg-scolor hover:scale-105 duration-500 p-2 rounded-xl"
          onClick={handlePrevClick}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
        <div
          className="text-center text-2xl h-[300px] sm:h-[250px] md:h-[300px] w-full p-10 rounded-3xl bg-cover bg-center hover:scale-[1.01] hover:shadow-xl transition-all duration-300 transform"
          style={{ backgroundImage: divs[currentDivIndex].background }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-white my-5">
            {divs[currentDivIndex].title}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg">
            {divs[currentDivIndex].description}
          </p>
        </div>
        <button
          className="hover:bg-scolor hover:scale-105 duration-500 p-2 rounded-xl"
          onClick={handleNextClick}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </button>
      </div>
      <div className="flex m-2 justify-center space-x-2">
        {divs.map((_, index) => (
          <button
            key={index}
            className={`rounded-2xl h-2 transition-all duration-300 hover:w-12 ${
              currentDivIndex === index
                ? "w-[60px] bg-scolor"
                : "w-[40px] bg-gray-300 dark:bg-gray-700"
            }`}
            onClick={() => setCurrentDivIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
