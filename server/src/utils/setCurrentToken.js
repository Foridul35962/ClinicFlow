import redis from "../db/redis.js";

export const setCurrentToken = async (doctorId, tokenNumber) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const redisKey = `queue:${doctorId}:${todayStr}`;

    await redis.set(redisKey, String(tokenNumber), "EX", 6 * 60 * 60);
}