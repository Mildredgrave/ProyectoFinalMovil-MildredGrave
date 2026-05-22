import type { User } from "../../domain/user/user.type";

const USERS_KEY = "users-v1";

export function getAllUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw) as User[];
}

export function findUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function saveUser(user: User): void {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function userExists(email: string): boolean {
  return findUserByEmail(email) !== null;
}
