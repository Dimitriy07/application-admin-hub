import redis from "@/app/_lib/redis";

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 1 * 60 * 1000; // 1 minute
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

type RateLimit = {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
};

export async function rateLimitCheck(
  ip: string,
  isSubmitted = false
): Promise<{
  allowed: boolean;
  reason?: string;
  blockedUntil?: number;
}> {
  const now = Date.now();
  const key = `ratelimit:${ip}`;
  const data = await redis.get<RateLimit>(key);

  // IP is currently blocked
  if (data?.blockedUntil && now < data.blockedUntil) {
    return {
      allowed: false,
      reason: "cooldown",
      blockedUntil: data.blockedUntil,
    };
  }

  // New or expired window
  if (!data || now - data.lastAttempt > WINDOW_MS) {
    await redis.set(
      key,
      {
        count: 1,
        lastAttempt: now,
      },
      { px: WINDOW_MS + COOLDOWN_MS }
    );
    return { allowed: true };
  }

  const newRecord: RateLimit = {
    count: isSubmitted ? data.count + 1 : data.count,
    lastAttempt: now,
  };

  if (newRecord.count && newRecord.count > MAX_ATTEMPTS) {
    newRecord.blockedUntil = now + COOLDOWN_MS;
    await redis.set(key, newRecord, { px: WINDOW_MS + COOLDOWN_MS });
    return {
      allowed: false,
      reason: "limit-exceeded",
      blockedUntil: newRecord.blockedUntil,
    };
  }
  if (isSubmitted) {
    await redis.set(key, newRecord, { px: WINDOW_MS + COOLDOWN_MS });
  }

  return { allowed: true };
}
