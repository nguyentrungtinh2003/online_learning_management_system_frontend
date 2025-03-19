import axios from "axios";

const API_BASE_URL = "https://codearena-backend-dev.onrender.com/api/courses"; 

export const getCourses = async () => {
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


// 🟢 Lấy khóa học theo ID
export const getCourseById = async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${courseId}`);
      return response.data; // Dữ liệu API trả về
    } catch (error) {
      console.error("❌ Lỗi lấy khóa học:", error);
      return null;
    }
  };


// 🟡 Cập nhật khóa học
export const updateCourse  = async (id, courseData, file) => {
  try {
    // Tạo formData vì API yêu cầu "multipart/form-data"
    const formData = new FormData();
    
    // Chuyển đổi courseData thành chuỗi JSON để gửi đi
    formData.append("course", JSON.stringify(courseData));

    // Nếu có ảnh mới, thêm vào FormData
    if (file) {
      formData.append("img", file);
    }

    // Gọi API bằng Axios (sử dụng PUT request)
    const response = await axios.put(
      `${API_BASE_URL}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Cập nhật thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật khóa học:", error);
    throw error;
  }
};
  
// export const addCourse =  async (courseData, imgFile) => {
//     try {
//         const formData = new FormData();
//         formData.append("course", new Blob([JSON.stringify(courseData)],{ type: "application/json" }));
//         if(imgFile) {
//             formData.append("img",imgFile);
//         }

//         const response = await axios.post(`${API_BASE_URL}/courses/add`,formData,{
//             headers: {"Content-Type":"multipart/form-data"},
//         });
//         return response.data;
//     }
//     catch(error){
//         console.error("Error adding course:",error);
//         throw error;
//     }
// };

export const addCourse = async (courseData, imageFile) => {
    try {
        const formData = new FormData();
        
        // Xóa id nếu nó có trong dữ liệu để tránh lỗi
        const { id, ...newCourseData } = courseData;  

        formData.append("course", JSON.stringify(newCourseData));

        if (imageFile) {
            formData.append("img", imageFile);
        }

        const response = await axios.post(`${API_BASE_URL}/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
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
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
    }
      return response.json();
  } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
  }
};


// API Lấy danh sách khóa học theo phân trang
export const getCoursesByPage = async ( page = 0, size = 6) => {
  const response = await axios.get(`${API_BASE_URL}/page?page=${page}&size=${size}`);
  return response.data;
};

// API Tìm kiếm khóa học có phân trang
export const searchCourses = async (keyword, page = 0 , size = 6) => {
  const response = await axios.get(`${API_BASE_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
  return response.data;
}