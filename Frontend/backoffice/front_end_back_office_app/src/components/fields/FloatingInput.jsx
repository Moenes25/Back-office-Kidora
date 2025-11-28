import React from "react";

export default function FloatingInput({
  id,
  label,
  value = "",
  onChange,
  type = "text",
  icon = null,
  className = "",
  inputClass = "",
  required = false,
  name,
  ...rest
}) {
  const inputName = name ?? id;
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={inputName}
        type={type}
        placeholder=" " // required for peer-placeholder-shown
        value={value}
        onChange={onChange}
        required={required}
        className={[
          "peer w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition",
          icon ? "pl-10" : "pl-3",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          "dark:border-navy-700 dark:bg-navy-800 dark:focus:ring-navy-600",
          inputClass,
        ].join(" ")}
        {...rest}
      />
      <label
        htmlFor={id}
        className={[
          // base: maintain inline inside input and center vertically
          "pointer-events-none absolute select-none transition-opacity duration-200",
          "top-1/2 -translate-y-1/2", // center vertically (no translate on focus)
          icon ? "left-10" : "left-3",
          "text-sm text-gray-400",
          // hide when focused or when value present
          hasValue ? "opacity-0" : "opacity-100",
          "peer-focus:opacity-0",
        ].join(" ")}
      >
        {label}
      </label>
    </div>
  );
}
