import { createLimiter, timeWindow } from "./baseLimiter.js";

export const emailCampaignLimiter = createLimiter({
  windowMs: timeWindow.ONE_HOUR,
  limit: 5,
  message: {
    success: false,
    message: "Too many email requests, please try again after an hour",
  },
});
