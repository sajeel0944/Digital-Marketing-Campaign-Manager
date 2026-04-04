export interface AuthSchema {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface User {
  email: string;
  token: string;
}