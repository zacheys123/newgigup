export function RoleStatusCard({
  title,
  value,
  format,
  trend,
}: {
  title?: string;
  value: number;
  trend?: string;
  //   max: number;
  //   icon: React.ReactNode;
  format?: string;
}) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value} <span className="text-xs text-gray-500">{format}</span>
          </p>
        </div>
        <div className="p-2 rounded-full bg-gray-800">{trend}</div>
      </div>
      <div className="mt-3"></div>
    </div>
  );
}
