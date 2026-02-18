
import { GoogleGenAI, Type } from "@google/genai";
import { Pet } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPetAdvice = async (pet: Pet, query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks about their pet ${pet.name} (${pet.type}, breed size: ${pet.size || 'unknown'}). Question: ${query}`,
      config: {
        systemInstruction: "You are Zorgo AI, a friendly and expert pet care assistant. Provide practical, empathetic, and scientifically sound advice for pet owners.",
      }
    });
    return response.text || "Desculpe, não consegui processar seu pedido agora.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com a inteligência Zorgo.";
  }
};

export const suggestRoutine = async (pet: Pet) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a daily routine for ${pet.name}, a ${pet.type} pet.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              time: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["task", "time"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Routine Suggestion Error:", error);
    return [];
  }
};
