import z from "zod";

const subscriberSchema = z.object({
  email: z.email("Invalid email").min(1, "Email is required"),
});


export default subscriberSchema;