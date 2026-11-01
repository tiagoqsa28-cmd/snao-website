import { createClient } from "redis";
import { ethers } from "ethers";


const SALE_CONTRACT =
    "0x34d584CA40813816F87530bf826cC6A8e2A44c09";

const CHAIN_ID =
    56;

const BSC_RPC_URL =
    "https://bsc-dataseed.binance.org/";

const REFERRAL_PURCHASES_KEY =
    "snao:referrals:purchases";

const APPROVED_REFERRALS = {
    trixie: {
        name: "Trixie",
        active: true
    }
};


const SALE_ABI = [
    "event TokensPurchased(address indexed buyer,uint256 tokenAmount,uint256 paymentAmount)"
];


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


async function verifyPurchaseOnChain({
    transactionHash,
    buyer
}) {

    const provider =
        new ethers.JsonRpcProvider(
            BSC_RPC_URL,
            CHAIN_ID
        );


    const receipt =
        await provider.getTransactionReceipt(
            transactionHash
        );


    if (!receipt) {

        throw new Error(
            "Transaction receipt not found"
        );

    }


    if (Number(receipt.status) !== 1) {

        throw new Error(
            "Transaction was not successful"
        );

    }


    if (
        !receipt.to ||
        receipt.to.toLowerCase() !==
            SALE_CONTRACT.toLowerCase()
    ) {

        throw new Error(
            "Transaction was not sent to the official sale contract"
        );

    }


    const saleInterface =
        new ethers.Interface(
            SALE_ABI
        );


    let confirmedPurchase =
        null;


    for (
        const log
        of receipt.logs
    ) {

        if (
            !log.address ||
            log.address.toLowerCase() !==
                SALE_CONTRACT.toLowerCase()
        ) {

            continue;

        }


        try {

            const parsed =
                saleInterface.parseLog(
                    log
                );


            if (
                parsed &&
                parsed.name ===
                    "TokensPurchased"
            ) {

                const eventBuyer =
                    String(
                        parsed.args.buyer
                    ).toLowerCase();


                if (
                    eventBuyer !==
                    buyer.toLowerCase()
                ) {

                    continue;

                }


                confirmedPurchase = {

                    buyer:
                        eventBuyer,

                    tokenAmount:
                        parsed.args
                            .tokenAmount
                            .toString(),

                    paymentAmount:
                        parsed.args
                            .paymentAmount
                            .toString(),

                    blockNumber:
                        Number(
                            receipt.blockNumber
                        )

                };


                break;

            }

        } catch (error) {

            // Ignore unrelated logs.

        }

    }


    if (!confirmedPurchase) {

        throw new Error(
            "Valid TokensPurchased event not found"
        );

    }


    return confirmedPurchase;

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

            const approvedReferral =
    APPROVED_REFERRALS[
        referralCode
    ];


if (
    !approvedReferral ||
    approvedReferral.active !== true
) {

    return Response.json(
        {
            error:
                "Referral code is not approved"
        },
        {
            status: 403
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
                    SALE_CONTRACT
                        .toLowerCase()
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
                Number(
                    body?.chainId
                ) !== CHAIN_ID
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

                const existingRecord =
                    await redis.get(
                        transactionKey
                    );


                return Response.json(
                    {
                        success:
                            true,

                        duplicate:
                            true,

                        verified:
                            true,

                        purchase:
                            existingRecord
                                ? JSON.parse(
                                    existingRecord
                                )
                                : null
                    }
                );

            }


            /*
             * IMPORTANT:
             *
             * Values sent by the browser are NOT trusted.
             *
             * The authoritative buyer, SNAO amount and
             * payment amount are extracted directly from
             * the TokensPurchased event on BNB Smart Chain.
             */

            const confirmedPurchase =
                await verifyPurchaseOnChain({
                    transactionHash,
                    buyer
                });


            const record = {

                referralCode,

                buyer:
                    confirmedPurchase
                        .buyer,

                transactionHash,

                chainId:
                    CHAIN_ID,

                saleContract:
                    SALE_CONTRACT
                        .toLowerCase(),

                paymentAmount:
                    confirmedPurchase
                        .paymentAmount,

                tokenAmount:
                    confirmedPurchase
                        .tokenAmount,

                blockNumber:
                    confirmedPurchase
                        .blockNumber,

                createdAt:
                    new Date()
                        .toISOString(),

                verified:
                    true

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
                    success:
                        true,

                    duplicate:
                        false,

                    verified:
                        true,

                    purchase:
                        record
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
                        "Unable to verify referral purchase"
                },
                {
                    status: 400
                }
            );

        }

    }

};
