
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, InterviewResponse, CandidateResult } from "../types";

/**
 * Generates 5 professional interview questions tailored to the specific domain using Gemini AI.
 */
export const getDomainQuestions = async (domainName: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 professional, high-level interview questions for a candidate applying for a '${domainName}' position. 
      The questions should test technical depth, problem-solving, and industry standards. 
      Return the response as a JSON array of strings only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const questions = JSON.parse(response.text || "[]");
    return questions.length > 0 ? questions : ["Describe your experience in this field.", "How do you handle complex technical challenges?", "What is your approach to teamwork?", "How do you stay updated with industry trends?", "Why are you interested in this role?"];
  } catch (error) {
    console.error("Gemini Question Generation Error:", error);
    return ["Describe your most significant professional achievement.", "How do you manage deadlines?", "How do you handle technical disagreements?", "Explain a complex concept simply.", "What are your goals for the next 2 years?"];
  }
};

/**
 * Persists the result to Azure Cloud via the saveResult function.
 */
export const saveResultToCloud = async (result: CandidateResult): Promise<boolean> => {
  try {
    const response = await fetch('/api/saveResult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      console.warn("Cloud save failed, result remains in local cache only.");
      return false;
    }

    const data = await response.json();
    return true;
  } catch (error) {
    console.error("Connectivity error during cloud save:", error);
    return false;
  }
};

/**
 * Uses Gemini Pro to perform a sophisticated evaluation of the candidate's performance.
 */
export const evaluateFullAssessment = async (
  userData: UserData,
  history: InterviewResponse[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `
    Perform a professional HR assessment for a candidate.
    Candidate: ${userData.fullName}
    Domain: ${userData.domain}
    
    Interview Transcript:
    ${history.map((h, i) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.answer}`).join('\n\n')}
    
    Provide an evaluation including:
    1. A technical score from 0 to 100 based on the depth and accuracy of answers.
    2. A recommendation: 'Recommended' or 'Not Recommended'.
    3. A concise technical summary of their performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            recommendation: { type: Type.STRING, enum: ['Recommended', 'Not Recommended'] },
            summary: { type: Type.STRING }
          },
          required: ['score', 'recommendation', 'summary']
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      score: 50,
      recommendation: 'Not Recommended',
      summary: "Evaluation engine failed. Please review manually."
    };
  }
};
