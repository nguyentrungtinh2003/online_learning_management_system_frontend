import axios from "axios";

const API_BASE_URL = "https://codearena-backend-dev.onrender.com/api/lessons"; 


export const getLesson = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        // const filteredCourses = response.data.data.filter(course => !course.deleted); // Chỉ lấy khóa học chưa bị xóa
        // return { ...response.data, data: filteredCourses };
  
        return response.data;
    }
    catch (error){
        console.error("Error fetching courses:", error);
        throw error;
    }
  };

// 🟢 Lấy bài học theo course ID
export const getLessonById = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseId}`);
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
      const lessonBlob = new Blob([JSON.stringify(lessonData)], { type: "application/json" });
  
      formData.append("lesson", lessonBlob);  // Dữ liệu bài học (JSON)
      if (imgFile) formData.append("img", imgFile); // Ảnh
      if (videoFile) formData.append("video", videoFile); // Video
  
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data; // Trả về API response
    } catch (error) {
      console.error("Error adding lesson:", error);
      throw error;
    }
  };
  

export const deleteLesson = async (id) => {
  try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete lesson");
    }
      return response.json();
  } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
  }
};
