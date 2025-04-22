const SectionContainer = ({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-neutral-800/50 rounded-lg p-4">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        {icon} {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);
export default SectionContainer;
