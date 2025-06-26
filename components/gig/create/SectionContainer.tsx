const SectionContainer = ({
  icon,
  title,
  children,
  action,
  onClickHeader,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  onClickHeader?: () => void;
}) => (
  <div className="bg-neutral-800/50 rounded-lg p-4">
    <div
      className="flex justify-between items-center mb-4"
      onClick={() => (onClickHeader ? onClickHeader() : null)}
    >
      <h2 className="text-lg font-bold text-neutral-200 flex items-center gap-2">
        {icon} {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);
export default SectionContainer;
