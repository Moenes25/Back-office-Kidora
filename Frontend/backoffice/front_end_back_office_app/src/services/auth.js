import axios from "axios";

export const updateSuperAdminPassword = async ({ currentPassword, newPassword }, token) => {
  try {
    const response = await axios.put(
      "/superadmin/update-password",
      null,
      {
        params: { oldPassword: currentPassword, newPassword },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Something went wrong";
  }
};
