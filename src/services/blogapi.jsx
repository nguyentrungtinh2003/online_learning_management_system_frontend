import axios from "axios";
import URL from "../config/URLconfig";

export const getBlogs = async () => {
  try {
    const response = await axios.get(`${URL}/blogs/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const addBlog = async (blogData, imgFile, videoFile) => {
  try {
    const formData = new FormData();

    // Chuyển đổi JSON thành Blob để gửi dưới dạng `RequestPart`
    const blogBLob = new Blob([JSON.stringify(blogData)], {
      type: "application/json",
    });

    formData.append("blog", blogBLob); // Dữ liệu bài học (JSON)
    if (imgFile) formData.append("img", imgFile); // Ảnh
    if (videoFile) formData.append("video", videoFile); // Video

    const response = await axios.post(
      `${URL}/blogs/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      {
        withCredentials: true,
      }
    );

    return response.data; // Trả về API response
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

export const updateBlog = async (id, blogData, imgFile, videoFile) => {
  try {
    const formData = new FormData();

    // Chuyển đổi JSON thành Blob để gửi dưới dạng `RequestPart`
    const blogBLob = new Blob([JSON.stringify(blogData)], {
      type: "application/json",
    });

    formData.append("blog", blogBLob); // Dữ liệu bài học (JSON)
    if (imgFile) formData.append("img", imgFile); // Ảnh
    if (videoFile) formData.append("video", videoFile); // Video

    const response = await axios.post(
      `${URL}/blogs/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      {
        withCredentials: true,
      }
    );

    return response.data; // Trả về API response
  } catch (error) {
    console.error("Error update blog:", error);
    throw error;
  }
};

export const searchBlogs = async (keyword, page = 0, size = 6) => {
  const response = await axios.get(
    `${URL}/blogs/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const deleteBlog = async (id, userId) => {
  try {
    const response = await axios.delete(`${URL}/blogs/delete/${id}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete blog");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

export const getBlogsByPage = async (page = 0, size = 6) => {
  try {
    const response = await axios.get(
      `${URL}/blogs/page?page=${page}&size=${size}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
};

//. API Restore
export const restoreBlog = async (id, userId) => {
  try {
    const response = await axios.put(
      `${URL}/blogs/restore/${id}/${userId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to restore quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};
