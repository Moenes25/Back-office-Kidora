import { Routes, Route } from "react-router-dom";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./RestPassword";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";


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


