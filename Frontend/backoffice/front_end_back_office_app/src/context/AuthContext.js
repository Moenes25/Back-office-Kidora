// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(localStorage.getItem("token"));
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token;

  // ---- petit helper pour décoder un JWT (sans lib)
  const decodeJwt = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      return payload || null;
    } catch {
      return null;
    }
  };

  // ==============================================
  // CHARGER L'UTILISATEUR AU DEMARRAGE
  // ==============================================
  useEffect(() => {
    const run = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) { setLoading(false); return; }

      // Met le header Authorization par défaut
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;

      // Si pas d'userId stocké, on le récupère depuis le token
      let userId = localStorage.getItem("userId");
      if (!userId || userId === "undefined" || userId === "null") {
        const payload = decodeJwt(storedToken);
        if (payload?.id) {
          userId = payload.id;
          localStorage.setItem("userId", payload.id);
          // hydrate un minimum l'état user
          setUser({
            id: payload.id,
            email: payload.username || payload.sub,
            role: payload.role,
          });
        }
      }

      // Si on a un id valide, on peut tenter d’enrichir depuis l’API
      if (userId && userId !== "undefined" && userId !== "null") {
        try {
          const res = await api.get(`/auth/${userId}`);
          setUser(res.data); // enrichissement
        } catch (e) {
          // Laisse l’interceptor gérer un vrai 401 ; ici on log seulement
          console.error("Fetch user failed:", e);
        }
      }

      setLoading(false);
    };

    run();
  }, [token]);

  // ==============================================
  // LOGIN
  // ==============================================
  const login = async (email, password) => {
    setLoading(true);
    try {
      // tu peux garder fetch, mais autant utiliser ton client axios :
      const res = await api.post(`/auth/login`, { email, password });
      const { token: jwt } = res.data;

      if (!jwt) throw new Error("Token manquant");

      // Décoder pour extraire l'id
      const payload = decodeJwt(jwt);
      if (!payload?.id) throw new Error("ID manquant dans le token");

      // Persist
      localStorage.setItem("token", jwt);
      localStorage.setItem("userId", payload.id);

      // Mettre à jour l'état + header par défaut
      setToken(jwt);
      api.defaults.headers.Authorization = `Bearer ${jwt}`;

      // Hydrate un minimum l'utilisateur tout de suite
      setUser({
        id: payload.id,
        email: payload.username || payload.sub || email,
        role: payload.role,
      });

      // (optionnel) L'enrichissement complet se fera au useEffect
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ==============================================
  // UPDATE USER LOCAL
  // ==============================================
  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  // ==============================================
  // LOGOUT
  // ==============================================
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
