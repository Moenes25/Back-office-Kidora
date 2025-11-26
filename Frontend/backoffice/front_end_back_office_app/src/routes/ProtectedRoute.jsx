import { useAuth } from "context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const auth = useAuth();
  if (!auth) return null;

  const { user, isAuthenticated } = auth;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (role && user?.role !== role)
    return <Navigate to="/auth/not-authorized" replace />;

  return children;
}

// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, role }) {
//   const { user, isAuthenticated } = useAuth();

//   // Not logged in
//   if (!isAuthenticated) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   // Has role limitation (like superadmin)
//   if (role && user?.role !== role) {
//     return <Navigate to="/auth/not-authorized" replace />;
//   }

//   return children;
// }
