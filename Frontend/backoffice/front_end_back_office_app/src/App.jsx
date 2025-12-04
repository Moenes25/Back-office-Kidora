import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";

import AuthLayout from "views/auth";
import ProtectedRoute from "routes/ProtectedRoute";


const App = () => {
  return (
    <Routes>
      {/* AUTH pages */}
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Protected Dashboard */}
      <Route
        path="admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      <Route path="rtl/*" element={<RtlLayout />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
