import OpenAI from 'openai';

let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateBlogContent = async (topic: string, originalContent: string, includeResearch: boolean) => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}".
${originalContent ? `Include this original content: "${originalContent}"` : ''}
${includeResearch ? 'Include well-researched information and cite sources.' : ''}
Format the response in Markdown.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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

  return response.choices[0]?.message?.content || '';
};