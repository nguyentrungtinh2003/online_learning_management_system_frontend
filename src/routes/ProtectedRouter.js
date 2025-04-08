import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children, requiredRole }) => {
  const storedUser = localStorage.getItem("role");

  if (!storedUser) return <Navigate to="/login" />;

  let role;

  try {
    const parsed = JSON.parse(storedUser);
    role = typeof parsed === "object" ? parsed.role : parsed;
  } catch (err) {
    // Nếu không parse được thì dùng luôn chuỗi (trong trường hợp user chỉ là "USER")
    role = storedUser;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/404" />;
  }

  return children;
};

export default ProtectedRouter;
