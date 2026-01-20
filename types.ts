
export interface Todo {
  id: string;
  created_at: string;
  title: string;
  is_completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface AISuggestion {
  message: string;
  recommendation: string;
}
