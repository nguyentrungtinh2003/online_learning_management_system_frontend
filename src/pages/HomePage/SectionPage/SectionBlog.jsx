import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../../config/URLconfig";
import { PiEyeDuotone, PiHeartFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";

const BlogCard = ({ blog }) => {
  const { t } = useTranslation("homepage");
  const isPopular = blog.likeCount >= 1;

  return (
    <div className="relative font-semibold text-gray-700 dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-1 border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      {isPopular && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
          {t("blog.popular")}
        </div>
      )}

      <img
        src={blog.img}
        alt={blog.blogName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-4xl lg:text-2xl h-16 font-bold text-gray-800 dark:text-darkText overflow-hidden text-ellipsis line-clamp-2 h-[5.5rem] lg:h-[3.9rem] leading-tight">
          {blog.blogName}
        </h3>

        <div className="mt-2 flex justify-between">
          <div className="flex gap-1 text-xl lg:text-sm items-center">
            <PiEyeDuotone size={20} />
            <p>{blog.view}</p>
          </div>
          <div className="flex text-xl lg:text-sm items-center gap-1">
            <PiHeartFill size={20} />
            <p>{blog.blogComments.length}</p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <p className="text-xl lg:text-sm mt-1 flex w-full gap-2 items-center">
            <img className="h-6 w-6" alt={blog.user?.username} src={blog.user?.img} />
            <span>{blog.user?.username}</span>
          </p>
        </div>

        <a href={`/blog?scrollTo=${blog.id}`}>
          <button className="mt-4 w-full bg-wcolor border-2 hover:text-wcolor dark:text-darkText dark:border-darkBorder dark:bg-darkSubbackground text-gray-600 text-xl font-semibold py-2 rounded-lg dark:hover:bg-fcolor hover:bg-fcolor transition duration-300">
            {t("blog.readMore")}
          </button>
        </a>
      </div>
    </div>
  );
};

const SectionBlog = () => {
  const { t } = useTranslation("homepage");
  const [blogs, setBlogs] = useState([]);

  const fetchBlogRandom = (limit) => {
    axios
      .get(`${URL}/blogs/limit?limit=${limit}`, { withCredentials: true })
      .then((response) => {
        const blogsWithLikes = response.data.data.map((blog) => ({
          ...blog,
          likeCount: blog.likedUsers ? blog.likedUsers.length : 0,
        }));

        const sortedBlogs = blogsWithLikes.sort((a, b) => {
          if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;

          const dateA = new Date(...(a.date || []));
          const dateB = new Date(...(b.date || []));
          return dateB - dateA;
        });

        setBlogs(sortedBlogs);
      })
      .catch((error) => {
        console.log("Error get blog random " + error.message);
      });
  };

  useEffect(() => {
    fetchBlogRandom(20);
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <h2 className="lg:text-3xl lg:py-0 py-4 text-4xl font-bold text-center text-fcolor mb-8">
        {t("blog.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default SectionBlog;
