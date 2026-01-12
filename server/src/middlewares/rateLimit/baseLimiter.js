import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const timeWindow = {
  TEN_MINUTES: 10 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
};

export const createLimiter = ({
  windowMs = timeWindow.FIFTEEN_MINUTES,
  limit = 200,
  message = {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  keyGenerator = (req, res) => ipKeyGenerator(req.ip),
}) => {
  return rateLimit({
    windowMs,
    limit,
    message,
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
