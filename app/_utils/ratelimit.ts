const ipAttempts = new Map<
  string,
  { count: number; lastAttempt: number; blockedUntil?: number }
>();

const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 1000; // 1 minute
// const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const COOLDOWN_MS = 10 * 1000; // 5 minutes

export function rateLimitCheck(
  ip: string,
  isSubmited = false
): {
  allowed: boolean;
  reason?: string;
  blockedUntil?: number;
} {
  console.log(ipAttempts);

  const now = Date.now();
  const record = ipAttempts.get(ip);

  // IP is currently blocked
  if (record?.blockedUntil && now < record.blockedUntil) {
    return {
      allowed: false,
      reason: "cooldown",
      blockedUntil: record.blockedUntil,
    };
  }

  if (!record || now - record.lastAttempt > WINDOW_MS) {
    // Reset window
    ipAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }
  if (isSubmited) {
    record.count += 1;
    record.lastAttempt = now;
  }

  if (record.count > MAX_ATTEMPTS) {
    record.blockedUntil = now + COOLDOWN_MS;
    console.warn(`Rate limit exceeded by IP: ${ip}`);
    return {
      allowed: false,
      reason: "limit-exceeded",
      blockedUntil: record.blockedUntil,
    };
  }

  return { allowed: true };
}
