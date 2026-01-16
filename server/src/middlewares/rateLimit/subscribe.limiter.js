import { createLimiter, timeWindow } from "./baseLimiter.js";

export const subscribeLimiter = createLimiter({
  windowMs: timeWindow.FIFTEEN_MINUTES,
  limit: 5,
  message: {
    success: false,
    message: "Too many requests to subscribe, please try again after 10 minutes",
  },
});

export const unsubscribeLimiter = createLimiter({
  windowMs: timeWindow.FIFTEEN_MINUTES,
  limit: 5,
  message: {
    success: false,
    message: "Too many requests to unsubscribe, please try again after 10 minutes",
  },
});

export const deleteSubscriberLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 40,
  message: {
    success: false,
    message: "Too many requests to delete subscriber, please try again after 10 minutes",
  },
});
