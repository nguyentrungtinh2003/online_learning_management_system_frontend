import React, { useEffect, useState } from "react";

const blogs = [
  {
    title_en: "The Future of Web Development",
    title_vi: "Tương lai của phát triển Web",
    date: "December 21, 2024",
    views_en: "1200 Views",
    views_vi: "1200 lượt xem",
    comments_en: "50 Comments",
    comments_vi: "50 bình luận",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc:
      "https://www.snapagency.com/wp-content/uploads/2019/04/og-devs.jpg",
  },
  {
    title_en: "How AI is Changing the World",
    title_vi: "Trí tuệ nhân tạo đang thay đổi thế giới như thế nào",
    date: "December 19, 2024",
    views_en: "1500 Views",
    views_vi: "1500 lượt xem",
    comments_en: "30 Comments",
    comments_vi: "30 bình luận",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc:
      "https://www.udacity.com/blog/wp-content/uploads/2020/06/HTML_Blog-scaled.jpeg",
  },
  {
    title_en: "Top 10 Travel Destinations in 2025",
    title_vi: "Top 10 điểm đến du lịch năm 2025",
    date: "December 18, 2024",
    views_en: "1000 Views",
    views_vi: "1000 lượt xem",
    comments_en: "25 Comments",
    comments_vi: "25 bình luận",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc: "https://i.ytimg.com/vi/zZCSTAR-4w0/maxresdefault.jpg",
  },
  {
    title_en: "Healthy Eating for a Better Life",
    title_vi: "Ăn uống lành mạnh cho cuộc sống tốt đẹp hơn",
    date: "December 17, 2024",
    views_en: "800 Views",
    views_vi: "800 lượt xem",
    comments_en: "40 Comments",
    comments_vi: "40 bình luận",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc: "https://iplus.com.vn/assets/front/img/blogs/6656c8a60c941.jpg",
  },
  {
    title_en: "Top 10 Travel Destinations in 2025",
    title_vi: "Top 10 điểm đến du lịch năm 2025",
    date: "December 18, 2024",
    views_en: "1000 Views",
    views_vi: "1000 lượt xem",
    comments_en: "25 Comments",
    comments_vi: "25 bình luận",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc: "https://i.ytimg.com/vi/zZCSTAR-4w0/maxresdefault.jpg",
  },
  {
    title_en: "Healthy Eating for a Better Life",
    title_vi: "Ăn uống lành mạnh cho cuộc sống tốt đẹp hơn",
    date: "December 17, 2024",
    views_en: "800 Views",
    views_vi: "800 lượt xem",
    comments_en: "40 Comments",
    comments_vi: "40 bình luận",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc: "https://iplus.com.vn/assets/front/img/blogs/6656c8a60c941.jpg",
  },
];

const BlogCard = ({ blog, language }) => (
  <div className="font-semibold text-gray-700 dark:bg-darkSubbackground dark:text-darkSubtext dark:border-darkBorder border-1 border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
    <img
      src={blog.imgSrc}
      alt={language === "vi" ? blog.title_vi : blog.title_en}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <h3 className="text-2xl font-bold dark:text-darkText text-gray-800 overflow-hidden text-ellipsis line-clamp-2 leading-tight h-[3.5rem]">
        {language === "vi" ? blog.title_vi : blog.title_en}
      </h3>

      <div className="mt-2 text-sm flex justify-between">
        <p>{language === "vi" ? blog.views_vi : blog.views_en}</p>
        <p>{language === "vi" ? blog.comments_vi : blog.comments_en}</p>
      </div>

      <div className="flex items-center mt-2">
        <img
          src={blog.userImage}
          alt="User"
          className="w-8 h-8 rounded-full mr-2"
        />
        <p className="text-sm">{language === "vi" ? "Đăng bởi người dùng" : "Posted by User"}</p>
      </div>

      <button className="w-full mt-4 py-2 bg-scolor text-white text-xl font-semibold rounded-lg hover:bg-fcolor transition duration-300">
        {language === "vi" ? "Đọc thêm" : "Read More"}
      </button>
    </div>
  </div>
);

const SectionBlog = () => {
  const [language, setLanguage] = useState("en");

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
        {blogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} language={language} />
        ))}
      </div>
    </div>
  );
};

export default SectionBlog;
