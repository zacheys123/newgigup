import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
  Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  Icon?: ReactNode;
}) => (
  <div className={className}>
    <Label className="text-neutral-600 text-[12px]">{label}</Label>
    <div className={Icon ? "flex items-center gap-2" : ""}>
      {Icon}
      <Input
        className={`bg-neutral-800 border-neutral-700 text-white mt-1 text-[12px] ${
          disabled ? "opacity-70" : ""
        } ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  </div>
);

export default TextInput;
