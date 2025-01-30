import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { initializeOpenAI, generateBlogContent } from "@/utils/openai";

export function BlogForm({ onBlogGenerated }: { onBlogGenerated: (content: string) => void }) {
  const [topic, setTopic] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [includeResearch, setIncludeResearch] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
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

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!isApiKeySet) {
      toast({
        title: "API Key Required",
        description: "Please set your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateBlogContent(topic, originalContent, includeResearch);
      onBlogGenerated(generatedContent);
      toast({
        title: "Blog Generated!",
        description: "Your SEO-optimized blog post has been created.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {!isApiKeySet && (
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
        )}

        <div className="space-y-2">
          <Label htmlFor="topic">Blog Topic</Label>
          <Input
            id="topic"
            placeholder="Enter your blog topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Original Content (Optional)</Label>
          <Textarea
            id="content"
            placeholder="Enter any original content or ideas..."
            className="min-h-[100px]"
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="research"
            checked={includeResearch}
            onCheckedChange={setIncludeResearch}
          />
          <Label htmlFor="research">Include AI Research</Label>
        </div>

        <Button
          className="w-full"
          onClick={generateBlog}
          disabled={isGenerating || !isApiKeySet}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Blog...
            </>
          ) : (
            "Generate SEO-Optimized Blog"
          )}
        </Button>
      </div>
    </Card>
  );
}