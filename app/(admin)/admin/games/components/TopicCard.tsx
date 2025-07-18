import {
  BookOpen,
  Brain,
  Gamepad2,
  Music2,
  Globe,
  Rocket,
  Code,
  ShieldCheck,
  GraduationCap,
  FlaskConical,
} from "lucide-react";
import { Topic } from "./TopicForm";

const iconMap = {
  gamepad: Gamepad2,
  book: BookOpen,
  brain: Brain,
  music: Music2,
  globe: Globe,
  flask: FlaskConical,
  rocket: Rocket,
  code: Code,
  shield: ShieldCheck,
  education: GraduationCap,
};

export default function TopicCard({ topic }: { topic: Topic }) {
  const Icon = iconMap[topic.image as keyof typeof iconMap] || Gamepad2;

  return (
    <div className="bg-white border shadow-sm rounded-lg p-4 flex items-start gap-4">
      <Icon className="w-6 h-6 text-blue-500 mt-1" />
      <div>
        <h3 className="font-semibold text-lg">{topic.name}</h3>
        <p className="text-sm text-gray-600">{topic.description}</p>
      </div>
    </div>
  );
}
