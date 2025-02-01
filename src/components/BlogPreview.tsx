import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

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

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    const contentWithoutTags = content.replace(/TAGS:.+$/m, '');
    
    // Add CSS styles for better PDF formatting
    element.innerHTML = `
      <div style="
        padding: 40px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
      ">
        <style>
          h1 { font-size: 28px; margin-bottom: 20px; color: #333; }
          h2 { font-size: 24px; margin-top: 30px; margin-bottom: 15px; color: #444; }
          h3 { font-size: 20px; margin-top: 25px; margin-bottom: 12px; color: #555; }
          p { margin-bottom: 15px; font-size: 16px; color: #666; }
          img { max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; }
          blockquote { 
            border-left: 4px solid #ddd;
            padding-left: 15px;
            margin: 20px 0;
            font-style: italic;
          }
          ul, ol { margin: 15px 0; padding-left: 25px; }
          li { margin-bottom: 8px; }
        </style>
        ${contentWithoutTags}
      </div>
    `;
    
    const opt = {
      margin: [0.5, 0.5],
      filename: 'blog-post.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait'
      }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      toast({
        title: "PDF Downloaded",
        description: "Your blog post has been downloaded as a PDF.",
      });
    });
  };

  const tags = extractTags(editedContent);
  const contentWithoutTags = editedContent.replace(/TAGS:.+$/m, '');

  if (!content) return null;

  return (
    <Card className="p-8 w-full max-w-4xl mx-auto mt-8">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
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