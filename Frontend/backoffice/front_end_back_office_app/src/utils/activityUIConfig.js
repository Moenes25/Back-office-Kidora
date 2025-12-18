import { FaPlus, FaEdit, FaTrash, FaCog } from "react-icons/fa";

export const ACTION_UI = {
  CREATE: {
    label: "Created",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    icon: <FaPlus />,
  },
  UPDATE: {
    label: "Updated",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    dot: "bg-yellow-500",
    icon: <FaEdit />,
  },
  DELETE: {
    label: "Deleted",
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    icon: <FaTrash />,
  },
  OTHER: {
    label: "Action",
    color: "text-gray-600",
    bg: "bg-gray-50",
    dot: "bg-gray-500",
    icon: <FaCog />,
  },
};
