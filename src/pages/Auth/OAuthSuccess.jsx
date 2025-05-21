import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");
    const username = params.get("username");
    const email = params.get("email");
    const img = params.get("img");
    const coin = params.get("coin");
    const role = params.get("role");
    const point = params.get("point");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("img", img);
      localStorage.setItem("coin", coin);
      localStorage.setItem("role", role);
      localStorage.setItem("point", point);
      navigate("/"); // hoặc /admin nếu cần phân quyền
    }
  }, [navigate]);

  return <div>Đang đăng nhập Google...</div>;
};

export default OAuthSuccess;
