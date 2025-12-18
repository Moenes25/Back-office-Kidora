export const normalizeAction = (raw = "") => {
  const text = raw.toLowerCase();

  if (text.includes("creation")) return "CREATE";
  if (text.includes("modification")) return "UPDATE";
  if (text.includes("suppression")) return "DELETE";

  return "OTHER";
};
