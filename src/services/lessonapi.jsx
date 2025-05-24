import axios from "axios";
import URL from "../config/URLconfig";

export const getLesson = async () => {
  try {
    const response = await axios.get(`${URL}/teacher/lessons/all`, {
      withCredentials: true,
    });
    // const filteredCourses = response.data.data.filter(course => !course.deleted); // Chỉ lấy khóa học chưa bị xóa
    // return { ...response.data, data: filteredCourses };

    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// 2.Get Lesson By Id
export const getLessonById = async (lessonId) => {
  try {
    const response = await axios.get(`${URL}/lessons/${lessonId}`, {
      withCredentials: true,
    });
    return response.data; // Dữ liệu API trả về
  } catch (error) {
    console.error("❌ Lỗi lấy khóa học:", error);
    return null;
  }
};

// 🟢 Lấy bài học theo course ID
export const getLessonByCourseId = async (courseId) => {
  try {
    const response = await axios.get(
      `${URL}/teacher/lessons/courses/${courseId}/page`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Dữ liệu API trả về
  } catch (error) {
    console.error("❌ Lỗi lấy khóa học:", error);
    return null;
  }
};

export const AddLesson = async (lessonData, imgFile, videoFile) => {
  try {
    const formData = new FormData();

    // Chuyển đổi JSON thành Blob để gửi dưới dạng `RequestPart`
    const lessonBlob = new Blob([JSON.stringify(lessonData)], {
      type: "application/json",
    });

    formData.append("lesson", lessonBlob); // Dữ liệu bài học (JSON)
    if (imgFile) formData.append("img", imgFile); // Ảnh
    if (videoFile) formData.append("video", videoFile); // Video

    const response = await axios.post(
      `${URL}/teacher/lessons/add`,
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
    console.error("Error adding lesson:", error);
    throw error;
  }
};

export const deleteLesson = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/lessons/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // đúng cách để gửi cookie session
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete lesson");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
};

// API Lấy danh sách khóa học theo phân trang
export const getLessonByPage = async (page = 0, size = 6) => {
  const response = await axios.get(
    `${URL}/teacher/lessons/page?page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// API Lấy danh sách khóa học theo phân trang
export const getLessonByCourseIdAndPage = async (
  courseId,
  page = 0,
  size = 6
) => {
  const response = await axios.get(
    `${URL}/teacher/lessons/courses/${courseId}/page?page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// API Tìm kiếm khóa học có phân trang
export const searchLessons = async (keyword, page = 0, size = 6) => {
  const response = await axios.get(
    `${URL}/lessons/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// API Restore
export const restoreLesson = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/lessons/restore/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to restore lesson");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
};

// API Update Lesson Process
export const updateLessonProcess = async (userId, courseId, lessonId) => {
  try {
    const response = await axios.put(
      `${URL}/process/update/${userId}/${courseId}/${lessonId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data; // Trả về dữ liệu từ backend
  } catch (error) {
    if (error.response) {
      console.error("Lỗi từ API:", error.response.data);
      console.error("Trạng thái lỗi:", error.response.status);
    } else {
      console.error("Lỗi không xác định:", error);
    }
  }
};

// API Update Lesson
export const updateLesson = async (id, lessonData, img, video) => {
  const formData = new FormData();

  formData.append(
    "lesson",
    new Blob([JSON.stringify(lessonData)], { type: "application/json" })
  );

  if (img) formData.append("img", img);
  if (video) formData.append("video", video);

  const response = await axios.put(
    `${URL}/teacher/lessons/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return response.data;
};
