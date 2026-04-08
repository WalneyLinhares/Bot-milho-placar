import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 120000,
    max: 5
});