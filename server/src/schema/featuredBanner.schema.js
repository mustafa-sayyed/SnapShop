import z from "zod";

const featuredBannerSchema = z.object({
  bannerImage: z.string().min(1, "Banner image is required"),
  bannerTitle: z.string().optional(),
  bannerLink: z.string().optional(),
  isActive: z.boolean().default(false),
});

export default featuredBannerSchema;
