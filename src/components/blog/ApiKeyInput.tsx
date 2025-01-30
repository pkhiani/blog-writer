import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { initializeOpenAI } from "@/utils/openai";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  setIsApiKeySet: (isSet: boolean) => void;
}

export function ApiKeyInput({ apiKey, setApiKey, setIsApiKeySet }: ApiKeyInputProps) {
  const { toast } = useToast();

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    try {
      initializeOpenAI(apiKey);
      setIsApiKeySet(true);
      toast({
        title: "API Key Set",
        description: "Your OpenAI API key has been configured successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="apiKey">OpenAI API Key</Label>
      <Input
        id="apiKey"
        type="password"
        placeholder="Enter your OpenAI API key..."
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <Button onClick={handleApiKeySubmit} className="w-full">
        Set API Key
      </Button>
    </div>
  );
}