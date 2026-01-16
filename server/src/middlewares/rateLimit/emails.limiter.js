import { createLimiter, timeWindow } from "./baseLimiter";

export const sendEmailLimiter = createLimiter({
  windowMs: timeWindow.ONE_HOUR,
  limit: 2,
  message: {
    success: false,
    message: "Too many email requests, please try again after an hour",
  },
});
