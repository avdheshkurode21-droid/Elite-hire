
import { UserData, InterviewResponse } from "../types";

/**
 * Calls the Azure Function backend to generate the next interview question.
 */
export const generateNextQuestion = async (
  userData: UserData,
  history: InterviewResponse[]
): Promise<string> => {
  try {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generateQuestion',
        userData,
        history
      })
    });

    if (!response.ok) throw new Error('Backend failed to generate question');
    
    const data = await response.json();
    return data.text || "Could you tell me more about your experience in this field?";
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

/**
 * Calls the Azure Function backend to evaluate the candidate's performance.
 */
export const evaluateCandidate = async (
  userData: UserData,
  history: InterviewResponse[]
) => {
  try {
    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'evaluate',
        userData,
        history
      })
    });

    if (!response.ok) throw new Error('Backend failed to evaluate candidate');
    
    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    return {
      score: 70,
      recommendation: "Recommended",
      summary: "Candidate evaluation completed with default parameters due to a connectivity issue."
    };
  }
};
