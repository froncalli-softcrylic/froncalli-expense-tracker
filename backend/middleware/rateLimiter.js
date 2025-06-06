import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // In a real-world application, you might want to limit the rate based on user ID or IP address.
    // Here we are using a generic key "my-rate-limit" for demonstration purposes.
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error:", error);
    next(error);
  }
};

export default rateLimiter;
