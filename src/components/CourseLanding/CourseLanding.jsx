import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CourseLanding() {
  const { t } = useTranslation("homepage");
  const [currentDivIndex, setCurrentDivIndex] = useState(0);
  const totalPages = 5;

  const divs = [
    {
      title: t("landing.title1"),
      description: t("landing.description1"),
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://wallpapercave.com/wp/wp10167060.jpg')",
    },
    {
      title: t("landing.title2"),
      description: t("landing.description2"),
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png')",
    },
    {
      title: t("landing.title3"),
      description: t("landing.description3"),
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://i.imgur.com/lkanFrg.jpg')",
    },
    {
      title: t("landing.title4"),
      description: t("landing.description4"),
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp')",
    },
    {
      title: t("landing.title5"),
      description: t("landing.description5"),
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://static.vecteezy.com/system/resources/previews/006/198/869/non_2x/internet-security-protection-from-hacker-attacking-cyber-attack-and-network-security-concept-free-photo.jpg')",
    },
  ];

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
    <div className="h-fit mx-2 mb-2 flex flex-col items-center">
      <div className="flex w-full dark:text-gray-300 justify-between items-center space-x-2">
        <button
          className="hover:bg-scolor hover:scale-105 duration-500 p-2 rounded-xl"
          onClick={handlePrevClick}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </button>
        <div
          className="text-center text-2xl h-[500px] lg:h-[300px] w-full p-10 rounded-3xl bg-cover bg-center hover:scale-[1.01] hover:shadow-xl transition-all duration-300 transform"
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
                ? "w-[60px] bg-fcolor dark:bg-cyan-400"
                : "w-[40px] bg-gray-300 dark:bg-gray-700"
            }`}
            onClick={() => setCurrentDivIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
