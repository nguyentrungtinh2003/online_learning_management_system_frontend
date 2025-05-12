import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";

const BlogCard = ({ blog, language }) => (
  <div className="font-semibold text-gray-700 dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-1 border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
    <img
      src={blog.img}
      alt={language === "vi" ? blog.blogName : blog.blogName}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <h3 className="text-2xl font-bold dark:text-darkText text-gray-800 overflow-hidden text-ellipsis line-clamp-2 leading-tight h-16">
        "{language === "vi" ? blog.blogName : blog.blogName}
      </h3>

      <div className="mt-2 text-sm flex justify-between">
        <p>{language === "vi" ? blog.view : blog.view}</p>
        <p>
          {language === "vi"
            ? blog.blogComments.length
            : blog.blogComments.length}
        </p>
      </div>

      <div className="flex items-center mt-2">
        <img
          src={blog.user.img}
          alt="User"
          className="w-8 h-8 rounded-full mr-2"
        />
        <p className="text-sm">
          {language === "vi" ? "Đăng bởi người dùng" : "Posted by User"}
        </p>
      </div>

      <a href={`/blog?scrollTo=${blog.id}`}>
        <button className="w-full mt-4 py-2 bg-scolor text-white text-xl font-semibold rounded-lg hover:bg-fcolor transition duration-300">
          {language === "vi" ? "Đọc thêm" : "Read More"}
        </button>
      </a>
    </div>
  </div>
);

const SectionBlog = () => {
  const [language, setLanguage] = useState("en");

  const [blogs, setBlogs] = useState([]);

  const fetchBlogRandom = (limit) => {
    axios
      .get(`${URL}/blogs/limit?limit=${limit}`, { withCredentials: true })
      .then((response) => {
        setBlogs(response.data.data);
      })
      .catch((error) => {
        console.log("Error get blog random " + error.message);
      });
  };

  useEffect(() => {
    fetchBlogRandom(20);
  }, []);

  useEffect(() => {
    const storedLang =
      localStorage.getItem("i18nextLng") || localStorage.getItem("language");
    if (storedLang === "vi" || storedLang === "en") {
      setLanguage(storedLang);
    }
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
        {language === "vi"
          ? "Bài viết & Góc nhìn lập trình"
          : "Tech Talks & Programming Perspectives"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} language={language} />
        ))}
      </div>
    </div>
  );
};

export default SectionBlog;
