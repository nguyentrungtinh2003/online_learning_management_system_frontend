import axios from "axios";
import URL from "../config/URLconfig";
import { Bold } from "lucide-react";

// 1. Get Quiz By Page
export const getQuizzesByPage = async (page = 0, size = 6) => {
  try {
    const response = await axios.get(
      `${URL}/teacher/quizzes/page?page=${page}&size=${size}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
};

// 2. Search Quiz
export const searchQuiz = async (keyword, page = 0, size = 6) => {
  const response = await axios.get(
    `${URL}/teacher/quizzes/search?keyword=${keyword}&page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// 3. Add Quiz
export const addQuiz = async (quizData, img) => {
  const formData = new FormData();
  formData.append(
    "quiz",
    new Bold([JSON.stringify(quizData)], { type: "application/json" })
  );
  if (img) formData.append("img", img);

  try {
    const response = await axios.post(`${URL}/quizzes/add`, formData, {
      headers: { "Content-Type:": "multipart/form-data" },
    });
  } catch (error) {
    console.error("Lỗi khi thêm quiz:", error.response?.data || error.message);
    throw error;
  }
};

// 4. Update Quiz
export const updateQuiz = async (id, quizData, img) => {
  const formData = new FormData();
  formData.append(
    "quiz",
    new Bold([JSON.stringify(quizData)], { type: "application/json" })
  );
  if (img) formData.append("img", img);

  try {
    const response = await axios.put(`${URL}/quizzes/update/${id}`, formData, {
      headers: { "Content-Type:": "multipart/form-data" },
    });
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật quiz!",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 5. Delete Quiz
export const deleteQuiz = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/quizzes/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // đúng cách để gửi cookie session
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete quiz");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

// 6. Quiz by Id
export const getQuizById = async (id) => {
  try {
    const response = await fetch(`${URL}/quizzes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // đúng cách để gửi cookie session
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete quiz");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

// 6. Get Quiz By Page
export const getQuizzesByLessonIdAndPage = async (
  lessonId,
  page = 0,
  size = 6
) => {
  try {
    const response = await axios.get(
      `${URL}/teacher/quizzes/lesson/${lessonId}/page?page=${page}&size=${size}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
};

//7. API Restore
export const restoreQuiz = async (id) => {
  try {
    const response = await fetch(`${URL}/teacher/quizzes/restore/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

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

// 8. GET ALL Quizzes By Lesson Id
export const getAllQuizzesByLessonId = async (lessonId) => {
  try {
    const response = await axios.get(
      `${URL}/teacher/quizzes/lessons/${lessonId}/all`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes by lessonId:", error);
    return null;
  }
};

// 9. Submit Quiz & Calculate Points
export const submitQuiz = async (id, userId, answersUser) => {
  try {
    // Cấu hình dữ liệu cần gửi
    const data = {
      userId: userId, // ID của người dùng
      answersUser: answersUser, // Mảng câu trả lời người dùng đã chọn
    };

    // Gọi API để nộp quiz và nhận điểm
    const response = await axios.post(
      `${URL}/quizzes/submit/${id}/${userId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Gửi cookie nếu cần
      }
    );

    // Trả về kết quả thành công từ server
    return response.data;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error submitting quiz:", error);
    throw error;
  }
};

// 10. Save Point
export const savePointHistory = async (userId, point) => {
  try {
    const response = await axios.post(
      `${URL}/rankings/add`,
      {
        user: { id: userId }, // đúng tên field theo DTO
        point: point,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // nếu cần gửi cookie
      }
    );

    if (response.data.statusCode === 200) {
      console.log("✅ Lưu lịch sử điểm thành công.");
    } else {
      console.error("❌ Lỗi khi lưu lịch sử điểm:", response.data.message);
    }
  } catch (error) {
    console.error("🚫 Có lỗi khi gọi API lưu lịch sử điểm:", error);
  }
};
