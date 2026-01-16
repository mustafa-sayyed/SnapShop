import z from "zod";

export const emailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  audience: z.enum(["all", "subscribers", "unsubsscribed"], {
    required_error: "Audience is required",
  }),
});
