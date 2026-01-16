import { z } from "zod";

export const FeedbackSchema = z.object({
  type: z.string().min(1, "Feedback type is required"),
  feedbackText: z.string().min(1, "Feedback text is required"),
  feedbackImages: z.array(z.string()).optional(),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;
