export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Work' | 'Personal' | 'Learning' | 'Health' | 'Other';
  date: string;
  time: string;
  location?: string;
  completed: boolean;
}

export interface NewActivityForm {
  title: string;
  description: string;
  category: Activity['category'];
  date: string;
  time: string;
  location?: string;
} 