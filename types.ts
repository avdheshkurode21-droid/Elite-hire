
export enum AppView {
  LOGIN = 'LOGIN',
  DOMAIN_SELECTION = 'DOMAIN_SELECTION',
  INTERVIEW = 'INTERVIEW',
  SUCCESS = 'SUCCESS',
  DASHBOARD = 'DASHBOARD'
}

export enum Language {
  EN = 'EN',
  ES = 'ES',
  FR = 'FR'
}

export interface UserData {
  fullName: string;
  phone: string;
  idNo: string;
  domain?: string;
  domainColor?: string;
  // New profile fields
  experienceLevel?: 'Fresher' | 'Experienced';
  educationField?: string;
  otherEducationField?: string;
  graduationYear?: string;
}

export interface InterviewResponse {
  question: string;
  answer: string;
  startTime?: string;
  duration?: number; // in seconds
}

export interface CandidateResult {
  userData: UserData;
  responses: InterviewResponse[];
  score: number;
  recommendation: 'Recommended' | 'Not Recommended';
  summary: string;
  timestamp: string;
}

export interface DomainOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string; // Tailwind color class (e.g., 'indigo', 'emerald', 'amber')
}
