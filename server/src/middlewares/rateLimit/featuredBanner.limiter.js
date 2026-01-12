import { createLimiter, timeWindow } from "./baseLimiter";

export const addFeaturedBannerLimiter = createLimiter({
  windowMs: timeWindow.FIFTEEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message:
      "Too many requests to add featured banners, please try again after 15 minutes",
  },
});

export const deleteFeaturedBannerLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message:
      "Too many requests to delete featured banners, please try again after 10 minutes",
  },
});

export const toggleFeaturedBannerLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 15,
  message: {
    success: false,
    message:
      "Too many requests to toggle featured banners, please try again after 10 minutes",
  },
});


