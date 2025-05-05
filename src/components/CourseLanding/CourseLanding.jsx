import React, { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CourseLanding() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  const divs = [
    {
      title: {
        en: "Master Web Development",
        vi: "Làm chủ Lập trình Web",
      },
      description: {
        en: "Become a full-stack web developer. Learn HTML, CSS, JavaScript, and popular frameworks like React and Node.js. Build dynamic and interactive web applications.",
        vi: "Trở thành lập trình viên full-stack. Học HTML, CSS, JavaScript và các framework phổ biến như React và Node.js. Xây dựng các ứng dụng web động và tương tác.",
      },
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://wallpapercave.com/wp/wp10167060.jpg')",
    },
    {
      title: {
        en: "Python for Data Science",
        vi: "Python cho Khoa học Dữ liệu",
      },
      description: {
        en: "Unlock the power of data with Python. Learn data analysis, machine learning, and data visualization. Build intelligent applications and make data-driven decisions.",
        vi: "Khai phá sức mạnh dữ liệu với Python. Học phân tích dữ liệu, học máy và trực quan hóa dữ liệu. Xây dựng ứng dụng thông minh và ra quyết định dựa trên dữ liệu.",
      },
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.newtechdojo.com/wp-content/uploads/2018/08/Data-Science.png')",
    },
    {
      title: {
        en: "Mobile App Development",
        vi: "Phát triển Ứng dụng Di động",
      },
      description: {
        en: "Create stunning mobile apps for iOS and Android. Learn Swift, Kotlin, and cross-platform frameworks like Flutter. Bring your app ideas to life.",
        vi: "Tạo ứng dụng di động tuyệt vời cho iOS và Android. Học Swift, Kotlin và các framework đa nền tảng như Flutter. Hiện thực hóa ý tưởng ứng dụng của bạn.",
      },
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://i.imgur.com/lkanFrg.jpg')",
    },
    {
      title: {
        en: "Game Development",
        vi: "Phát triển Trò chơi",
      },
      description: {
        en: "Immerse yourself in the world of game development. Learn game engines like Unity and Unreal Engine. Create 2D and 3D games.",
        vi: "Đắm chìm trong thế giới phát triển trò chơi. Học các công cụ như Unity và Unreal Engine. Tạo game 2D và 3D.",
      },
      background:
        "linear-gradient(to right, #30cfd033, #33086733),url('https://www.mindinventory.com/blog/wp-content/uploads/2022/04/unity-3d-for-game-development-1024x647.webp')",
    },
    {
      title: {
        en: "Cybersecurity Fundamentals",
        vi: "Những kiến thức cơ bản về An ninh mạng",
      },
      description: {
        en: "Protect digital systems from cyber threats. Learn ethical hacking, network security, and cloud security. Become a cybersecurity expert.",
        vi: "Bảo vệ hệ thống số khỏi các mối đe dọa mạng. Học tấn công có đạo đức, bảo mật mạng và bảo mật đám mây. Trở thành chuyên gia an ninh mạng.",
      },
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
    <div className="h-fit mx-2 mb-2 flex flex-col items-center">
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
            {divs[currentDivIndex].title[language]}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg">
            {divs[currentDivIndex].description[language]}
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
