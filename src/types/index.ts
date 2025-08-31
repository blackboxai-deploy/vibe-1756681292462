export interface User {
  id: string;
  email: string;
  name: string;
  specialty?: string;
  credentials?: string;
  licenseNumber?: string;
  hospital?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  specialty: MedicalSpecialty;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'ended' | 'archived';
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  color: string;
  icon: string;
  model: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ChatState {
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};