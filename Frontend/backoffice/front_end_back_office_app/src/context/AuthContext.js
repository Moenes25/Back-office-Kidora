import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const isLoggedIn = !!token;

  // -------------------------
  // LOGIN
  // -------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      const accessToken = data.token;
      localStorage.setItem("token", accessToken);

      const userData = {
        id: data.id,
        nom: data.nom,
        email: data.email,
        tel: data.tel,
        role: data.role,
          
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);

      return true;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UPDATE USER LOCALLY
  // After updating profile in backend
  // -------------------------
  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };

    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        login,
        logout,
        updateUser,  
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
