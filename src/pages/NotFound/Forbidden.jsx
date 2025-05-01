import React from "react";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wcolor dark:bg-darkBackground dark:text-darkText text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <p className="text-xl mb-6">Bạn không có quyền truy cập vào trang này.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default ForbiddenPage;
