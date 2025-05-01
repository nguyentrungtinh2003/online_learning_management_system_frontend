import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdForum, MdNavigateNext } from "react-icons/md";

const AdminEditBlog = () => {
  const [blogData, setBlogData] = useState({
    blogId: "001",
    createdDate: "12/03/2023",
    blogTitle: "How React Hooks Work",
    description: "This course helps you grasp ...",
    image: "img1.jpg",
    video: "video.mp4",
    interactions: "300",
    views: "1200",
    avatar: "Min Tae",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  return (
    <div className="h-full w-full">
      <div className="flex-1 flex flex-col h-fit py-6 px-3">
        <div className="flex gap-2 mb-4 items-center">
          <MdForum size={30} />
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">Blog Management</h2>
          <MdNavigateNext size={30} />
          <h2 className="text-lg font-bold">Edit Blog</h2>
        </div>
        <form className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Blog ID:
              </label>
              <input
                type="text"
                name="blogId"
                value={blogData.blogId}
                readOnly
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Created Date:
              </label>
              <input
                type="text"
                name="createdDate"
                value={blogData.createdDate}
                readOnly
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Blog Title:
              </label>
              <input
                type="text"
                name="blogTitle"
                value={blogData.blogTitle}
                onChange={handleChange}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Description:
              </label>
              <textarea
                name="description"
                rows={3}
                value={blogData.description}
                onChange={handleChange}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              ></textarea>
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Image:</label>
              <input
                type="file"
                name="image"
                className="flex-1 border rounded-lg px-2 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Video:</label>
              <input
                type="file"
                name="video"
                className="flex-1 border rounded-lg px-2 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">
                Interactions:
              </label>
              <input
                type="number"
                name="interactions"
                value={blogData.interactions}
                onChange={handleChange}
                readOnly
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Views:</label>
              <input
                type="number"
                name="views"
                value={blogData.views}
                onChange={handleChange}
                readOnly
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-gray-700 font-medium">Actor:</label>
              <input
                type="text"
                name="avatar"
                value={blogData.avatar}
                onChange={handleChange}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-scolor"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Link
              to="/admin/blog"
              className="px-6 py-2 border-2 border-sicolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-scolor text-ficolor rounded-lg hover:bg-opacity-80"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditBlog;
