import api from "./api";


export const getAllActivities = async () => {
  const { data } = await api.get("/activity/all");
  return data;
};
