import React from "react";

export default function FloatingSelect({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  className = "",
  required = false,
  ...rest
}) {
  const selectName = name ?? id;
  return (
    <div className={`relative ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 block select-none text-xs font-semibold text-gray-500"
      >
        {label}
      </label>
      <select
        id={id}
        name={selectName}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-navy-700 dark:bg-navy-800"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}
