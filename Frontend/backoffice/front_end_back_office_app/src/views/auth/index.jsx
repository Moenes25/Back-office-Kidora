import { Routes, Route } from "react-router-dom";
import ResetPassword from "./RestPassword";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import VerifyCode from "./VerifyCode";


export default function AuthLayout() {
  return (
    <Routes>
      <Route path="verify" element={<VerifyCode />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="login" element={<Login />} />
     
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}


