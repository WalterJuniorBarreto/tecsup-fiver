// src/types/profile.types.ts

export type RateType = 'HOURLY' | 'FIXED' | 'NEGOTIABLE';
export type LanguageLevel = 'BÁSICO' | 'INTERMEDIO' | 'AVANZADO' | 'NATIVO';

export interface Language {
  name: string;
  level: LanguageLevel;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  avatar: string | null;
  professionalTitle: string | null;
  location: string | null;
  bio: string | null;
  rateType: RateType;
  hourlyRate: number | null;
  languages: Language[] | null;
  createdAt: string;
  skills: string[];              
  yearsOfExperience: number | null;
  education: string[];              
  portfolioUrl: string | null;
}

export interface ProfileResponse {
  status: string;
  message?: string;
  data: UserProfile;
}