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

  const prompt = `Write a ${wordCount}-word blog post about "${topic}" using these tones: ${tones}.
${originalContent ? `Include this original content: "${originalContent}"` : ''}
${includeResearch ? 'Include well-researched information and cite sources.' : ''}
${includeImages ? 'Include [IMAGE] placeholders where relevant images should be placed.' : ''}
Format the response in Markdown.
Ensure proper headings, paragraphs, and formatting for readability.`;

  const response = await openai.chat.completions.create({
    model: "o1-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional blog writer skilled in SEO optimization and creating engaging content."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  let content = response.choices[0]?.message?.content || '';

  if (includeImages && content.includes('[IMAGE]')) {
    const imagePlaceholders = content.match(/\[IMAGE\]/g) || [];
    
    for (let i = 0; i < imagePlaceholders.length; i++) {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Generate a relevant image for a ${tones} blog post about: ${topic}`,
        n: 1,
        size: "1024x1024",
      });

      if (imageResponse.data[0]?.url) {
        content = content.replace('[IMAGE]', `![Blog image ${i + 1}](${imageResponse.data[0].url})`);
      }
    }
  }

  return content;
};