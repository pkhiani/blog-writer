import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BlogSettingsProps {
  tones: string[];
  setTones: (tones: string[]) => void;
  wordCount: string;
  setWordCount: (count: string) => void;
}

export function BlogSettings({ tones, setTones, wordCount, setWordCount }: BlogSettingsProps) {
  const handleTonesChange = (values: string[]) => {
    setTones(values);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tone">Writing Tones (Select multiple)</Label>
        <ToggleGroup
          type="multiple"
          value={tones}
          onValueChange={handleTonesChange}
          className="flex flex-wrap gap-2"
        >
          <ToggleGroupItem value="professional" aria-label="Professional tone">
            Professional
          </ToggleGroupItem>
          <ToggleGroupItem value="casual" aria-label="Casual tone">
            Casual
          </ToggleGroupItem>
          <ToggleGroupItem value="formal" aria-label="Formal tone">
            Formal
          </ToggleGroupItem>
          <ToggleGroupItem value="friendly" aria-label="Friendly tone">
            Friendly
          </ToggleGroupItem>
          <ToggleGroupItem value="humorous" aria-label="Humorous tone">
            Humorous
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wordCount">Word Count</Label>
        <Select value={wordCount} onValueChange={setWordCount}>
          <SelectTrigger>
            <SelectValue placeholder="Select word count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="250">250 words</SelectItem>
            <SelectItem value="500">500 words</SelectItem>
            <SelectItem value="1000">1000 words</SelectItem>
            <SelectItem value="2500">2500 words</SelectItem>
            <SelectItem value="5000">5000 words</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}