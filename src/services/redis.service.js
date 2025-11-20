"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

// Xử lý kết nối Redis (quan trọng cho Redis v4+)
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTime = 10;
  const expireTime = 3000; // 3 giây tạm lock

  for (let i = 0; i < retryTime; i++) {
    // Tạo một key, ai nắm giữ được key thì được vào thanh toán
    // Dùng SET với NX (Not Exist) và PX (Expire theo ms) để đảm bảo tính nguyên tử
    const result = await redisClient.set(key, cartId, {
      NX: true,
      PX: expireTime,
    });

    console.log(`Result lock for ${key}:`, result);

    if (result === "OK") {
      return key;
    } else {
      // Nếu chưa lấy được, chờ 50ms rồi thử lại
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  return null;
};

const releaseLock = async (keyLock) => {
  return await redisClient.del(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
