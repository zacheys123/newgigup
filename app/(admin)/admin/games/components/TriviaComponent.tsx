"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopicForm } from "./TopicForm";
import { Label } from "@/components/ui/label";
import { createTopic } from "../actions/createTopics";
import { toast } from "sonner";
import { X } from "lucide-react";

const fallbackTopics = [
  "Geography",
  "History",
  "Science",
  "Movies",
  "Music",
  "Sports",
  "Literature",
  "Technology",
  "Food & Drink",
  "Animals",
  "Art",
];

export default function TriviaComponent() {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isCreatingNewTopic, setIsCreatingNewTopic] = useState(false);

  const handleCreateTopic = async (data: {
    name: string;
    description: string;
    icon: string;
    questions: {
      question: string;
      correctAnswer: string;
      otherGuesses: string[];
      timeLimit: number;
    }[];
  }) => {
    try {
      const myData = { ...data, selectedTopic };
      await createTopic(myData);
      toast("Topic created successfully");
      setIsCreatingNewTopic(false);
      // You might want to refresh your topics list here
    } catch (error) {
      toast("Failed to create topic");
      throw error;
    }
  };
  const handleReset = () => {
    setSelectedTopic(""); // Reset to empty string to show placeholder
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 lg:p-10 shadow-lg dark:shadow-xl dark:shadow-gray-800/10">
      {/* Topic Selection */}
      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Select Topic
        </Label>
        <div className="flex items-center gap-2">
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="flex-1 min-w-[130px]">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {fallbackTopics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTopic && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </Button>
          )}{" "}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreatingNewTopic(!isCreatingNewTopic)}
          >
            {isCreatingNewTopic ? "Cancel" : "Add New"}
          </Button>
        </div>
      </div>

      {isCreatingNewTopic && (
        <div className="space-y-8">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xl">
                ➕
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100">
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 bg-clip-text text-transparent">
                    New Topic Creation
                  </span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
                  Add a new topic with associated questions
                </p>
              </div>
            </div>
          </div>

          <TopicForm
            onSubmit={handleCreateTopic}
            onCancel={() => setIsCreatingNewTopic(false)}
            selectedTopic={selectedTopic}
          />
        </div>
      )}
    </div>
  );
}
