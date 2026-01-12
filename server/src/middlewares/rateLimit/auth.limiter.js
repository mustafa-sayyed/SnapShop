import { createLimiter, timeWindow } from "./baseLimiter.js";

export const loginLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message: "Too many request for login, please try agin after 10 minutes.",
  },
});

export const signupLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 10,
  message: {
    success: false,
    message: "Too many request for registration, please try again after 10 minutes",
  },
});

export const adminLoginLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 5,
  message: {
    success: false,
    message: "Too many request for admin login, please try again after 10 minutes",
  },
});

export const googleLoginLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 15,
  message: {
    success: false,
    message: "Too many request for Google login, please try again after 10 minutes",
  },
});

export const deleteUserLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 30,
  message: {
    success: false,
    message: "Too many requests to delete user, please try again after 10 minutes",
  },
});

export const forgotPasswordLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 5,
  message: {
    success: false,
    message: "Too many requests for password reset, please try again after 10 minutes",
  },
});

export const resetPasswordLimiter = createLimiter({
  windowMs: timeWindow.TEN_MINUTES,
  limit: 5,
  message: {
    success: false,
    message: "Too many requests to reset password, please try again after 10 minutes",
  },
});
