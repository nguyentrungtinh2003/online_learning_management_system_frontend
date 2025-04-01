import axios from "axios";
import URL from "../config/URLconfig";
import { Bold } from "lucide-react";

// 1. Get Quiz By Page
export const getQuizzesByPage = async (page = 0, size = 6) => {
    try {
        const response = await axios.get(
            `${URL}/teacher/courses/lessons/quizzes/page?page=${page}&size=${size}`,
            {
                withCredentials: true,
            }
        )
        return response.data;
    }
    catch (error) {
        console.error("Error fetching quizzes:", error);
        return null;
    }
};

// 2. Search Quiz
export const searchQuiz = async ( keyword, page = 0, size = 6) => {
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
        new Bold([JSON.stringify(quizData)], {type: "application/json"})
    );
    if(img) formData.append("img",img);

    try {
        const response = await axios.post(`${URL}/quizzes/add`,formData, {
            headers: { "Content-Type:" : "multipart/form-data"},
        });
    }
    catch ( error) {
        console.error("Lỗi khi thêm quiz:", error.response?.data || error.message);
        throw error;
    }
};

// 4. Update Quiz
export const updateQuiz = async (id) => {
    const formData = new FormData();
    formData.append("quiz",new Bold([JSON.stringify(quizData)], {type: "application/json"}));
    if(img) formData.append("img",img);

    try {
        const response = await axios.put(
            `${URL}/quizzes/update/${id}`, formData, {headers: { "Content-Type:" : "multipart/form-data"},}
        );
    }
    catch (error) {
        console.error("Lỗi khi cập nhật quiz!", error.response?.data || error.message);
        throw error;
    }
};


// 5. Delete Quiz
export const deleteQuiz = async (id) => {
  try {
      const response = await fetch(`${URL}/quizzes/delete/${id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete quiz");
    }
      return response.json();
  } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
  }
};