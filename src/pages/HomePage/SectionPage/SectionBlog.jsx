import React from "react";

const blogs = [
  {
    title: "The Future of Web Development",
    date: "December 21, 2024",
    views: "1200 Views",
    comments: "50 Comments",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc:
      "https://www.snapagency.com/wp-content/uploads/2019/04/og-devs.jpg",
  },
  {
    title: "How AI is Changing the World",
    date: "December 19, 2024",
    views: "1500 Views",
    comments: "30 Comments",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc:
      "https://www.udacity.com/blog/wp-content/uploads/2020/06/HTML_Blog-scaled.jpeg",
  },
  {
    title: "Top 10 Travel Destinations in 2025",
    date: "December 18, 2024",
    views: "1000 Views",
    comments: "25 Comments",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc: "https://i.ytimg.com/vi/zZCSTAR-4w0/maxresdefault.jpg",
  },
  {
    title: "Healthy Eating for a Better Life",
    date: "December 17, 2024",
    views: "800 Views",
    comments: "40 Comments",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc: "https://iplus.com.vn/assets/front/img/blogs/6656c8a60c941.jpg",
  },
  {
    title: "Top 10 Travel Destinations in 2025",
    date: "December 18, 2024",
    views: "1000 Views",
    comments: "25 Comments",
    userImage:
      "https://www.pngkey.com/png/full/72-729716_user-avatar-png-graphic-free-download-icon.png",
    imgSrc: "https://i.ytimg.com/vi/zZCSTAR-4w0/maxresdefault.jpg",
  },
  {
    title: "Healthy Eating for a Better Life",
    date: "December 17, 2024",
    views: "800 Views",
    comments: "40 Comments",
    userImage:
      "https://www.pngkit.com/png/full/115-1150342_user-avatar-icon-iconos-de-mujeres-a-color.png",
    imgSrc: "https://iplus.com.vn/assets/front/img/blogs/6656c8a60c941.jpg",
  },
];

const BlogCard = ({ blog }) => (
  <div className="font-semibold text-gray-700 dark:text-gray-400 dark:border-gray-700 border-1 border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
    <img
      src={blog.imgSrc}
      alt={blog.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <h3 className="text-2xl font-bold dark:text-gray-300 text-gray-800 overflow-hidden text-ellipsis line-clamp-2 leading-tight h-[3.5rem]">
        {blog.title}
      </h3>

      <div className="mt-2 text-sm flex justify-between">
        <p>{blog.views}</p>
        <p>{blog.comments}</p>
      </div>

      <div className="flex items-center mt-2">
        <img
          src={blog.userImage}
          alt="User"
          className="w-8 h-8 rounded-full mr-2"
        />
        <p className="text-sm">Posted by User</p>
      </div>

      <button className="w-full mt-4 py-2 bg-scolor text-white text-xl font-semibold rounded-lg hover:bg-fcolor transition duration-300">
        Read More
      </button>
    </div>
  </div>
);

const SectionBlog = () => {
  return (
    <div className="w-full mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-fcolor mb-8">
        Tech Talks & Programming Perspectives
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {blogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default SectionBlog;
