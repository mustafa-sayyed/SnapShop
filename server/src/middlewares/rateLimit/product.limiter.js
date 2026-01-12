import { createLimiter, timeWindow } from "./baseLimiter";

export const addProductLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 20,
  message: {
    success: false,
    message: "Too many requests to add products, please try again after 10 minutes",
  },
});

export const deleteProductLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 20,
  message: {
    success: false,
    message: "Too many requests to delete products, please try again after 10 minutes",
  },
});
