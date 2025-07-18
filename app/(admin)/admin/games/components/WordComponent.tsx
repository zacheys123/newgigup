import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WordsComponent() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">🔠 Word Packs</h3>

        <div className="mb-6">
          <Label>Create New Word Pack</Label>
          <div className="flex gap-2 mt-2">
            <Input placeholder="Pack name" className="flex-1" />
            <Button>Create</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Easy", "Medium", "Hard"].map((difficulty) => (
            <div key={difficulty} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{difficulty} Level</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Word Count: 150</span>
                  <Button size="sm" variant="outline">
                    Add Words
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Updated: 2 days ago</span>
                  <Button size="sm" variant="destructive">
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">📊 Game Settings</h3>
        <div className="space-y-4">
          <div>
            <Label>Time Limit (seconds)</Label>
            <Input type="number" defaultValue="60" />
          </div>
          <div>
            <Label>Points per Word</Label>
            <Input type="number" defaultValue="100" />
          </div>
          <div>
            <Label>Bonus Multiplier</Label>
            <Input type="number" defaultValue="1.5" step="0.1" />
          </div>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
