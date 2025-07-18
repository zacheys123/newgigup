import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmojiComponent() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">🤔 Emoji Puzzles</h3>

        <div className="mb-6">
          <Label>Create New Puzzle</Label>
          <div className="space-y-4 mt-2">
            <Input placeholder="Emoji sequence (e.g., 🍎📱💻)" />
            <Input placeholder="Answer (e.g., Apple products)" />
            <div className="flex gap-2">
              <Input
                placeholder="Difficulty (1-5)"
                type="number"
                className="w-24"
              />
              <Input placeholder="Category" />
            </div>
            <Button>Add Puzzle</Button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Puzzle Library</h4>
          <div className="space-y-3">
            {[
              { emoji: "🐦🔥", answer: "Angry Birds", difficulty: 2 },
              { emoji: "👑🦁", answer: "Lion King", difficulty: 3 },
              { emoji: "🚀🌕", answer: "Space travel", difficulty: 4 },
            ].map((puzzle, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <p className="text-2xl">{puzzle.emoji}</p>
                  <p className="text-sm text-gray-500">
                    {puzzle.answer} • Difficulty: {puzzle.difficulty}/5
                  </p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">📊 Categories</h3>
        <div className="flex flex-wrap gap-2">
          {["Movies", "Food", "Animals", "Tech", "Sports", "Music"].map(
            (category) => (
              <span
                key={category}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {category}
              </span>
            )
          )}
          <Button variant="outline" size="sm">
            + Add Category
          </Button>
        </div>
      </div>
    </div>
  );
}
