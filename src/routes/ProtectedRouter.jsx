import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children, requiredRole, requiredRoles }) => {
  const stored = localStorage.getItem("role");

  if (!stored) return <Navigate to="/login" />;

  let role;

  try {
    const parsed = JSON.parse(stored);
    role = typeof parsed === "object" ? parsed.role : parsed;
  } catch (error) {
    role = stored;
  }

  // Xử lý trường hợp truyền vào 1 role (cũ) hoặc nhiều role (mới)
  const allowedRoles = requiredRoles || (requiredRole ? [requiredRole] : []);

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/403" />;
  }

  return children;
};

export default ProtectedRouter;
