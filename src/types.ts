export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type Role =
  | 'Product Management'
  | 'Product Analyst'
  | 'Software Development'
  | 'iOS Development'
  | 'Business Analyst'
  | 'Strategy'
  | 'Marketing'
  | 'Growth'
  | 'Data Analytics';

export type TrackerStatus = 'Saved' | 'Applied' | 'Interview' | 'Rejected';
export type ListingStatus = 'demo' | 'open' | 'closed' | 'expired';
export type VerificationState = 'demo' | 'verified' | 'unverified';

export const ROLE_OPTIONS: Role[] = [
  'Product Management',
  'Product Analyst',
  'Software Development',
  'iOS Development',
  'Business Analyst',
  'Strategy',
  'Marketing',
  'Growth',
  'Data Analytics',
];
export const WORK_MODE_OPTIONS: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];

export interface Internship {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  role: Role;
  location: string; // City, State
  state: string;
  workMode: WorkMode;
  duration: string;
  stipend: string;
  postedDaysAgo: number;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  openings: number;
  applyUrl: string;
  sourceUrl: string | null;
  applicationDeadline: string;
  lastVerifiedAt: string | null;
  listingStatus: ListingStatus;
  isDemo: boolean;
  verification: VerificationState;
  eligibility: string;
}

export interface Application {
  internshipId: string;
  status: TrackerStatus;
  appliedAt: number;
  updatedAt: number;
  notes: string;
}
