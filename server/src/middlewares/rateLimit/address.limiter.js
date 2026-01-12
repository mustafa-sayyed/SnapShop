import { createLimiter, timeWindow } from "./baseLimiter";

export const addAddressLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message: "Too many requests to add address, please try again after 10 minutes",
  },
});

export const deleteAddressLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message: "Too many requests to delete address, please try again after 10 minutes",
  },
});

export const updateAddressLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message: "Too many request to update address, please try again after 10 minutes",
  },
});
