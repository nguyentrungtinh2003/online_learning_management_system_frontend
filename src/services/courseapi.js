import axios from "axios";

const API_BASE_URL = "https://codearena-backend-dev.onrender.com/api/courses"; 

export const getCourses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        return response.data;
    }
    catch (error){
        console.error("Error fetching courses:",error);
        throw error;
    }
};

export const getCourseId = async (id) => {
    try{
        const response =  await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    }
    catch (error){
        console.error("Error fetching course by ID:",error);
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

