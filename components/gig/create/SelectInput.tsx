import { Label } from "flowbite-react";

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) => (
  <div className={className}>
    {label && <Label className="text-neutral-400 text-[12px]">{label}</Label>}
    <select
      className={`appearance-none w-full p-2 rounded-md bg-neutral-800 text-gray-300 border-neutral-700 focus:ring-0 text-sm mt-1 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
export default SelectInput;
