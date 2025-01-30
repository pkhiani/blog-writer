import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export function BlogPreview({ content }: { content: string }) {
  if (!content) return null;

  return (
    <Card className="p-8 w-full max-w-4xl mx-auto mt-8">
      <div className="blog-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </Card>
  );
}