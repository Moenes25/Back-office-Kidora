import React from "react";
import Dropdown from "components/dropdown";
import avatar from "assets/img/avatars/avatar4.png";

const ProfileDropdown = () => {
  return (
    <Dropdown
      button={<img src={avatar} className="rounded-full w-11 h-11 z-100" alt="avatar" />}
      classNames="py-2 top-8 -left-[180px] w-max text-gray-900 "
      children={
        <div className="flex flex-col w-56 bg-white shadow-xl rounded-2xl dark:bg-navy-700 dark:text-white">
          <div className="p-4">
            <p className="text-sm font-bold">👋 Hey, Adela</p>
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-white/20" />

          <div className="flex flex-col p-4">
            <a href="/admin/profile" className="text-sm">Profile Settings</a>
            <a href="/admin/profile#settings" className="mt-3 text-sm">Newsletter Settings</a>
            <a href="/admin/profile#activity" className="mt-3 text-sm font-medium text-red-500">Log Out</a>
          </div>
        </div>
      }
    />
  );
};

export default ProfileDropdown;
