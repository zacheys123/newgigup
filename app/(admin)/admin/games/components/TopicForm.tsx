"use client";
// types/topic.ts
export interface Topic {
  name: string;
  description: string;
  image: string;
  questions: Question[]; // or your specific question type
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createTopic } from "../actions/createTopics";
import TopicCard from "./TopicCard";
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
import { Question } from "@/types/gamesiinterface";

const iconOptions = [
  { label: "Game", value: "gamepad", icon: Gamepad2 },
  { label: "Book", value: "book", icon: BookOpen },
  { label: "Brain", value: "brain", icon: Brain },
  { label: "Music", value: "music", icon: Music2 },
  { label: "Globe", value: "globe", icon: Globe },
  { label: "Science", value: "flask", icon: FlaskConical },
  { label: "Rocket", value: "rocket", icon: Rocket },
  { label: "Coding", value: "code", icon: Code },
  { label: "Security", value: "shield", icon: ShieldCheck },
  { label: "Education", value: "education", icon: GraduationCap },
];

export default function TopicForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("gamepad");
  const [loading, setLoading] = useState(false);

  const topicPreview: Topic = {
    name,
    description,
    image: selectedIcon,
    questions: [],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createTopic(topicPreview);
    setName("");
    setDescription("");
    setSelectedIcon("gamepad");
    setLoading(false);
    location.reload();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md border p-6 space-y-6 max-w-xl"
      >
        <h2 className="text-xl font-semibold">Create New Topic</h2>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Topic Title"
          required
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          rows={3}
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className={`flex flex-col items-center p-2 rounded-md border text-xs ${
                  selectedIcon === value
                    ? "border-blue-500 bg-blue-100 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedIcon(value)}
              >
                <Icon className="h-5 w-5 mb-1" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Topic"}
        </Button>
      </form>

      {/* Live Preview */}
      {(name || description) && (
        <div className="pt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Live Preview:
          </h3>
          <TopicCard topic={topicPreview} />
        </div>
      )}
    </div>
  );
}
