import React from "react";

export default function SwitchField({
  checked = false,
  onChange,
  id,
  iconOn = null,
  iconOff = null,
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      {/* track */}
      <div
        className={`h-6 w-11 rounded-full transition-colors duration-200 ${
          checked ? "bg-gray-300" : "bg-gray-200 dark:bg-navy-600"
        }`}
        aria-hidden
      />
      {/* knob with icon inside */}
      <div
        className={`absolute left-0.5 top-0.5 flex h-5 w-5 transform items-center justify-center rounded-full bg-white text-xs shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
        aria-hidden
      >
        {checked ? iconOn : iconOff}
      </div>
    </label>
  );
}
