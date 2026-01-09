
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserData, InterviewResponse } from "../types";

/**
 * Generates professional interview questions tailored to the specific domain.
 * Uses gemini-3-flash-preview for ultra-low latency.
 */
export const getDomainQuestions = async (domainName: string): Promise<string[]> => {
  // Always use the named parameter for API key initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 professional interview questions for a candidate applying for a '${domainName}' position. 
      The questions should be technical, deep, and concise. 
      Return the response as a JSON array of strings ONLY.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // Access .text property directly (not a method)
    const text = response.text || "[]";
    const questions = JSON.parse(text);
    return questions.length > 0 ? questions : [
      "Describe your professional experience in this domain.",
      "How do you approach solving complex technical problems?",
      "What is your philosophy on collaboration and teamwork?",
      "How do you maintain your skills in a rapidly evolving industry?",
      "Why are you the ideal candidate for this specific role?"
    ];
  } catch (error) {
    console.error("Gemini Question Generation Error:", error);
    return [
      "Describe a major project you successfully led.",
      "How do you handle strict deadlines and pressure?",
      "How do you resolve professional disagreements in a team?",
      "What are your long-term career aspirations?",
      "Explain a complex technical concept to a non-technical audience."
    ];
  }
};

/**
 * Persists assessment results to Azure Cloud via Azure Function.
 */
export const saveResultToCloud = async (data: any): Promise<boolean> => {
  try {
    const response = await fetch("/api/saveResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return response.ok;
  } catch (error) {
    console.warn("Azure Table Storage sync failed:", error);
    return false;
  }
};

/**
 * Uses Gemini Pro for high-reasoning complex evaluation task.
 * Evaluates candidate responses using rigorous technical criteria.
 */
export const evaluateFullAssessment = async (
  userData: UserData,
  history: InterviewResponse[]
) => {
  // Always use the named parameter for API key initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Perform a rigorous professional assessment for a candidate.
    Candidate: ${userData.fullName}
    Target Domain: ${userData.domain}
    
    Interview Transcript:
    ${history.map((h, i) => `Q${i+1}: ${h.question}\nA${i+1}: ${h.answer}`).join('\n\n')}
    
    Evaluate technical depth, architectural understanding, and professional competency.
    
    The "summary" MUST be written using highly specialized, domain-specific technical language. 
    - If Tech: Mention complexity (O-notation), architectural patterns, concurrency, or state management.
    - If HR: Mention behavioral frameworks, strategic talent acquisition, or compliance ecosystems.
    - If Finance: Mention valuation methodologies, risk hedging, or fiscal modeling.
    
    The reasoning should explicitly state the technical "why" behind the recommendation.
    
    Output JSON ONLY:
    {
      "score": number (0-100),
      "recommendation": "Recommended" | "Not Recommended",
      "summary": "Technical diagnostic reasoning (2-3 sentences max)"
    }
  `;

  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning task
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            recommendation: { type: Type.STRING }, // Simplified to avoid potential schema strictness with enums
            summary: { type: Type.STRING }
          },
          required: ['score', 'recommendation', 'summary']
        }
      }
    });

    // Access .text property directly
    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score ?? 70,
      recommendation: result.recommendation ?? 'Recommended',
      summary: result.summary ?? "Candidate demonstrates core competency but requires further calibration on domain-specific architectural nuances."
    };
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      score: 50,
      recommendation: 'Not Recommended',
      summary: "Diagnostic evaluation interrupted. Preliminary data suggests standard implementation proficiency."
    };
  }
};
