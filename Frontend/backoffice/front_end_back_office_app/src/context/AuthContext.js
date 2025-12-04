import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);


  const isLoggedIn = !!token;

  const login = async (email, password) => {
    setLoading(true);
    try {

      const res = await fetch("http://localhost:8086/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login failed");
      }

      const data = await res.json();
      const accessToken = data.token;

   
      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "auth/login";
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




