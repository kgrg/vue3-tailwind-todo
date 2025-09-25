export type ActivityCategory = 'Work' | 'Personal' | 'Learning' | 'Health' | 'Other'

export interface Activity {
  id: string
  title: string
  description: string
  category: ActivityCategory
  date: string
  time: string
  location?: string
  status: 'completed' | 'pending'
  createdAt: string
}

export interface NewActivityForm {
  title: string
  description: string
  category: ActivityCategory
  date: string
  time: string
  location?: string
}
