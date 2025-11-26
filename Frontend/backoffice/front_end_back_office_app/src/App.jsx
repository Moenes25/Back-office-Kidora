import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import ProtectedRoute from "routes/ProtectedRoute";
import AuthLayout from "views/auth";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route
        path="admin/*"
        element={
          <ProtectedRoute role="SUPER_ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
