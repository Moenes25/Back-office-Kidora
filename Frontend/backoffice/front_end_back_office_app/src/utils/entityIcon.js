import { FaBuilding, FaCalendarAlt } from "react-icons/fa";

export const ENTITY_CONFIG = {
  Etablissement: {
    label: "Entreprise",
    // icon: <FaBuilding className="text-purple-500" />,
  },
  Evenement: {
    label: "Event",
    // icon: <FaCalendarAlt className="text-orange-500" />,
  },
};

export const getEntityData = (entity) =>
  ENTITY_CONFIG[entity] || null;
