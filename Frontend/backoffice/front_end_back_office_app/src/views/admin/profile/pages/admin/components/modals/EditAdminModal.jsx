import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import api from "services/api";

const EditAdminModal = ({ admin, onClose, onEditSuccess }) => {
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState(admin.password);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    try {
      const res = await api.put(`/auth/update-profile/${admin.idUser}`, {
        password,
        email,
      });

      onEditSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="p-6 space-y-4 bg-white shadow-xl w-80 rounded-xl">
        <h3 className="mb-8 text-lg font-bold text-center gradient-text">
          Edit {admin.nom}
        </h3>

        <div className="relative w-full">
          <MdMail
            size={20}
            className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full py-4 pl-12 pr-4 text-gray-700 bg-transparent border border-gray-600 outline-none peer rounded-xl"
          />

          <label
            htmlFor="forgot-email"
            className="absolute px-1 text-gray-600 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-600 peer-focus:top-0 peer-focus:text-sm peer-focus:text-gray-600"
          >
            Enter your email
          </label>
        </div>



        

        <div className="relative w-full">
          <FaLock className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2" />

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full py-4 pl-12 pr-8 text-gray-700 bg-transparent border border-gray-300 outline-none peer rounded-xl"
          />

          <label
            htmlFor="login-password"
            className="absolute px-1 text-gray-600 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-sm peer-valid:text-gray-600 peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-600"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 right-3 top-5"
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-red-500" />
            ) : (
              <IoEyeOutline className="text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded underline-offset-2 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-purple-600 to-yellow-500 hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
