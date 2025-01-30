import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BlogOptionsProps {
  includeResearch: boolean;
  setIncludeResearch: (include: boolean) => void;
  includeImages: boolean;
  setIncludeImages: (include: boolean) => void;
}

export function BlogOptions({
  includeResearch,
  setIncludeResearch,
  includeImages,
  setIncludeImages,
}: BlogOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="research"
          checked={includeResearch}
          onCheckedChange={setIncludeResearch}
        />
        <Label htmlFor="research">Include AI Research</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="images"
          checked={includeImages}
          onCheckedChange={setIncludeImages}
        />
        <Label htmlFor="images">Include AI Generated Images</Label>
      </div>
    </div>
  );
}