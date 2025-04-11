import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <Label className="text-neutral-400 text-[12px]">{label}</Label>
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
);

export default TextInput;
