import Card from "components/card";

const Widget = ({ icon, title, subtitle }) => {
  return (
    <Card
      extra="
        group relative overflow-hidden
        !flex-row flex-grow items-center rounded-[20px]
        bg-white/80 dark:bg-navy-800
        shadow-md
        transform transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl
      "
    >
      {/* Light gradient glow on hover */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r from-brand-500/5 via-transparent to-brand-500/10
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
      />

      {/* Icon */}
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div
          className="
            relative rounded-2xl
            bg-gradient-to-tr from-brand-500/10 via-white to-brand-500/30
            dark:from-navy-700 dark:via-navy-800 dark:to-brand-500/20
            p-3
            shadow-inner shadow-brand-500/20
            transform transition-transform duration-300
            group-hover:scale-110 group-hover:rotate-3
          "
        >
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
          {/* small glow dot */}
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </div>
      </div>

      {/* Texts */}
      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p
          className="
            font-dm text-xs font-medium uppercase tracking-wide
            text-gray-500 dark:text-gray-400
            transition-transform duration-300
            group-hover:translate-y-[-1px]
          "
        >
          {title}
        </p>
        <h4
          className="
            text-2xl font-extrabold
            bg-gradient-to-r from-navy-700 to-brand-500
            bg-clip-text text-transparent
            dark:from-white dark:to-brand-400
            transition-transform duration-300
            group-hover:translate-y-[1px]
          "
        >
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default Widget;
