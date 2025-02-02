import { useState } from "react";
import { BlogForm } from "@/components/BlogForm";
import { BlogPreview } from "@/components/BlogPreview";

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState("");

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 font-merriweather">
            Write A Blog
          </h1>
          <p className="text-lg text-gray-600">
            Create SEO-optimized blog posts with the power of AI
          </p>
        </div>

        <BlogForm onBlogGenerated={setGeneratedContent} />
        <BlogPreview content={generatedContent} />
      </div>
    </div>
  );
};

export default Index;