import React, { useState, useEffect } from "react"

export default function CourseLanding() {
  const divs = [
    <div
      className="box-border text-2xl bg-cyan-200 h-[400px] w-full mt-20 p-10 rounded-3xl"
      key="1"
    >
      <h1>Code Arena on FaceBook</h1>
      <p>
        Join our vibrant community of coders, participate in exciting
        challenges, and level up your programming skills.
      </p>
    </div>,
    <div
      className="text-2xl bg-gray-200 h-[400px] mt-20 p-10 rounded-3xl"
      key="2"
    >
      <h1>Code Arena on FaceBook</h1>
      <p>
        Join our vibrant community of coders, participate in exciting
        challenges, and level up your programming skills.
      </p>
    </div>,
    <div
      className="text-2xl bg-blue-200 h-[400px] mt-20 p-10 rounded-3xl"
      key="3"
    >
      <h1>Code Arena on FaceBook</h1>
      <p>
        Join our vibrant community of coders, participate in exciting
        challenges, and level up your programming skills.
      </p>
    </div>,
    <div
      className="text-2xl bg-red-200 h-[400px] mt-20 p-10 rounded-3xl"
      key="4"
    >
      <h1>Code Arena on FaceBook</h1>
      <p>
        Join our vibrant community of coders, participate in exciting
        challenges, and level up your programming skills.
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
    }
  };

  const handleNextClick = () => {
    if (currentDivIndex < totalPages - 1) {
      setCurrentDivIndex(currentDivIndex + 1);
    }
    else {
      setCurrentDivIndex((currentDivIndex - totalPages)+1)
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
      <button className="p-4 mr-2 bg-cyan-300 absolute mt-[180px]" onClick={handlePrevClick}></button>
      <button className="p-4 bg-cyan-300 absolute right-0 mt-[180px]" onClick={handleNextClick}></button>
      {divs[currentDivIndex]}
      <div className="flex m-2">
      <button className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 0 ? '60px' : '40px' }}
          onClick={() => handleButtonClick(0)}
        />
        <button className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 1 ? '60px' : '40px' }}
          onClick={() => handleButtonClick(1)}
        />
        <button className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 2 ? '60px' : '40px' }}
          onClick={() => handleButtonClick(2)}
        />
        <button className="bg-gray-300 rounded-2xl h-2 w-10 mr-2"
          style={{ width: currentDivIndex === 3 ? '60px' : '40px' }}
          onClick={() => handleButtonClick(3)}
        />
      </div>
    </div>
  );
}
