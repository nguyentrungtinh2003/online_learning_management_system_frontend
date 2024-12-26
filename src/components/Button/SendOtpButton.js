import React, { useState, useEffect } from "react";

export default function SendOtpButton() {
  const [count, setCount] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let interval;

    if (isCounting) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCounting]);

  const handleClick = () => {
    setIsCounting(true);
  };
  return (
    <button
      className="ml-2 bg-cyan-500 text-white rounded-xl px-3 text-xs font-semibold hover:bg-cyan-400"
      disabled={isCounting && count > 0}
      onClick={handleClick}
    >
      {isCounting ? count : "Send OTP"}
    </button>
  );
}
