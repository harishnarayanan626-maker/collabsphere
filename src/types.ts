export type UserRole = 'Student' | 'Faculty';

export type AppView = 'login' | 'dashboard' | 'tasks' | 'team' | 'risks' | 'faculty' | 'schema';

export interface PastContribution {
  project_name: string;
  role: string;
  year: string;
  description: string;
  commits_count?: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Team Lead';
  gpa?: string;
  year?: string;
  bio?: string;
  skills: string[];
  avatarUrl: string;
  status: 'Available' | 'Interviewing' | 'Assigned';
  capacityPct: number; // e.g. 85%
  workloadStatus: 'Underloaded' | 'Balanced' | 'Overloaded';
  lastActive: string;
  pastContributions?: PastContribution[];
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department?: string;
  avatarUrl?: string;
}

export interface Team {
  id: number;
  team_name: string;
  project_subtitle?: string;
  created_by?: number;
  progress_pct: number;
  high_risks_count: number;
  med_risks_count: number;
  team_size: number;
  next_milestone: string;
  sprint_velocity: string;
  member_ids: number[];
  target_deadline?: string;
}

export interface Project {
  id: number;
  team_id: number;
  project_name: string;
  description: string;
  status: 'Active' | 'Planning' | 'Completed' | 'On Hold';
  faculty_advisor_id?: number;
  target_deadline?: string;
}

export interface ExternalUrl {
  label: string;
  url: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  assigned_to: number; // Student id
  assigned_name?: string;
  assigned_avatar?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  risk_level: 'On Track' | 'Medium Risk' | 'High Risk';
  due_date: string;
  created_date: string;
  ideal_progress_pct: number;
  actual_progress_pct: number;
  category_tag?: string; // e.g. DEV, DESIGN, DOCS
  delay_text?: string; // e.g. "4 days behind"
  estimated_hours?: number;
  progress_history?: { date: string; progress: number }[];
  external_urls?: ExternalUrl[];
  depends_on_task_id?: number;
}

export interface ProjectFile {
  id: number;
  project_id: number;
  filename: string;
  version: string;
  uploaded_by: number;
  uploaded_by_name?: string;
  uploaded_date: string;
  size?: string;
}

export interface ContributionLog {
  id: number;
  student_id: number;
  student_name: string;
  project_id: number;
  action_type: string;
  details: string;
  timestamp: string;
  badge_color?: string;
}

export interface RiskInsightAlert {
  id: number;
  title: string;
  assigned_to_name: string;
  group_or_phase: string;
  risk_badge: string;
  actionable_tip: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LowContributionUser {
  id: number;
  student_id: number;
  name: string;
  risk_level: 'High Risk' | 'Medium Risk' | 'Info Only';
  updates_count: number;
  last_login: string;
}
