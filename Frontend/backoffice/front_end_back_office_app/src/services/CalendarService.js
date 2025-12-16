import api from "./api";

export async function getEventCountForWeek(type) {
  const res = await api.get("/evenement/countCurrentWeek", {
    params: { type },
  });
  return res.data;
}

export async function getEventCountToday(type) {
  const res = await api.get("/evenement/countToday", {
    params: { type },
  });
  return res.data;
}

export async function getEventCountByType(type) {
  const res = await api.get("/evenement/countByType", {
    params: { type },
  });
  return res.data;
}

export async function getTotalHeuresPlanifiees(type) {
  const res = await api.get("/evenement/totalHeuresPlanifiees", {
    params: { type },
  });
  return res.data;
}
