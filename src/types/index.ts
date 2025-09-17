export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  createdAt: any; 
  updatedAt: any; 
  userId?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Advice {
  slip: {
    id: number;
    advice: string;
  };
}