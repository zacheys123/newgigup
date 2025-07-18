import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SeedTopicsButton } from "./seedButton";
import { ResetTopicsButton } from "./ResetButton";

export default function TriviaComponent() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Trivia Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <SeedTopicsButton />
          <ResetTopicsButton />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="p-2 bg-blue-100 rounded-full">📊</span>
          Trivia Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Total Questions",
              value: "1,245",
              bg: "bg-blue-50/80",
              border: "border-blue-100",
            },
            {
              title: "Daily Players",
              value: "3,421",
              bg: "bg-green-50/80",
              border: "border-green-100",
            },
            {
              title: "Categories",
              value: "28",
              bg: "bg-yellow-50/80",
              border: "border-yellow-100",
            },
            {
              title: "Avg. Rating",
              value: "4.8",
              bg: "bg-purple-50/80",
              border: "border-purple-100",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} ${stat.border} p-4 rounded-xl border transition-all hover:shadow-md hover:translate-y-[-2px]`}
            >
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form and Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Add Question Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="p-2 bg-green-100 rounded-full">➕</span>
            Add New Question
          </h2>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Question</Label>
              <Input
                placeholder="Enter the question"
                className="focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Category</Label>
              <Input
                placeholder="Enter category"
                className="focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Correct Answer
                </Label>
                <Input
                  placeholder="Correct answer"
                  className="focus-visible:ring-2 focus-visible:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Incorrect Answers
                </Label>
                <Input placeholder="Option 1" />
                <Input placeholder="Option 2" className="mt-2" />
                <Input placeholder="Option 3" className="mt-2" />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-md">
              Add Question
            </Button>
          </div>
        </div>

        {/* Question Management Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="p-2 bg-indigo-100 rounded-full">📝</span>
            Question Management
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="mb-3 sm:mb-0">
                  <p className="font-medium text-gray-900">
                    Question #{item} about science
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Category: Science
                  </p>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 text-gray-700"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="shadow-sm hover:shadow-md"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
