import z from "zod";

const featuredBannerSchema = z.object({
  bannerTitle: z.string().optional(),
  bannerDescription: z.string().optional(),
  bannerLink: z.string().optional(),
  isActive: z.coerce.boolean().default(false),
});

export default featuredBannerSchema;
