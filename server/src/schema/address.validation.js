import z from "zod";

const addressSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Invalid Pincode, must be 6 digits"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export default addressSchema;
