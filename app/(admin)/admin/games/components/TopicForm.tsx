"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, MinusIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface Question {
  question: string;
  correctAnswer: string;
  otherGuesses: string[];
  timeLimit: number;
}

interface TopicFormProps {
  initialData?: {
    name: string;
    description: string;
    icon: string;
    questions: Question[];
  };
  onSubmit: (data: {
    name: string;
    description: string;
    icon: string;
    questions: Question[];
  }) => Promise<void>;

  onCancel?: () => void;
  selectedTopic: string;
}

const defaultInitialData = {
  name: "",
  description: "",
  icon: "",
  questions: [
    {
      question: "",
      correctAnswer: "",
      otherGuesses: ["", "", ""],
      timeLimit: 30,
    },
  ],
};

export function TopicForm({
  initialData = defaultInitialData,
  onSubmit,
  onCancel,
  selectedTopic,
}: TopicFormProps) {
  const [formData, setFormData] = useState(initialData);

  // Handle text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle question text changes
  const handleTextChange = (
    qIndex: number,
    field: keyof Question,
    value: string
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle number changes (like timeLimit)
  const handleNumberChange = (
    qIndex: number,
    field: keyof Question,
    value: number
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle option changes for incorrect answers
  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].otherGuesses[oIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Add a new question to the form
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          correctAnswer: "",
          otherGuesses: ["", "", ""],
          timeLimit: 30,
        },
      ],
    }));
  };

  // Remove a question from the form
  const removeQuestion = (index: number) => {
    if (formData.questions.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // Add an incorrect option to a question
  const addOption = (qIndex: number) => {
    if (formData.questions[qIndex].otherGuesses.length >= 5) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].otherGuesses.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Remove an incorrect option from a question
  const removeOption = (qIndex: number, oIndex: number) => {
    if (formData.questions[qIndex].otherGuesses.length <= 3) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].otherGuesses.splice(oIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      toast("Topic saved successfully");
    } catch (error) {
      console.log(error);
      toast("Failed to save topic");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Topic Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {!selectedTopic && (
          <div className="space-y-3">
            <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Topic Name*
            </Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter topic name"
              className="text-base sm:text-lg font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors"
            />
          </div>
        )}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Topic Icon
          </Label>
          <Input
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="e.g., 🌍"
            className="text-base sm:text-lg font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Topic Description
        </Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of this topic"
          rows={2}
          className="text-base font-light bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors min-h-[100px]"
        />
      </div>

      {/* Questions Section */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
              Questions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add all related questions for this topic
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addQuestion}
            className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1.5 text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {formData.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Question {qIndex + 1}
                </span>
                {formData.questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 text-xs"
                  >
                    <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Question Content */}
              <div className="space-y-5">
                {/* Question Text */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Question Text*
                  </Label>
                  <Input
                    value={question.question}
                    onChange={(e) =>
                      handleTextChange(qIndex, "question", e.target.value)
                    }
                    required
                    placeholder="Enter the question"
                    className="text-base font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors"
                  />
                </div>

                {/* Answer & Time Limit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Correct Answer*
                    </Label>
                    <Input
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleTextChange(
                          qIndex,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Correct answer"
                      className="text-base font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Time Limit
                    </Label>
                    <Select
                      value={question.timeLimit.toString()}
                      onValueChange={(value) =>
                        handleNumberChange(qIndex, "timeLimit", parseInt(value))
                      }
                    >
                      <SelectTrigger className="text-base font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 h-auto focus:ring-0 focus:border-green-500 dark:focus:border-green-400">
                        <SelectValue placeholder="Select time limit" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        {[15, 30, 45, 60].map((time) => (
                          <SelectItem
                            key={time}
                            value={time.toString()}
                            className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {time} seconds
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Incorrect Options */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Incorrect Options*
                  </Label>
                  <div className="space-y-3">
                    {question.otherGuesses.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          required
                          placeholder={`Incorrect option ${oIndex + 1}`}
                          className="text-base font-light bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-green-500 dark:focus-visible:border-green-400 transition-colors flex-1"
                        />
                        {oIndex >= 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
                          >
                            <MinusIcon className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {question.otherGuesses.length < 4 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addOption(qIndex)}
                        className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 mt-1 px-2 py-1 text-xs"
                      >
                        <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
                        Add Option
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="order-2 sm:order-1 w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-2 text-sm"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="order-1 sm:order-2 w-full sm:w-auto px-8 py-2.5 text-sm bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 dark:from-green-700 dark:to-teal-700 dark:hover:from-green-600 dark:hover:to-teal-600 shadow-md transition-all hover:shadow-lg"
        >
          {initialData === defaultInitialData ? "Create Topic" : "Update Topic"}
        </Button>
      </div>
    </form>
  );
}
