import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { generateBlogContent } from "@/utils/openai";
import { ApiKeyInput } from "./blog/ApiKeyInput";
import { BlogSettings } from "./blog/BlogSettings";
import { BlogOptions } from "./blog/BlogOptions";

export function BlogForm({ onBlogGenerated }: { onBlogGenerated: (content: string) => void }) {
  const [topic, setTopic] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [includeResearch, setIncludeResearch] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [tones, setTones] = useState<string[]>(["professional"]);
  const [wordCount, setWordCount] = useState("500");
  const [includeImages, setIncludeImages] = useState(false);
  const { toast } = useToast();

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

    if (tones.length === 0) {
      toast({
        title: "Tone Required",
        description: "Please select at least one writing tone.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateBlogContent(
        topic,
        originalContent,
        includeResearch,
        tones.join(", "),
        parseInt(wordCount),
        includeImages
      );
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
          <ApiKeyInput
            apiKey={apiKey}
            setApiKey={setApiKey}
            setIsApiKeySet={setIsApiKeySet}
          />
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

        <BlogSettings
          tones={tones}
          setTones={setTones}
          wordCount={wordCount}
          setWordCount={setWordCount}
        />

        <BlogOptions
          includeResearch={includeResearch}
          setIncludeResearch={setIncludeResearch}
          includeImages={includeImages}
          setIncludeImages={setIncludeImages}
        />

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