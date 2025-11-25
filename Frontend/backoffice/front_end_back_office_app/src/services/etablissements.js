// src/services/etablissements.js
import api from "./api";

export const EtabAPI = {
  create: (payload) => api.post("/etablissement/save", payload),
  list:   () => api.get("/etablissement"),
  update: (id, payload) => api.put(`/etablissement/${id}`, payload),
  remove: (id) => api.delete(`/etablissement/${id}`),
};
