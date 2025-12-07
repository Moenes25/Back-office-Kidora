import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
 // Initialize user state from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL; 

  const isLoggedIn = !!token;

 const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Login failed");
    }

    const data = await res.json();
    const accessToken = data.token;

   // Store token and user data in localStorage
    localStorage.setItem("token", accessToken);

    // Extract user data from response
    const userData = {
      id: data.id,
      nom: data.nom,
      email: data.email,
      tel: data.tel,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));

   // Update state
    setToken(accessToken);
    setUser(userData);

    return true;
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
