import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("roleEnum");
    if (storedRole) {
      setUser(storedRole); // Không cần JSON.parse nếu chỉ lưu string
    }
  }, []);

  // Optional: đồng bộ lại localStorage nếu setUser thay đổi role
  useEffect(() => {
    if (user) {
      localStorage.setItem("roleEnum", user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
