/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes }) {
  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  return routes.map((route, index) => {
    if (
      route.layout === "/admin" ||
      route.layout === "/auth" ||
      route.layout === "/rtl"
    ) {
      const isActive = activeRoute(route.path);

      return (
        <Link key={index} to={route.layout + "/" + route.path}>
          <div
            className={`
              group relative mb-3 flex items-center 
              px-6 py-2 rounded-xl
              transition-all duration-300 
              hover:translate-x-2
              hover:bg-gradient-to-r 
              hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50
              dark:hover:from-navy-700/30 dark:hover:via-navy-600/20 dark:hover:to-navy-700/30
              ${isActive ? "bg-indigo-50 dark:bg-navy-700/40" : ""}
            `}
          >
            {/* Ligne active animée */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-blue-500 animate-pulse"></div>
            )}

            <li className="flex items-center cursor-pointer">
              {/* Icône animée */}
              <span
                className={`
                  text-xl transition-all duration-300 group-hover:scale-110 
                  group-hover:translate-x-1
                  ${isActive ? "text-indigo-600 dark:text-white" : "text-gray-600 dark:text-gray-300"}
                `}
              >
                {route.icon ? route.icon : <DashIcon />}
              </span>

              {/* Titre */}
              <p
                className={`
                  ml-4 text-sm transition-all duration-300 
                  group-hover:text-indigo-600 dark:group-hover:text-white 
                  ${isActive ? "font-bold text-indigo-600 dark:text-white" : "text-gray-600 dark:text-gray-300"}
                `}
              >
                {route.name}
              </p>
            </li>

            {/* Effet Glow au hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 
              bg-gradient-to-r from-indigo-500 to-blue-400 
              blur-xl transition-all duration-500 pointer-events-none">
            </div>
          </div>
        </Link>
      );
    }
  });
}

export default SidebarLinks;
