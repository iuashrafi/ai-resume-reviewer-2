import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaDto = z.infer<typeof LoginSchema>;

export type User = {
  id: string;
  email: string;
};
