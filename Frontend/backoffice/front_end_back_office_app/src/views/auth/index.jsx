import { Routes, Route } from "react-router-dom";
import Login from "views/auth/Login";
import Register from "views/auth/Register";

export default function AuthLayout() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}
