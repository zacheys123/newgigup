import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ToggleSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center justify-between">
    <Label className="text-neutral-400">{label}</Label>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-rose-600"
    />
  </div>
);
export default ToggleSwitch;
