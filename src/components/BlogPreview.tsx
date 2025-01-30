import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";

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
          <ReactMarkdown>{editedContent}</ReactMarkdown>
        )}
      </div>
    </Card>
  );
}