
import { UserData, InterviewResponse } from "../types";
import { QUESTION_BANK, DEFAULT_QUESTIONS } from "../constants";

/**
 * Retrieves questions locally from the validated bank.
 */
export const getDomainQuestions = async (domainName: string): Promise<string[]> => {
  // Brief delay for UX feel
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const questionObjects = QUESTION_BANK[domainName] || DEFAULT_QUESTIONS;
  return questionObjects.map(q => q.q);
};

/**
 * Local Deterministic Evaluation Engine.
 * Evaluates candidate depth based on keyword density and technical lexicon.
 */
export const evaluateFullAssessment = async (
  userData: UserData,
  history: InterviewResponse[]
) => {
  // Artificial processing delay to simulate deep analysis
  await new Promise(resolve => setTimeout(resolve, 1500));

  const domain = userData.domain || "";
  const questionSet = QUESTION_BANK[domain] || DEFAULT_QUESTIONS;
  
  let totalKeywordsPossible = 0;
  let totalKeywordsFound = 0;
  let detailBonus = 0;

  history.forEach((entry, index) => {
    const qData = questionSet[index] || DEFAULT_QUESTIONS[0];
    const keywords = qData.keywords;
    const answerLower = entry.answer.toLowerCase();

    totalKeywordsPossible += keywords.length;

    keywords.forEach(kw => {
      if (answerLower.includes(kw.toLowerCase())) {
        totalKeywordsFound++;
      }
    });

    // Reward detailed explanations even if keywords don't match exactly
    if (entry.answer.length > 150) detailBonus += 5;
    else if (entry.answer.length > 60) detailBonus += 2;
  });

  // Calculate percentage
  const matchRatio = totalKeywordsPossible > 0 ? (totalKeywordsFound / totalKeywordsPossible) : 0;
  
  // Base 30 score for completion + weight of keywords (60%) + detail bonus (10%)
  const rawScore = Math.min(100, Math.round((matchRatio * 60) + 30 + detailBonus));
  
  const recommendation = rawScore >= 60 ? 'Recommended' : 'Not Recommended';
  
  // Generate deterministic summary based on score bracket
  let summary = "";
  if (rawScore >= 85) {
    summary = `EXCEPTIONAL ALIGNMENT: Candidate demonstrated high technical density with ${totalKeywordsFound} key domain indicators identified. Lexical depth suggests expert-level familiarity.`;
  } else if (rawScore >= 60) {
    summary = `VALIDATED COMPETENCY: Response patterns align with core ${domain} requirements. Candidate utilized sufficient industry-standard terminology to qualify for the next stage.`;
  } else if (rawScore >= 40) {
    summary = `LIMITED ALIGNMENT: Technical lexicon usage was sparse. Candidate provides foundational answers but lacks the specific technical terminology expected for high-level ${domain} roles.`;
  } else {
    summary = `INSUFFICIENT DEPTH: Evaluation failed to identify critical domain keywords. Responses were either too brief or lacked professional technical context.`;
  }

  return {
    score: rawScore,
    recommendation,
    summary
  };
};
