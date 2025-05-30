import { Redis } from "@upstash/redis";
import config from "@/lib/config";

const redis = new Redis({
  url: config.env.upstash.redisURL || "Error in URL",
  token: config.env.upstash.redisToken || "Error in Token",
});

export default redis;
