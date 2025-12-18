// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const [loading, setLoading] = useState(false);

//   const API_URL = process.env.REACT_APP_API_URL;

//   const isLoggedIn = !!token;

//   // -------------------------
//   // LOGIN
//   // -------------------------
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) throw new Error(await res.text());

//       const data = await res.json();

//       const accessToken = data.token;
//       localStorage.setItem("token", accessToken);

//       const userData = {
//         id: data.id,

//       };

//       localStorage.setItem("user", JSON.stringify(userData));
//       setToken(accessToken);
//       setUser(userData);

//       return true;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------
//   // UPDATE USER LOCALLY
//   // After updating profile in backend
//   // -------------------------
//   const updateUser = (newUserData) => {
//     const updated = { ...user, ...newUserData };

//     localStorage.setItem("user", JSON.stringify(updated));
//     setUser(updated);
//   };

//   // -------------------------
//   // LOGOUT
//   // -------------------------
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     setUser(null);
//     window.location.href = "/auth/login";
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         user,
//         isLoggedIn,
//         login,
//         logout,
//         updateUser,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import api from "services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token;

  // ==================================================
  // LOAD USER FROM API (ON REFRESH / FIRST LOAD)
  // ==================================================
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Auth expired:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ==================================================
  // LOGIN
  // ==================================================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      setToken(data.token);
      // user will be fetched automatically by useEffect
      return true;
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UPDATE USER LOCALLY (AFTER PROFILE UPDATE)
  // ==================================================
  const updateUser = (newUserData) => {
    setUser((prev) => ({
      ...prev,
      ...newUserData,
    }));
  };

  // ==================================================
  // LOGOUT
  // ==================================================
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
