import React from "react";
import { Link } from "react-router-dom";

const ServerErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:text-darkText text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
      <p className="text-xl mb-6">
        Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default ServerErrorPage;
