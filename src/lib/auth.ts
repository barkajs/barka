import crypto from 'node:crypto';
import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema.js';

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

export async function createUser(
  db: BetterSQLite3Database<typeof schema>,
  email: string,
  password: string,
  name: string,
  role: string = 'editor',
): Promise<string> {
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  db.insert(schema.users).values({
    id, email, passwordHash, name, role, createdAt: new Date(),
  }).run();
  return id;
}

export function createSession(
  db: BetterSQLite3Database<typeof schema>,
  userId: string,
): string {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  db.insert(schema.sessions).values({ id, userId, expiresAt }).run();
  return id;
}

export function validateSession(
  db: BetterSQLite3Database<typeof schema>,
  sessionId: string,
): { userId: string; role: string; name: string; email: string } | null {
  const session = db.select().from(schema.sessions).where(eq(schema.sessions.id, sessionId)).get();
  if (!session || session.expiresAt < new Date()) {
    if (session) db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
    return null;
  }
  const user = db.select().from(schema.users).where(eq(schema.users.id, session.userId)).get();
  if (!user) return null;
  return { userId: user.id, role: user.role, name: user.name, email: user.email };
}

export function destroySession(
  db: BetterSQLite3Database<typeof schema>,
  sessionId: string,
): void {
  db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
}
