
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
  
  // Domain-Specific Insufficient Depth Generators
  const getInsufficientDepthOpinion = (domain: string): string => {
    switch(domain) {
      case 'Software Developer':
      case 'Frontend Developer':
      case 'Backend Developer':
        return `TECHNICAL ARCHITECTURE VOID: Our analysis indicates a profound disconnect from systemic design principles. The candidate's failure to utilize core algorithmic lexicon suggests a lack of hands-on experience in enterprise-scale development. Engineering depth is insufficient for high-level vertical integration.`;
      case 'HR Services':
        return `STRATEGIC HUMAN CAPITAL MISALIGNMENT: Evaluation reveals a critical absence of core mediation and organizational behavioral frameworks. The candidate lacks the professional linguistic density required for high-stakes talent management or conflict resolution at an executive level.`;
      case 'Finance':
        return `FISCAL ANALYTICAL DEFICIT: Data synthesis reveals a profound disconnect from rigorous valuation methodologies and risk mitigation strategies. Quantitative depth is non-existent within the response patterns, indicating a high-risk profile for complex financial modeling requirements.`;
      case 'QA Tester':
        return `SYSTEMIC VALIDATION FRICTION: The candidate demonstrated a superficial understanding of automated verification cycles. Absence of regression-centric logic and "fail-fast" thinking indicates a profile unsuited for enterprise-grade quality oversight or CI/CD integration.`;
      default:
        return `CRITICAL DOMAIN DISCONNECT: Linguistic pattern analysis failed to identify fundamental professional indicators. The candidate's discourse remains at a layperson's level, lacking the specialized technical terminology expected for advanced professional contributions in this sector.`;
    }
  };

  // Generate deterministic summary based on score bracket with professional AI opinion tone
  let summary = "";
  if (rawScore >= 85) {
    summary = `EXCEPTIONAL DOMAIN ALIGNMENT: Automated audit identifies high-velocity technical density. Candidate discourse demonstrates mastery of ${domain} frameworks with optimal keyword saturation. Recommend immediate expedited onboarding.`;
  } else if (rawScore >= 60) {
    summary = `VALIDATED OPERATIONAL COMPETENCY: Response vectors align with standardized ${domain} benchmarks. Candidate utilized sufficient technical lexicon to qualify for human-led final review. Recommended for the next stage of screening.`;
  } else if (rawScore >= 40) {
    summary = `FOUNDATIONAL DEFICIT: AI synthesis detects emerging concepts but lacks technical rigor. While the candidate understands the abstract layer of ${domain}, they failed to manifest the granular technical depth required for professional autonomy.`;
  } else {
    summary = getInsufficientDepthOpinion(domain);
  }

  return {
    score: rawScore,
    recommendation,
    summary
  };
};
