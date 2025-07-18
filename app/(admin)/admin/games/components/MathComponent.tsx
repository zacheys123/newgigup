import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MathComponent() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">➕ Difficulty Levels</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {["Elementary", "Intermediate", "Advanced"].map((level) => (
            <div key={level} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{level}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Problems:</span>
                  <span>250</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Time:</span>
                  <span>
                    {level === "Elementary"
                      ? "15s"
                      : level === "Intermediate"
                      ? "25s"
                      : "40s"}
                  </span>
                </div>
                <Button size="sm" className="w-full mt-2">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">⚙️ Problem Generator</h3>
        <div className="space-y-4">
          <div>
            <Label>Problem Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addition">Addition</SelectItem>
                <SelectItem value="subtraction">Subtraction</SelectItem>
                <SelectItem value="multiplication">Multiplication</SelectItem>
                <SelectItem value="division">Division</SelectItem>
                <SelectItem value="algebra">Algebra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Value</Label>
              <input type="range" min="1" max="100" className="w-full" />
            </div>
            <div>
              <Label>Max Value</Label>
              <input type="range" min="10" max="1000" className="w-full" />
            </div>
          </div>

          <div>
            <Label>Number of Problems</Label>
            <input
              type="number"
              min="1"
              max="50"
              defaultValue="10"
              className="border rounded w-full p-2"
            />
          </div>

          <Button>Generate Problems</Button>
        </div>
      </div>
    </div>
  );
}
