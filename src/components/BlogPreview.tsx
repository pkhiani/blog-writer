import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

export function BlogPreview({ content }: { content: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { toast } = useToast();

  // Update editedContent when new content is received
  if (content !== editedContent && !isEditing) {
    setEditedContent(content);
  }

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your blog post has been updated successfully.",
    });
  };

  const extractTags = (content: string) => {
    const tagsMatch = content.match(/TAGS:(.+)$/m);
    if (tagsMatch) {
      return tagsMatch[1].split(',').map(tag => tag.trim());
    }
    return [];
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast({
      title: "Tag Copied",
      description: `"${tag}" has been copied to your clipboard.`,
    });
  };

  const tags = extractTags(editedContent);
  const contentWithoutTags = editedContent.replace(/TAGS:.+$/m, '');

  if (!content) return null;

  return (
    <Card className="p-8 w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? "Save Changes" : "Edit Content"}
        </Button>
      </div>
      <div className="blog-content">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm"
          />
        ) : (
          <>
            <ReactMarkdown>{contentWithoutTags}</ReactMarkdown>
            {tags.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer flex items-center gap-1 hover:bg-primary/90"
                      onClick={() => copyTag(tag)}
                    >
                      {tag}
                      <Copy className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}