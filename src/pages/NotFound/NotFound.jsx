import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:text-darkText dark:bg-darkBackground px-4 text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4 animate-bounce" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl mb-6">
        Oops! Trang bạn đang tìm kiếm không tồn tại.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-medium shadow transition duration-300"
      >
        Quay lại Trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
