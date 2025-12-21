import { FiUsers, FiActivity, FiStar } from "react-icons/fi";

export const statsConfig = [  
  {
    key: "admins",
    label: "Admins",
    icon: <FiUsers />,
    gradient: "from-purple-500 to-purple-300",
  },
  {
    key: "entreprises",
    label: "Entreprises",
    icon: <FiActivity />,
    gradient: "from-blue-400 to-blue-200",
  },
  {
    key: "activityScore",
    label: "Activity Score",
    format: (v) => `${v}%`,
    icon: <FiStar />,
    gradient: "from-yellow-400 to-yellow-200",
  },
];
