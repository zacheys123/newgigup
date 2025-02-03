import { Input } from "../ui/input";
interface PersonalProps {
  email: string;
  username: string;
}
export default function AuthorizationInfoSection({
  email,
  username,
}: PersonalProps) {
  return (
    <div className="space-y-2">
      <span className="text-md font-bold text-gray-300">
        Authorization Info
      </span>
      <Input
        type="text"
        className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
        value={email || ""}
        disabled
      />
      <Input
        type="text"
        className="w-full bg-transparent border-none text-[12px] focus:ring-0 text-white"
        value={username || ""}
        disabled
      />
    </div>
  );
}
