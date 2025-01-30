import OpenAI from 'openai';

let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateBlogContent = async (
  topic: string, 
  originalContent: string, 
  includeResearch: boolean,
  tone: string,
  wordCount: number,
  includeImages: boolean
) => {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const prompt = `Write a ${wordCount}-word, ${tone} tone, SEO-optimized blog post about "${topic}".
${originalContent ? `Include this original content: "${originalContent}"` : ''}
${includeResearch ? 'Include well-researched information and cite sources.' : ''}
${includeImages ? 'Include markdown image placeholders where relevant images should be placed.' : ''}
Format the response in Markdown.
Ensure proper headings, paragraphs, and formatting for readability.`;

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

  let content = response.choices[0]?.message?.content || '';

  if (includeImages) {
    // Generate image descriptions and add them to the content
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Generate a relevant image for a blog post about: ${topic}`,
      n: 1,
      size: "1024x1024",
    });

    if (imageResponse.data[0]?.url) {
      content = `![Blog header image](${imageResponse.data[0].url})\n\n${content}`;
    }
  }

  return content;
};