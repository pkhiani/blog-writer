import OpenAI from 'openai';
import { supabase } from "@/integrations/supabase/client";

let openai: OpenAI | null = null;

export const initializeOpenAI = async () => {
  try {
    const { data: { OPENAI_API_KEY }, error } = await supabase.functions.invoke('get-openai-key', {});
    
    if (error) throw error;
    
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing OpenAI:', error);
    return false;
  }
};

export const generateBlogContent = async (
  topic: string, 
  originalContent: string, 
  includeResearch: boolean,
  tones: string,
  wordCount: number,
  includeImages: boolean
) => {
  if (!openai) {
    const success = await initializeOpenAI();
    if (!success) {
      throw new Error('Failed to initialize OpenAI client');
    }
  }

  // First, generate the blog content with image placeholders
  const contentPrompt = `Write a ${wordCount}-word blog post about "${topic}" using these tones: ${tones}.
${originalContent ? `Include this original content: "${originalContent}"` : ''}
${includeResearch ? 'Include well-researched information and cite sources, with clickable links.' : ''}
${includeImages ? 'Add [GENERATE_IMAGE: brief image description] placeholders at appropriate points in the content where images would enhance the narrative.' : ''}
Format the response in Markdown.
Ensure proper headings, paragraphs, and formatting for readability.
At the end of the content, add a line "TAGS:" followed by up to 10 relevant 1-2 word tags for this blog post, separated by commas.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional blog writer skilled in SEO optimization and creating engaging content. When asked to include images, use the exact format [GENERATE_IMAGE: description] for image placeholders."
      },
      {
        role: "user",
        content: contentPrompt
      }
    ],
    temperature: 0.7,
  });

  let content = response.choices[0]?.message?.content || '';

  // If images are requested, process all image placeholders
  if (includeImages) {
    const imagePlaceholderRegex = /\[GENERATE_IMAGE:\s*([^\]]+)\]/g;
    const matches = [...content.matchAll(imagePlaceholderRegex)];
    
    for (const match of matches) {
      const [fullMatch, imageDescription] = match;
      try {
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `High quality, professional image for a blog post about ${topic}. Specifically: ${imageDescription}`,
          n: 1,
          size: "1024x1024",
          quality: "hd",
        });

        if (imageResponse.data[0]?.url) {
          content = content.replace(
            fullMatch, 
            `![${imageDescription}](${imageResponse.data[0].url})`
          );
        }
      } catch (error) {
        console.error('Error generating image:', error);
        // Replace failed image placeholder with an error message
        content = content.replace(
          fullMatch,
          '*[Image generation failed]*'
        );
      }
    }
  }

  return content;
};