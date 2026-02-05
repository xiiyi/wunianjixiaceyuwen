import { GoogleGenAI } from "@google/genai";

// 检查是否配置了有效的 API Key
const apiKey = process.env.API_KEY || '';
const isApiKeyValid = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' && apiKey.length > 10;

// 备用水墨画风格图片 - 来自 Unsplash 的高质量中国传统风格图片
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=400&fit=crop', // 竹林
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=400&fit=crop', // 山水
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&h=400&fit=crop', // 书本
  'https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=800&h=400&fit=crop', // 静谧自然
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop', // 水波
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop', // 山峦
];

let fallbackIndex = 0;

/**
 * 获取备用图片
 */
function getFallbackImage(): string {
  const img = FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  fallbackIndex++;
  return img;
}

let ai: GoogleGenAI | null = null;

if (isApiKeyValid) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * Generates an image based on a text description using Gemini 2.5 Flash Image.
 * Falls back to preset images if API is not available or fails.
 */
export async function generatePoemIllustration(description: string): Promise<string | null> {
  // 如果 API Key 无效，直接返回备用图片
  if (!isApiKeyValid || !ai) {
    console.log('Using fallback image (API Key not configured)');
    return getFallbackImage();
  }

  try {
    const prompt = `Create a traditional Chinese ink wash painting style illustration for the following scene: "${description}". The image should be suitable for a grade 5 poetry textbook, artistic, serene, and culturally accurate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    // 如果 API 没返回图片，使用备用图片
    console.log('API returned no image, using fallback');
    return getFallbackImage();
  } catch (error) {
    console.error("Failed to generate image, using fallback:", error);
    return getFallbackImage();
  }
}