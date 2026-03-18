export interface OperationItem {
  id: string;
  title: string;
  type: 'milestone' | 'task' | 'info';
  status?: 'pending' | 'in-progress' | 'completed';
  startDate?: string;
  endDate?: string;
  description?: string;
  budget?: number;
  source: 'sheet' | 'calendar' | 'doc';
}

export interface AuthStatus {
  isAuthenticated: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}
