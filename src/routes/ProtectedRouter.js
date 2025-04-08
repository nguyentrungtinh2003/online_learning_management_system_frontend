import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children, requiredRole }) => {
  const stored = localStorage.getItem("role");

  if (!stored) return <Navigate to="/login" />;

  let role;

  try {
    const parsed = JSON.parse(stored);
    role = typeof parsed === "object" ? parsed.role : parsed;
  } catch (error) {
    role = stored; // nếu không parse được thì là string
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/403" />;
  }

  return children;
};

export default ProtectedRouter;
