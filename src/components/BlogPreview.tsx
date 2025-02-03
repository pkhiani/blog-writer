
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";
import { PrinterIcon } from "lucide-react";

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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const contentWithoutTags = editedContent.replace(/TAGS:.+$/m, '').trim();
      printWindow.document.write(`
        <html>
          <head>
            <title>Blog Post</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 40px auto;
                padding: 0 20px;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 20px 0;
              }
              h1, h2, h3 { margin-top: 2em; }
              p { margin-bottom: 1em; }
            </style>
          </head>
          <body>
            ${contentWithoutTags}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
  const contentWithoutTags = editedContent.replace(/TAGS:.+$/m, '').trim();

  if (!content) return null;

  return (
    <Card className="p-8 w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handlePrint}
        >
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button
          variant="outline"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? "Save Changes" : "Edit Content"}
        </Button>
      </div>
      <div className="blog-content prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm"
          />
        ) : (
          <>
            <div className="prose-headings:font-bold prose-headings:mb-4 prose-p:mb-4 prose-img:my-8 prose-img:rounded-lg">
              <ReactMarkdown>{contentWithoutTags}</ReactMarkdown>
            </div>
            {tags.length > 0 && (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer hover:bg-primary/90"
                      onClick={() => copyTag(tag)}
                    >
                      {tag}
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
