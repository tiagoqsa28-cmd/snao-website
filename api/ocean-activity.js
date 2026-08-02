const VISITORS_KEY = "snao:ocean:visitors";
const ONLINE_KEY = "snao:ocean:online";
const ONLINE_WINDOW_MS = 2 * 60 * 1000;

function getRedisCredentials() {
    const url =
        process.env.STORAGE_REDIS_REST_URL ||
        process.env.UPSTASH_REDIS_REST_URL;

    const token =
        process.env.STORAGE_REDIS_REST_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN;

    return { url, token };
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
            const { visitorId } = await request.json();

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

            const { url, token } = getRedisCredentials();

            if (!url || !token) {
                return Response.json(
                    { error: "Redis environment variables are missing" },
                    { status: 500 }
                );
            }

            const now = Date.now();
            const onlineLimit = now - ONLINE_WINDOW_MS;

            const redisResponse = await fetch(`${url}/pipeline`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([
                    ["SADD", VISITORS_KEY, visitorId],
                    ["ZADD", ONLINE_KEY, now, visitorId],
                    ["ZREMRANGEBYSCORE", ONLINE_KEY, 0, onlineLimit],
                    ["SCARD", VISITORS_KEY],
                    ["ZCARD", ONLINE_KEY]
                ])
            });

            if (!redisResponse.ok) {
                throw new Error(
                    `Redis request failed: ${redisResponse.status}`
                );
            }

            const results = await redisResponse.json();

            const totalVisitors =
                Number(results?.[3]?.result) || 0;

            const onlineNow =
                Number(results?.[4]?.result) || 0;

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
            console.error("Ocean activity error:", error);

            return Response.json(
                { error: "Unable to load Ocean activity" },
                { status: 500 }
            );
        }
    }
};