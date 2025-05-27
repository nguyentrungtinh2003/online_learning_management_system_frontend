import axios from "axios";
import URL from "../config/URLconfig";

// API Lấy danh sách khóa học theo phân trang
export const getUserByPage = async (page = 0, size = 6) => {
  console.log(document.cookie);
  const response = await axios.get(
    `${URL}/admin/user/page?page=${page}&size=${size}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
