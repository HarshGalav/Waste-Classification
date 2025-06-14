interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
  }
  
  export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-dark-muted text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-dark-text mt-1">{value}</p>
            {trend && (
              <p className="text-green-400 text-xs mt-1">{trend}</p>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg">
            {icon}
          </div>
        </div>
      </div>
    );
  }