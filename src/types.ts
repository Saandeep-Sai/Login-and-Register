export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Simulated for demo purposes
  createdAt: string;
  avatarSeed: string; // Icon or color theme key
  role: string; // Professional, Enthusiast, Student
}

export interface UserSession {
  currentUser: User | null;
  loginTime: string | null;
  deviceInfo: string;
}

export interface SecureNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Finance' | 'Secret';
  createdAt: string;
}
