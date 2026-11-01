import { createClient } from "redis";

const SALE_CONTRACT =
    "0x34d584CA40813816F87530bf826cC6A8e2A44c09";

const CHAIN_ID = 56;

const REFERRAL_PURCHASES_KEY =
    "snao:referrals:purchases";

let redisClient;


async function getRedisClient() {

    if (!process.env.REDIS_URL) {
        throw new Error(
            "REDIS_URL is missing"
        );
    }

    if (!redisClient) {

        redisClient =
            createClient({
                url:
                    process.env.REDIS_URL
            });

        redisClient.on(
            "error",
            (error) => {
                console.error(
                    "Redis error:",
                    error
                );
            }
        );

    }

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;

}


function sanitizeReferralCode(
    value
) {

    if (
        typeof value !== "string"
    ) {
        return null;
    }

    const cleaned =
        value
            .trim()
            .toLowerCase()
            .replace(
                /[^a-z0-9_-]/g,
                ""
            )
            .slice(
                0,
                40
            );

    return cleaned || null;

}


function isValidAddress(
    value
) {

    return (
        typeof value === "string" &&
        /^0x[a-fA-F0-9]{40}$/.test(
            value
        )
    );

}


function isValidTransactionHash(
    value
) {

    return (
        typeof value === "string" &&
        /^0x[a-fA-F0-9]{64}$/.test(
            value
        )
    );

}


export default {

    async fetch(request) {

        if (
            request.method !== "POST"
        ) {

            return Response.json(
                {
                    error:
                        "Method not allowed"
                },
                {
                    status: 405
                }
            );

        }


        try {

            const body =
                await request.json();


            const referralCode =
                sanitizeReferralCode(
                    body?.referralCode
                );


            const buyer =
                typeof body?.buyer ===
                "string"
                    ? body.buyer
                        .toLowerCase()
                    : null;


            const transactionHash =
                typeof body?.transactionHash ===
                    "string"
                    ? body.transactionHash
                        .toLowerCase()
                    : null;


            const saleContract =
                typeof body?.saleContract ===
                    "string"
                    ? body.saleContract
                        .toLowerCase()
                    : null;


            if (!referralCode) {

                return Response.json(
                    {
                        error:
                            "Invalid referral code"
                    },
                    {
                        status: 400
                    }
                );

            }


            if (
                !isValidAddress(
                    buyer
                )
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid buyer wallet"
                    },
                    {
                        status: 400
                    }
                );

            }


            if (
                !isValidTransactionHash(
                    transactionHash
                )
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid transaction hash"
                    },
                    {
                        status: 400
                    }
                );

            }


            if (
                saleContract !==
                SALE_CONTRACT.toLowerCase()
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid sale contract"
                    },
                    {
                        status: 400
                    }
                );

            }


            if (
                Number(body?.chainId) !==
                CHAIN_ID
            ) {

                return Response.json(
                    {
                        error:
                            "Invalid blockchain"
                    },
                    {
                        status: 400
                    }
                );

            }


            const redis =
                await getRedisClient();


            const transactionKey =
                `snao:referral:tx:${transactionHash}`;


            const alreadyRecorded =
                await redis.exists(
                    transactionKey
                );


            if (alreadyRecorded) {

                return Response.json(
                    {
                        success: true,
                        duplicate: true
                    }
                );

            }


            const record = {

                referralCode,

                buyer,

                transactionHash,

                chainId:
                    CHAIN_ID,

                saleContract:
                    SALE_CONTRACT.toLowerCase(),

                paymentAmount:
                    String(
                        body?.paymentAmount ??
                        ""
                    ),

                tokenAmount:
                    String(
                        body?.tokenAmount ??
                        ""
                    ),

                createdAt:
                    new Date()
                        .toISOString(),

                verified:
                    false

            };


            const transaction =
                redis.multi();


            transaction.set(
                transactionKey,
                JSON.stringify(
                    record
                )
            );


            transaction.rPush(
                REFERRAL_PURCHASES_KEY,
                JSON.stringify(
                    record
                )
            );


            await transaction.exec();


            return Response.json(
                {
                    success: true,
                    duplicate: false,
                    verified: false
                },
                {
                    headers: {
                        "Cache-Control":
                            "no-store"
                    }
                }
            );


        } catch (error) {

            console.error(
                "Referral purchase error:",
                error
            );


            return Response.json(
                {
                    error:
                        "Unable to record referral purchase"
                },
                {
                    status: 500
                }
            );

        }

    }

};
