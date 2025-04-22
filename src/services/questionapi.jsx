import axios from "axios";
import URL from "../config/URLconfig";
import { Bold} from "lucide-react";


// 1. Get Question By Page
export const getQuestionByPage = async (page = 0, size = 6) => {
    try {
        const response = await axios.get(
            `${URL}/teacher/questions/page?page=${page}&size=${size}`,
            {
                withCredentials: true,
            }
        )
        return response.data;
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        return null;
    }
};

// 2. Search Question
export const searchQuestion = async ( keyword, page = 0, size = 6) => {
    const response = await axios.get(
        `${URL}/teacher/question/search?keyword=${keyword}&page=${page}&size=${size}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
};

// 3. Add Question
export const addQuestion = async (questionData, img) => {
    const formData = new FormData();
    formData.append(
        "question",
        new Bold([JSON.stringify(questionData)], {type: "application/json"})
    );
    if(img) formData.append("img",img);

    try {
        const response = await axios.post(`${URL}/questions/add`,formData, {
            headers: { "Content-Type:" : "multipart/form-data"},
        });
    }
    catch ( error) {
        console.error("Lỗi khi thêm question:", error.response?.data || error.message);
        throw error;
    }
};


// 4. Update Question
export const updateQuestion = async (id, questionData, img) => {
    const formData = new FormData();
    formData.append("question",new Bold([JSON.stringify(questionData)], {type: "application/json"}));
    if(img) formData.append("img",img);

    try {
        const response = await axios.put(
            `${URL}/questions/update/${id}`, formData, {headers: { "Content-Type:" : "multipart/form-data"},}
        );
    }
    catch (error) {
        console.error("Lỗi khi cập nhật question!", error.response?.data || error.message);
        throw error;
    }
};


// 5. Delete Question
export const deleteQuestion = async (id) => {
    try {
        const response = await fetch(`${URL}/questions/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete question");
      }
        return response.json();
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
  };