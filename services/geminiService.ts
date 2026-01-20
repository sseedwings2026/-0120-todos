
import { GoogleGenAI, Type } from "@google/genai";
import { Todo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAITaskInsights = async (todos: Todo[]) => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Based on the following todo list, provide a brief encouraging message and suggest which one is most critical to tackle next.
      Tasks: ${JSON.stringify(todos.map(t => ({ title: t.title, completed: t.is_completed, priority: t.priority })))}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING, description: "A supportive motivational quote or greeting." },
          recommendation: { type: Type.STRING, description: "Advice on which task to do next and why." }
        },
        required: ["message", "recommendation"]
      }
    }
  });

  const response = await model;
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { message: "오늘도 힘내세요!", recommendation: "가장 중요한 일부터 시작해볼까요?" };
  }
};
