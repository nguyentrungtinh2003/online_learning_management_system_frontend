import { useEffect, useState } from "react";

export default function FireworkConfetti() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const launchFirework = () => {
      const pieces = Array.from({ length: 300 }, (_, i) => ({
        id: i,
        x: window.innerWidth / 2, // Xuất phát từ giữa màn hình
        y: window.innerHeight / 2,
        angle: Math.random() * 360, // Hướng bắn ngẫu nhiên
        distance: Math.random() * 1200 + 300, // Bay xa hơn
        rotate: Math.random() * 1440, // Xoay dữ hơn
        size: Math.random() * 8 + 4, // Kích thước từ 4px - 12px
        color: ["bg-red-500", "bg-blue-500", "bg-yellow-400", "bg-green-400"][
          Math.floor(Math.random() * 4)
        ], // Màu sắc ngẫu nhiên
        duration: (Math.random() * 2 + 2).toFixed(2), // Bay 2-4s
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 4000); // Xóa sau 4s
    };

    launchFirework();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {confetti.map(
        ({ id, x, y, angle, distance, rotate, size, color, duration }) => {
          const radian = (angle * Math.PI) / 180;
          const targetX = Math.cos(radian) * distance;
          const targetY = Math.sin(radian) * distance;

          return (
            <div
              key={id}
              className={`absolute ${color} opacity-90 rounded`}
              style={{
                width: `${size}px`,
                height: `${size * 1.5}px`,
                left: x,
                top: y,
                transform: `rotate(${rotate}deg)`,
                animation: `explode-${id} ${duration}s ease-out forwards`,
              }}
            />
          );
        }
      )}
      <style>
        {confetti
          .map(
            ({ id, angle, distance }) => `
            @keyframes explode-${id} {
              0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
              }
              50% {
                opacity: 1;
                transform: translate(${
                  Math.cos((angle * Math.PI) / 180) * (distance / 2)
                }px, 
                                     ${
                                       Math.sin((angle * Math.PI) / 180) *
                                       (distance / 2)
                                     }px) scale(1.3);
              }
              100% {
                opacity: 0;
                transform: translate(${
                  Math.cos((angle * Math.PI) / 180) * distance
                }px, 
                                     ${
                                       Math.sin((angle * Math.PI) / 180) *
                                       distance
                                     }px) rotate(2160deg);
              }
            }
          `
          )
          .join("\n")}
      </style>
    </div>
  );
}
