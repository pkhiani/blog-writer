import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Unlock } from "lucide-react";
import { generateBlogContent, initializeOpenAI } from "@/utils/openai";
import { BlogSettings } from "./blog/BlogSettings";
import { BlogOptions } from "./blog/BlogOptions";
import { supabase } from "@/integrations/supabase/client";

export function BlogForm({ onBlogGenerated }: { onBlogGenerated: (content: string) => void }) {
  const [topic, setTopic] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [includeResearch, setIncludeResearch] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpenAIInitialized, setIsOpenAIInitialized] = useState(false);
  const [tones, setTones] = useState<string[]>(["professional"]);
  const [wordCount, setWordCount] = useState("500");
  const [includeImages, setIncludeImages] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initOpenAI = async () => {
      const success = await initializeOpenAI();
      setIsOpenAIInitialized(success);
      if (!success) {
        toast({
          title: "OpenAI Initialization Failed",
          description: "There was an error initializing OpenAI. Please try again later.",
          variant: "destructive",
        });
      }
    };
    initOpenAI();

    // Check URL parameters for successful payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setPremiumUnlocked(true);
      toast({
        title: "Premium Features Unlocked",
        description: "You can now use premium features for one generation.",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const isPremiumFeatureSelected = () => {
    return (
      tones.length > 1 ||
      parseInt(wordCount) > 1000 ||
      includeImages
    );
  };

  const handleCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {});
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "There was an error initiating checkout. Please try again.",
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

    if (!isOpenAIInitialized) {
      toast({
        title: "OpenAI Not Initialized",
        description: "Please wait for OpenAI to initialize and try again.",
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

    if (isPremiumFeatureSelected() && !premiumUnlocked) {
      toast({
        title: "Premium Feature",
        description: "Please upgrade to access multiple tones, extended word count, research, and image features.",
      });
      handleCheckout();
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
      if (premiumUnlocked) {
        setPremiumUnlocked(false);
        toast({
          title: "Premium Features Used",
          description: "Your one-time premium generation has been used.",
        });
      }
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

        {isPremiumFeatureSelected() && !premiumUnlocked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              Premium features selected (multiple tones, extended word count, or images).
              Upgrade required to access these features.
            </p>
            <Button
              onClick={handleCheckout}
              className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600"
            >
              Upgrade Now
            </Button>
          </div>
        )}

        {premiumUnlocked && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-2">
            <Unlock className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              Premium features unlocked for one generation
            </p>
          </div>
        )}

        <Button
          className="w-full"
          onClick={generateBlog}
          disabled={isGenerating || !isOpenAIInitialized}
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
