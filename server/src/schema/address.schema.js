import z, { refine } from "zod";

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  pincode: z.coerce
    .number("Pincode must be a number")
    .refine((val) => `${val}`.length === 6, "Invalid Pincode, must be 6 digits"),
  phone: z.coerce
    .number("Phone no. must be number")
    .refine((val) => `${val}`.length === 10, "Invalid Phone no, must be 10 digits"),
  isDefault: z.boolean().default(false),
});

export default addressSchema;
