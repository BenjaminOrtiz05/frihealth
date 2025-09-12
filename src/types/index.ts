export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  email?: string;
  isGuest: boolean;
}
