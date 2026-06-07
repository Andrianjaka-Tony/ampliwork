import fs from "node:fs";
import path from "node:path";

import { userDataSchema, type UserData } from "./auth.schema";

let cache: UserData | null = null;

export function getUserData(): UserData {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), "data", "users", "user.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed: unknown = JSON.parse(raw);

  cache = userDataSchema.parse(parsed);
  return cache;
}

export function getUsers() {
  return getUserData().users;
}

export function getTabAccessMatrix() {
  return getUserData().tabAccessMatrix;
}
