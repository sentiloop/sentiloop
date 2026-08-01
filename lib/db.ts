/**
 * ⚠️ DEMO: In-memory user store.
 * This is for demonstration purposes only.
 * In production, replace with a real database (PostgreSQL, MongoDB, etc.).
 */

export type UserRole = "admin" | "manager" | "sales" | "employee";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  otpCode: string | null;
  otpExpiry: number | null;
  resetToken: string | null;
  resetExpiry: number | null;
  verifyToken: string | null;
  provider: string | null;
}

// ⚠️ DEMO: Data is lost on server restart. Not suitable for production.
const users: User[] = [];

let nextId = 1;

export function generateId(): string {
  return `user_${nextId++}_${Date.now().toString(36)}`;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function findUserByResetToken(token: string): User | undefined {
  return users.find((u) => u.resetToken === token && u.resetExpiry && u.resetExpiry > Date.now());
}

export function findUserByVerifyToken(token: string): User | undefined {
  return users.find((u) => u.verifyToken === token);
}

export function createUser(data: Omit<User, "id">): User {
  const user: User = { id: generateId(), ...data };
  users.push(user);
  return user;
}

export function updateUser(id: string, data: Partial<Omit<User, "id">>): User | undefined {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...data };
  return users[index];
}
