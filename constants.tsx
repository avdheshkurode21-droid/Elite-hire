
import React from 'react';
import { 
  Briefcase, 
  Code, 
  Database, 
  Layout, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  Terminal,
  Search
} from 'lucide-react';
import { DomainOption } from './types';

export const DOMAINS: DomainOption[] = [
  { id: 'hr', label: 'HR Services', icon: 'Users', description: 'People management and recruitment strategies.', color: 'emerald' },
  { id: 'finance', label: 'Finance', icon: 'TrendingUp', description: 'Financial analysis and management.', color: 'amber' },
  { id: 'cs', label: 'Company Secretary', icon: 'Briefcase', description: 'Corporate governance and compliance.', color: 'blue' },
  { id: 'sw_dev', label: 'Software Developer', icon: 'Code', description: 'Building robust application logic.', color: 'indigo' },
  { id: 'tester', label: 'QA Tester', icon: 'ShieldCheck', description: 'Ensuring software quality and reliability.', color: 'rose' },
  { id: 'mgmt', label: 'Management Services', icon: 'Settings', description: 'Strategic business operations.', color: 'slate' },
  { id: 'analyst', label: 'Business Analyst', icon: 'Search', description: 'Bridge between business and technology.', color: 'cyan' },
  { id: 'frontend', label: 'Frontend Developer', icon: 'Layout', description: 'Creating beautiful user interfaces.', color: 'fuchsia' },
  { id: 'backend', label: 'Backend Developer', icon: 'Terminal', description: 'Managing servers and databases.', color: 'violet' },
];

export const QUESTION_BANK: Record<string, { q: string, keywords: string[] }[]> = {
  'HR Services': [
    { q: "How do you handle conflict resolution between two team members?", keywords: ["mediation", "neutral", "listen", "policy", "resolution"] },
    { q: "What strategies do you use for talent sourcing in a competitive market?", keywords: ["linkedin", "networking", "referrals", "branding", "outreach"] },
    { q: "Describe your experience with performance management systems.", keywords: ["kpi", "feedback", "review", "development", "improvement"] },
    { q: "How do you ensure diversity and inclusion in the hiring process?", keywords: ["bias", "blind", "inclusive", "outreach", "culture"] },
    { q: "What is your approach to employee onboarding?", keywords: ["integration", "training", "culture", "welcome", "mentor"] }
  ],
  'Software Developer': [
    { q: "What is the difference between a REST API and GraphQL?", keywords: ["endpoint", "query", "fetching", "schema", "payload"] },
    { q: "How do you ensure your code is maintainable and scalable?", keywords: ["clean", "solid", "comments", "refactor", "patterns"] },
    { q: "Describe your experience with CI/CD pipelines.", keywords: ["automation", "deployment", "github", "testing", "workflow"] },
    { q: "How do you handle debugging a complex production issue?", keywords: ["logs", "repro", "stack", "isolation", "fix"] },
    { q: "Explain the concept of 'closures' in programming.", keywords: ["scope", "function", "variable", "memory", "access"] }
  ],
  'Finance': [
    { q: "How do you perform a discounted cash flow (DCF) analysis?", keywords: ["valuation", "projection", "rate", "wacc", "future"] },
    { q: "What are the key components of a financial statement?", keywords: ["balance", "income", "cash", "equity", "assets"] },
    { q: "How do you manage financial risk in a volatile market?", keywords: ["hedging", "diversification", "liquidity", "portfolio", "risk"] },
    { q: "Describe your experience with budget forecasting.", keywords: ["variance", "projection", "allocation", "historical", "planning"] },
    { q: "What is the importance of working capital management?", keywords: ["liquidity", "current", "cycle", "operational", "efficiency"] }
  ],
  'QA Tester': [
    { q: "What is the difference between smoke testing and regression testing?", keywords: ["stability", "impact", "features", "automated", "verification"] },
    { q: "How do you prioritize test cases when time is limited?", keywords: ["risk", "critical", "usage", "requirements", "impact"] },
    { q: "Describe a bug you found that was particularly difficult to reproduce.", keywords: ["environment", "steps", "isolation", "intermittent", "root"] },
    { q: "What tools do you use for automated browser testing?", keywords: ["selenium", "playwright", "cypress", "assertions", "scripts"] },
    { q: "How do you handle a situation where a developer says a bug is 'not a bug'?", keywords: ["requirement", "specification", "user", "repro", "evidence"] }
  ]
};

export const DEFAULT_QUESTIONS = [
  { q: "What are your primary goals in this professional role?", keywords: ["growth", "contribution", "skills", "career", "impact"] },
  { q: "How do you manage your time when facing multiple deadlines?", keywords: ["priority", "organization", "focus", "planning", "delivery"] },
  { q: "Describe a professional challenge you overcame.", keywords: ["problem", "solution", "action", "result", "learning"] },
  { q: "How do you stay updated with industry trends?", keywords: ["learning", "reading", "news", "courses", "networking"] },
  { q: "Why do you want to work with our organization?", keywords: ["vision", "values", "alignment", "culture", "opportunity"] }
];

export const getIcon = (iconName: string, size = 24) => {
  switch (iconName) {
    case 'Users': return <Users size={size} />;
    case 'TrendingUp': return <TrendingUp size={size} />;
    case 'Briefcase': return <Briefcase size={size} />;
    case 'Code': return <Code size={size} />;
    case 'ShieldCheck': return <ShieldCheck size={size} />;
    case 'Settings': return <Settings size={size} />;
    case 'Search': return <Search size={size} />;
    case 'Layout': return <Layout size={size} />;
    case 'Terminal': return <Terminal size={size} />;
    default: return <Briefcase size={size} />;
  }
};
