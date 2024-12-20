import React, { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function CourseLanding() {
  const divs = [
    <div
      className="box-border text-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 h-[400px] w-full mt-20 p-10 rounded-3xl"
      key="1"
    >
      <h1 className="2xl:text-6xl text-5xl my-10">Master Web Development</h1>
      <p>
        Become a full-stack web developer. Learn HTML, CSS, JavaScript, and
        popular frameworks like React and Node.js. Build dynamic and interactive
        web applications.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-l from-rose-700 via-red-500 to-yellow-200 h-[400px] mt-20 p-10 rounded-3xl"
      key="2"
    >
      <h1 className="2xl:text-6xl text-5xl my-10">Python for Data Science</h1>
      <p>
        Unlock the power of data with Python. Learn data analysis, machine
        learning, and data visualization. Build intelligent applications and
        make data-driven decisions.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-r from-rose-400 via-cyan-400 to-teal-500 h-[400px] mt-20 p-10 rounded-3xl"
      key="3"
    >
      <h1 className="2xl:text-6xl text-5xl my-10">Mobile App Development</h1>
      <p>
      Create stunning mobile apps for iOS and Android. Learn Swift, Kotlin, and cross-platform frameworks like Flutter. Bring your app ideas to life.
      </p>
    </div>,
    <div
      className="text-2xl bg-gradient-to-l from-purple-400 via-blue-300 to-teal-200 h-[400px] mt-20 p-10 rounded-3xl"
      key="4"
    >
      <h1 className="2xl:text-6xl text-5xl my-10">Game Development</h1>
      <p>
      Immerse yourself in the world of game development. Learn game engines like Unity and Unreal Engine. Create 2D and 3D games.
      </p>
    </div>,
    <div
    className="text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-pink-500 h-[400px] mt-20 p-10 rounded-3xl"
    key="5"
  >
    <h1 className="2xl:text-5xl text-4xl my-10">Cybersecurity Fundamentals</h1>
    <p>
    Protect digital systems from cyber threats. Learn ethical hacking, network security, and cloud security. Become a cybersecurity expert.
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
      setCurrentDivIndex(currentDivIndex + totalPages -1);
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
    <div className="h-[500px] m-10 relative">
      <button className="p-2 absolute mt-[180px]" onClick={handlePrevClick}>
        <ArrowBackIosNewIcon fontSize="small" />
      </button>
      <button
        className="p-2 absolute right-0 mt-[180px]"
        onClick={handleNextClick}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </button>
      {divs[currentDivIndex]}
      <div className="flex m-2">
        <button
          className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 0 ? "60px" : "40px" }}
          onClick={() => handleButtonClick(0)}
        />
        <button
          className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 1 ? "60px" : "40px" }}
          onClick={() => handleButtonClick(1)}
        />
        <button
          className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 2 ? "60px" : "40px" }}
          onClick={() => handleButtonClick(2)}
        />
        <button
          className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 3 ? "60px" : "40px" }}
          onClick={() => handleButtonClick(3)}
        />
        <button
          className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 4 ? "60px" : "40px" }}
          onClick={() => handleButtonClick(4)}
        />
      </div>
    </div>
  );
}
