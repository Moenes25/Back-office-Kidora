import { Routes, Route } from "react-router-dom";
import Login from "views/auth/Login";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./ResetPassword";

export default function AuthLayout() {
  return (
    <Routes>
      <Route path="auth/verify" element={<VerifyCode />} />
      <Route path="auth/reset-password" element={<ResetPassword />} />
      <Route path="login" element={<Login />} />
     
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}


