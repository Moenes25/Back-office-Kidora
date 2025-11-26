import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as mockApi from "api/mockAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await mockApi.login({ email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);

      navigate("/admin");
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "api/api";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user") || "null")
//   );
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(false);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       const res = await api.post("/login", { email, password });

//       const accessToken = res.data.accessToken || res.data.token;

//       const userData = res.data.user;

//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("user", JSON.stringify(userData));

//       setToken(accessToken);
//       setUser(userData);

//       navigate("/admin");
//     } catch (err) {
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setToken(null);
//     navigate("/auth/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         loading,
//         isAuthenticated: !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
