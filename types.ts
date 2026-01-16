
export enum TaskStatus {
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not Completed'
}

export interface Task {
  id: string;
  timeRange: string;
  hours: number;
  description: string;
  status: TaskStatus;
  workingHrs: number;
  reason?: string;
  notes?: string;
  date: string; // ISO format
}

export interface SidebarTask {
  id: string;
  description: string;
  status: string;
}

export interface MonthlyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number; // 0 to 100
  priority: 'High' | 'Medium' | 'Low';
}

export interface DailySummary {
  totalHours: number;
  completedHours: number;
  totalMins: number;
  completedMins: number;
}
