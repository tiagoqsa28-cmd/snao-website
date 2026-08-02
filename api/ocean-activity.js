import { createClient } from "redis";

const VISITORS_KEY = "snao:ocean:visitors";
const ONLINE_KEY = "snao:ocean:online";
const ONLINE_WINDOW_MS = 2 * 60 * 1000;

let redisClient;

async function getRedisClient() {
    if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL is missing");
    }

    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL
        });

        redisClient.on("error", (error) => {
            console.error("Redis error:", error);
        });
    }

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;
}

export default {
    async fetch(request) {
        if (request.method !== "POST") {
            return Response.json(
                { error: "Method not allowed" },
                { status: 405 }
            );
        }

        try {
            const body = await request.json();
            const visitorId = body?.visitorId;

            if (
                typeof visitorId !== "string" ||
                visitorId.length < 10 ||
                visitorId.length > 100
            ) {
                return Response.json(
                    { error: "Invalid visitor ID" },
                    { status: 400 }
                );
            }

            const redis = await getRedisClient();

            const now = Date.now();
            const onlineLimit =
                now - ONLINE_WINDOW_MS;

            const transaction = redis.multi();

            transaction.sAdd(
                VISITORS_KEY,
                visitorId
            );

            transaction.zAdd(
                ONLINE_KEY,
                {
                    score: now,
                    value: visitorId
                }
            );

            transaction.zRemRangeByScore(
                ONLINE_KEY,
                0,
                onlineLimit
            );

            transaction.sCard(
                VISITORS_KEY
            );

            transaction.zCard(
                ONLINE_KEY
            );

            const results =
                await transaction.exec();

            const totalVisitors =
                Number(results[3]) || 0;

            const onlineNow =
                Number(results[4]) || 0;

            return Response.json(
                {
                    totalVisitors,
                    onlineNow
                },
                {
                    headers: {
                        "Cache-Control":
                            "no-store, no-cache, must-revalidate"
                    }
                }
            );
        } catch (error) {
            console.error(
                "Ocean activity error:",
                error
            );

            return Response.json(
                {
                    error:
                        "Unable to load Ocean activity"
                },
                {
                    status: 500
                }
            );
        }
    }
};