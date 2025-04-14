
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
  lastLogin?: string;
  isAdmin?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
}
