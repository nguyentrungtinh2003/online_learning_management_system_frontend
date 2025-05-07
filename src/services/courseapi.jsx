import axios from "axios";
import URL from "../config/URLconfig";

// Sơ đồ API

// 1.Get Course All
export const getCourses = async () => {
  try {
    const response = await axios.get(`${URL}/courses/all`, {
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

// 2.Get Course By Id
export const getCourseById = async (courseId) => {
  try {
    const response = await axios.get(`${URL}/courses/${courseId}`, {
      withCredentials: true,
    });
    return response.data; // Dữ liệu API trả về
  } catch (error) {
    console.error("❌ Lỗi lấy khóa học:", error);
    return null;
  }
};

// 3.Buy course
export const buyCourse = async (courseId) => {
  try {
    const response = await axios.post(
      `${URL}/courses/buy/${localStorage.getItem("id")}/${courseId}`,
      {
        withCredentials: true,
      }
    );
    if (response.data.status == 200) {
      toast.success("Mua khoá học thành công!", {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });
    }
    return response.data; // Dữ liệu API trả về
  } catch (error) {
    console.error("❌ Lỗi lấy khóa học:", error);
    return null;
  }
};

// 4. Update Course
export const updateCourse = async (id, courseData, file) => {
  try {
    // Tạo formData vì API yêu cầu "multipart/form-data"
    const formData = new FormData();

    // Xóa id khỏi dữ liệu (nếu có trong courseData)
    const { id: courseId, ...newCourseData } = courseData;

    // Thêm course dưới dạng JSON Blob để giữ đúng định dạng
    const courseJson = new Blob([JSON.stringify(newCourseData)], {
      type: "application/json",
    });

    formData.append("course", courseJson);

    // Nếu có ảnh mới, thêm vào FormData
    if (file) {
      formData.append("img", file);
    }

    // Gọi API bằng Axios (sử dụng PUT request)
    const response = await axios.put(
      `${URL}/teacher/courses/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    console.log("Course updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    throw error;
  }
};

export const addCourse = async (courseData, imageFile) => {
  try {
    const formData = new FormData();

    // Xóa id nếu nó có trong dữ liệu để tránh lỗi
    const { id, ...newCourseData } = courseData;

    // Thêm course dưới dạng JSON Blob để giữ đúng định dạng
    const courseJson = new Blob([JSON.stringify(newCourseData)], {
      type: "application/json",
    });

    formData.append("course", courseJson);

    if (imageFile) {
      formData.append("img", imageFile);
    }

    const response = await axios.post(`${URL}/teacher/courses/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log("Course added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/courses/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // đúng cách để gửi cookie session
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// API Lấy danh sách khóa học theo phân trang
export const getCoursesByPage = async (page = 0, size = 6) => {
  console.log(document.cookie);
  const response = await axios.get(
    `${URL}/teacher/courses/page?page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// API Tìm kiếm khóa học có phân trang
export const searchCourses = async (keyword, page = 0, size = 6) => {
  console.log(document.cookie);
  const response = await axios.get(
    `${URL}/teacher/courses/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// API Hiển thị course theo user
export const userEnroll = async (id) => {
  try {
    const response = await axios.get(`${URL}/enroll/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // axios tự động ném lỗi nếu status không phải 2xx, nên không cần kiểm tra response.ok
    return response.data;
  } catch (error) {
    console.error("Error get course:", error);

    // Gửi lại lỗi chi tiết nếu có response từ server
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to get course");
    }
  }
};

// API Restore
export const restoreCourse = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/courses/restore/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to restore course");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
