import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogSettingsProps {
  tone: string;
  setTone: (tone: string) => void;
  wordCount: string;
  setWordCount: (count: string) => void;
}

export function BlogSettings({ tone, setTone, wordCount, setWordCount }: BlogSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tone">Writing Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="humorous">Humorous</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wordCount">Word Count</Label>
        <Select value={wordCount} onValueChange={setWordCount}>
          <SelectTrigger>
            <SelectValue placeholder="Select word count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300">300 words</SelectItem>
            <SelectItem value="500">500 words</SelectItem>
            <SelectItem value="750">750 words</SelectItem>
            <SelectItem value="1000">1000 words</SelectItem>
            <SelectItem value="1500">1500 words</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}