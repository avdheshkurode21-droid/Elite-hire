
export enum AppView {
  LOGIN = 'LOGIN',
  DOMAIN_SELECTION = 'DOMAIN_SELECTION',
  INTERVIEW = 'INTERVIEW',
  SUCCESS = 'SUCCESS',
  DASHBOARD = 'DASHBOARD'
}

export interface UserData {
  fullName: string;
  phone: string;
  idNo: string;
  domain?: string;
}

export interface InterviewResponse {
  question: string;
  answer: string;
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
}
