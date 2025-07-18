import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Slider } from "./Slider";

export default function BearComponent() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">🐻 Bear Customization</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Bear Appearance</h4>
            <div className="space-y-4">
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA"].map(
                    (color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>

              <div>
                <Label>Size</Label>
                <Slider
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Accessories</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["🎩", "👓", "🎀", "🧣", "⌚"].map((acc) => (
                    <span
                      key={acc}
                      className="text-2xl cursor-pointer hover:scale-125 transition"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <span className="text-8xl">🐻</span>
              <span className="text-3xl absolute -top-4 -right-4">🎩</span>
            </div>
            <p className="mt-4 text-gray-600">Preview</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">🍯 Food Items</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { emoji: "🍎", points: 10 },
            { emoji: "🍯", points: 50 },
            { emoji: "🍌", points: 15 },
            { emoji: "🍓", points: 20 },
            { emoji: "🍕", points: 30 },
          ].map((food, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 flex flex-col items-center"
            >
              <span className="text-3xl">{food.emoji}</span>
              <span className="text-sm mt-1">{food.points} pts</span>
              <Button variant="outline" size="sm" className="mt-2">
                Edit
              </Button>
            </div>
          ))}
          <div className="border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center">
            <span className="text-2xl">+</span>
            <span className="text-sm mt-1">Add New</span>
          </div>
        </div>
      </div>
    </div>
  );
}
