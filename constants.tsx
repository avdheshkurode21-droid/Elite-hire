
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
  { id: 'hr', label: 'HR Services', icon: 'Users', description: 'People management and recruitment strategies.' },
  { id: 'finance', label: 'Finance', icon: 'TrendingUp', description: 'Financial analysis and management.' },
  { id: 'cs', label: 'Company Secretary', icon: 'Briefcase', description: 'Corporate governance and compliance.' },
  { id: 'sw_dev', label: 'Software Developer', icon: 'Code', description: 'Building robust application logic.' },
  { id: 'tester', label: 'QA Tester', icon: 'ShieldCheck', description: 'Ensuring software quality and reliability.' },
  { id: 'mgmt', label: 'Management Services', icon: 'Settings', description: 'Strategic business operations.' },
  { id: 'analyst', label: 'Business Analyst', icon: 'Search', description: 'Bridge between business and technology.' },
  { id: 'frontend', label: 'Frontend Developer', icon: 'Layout', description: 'Creating beautiful user interfaces.' },
  { id: 'backend', label: 'Backend Developer', icon: 'Terminal', description: 'Managing servers and databases.' },
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users': return <Users size={24} />;
    case 'TrendingUp': return <TrendingUp size={24} />;
    case 'Briefcase': return <Briefcase size={24} />;
    case 'Code': return <Code size={24} />;
    case 'ShieldCheck': return <ShieldCheck size={24} />;
    case 'Settings': return <Settings size={24} />;
    case 'Search': return <Search size={24} />;
    case 'Layout': return <Layout size={24} />;
    case 'Terminal': return <Terminal size={24} />;
    default: return <Briefcase size={24} />;
  }
};
