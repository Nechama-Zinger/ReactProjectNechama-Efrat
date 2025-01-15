import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // דגל שמציין אם הכל מוכן

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsReady(true); // לאחר שסיימנו את כל העדכון
    };

    fetchUserData(); // קריאה לפונקציה האסינכרונית
  }, []);

  // אם הפונקציה לא סיימה לעדכן את הנתונים, לא להציג שום דבר
  if (!isReady) {
    return null; // או אלמנט טעינה
  }

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

