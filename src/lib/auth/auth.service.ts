import { createHash, timingSafeEqual } from "node:crypto";

import { getUsers } from "./auth.data";
import { publicUserSchema, type LoginRequest, type PublicUser, type User } from "./auth.schema";

export function getPublicUsers(): PublicUser[] {
  return getUsers().map((user) => publicUserSchema.parse(user));
}

function toPublicUser(user: User): PublicUser {
  return publicUserSchema.parse(user);
}

function safeEqual(a: string, b: string): boolean {
  const ha = Uint8Array.from(createHash("sha256").update(a).digest());
  const hb = Uint8Array.from(createHash("sha256").update(b).digest());
  return timingSafeEqual(ha, hb);
}

export function authenticate({ email, password }: LoginRequest): PublicUser | null {
  const users = getUsers();
  const user = users.find((candidate) => candidate.email.toLowerCase() === email);

  const reference = user?.password ?? "$nonexistent-account$";
  const passwordMatches = safeEqual(password, reference);

  if (!user || !passwordMatches || !user.active) return null;

  return toPublicUser(user);
}
