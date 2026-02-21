export type UserRole = 'user' | 'admin';

export interface User {
  readonly id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
}

export type UserPayload = Omit<User, 'passwordHash'>;

export interface Session {
  user: UserPayload;
  expiresAt: string;
}
