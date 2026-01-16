import { z } from "zod";

export const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
