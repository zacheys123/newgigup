import { Input } from "../ui/input";
interface PersonalProps {
  firstname: string;
  lastname: string;
}
export default function PersonalInfoSection({
  firstname,
  lastname,
}: PersonalProps) {
  return (
    <div className="space-y-2">
      <span className="text-md font-bold text-gray-300">Personal Info</span>
      <Input
        type="text"
        className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
        value={firstname || ""}
        disabled
      />
      <Input
        type="text"
        className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
        value={lastname || ""}
        disabled
      />
    </div>
  );
}
