import { z } from "zod";

export const roleSchema = z.enum(["admin", "finance_lead", "analyst", "viewer"]);
export type Role = z.infer<typeof roleSchema>;

export const tabSchema = z.enum(["transactions", "stats", "custom"]);
export type Tab = z.infer<typeof tabSchema>;

export const departmentSchema = z.enum(["Executive", "Finance", "Engineering"]);
export type Department = z.infer<typeof departmentSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  password: z.string(),
  name: z.string(),
  title: z.string(),
  role: roleSchema,
  allowedTabs: z.array(tabSchema),
  department: departmentSchema,
  active: z.boolean(),

  createdAt: z.iso.date(),
});
export type User = z.infer<typeof userSchema>;

export const publicUserSchema = userSchema.omit({ password: true });
export type PublicUser = z.infer<typeof publicUserSchema>;

export const publicUserListSchema = z.array(publicUserSchema);

export const sessionSchema = publicUserSchema.pick({
  id: true,
  name: true,
  role: true,
  allowedTabs: true,
});
export type Session = z.infer<typeof sessionSchema>;

export const tabAccessMatrixSchema = z.record(tabSchema, z.array(roleSchema));
export type TabAccessMatrix = z.infer<typeof tabAccessMatrixSchema>;

export const userDataSchema = z.object({
  company: z.string(),
  authNote: z.string(),
  tabAccessMatrix: tabAccessMatrixSchema,
  users: z.array(userSchema),
});
export type UserData = z.infer<typeof userDataSchema>;

export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required."),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = publicUserSchema;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
