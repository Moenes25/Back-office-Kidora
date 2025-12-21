import { statsConfig } from "utils/statsConfig";
import StatsCard from "./StatsCard";


export default function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsConfig.map((item) => (
        <StatsCard
          key={item.key}
          label={item.label}
          value={
            item.format
              ? item.format(stats[item.key])
              : stats[item.key]
          }
          icon={item.icon}
          gradient={item.gradient}
        />
      ))}
    </div>
  );
}
