export interface User {
    id: number;
    username: string;
    email: string;
    role: 'superadmin' | 'admin' | 'volunteer';
    skills?: string;
    availability?: string;
  }
  
  export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
  }