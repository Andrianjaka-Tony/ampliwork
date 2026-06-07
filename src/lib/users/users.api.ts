import { apiFetch } from "@/lib/api/api.client";
import { publicUserListSchema, type PublicUser } from "@/lib/auth/auth.schema";

export function getUsers(signal?: AbortSignal): Promise<PublicUser[]> {
  return apiFetch("/api/users", { schema: publicUserListSchema, signal });
}
