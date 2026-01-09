// services/aiService.ts
export function getQuestions(domain: string, experience: string) {
  if (experience === "Fresher") {
    return [
      "Tell us about yourself",
      "What fundamentals do you know in this domain?",
      "Describe a project you worked on",
      "How do you learn new technologies?",
      "Why are you interested in this role?"
    ];
  }

  return [
    "Describe a real-world project you handled",
    "What challenges did you face?",
    "How do you solve production issues?",
    "How do you ensure quality in your work?",
    "What impact did your work create?"
  ];
}
