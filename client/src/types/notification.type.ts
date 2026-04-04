export interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
  type?: string;
}

export interface WebSocketMessage {
  type: 'INITIAL_DATA' | 'NEW_NOTIFICATIONS' | 'READ_CONFIRMATION' | 'ERROR';
  data?: Notification[];
  status?: string;
  id?: number;
  message?: string;
}

export interface MarkReadAction {
  action: 'mark_read';
  id: number;
}