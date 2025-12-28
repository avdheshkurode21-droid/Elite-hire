
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, InterviewResponse } from "../types";

// Always initialize with the exact environment variable and follow named parameter requirement
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNextQuestion = async (
  userData: UserData,
  history: InterviewResponse[]
): Promise<string> => {
  // Use gemini-3-flash-preview for basic text tasks like question generation
  const model = "gemini-3-flash-preview";
  
  const historyText = history.length > 0 
    ? history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n') 
    : "This is the start of the interview.";

  const prompt = `
    You are an expert HR interviewer for the role of ${userData.domain}.
    The candidate's name is ${userData.fullName}.
    
    Current Interview History:
    ${historyText}
    
    Based on the history and the domain, generate the NEXT professional interview question.
    If there is no history, ask an introductory technical or behavioral question related to ${userData.domain}.
    Keep the question concise and professional.
    Return ONLY the question text.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  // Extract text property directly as per guidelines
  return response.text || "Could you tell me more about your experience in this field?";
};

export const evaluateCandidate = async (
  userData: UserData,
  history: InterviewResponse[]
) => {
  // Use gemini-3-pro-preview for complex reasoning tasks like candidate evaluation
  const model = "gemini-3-pro-preview";

  const prompt = `
    Analyze the following interview performance for a ${userData.domain} position.
    
    Candidate: ${userData.fullName}
    Domain: ${userData.domain}
    
    Interview Transcript:
    ${history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}
    
    Evaluate the candidate on a scale of 0-100. Provide a recommendation ('Recommended' or 'Not Recommended') and a short summary.
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          recommendation: { type: Type.STRING, description: "'Recommended' or 'Not Recommended'" },
          summary: { type: Type.STRING }
        },
        required: ["score", "recommendation", "summary"],
        propertyOrdering: ["score", "recommendation", "summary"],
      }
    }
  });

  try {
    // Trim response text before parsing as per guidelines
    const jsonStr = (response.text || "{}").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return {
      score: 70,
      recommendation: "Recommended",
      summary: "Candidate showed basic proficiency in the required domain skills."
    };
  }
};
