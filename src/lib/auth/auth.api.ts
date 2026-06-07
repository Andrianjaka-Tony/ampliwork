import { apiFetch } from "@/lib/api/api.client";

import {
  loginRequestSchema,
  loginResponseSchema,
  type LoginRequest,
  type PublicUser,
} from "./auth.schema";

const LOGIN_ENDPOINT = "/api/auth/login";

export function login(credentials: LoginRequest): Promise<PublicUser> {
  const body = loginRequestSchema.parse(credentials);

  return apiFetch(LOGIN_ENDPOINT, {
    method: "POST",
    body,
    schema: loginResponseSchema,
  });
}
