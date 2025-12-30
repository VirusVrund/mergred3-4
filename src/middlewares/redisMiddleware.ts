
import { Request, Response, NextFunction } from "express";
import {redisClient} from "../config/redisClient";
import { hashApiKey } from "../utils/hash";
import { permission } from "node:process";

export async function redisMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const rawKey = req.header("x-api-key");
    if (!rawKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    const keyHash = hashApiKey(rawKey);

    const invalidCacheKey = `apikey:cache:invalid:${keyHash}`;
    const validCacheKey = `apikey:cache:valid:${keyHash}`;
    const storeKey = `apikey:store:${keyHash}`;

    // 1️⃣ Cached invalid key
    const invalid = await redisClient.get(invalidCacheKey);
    if (invalid) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // 2️⃣ Cached valid key
    const cachedValid = await redisClient.get(validCacheKey);
    if (cachedValid) {
      req.apiKey = JSON.parse(cachedValid);
      return next();
    }

    // 3️⃣ Permanent store lookup
    const stored = await redisClient.get(storeKey);
    if (!stored) {
      await redisClient.set(invalidCacheKey, "1", { EX: 60 });
      return res.status(401).json({ error: "Invalid API key" });
    }

    const data = JSON.parse(stored);

    if (!data.isActive) {
      await redisClient.set(invalidCacheKey, "1", { EX: 60 });
      return res.status(401).json({ error: "API key disabled" });
    }

    const payload = {
      permissions: data.permissions,
    };

    // 4️⃣ Cache valid payload
    await redisClient.set(validCacheKey, JSON.stringify(payload), { EX: 900 });

    req.apiKey = payload;
    next();
  } catch (err) {
    console.error("API key auth error:", err);
    res.status(500).json({ error: "Internal auth error" });
  }
}