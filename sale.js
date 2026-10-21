/* =====================================================
   SNAO PUBLIC SALE
   sale.js

   FRONTEND ↔ SNAO SALE CONTRACT
===================================================== */


/* =====================================================
   CONFIGURATION

   IMPORTANT:
   After MAINNET deployment we only need to place the
   verified addresses below.

   Until then:
   - wallet connection works
   - sale remains PRE-LAUNCH
   - approve is disabled
   - purchase is disabled
===================================================== */

const SALE_CONFIG = {

    chainId:
        56,

    chainIdHex:
        "0x38",

    network:
        "BNB Smart Chain",

    rpcUrl:
        "https://bsc-dataseed.binance.org/",

    blockExplorer:
        "https://bscscan.com",

    saleTokenSymbol:
        "SNAO",

    paymentSymbol:
        "USDT",

    gasSymbol:
        "BNB",

    totalSupply:
        200_000_000,

    totalSaleTokens:
        45_000_000,

    startingPrice:
        0.001,

    softCap:
        250_000,

    hardCap:
        5_000_000,

    lotSize:
        25_000,

    totalLots:
        1_800,

    maxTokensPerTx:
        2_500_000,

    /*
     * OFFICIAL SALE START
     *
     * 01 November 2026
     * 15:00 UTC
     * 11:00 Mato Grosso
     */

    scheduledStart:
        "2026-11-01T15:00:00Z",

    /*
     * MAINNET ADDRESSES
     *
     * DO NOT fill these with testnet addresses.
     *
     * We will insert the verified mainnet addresses
     * after deployment.
     */

    saleContract:
        null,

    paymentToken:
        null

};


/* =====================================================
   CONTRACT ABIs
===================================================== */

const SNAO_SALE_ABI = [

    "function paymentToken() view returns (address)",

    "function paymentTokenDecimals() view returns (uint8)",

    "function paymentTokenUnit() view returns (uint256)",

    "function startTime() view returns (uint256)",

    "function endTime() view returns (uint256)",

    "function SOFT_CAP() view returns (uint256)",

    "function HARD_CAP() view returns (uint256)",

    "function LOT_SIZE() view returns (uint256)",

    "function MAX_LOTS() view returns (uint256)",

    "function MAX_TOKENS_FOR_SALE() view returns (uint256)",

    "function MAX_TOKENS_PER_TX() view returns (uint256)",

    "function totalTokensSold() view returns (uint256)",

    "function totalRaised() view returns (uint256)",

    "function finalized() view returns (bool)",

    "function successful() view returns (bool)",

    "function fundsWithdrawn() view returns (bool)",

    "function contributions(address) view returns (uint256)",

    "function currentLot() view returns (uint256)",

    "function currentPrice() view returns (uint256)",

    "function quoteCost(uint256 tokenAmount) view returns (uint256)",

    "function buyTokens(uint256 tokenAmount)",

    "event TokensPurchased(address indexed buyer,uint256 tokenAmount,uint256 paymentAmount)",

    "event SaleFinalized(bool successful,uint256 totalRaised,uint256 totalTokensSold)",

    "event RefundClaimed(address indexed buyer,uint256 amount)"

];


const ERC20_ABI = [

    "function decimals() view returns (uint8)",

    "function symbol() view returns (string)",

    "function balanceOf(address account) view returns (uint256)",

    "function allowance(address owner,address spender) view returns (uint256)",

    "function approve(address spender,uint256 amount) returns (bool)"

];


/* =====================================================
   STATE
===================================================== */

let browserProvider =
    null;

let signer =
    null;

let connectedAccount =
    null;

let saleContract =
    null;

let paymentContract =
    null;

let paymentDecimals =
    6;

let quotedTokenAmount =
    0n;

let quotedPaymentAmount =
    0n;

let refreshTimer =
    null;

let quoteTimer =
    null;

let transactionRunning =
    false;


/* =====================================================
   ELEMENT HELPERS
===================================================== */

function saleGetElement(id) {

    return document.getElementById(
        id
    );

}


function saleGetFirstElement(
    ...ids
) {

    for (
        const id
        of ids
    ) {

        const element =
            saleGetElement(id);

        if (element) {

            return element;

        }

    }


    return null;

}


function saleSetText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        value;

}


/* =====================================================
   PAGE ELEMENTS

   Some aliases are intentionally supported so the
   integration also works with the IDs already present
   in the current sale.html.
===================================================== */

const saleMenuButton =
    saleGetElement(
        "saleMenuButton"
    );


const saleNavigation =
    saleGetElement(
        "saleNavigation"
    );


const saleConnectButton =
    saleGetElement(
        "saleConnectButton"
    );


const saleBuyButton =
    saleGetElement(
        "saleBuyButton"
    );


const saleUsdtInput =
    saleGetElement(
        "saleUsdtInput"
    );


const saleSnaoOutput =
    saleGetElement(
        "saleSnaoOutput"
    );


const saleTransactionStatus =
    saleGetElement(
        "saleTransactionStatus"
    );


const saleProgressFill =
    saleGetElement(
        "saleProgressFill"
    );


const saleProgressText =
    saleGetFirstElement(
        "saleLiveStatus",
        "saleProgressText"
    );


const saleCurrentPrice =
    saleGetFirstElement(
        "saleLivePrice",
        "saleCurrentPrice"
    );


const saleTokensSold =
    saleGetElement(
        "saleTokensSold"
    );


const saleCurrentLot =
    saleGetElement(
        "saleCurrentLot"
    );


const saleTotalRaised =
    saleGetElement(
        "saleTotalRaised"
    );


const saleRemainingTokens =
    saleGetElement(
        "saleRemainingTokens"
    );


const saleUserContribution =
    saleGetElement(
        "saleUserContribution"
    );


const saleCurrentYear =
    saleGetElement(
        "saleCurrentYear"
    );


/* =====================================================
   FORMATTERS
===================================================== */

function saleFormatNumber(
    value,
    maximumFractionDigits = 2
) {

    const numericValue =
        Number(value);


    if (
        !Number.isFinite(
            numericValue
        )
    ) {

        return "0";

    }


    return numericValue
        .toLocaleString(
            "en-US",
            {
                maximumFractionDigits
            }
        );

}


function saleFormatUSD(
    value,
    maximumFractionDigits = 2
) {

    return (
        "$" +
        saleFormatNumber(
            value,
            maximumFractionDigits
        )
    );

}


function saleShortAddress(
    address
) {

    if (
        !address ||
        address.length < 10
    ) {

        return address || "";

    }


    return (
        address.slice(0, 6) +
        "..." +
        address.slice(-4)
    );

}


/* =====================================================
   STATUS MESSAGE
===================================================== */

function saleSetStatus(
    message,
    type = ""
) {

    if (
        !saleTransactionStatus
    ) {

        return;

    }


    saleTransactionStatus
        .classList
        .remove(
            "success",
            "error"
        );


    if (type) {

        saleTransactionStatus
            .classList
            .add(type);

    }


    saleTransactionStatus
        .textContent =
        message;

}


/* =====================================================
   CONTRACT CONFIGURATION
===================================================== */

function saleContractsConfigured() {

    return Boolean(

        SALE_CONFIG.saleContract &&

        SALE_CONFIG.paymentToken &&

        ethers.isAddress(
            SALE_CONFIG.saleContract
        ) &&

        ethers.isAddress(
            SALE_CONFIG.paymentToken
        )

    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function closeSaleNavigation() {

    if (!saleNavigation) {
        return;
    }


    saleNavigation
        .classList
        .remove("open");


    document.body
        .classList
        .remove(
            "sale-menu-open"
        );


    if (saleMenuButton) {

        saleMenuButton
            .setAttribute(
                "aria-expanded",
                "false"
            );


        saleMenuButton
            .textContent =
            "☰";

    }

}


function openSaleNavigation() {

    if (!saleNavigation) {
        return;
    }


    saleNavigation
        .classList
        .add("open");


    document.body
        .classList
        .add(
            "sale-menu-open"
        );


    if (saleMenuButton) {

        saleMenuButton
            .setAttribute(
                "aria-expanded",
                "true"
            );


        saleMenuButton
            .textContent =
            "×";

    }

}


if (
    saleMenuButton &&
    saleNavigation
) {

    saleMenuButton
        .addEventListener(
            "click",
            () => {

                const open =
                    saleNavigation
                        .classList
                        .contains(
                            "open"
                        );


                if (open) {

                    closeSaleNavigation();

                } else {

                    openSaleNavigation();

                }

            }
        );


    saleNavigation
        .querySelectorAll("a")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    closeSaleNavigation
                );

            }
        );

}


/* =====================================================
   CURRENT YEAR
===================================================== */

if (saleCurrentYear) {

    saleCurrentYear.textContent =
        new Date()
            .getFullYear();

}


/* =====================================================
   BNB SMART CHAIN
===================================================== */

async function ensureBscNetwork() {

    if (
        !window.ethereum
    ) {

        throw new Error(
            "No Web3 wallet detected. Install MetaMask or another compatible wallet."
        );

    }


    const currentChainId =
        await window.ethereum.request(
            {
                method:
                    "eth_chainId"
            }
        );


    if (
        currentChainId
            .toLowerCase() ===
        SALE_CONFIG.chainIdHex
            .toLowerCase()
    ) {

        return;

    }


    try {

        await window.ethereum.request(
            {
                method:
                    "wallet_switchEthereumChain",

                params:
                    [
                        {
                            chainId:
                                SALE_CONFIG.chainIdHex
                        }
                    ]
            }
        );

    } catch (error) {

        if (
            error &&
            error.code === 4902
        ) {

            await window.ethereum.request(
                {
                    method:
                        "wallet_addEthereumChain",

                    params:
                        [
                            {
                                chainId:
                                    SALE_CONFIG.chainIdHex,

                                chainName:
                                    "BNB Smart Chain",

                                nativeCurrency:
                                    {
                                        name:
                                            "BNB",

                                        symbol:
                                            "BNB",

                                        decimals:
                                            18
                                    },

                                rpcUrls:
                                    [
                                        SALE_CONFIG.rpcUrl
                                    ],

                                blockExplorerUrls:
                                    [
                                        SALE_CONFIG.blockExplorer
                                    ]
                            }
                        ]
                }
            );


            return;

        }


        throw error;

    }

}


/* =====================================================
   CONNECT WALLET
===================================================== */

async function connectSaleWallet() {

    if (
        !window.ethereum
    ) {

        saleSetStatus(
            "No compatible Web3 wallet was detected.",
            "error"
        );

        return;

    }


    try {

        if (
            saleConnectButton
        ) {

            saleConnectButton.disabled =
                true;

            saleConnectButton.textContent =
                "CONNECTING...";
        }


        await ensureBscNetwork();


        browserProvider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        await browserProvider.send(
            "eth_requestAccounts",
            []
        );


        signer =
            await browserProvider
                .getSigner();


        connectedAccount =
            await signer
                .getAddress();


        if (
            saleConnectButton
        ) {

            saleConnectButton.textContent =
                saleShortAddress(
                    connectedAccount
                );

            saleConnectButton.disabled =
                false;

        }


        if (
            !saleContractsConfigured()
        ) {

            saleSetStatus(
                "Wallet connected. Public Sale contracts are awaiting official mainnet configuration."
            );


            saleSetText(
                saleUserContribution,
                "$0"
            );


            updatePurchaseAvailability();

            return;

        }


        await initializeContracts();


        await refreshSaleData();


        saleSetStatus(
            "Wallet connected to BNB Smart Chain.",
            "success"
        );

    } catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );


        if (
            saleConnectButton
        ) {

            saleConnectButton.disabled =
                false;

            saleConnectButton.textContent =
                "CONNECT WALLET";

        }


        saleSetStatus(
            saleReadableError(error),
            "error"
        );

    }

}


/* =====================================================
   INITIALIZE CONTRACTS
===================================================== */

async function initializeContracts() {

    if (
        !saleContractsConfigured()
    ) {

        return;

    }


    if (!browserProvider) {

        browserProvider =
            new ethers.BrowserProvider(
                window.ethereum
            );

    }


    if (!signer) {

        signer =
            await browserProvider
                .getSigner();

    }


    saleContract =
        new ethers.Contract(

            SALE_CONFIG.saleContract,

            SNAO_SALE_ABI,

            signer

        );


    paymentContract =
        new ethers.Contract(

            SALE_CONFIG.paymentToken,

            ERC20_ABI,

            signer

        );


    paymentDecimals =
        Number(
            await paymentContract
                .decimals()
        );

}


/* =====================================================
   SALE STATE
===================================================== */

async function getSaleState() {

    if (!saleContract) {

        return null;

    }


    const [

        tokensSoldRaw,

        raisedRaw,

        lotRaw,

        priceRaw,

        startRaw,

        endRaw,

        finalized,

        successful

    ] = await Promise.all([

        saleContract
            .totalTokensSold(),

        saleContract
            .totalRaised(),

        saleContract
            .currentLot(),

        saleContract
            .currentPrice(),

        saleContract
            .startTime(),

        saleContract
            .endTime(),

        saleContract
            .finalized(),

        saleContract
            .successful()

    ]);


    return {

        tokensSoldRaw,

        raisedRaw,

        lotRaw,

        priceRaw,

        startRaw,

        endRaw,

        finalized,

        successful

    };

}


/* =====================================================
   RENDER SALE DATA
===================================================== */

async function refreshSaleData() {

    if (
        !saleContractsConfigured() ||
        !saleContract
    ) {

        renderPreLaunchState();

        return;

    }


    try {

        const state =
            await getSaleState();


        if (!state) {
            return;
        }


        const tokensSold =
            Number(
                ethers.formatUnits(
                    state.tokensSoldRaw,
                    18
                )
            );


        const totalRaised =
            Number(
                ethers.formatUnits(
                    state.raisedRaw,
                    paymentDecimals
                )
            );


        /*
         * currentPrice() uses 18-decimal USD precision.
         */

        const currentPriceValue =
            Number(
                ethers.formatUnits(
                    state.priceRaw,
                    18
                )
            );


        const currentLotIndex =
            Number(
                state.lotRaw
            );


        const displayLot =
            Math.min(
                currentLotIndex + 1,
                SALE_CONFIG.totalLots
            );


        const remaining =
            Math.max(
                0,
                SALE_CONFIG.totalSaleTokens -
                tokensSold
            );


        const progress =
            Math.min(
                100,
                Math.max(
                    0,
                    (
                        tokensSold /
                        SALE_CONFIG.totalSaleTokens
                    ) * 100
                )
            );


        saleSetText(
            saleCurrentPrice,
            saleFormatUSD(
                currentPriceValue,
                6
            )
        );


        saleSetText(
            saleTokensSold,

            saleFormatNumber(
                tokensSold,
                0
            ) +
            " SNAO"
        );


        saleSetText(
            saleCurrentLot,

            saleFormatNumber(
                displayLot,
                0
            ) +
            " / " +
            saleFormatNumber(
                SALE_CONFIG.totalLots,
                0
            )
        );


        saleSetText(
            saleTotalRaised,

            saleFormatUSD(
                totalRaised,
                2
            )
        );


        saleSetText(
            saleRemainingTokens,

            saleFormatNumber(
                remaining,
                0
            ) +
            " SNAO"
        );


        if (
            saleProgressFill
        ) {

            saleProgressFill
                .style
                .width =
                progress.toFixed(4) +
                "%";

        }


        await renderSaleStatus(
            state,
            tokensSold,
            totalRaised
        );


        if (
            connectedAccount
        ) {

            await refreshUserContribution();

        }


        updatePurchaseAvailability(
            state
        );

    } catch (error) {

        console.error(
            "Sale refresh error:",
            error
        );


        saleSetStatus(
            "Unable to refresh on-chain sale data.",
            "error"
        );

    }

}


/* =====================================================
   SALE STATUS
===================================================== */

async function renderSaleStatus(
    state,
    tokensSold,
    totalRaised
) {

    const now =
        Math.floor(
            Date.now() / 1000
        );


    const start =
        Number(
            state.startRaw
        );


    const end =
        Number(
            state.endRaw
        );


    if (
        state.finalized
    ) {

        saleSetText(
            saleProgressText,

            state.successful
                ? "SALE COMPLETED"
                : "SALE CLOSED"
        );


        return;

    }


    if (
        tokensSold >=
        SALE_CONFIG.totalSaleTokens
    ) {

        saleSetText(
            saleProgressText,
            "SOLD OUT"
        );


        return;

    }


    if (
        totalRaised >=
        SALE_CONFIG.hardCap
    ) {

        saleSetText(
            saleProgressText,
            "HARD CAP REACHED"
        );


        return;

    }


    if (
        now < start
    ) {

        saleSetText(
            saleProgressText,
            "Opens November 1"
        );


        return;

    }


    if (
        now >= end
    ) {

        saleSetText(
            saleProgressText,
            "SALE ENDED"
        );


        return;

    }


    saleSetText(
        saleProgressText,
        "SALE LIVE"
    );

}


/* =====================================================
   USER CONTRIBUTION
===================================================== */

async function refreshUserContribution() {

    if (
        !saleContract ||
        !connectedAccount
    ) {

        return;

    }


    try {

        const contributionRaw =
            await saleContract
                .contributions(
                    connectedAccount
                );


        const contribution =
            Number(
                ethers.formatUnits(
                    contributionRaw,
                    paymentDecimals
                )
            );


        saleSetText(
            saleUserContribution,

            saleFormatUSD(
                contribution,
                2
            )
        );

    } catch (error) {

        console.error(
            "Contribution read error:",
            error
        );

    }

}


/* =====================================================
   PRE-LAUNCH STATE
===================================================== */

function renderPreLaunchState() {

    saleSetText(
        saleCurrentPrice,
        "$0.001"
    );


    saleSetText(
        saleTokensSold,
        "0 SNAO"
    );


    saleSetText(
        saleCurrentLot,
        "1 / 1,800"
    );


    saleSetText(
        saleTotalRaised,
        "$0"
    );


    saleSetText(
        saleRemainingTokens,
        "45,000,000 SNAO"
    );


    if (
        saleProgressFill
    ) {

        saleProgressFill
            .style
            .width =
            "0%";

    }


    saleSetText(
        saleProgressText,
        "Opens November 1"
    );


    if (
        saleBuyButton
    ) {

        saleBuyButton.disabled =
            true;

        saleBuyButton.textContent =
            "BUY SNAO";

    }

}


/* =====================================================
   SALE ACTIVE CHECK
===================================================== */

function isSaleActive(
    state
) {

    if (!state) {

        return false;

    }


    const now =
        Math.floor(
            Date.now() / 1000
        );


    const start =
        Number(
            state.startRaw
        );


    const end =
        Number(
            state.endRaw
        );


    return Boolean(

        !state.finalized &&

        now >= start &&

        now < end &&

        state.tokensSoldRaw <
            ethers.parseUnits(
                String(
                    SALE_CONFIG.totalSaleTokens
                ),
                18
            )

    );

}


/* =====================================================
   PURCHASE BUTTON AVAILABILITY
===================================================== */

async function updatePurchaseAvailability(
    providedState = null
) {

    if (
        !saleBuyButton
    ) {

        return;

    }


    if (
        transactionRunning
    ) {

        saleBuyButton.disabled =
            true;

        return;

    }


    if (
        !saleContractsConfigured()
    ) {

        saleBuyButton.disabled =
            true;

        saleBuyButton.textContent =
            "SALE NOT LIVE";

        return;

    }


    if (
        !connectedAccount ||
        !saleContract
    ) {

        saleBuyButton.disabled =
            true;

        saleBuyButton.textContent =
            "CONNECT WALLET FIRST";

        return;

    }


    let state =
        providedState;


    if (!state) {

        try {

            state =
                await getSaleState();

        } catch (error) {

            saleBuyButton.disabled =
                true;

            return;

        }

    }


    if (
        !isSaleActive(state)
    ) {

        saleBuyButton.disabled =
            true;

        saleBuyButton.textContent =
            "SALE NOT LIVE";

        return;

    }


    if (
        quotedTokenAmount <= 0n ||
        quotedPaymentAmount <= 0n
    ) {

        saleBuyButton.disabled =
            true;

        saleBuyButton.textContent =
            "ENTER USDT AMOUNT";

        return;

    }


    saleBuyButton.disabled =
        false;

    saleBuyButton.textContent =
        "BUY SNAO";

}


/* =====================================================
   FIND SNAO AMOUNT FOR USDT BUDGET

   User enters USDT.
   Contract buyTokens() expects SNAO amount.

   Because pricing changes by lot, simple division is
   not reliable.

   We therefore use quoteCost() as the source of truth
   and find the largest SNAO amount whose contract quote
   does not exceed the user's USDT budget.
===================================================== */

async function findTokenAmountForBudget(
    paymentBudget
) {

    if (
        !saleContract ||
        paymentBudget <= 0n
    ) {

        return {
            tokenAmount:
                0n,

            cost:
                0n
        };

    }


    const state =
        await getSaleState();


    const maxSaleTokens =
        ethers.parseUnits(
            String(
                SALE_CONFIG.totalSaleTokens
            ),
            18
        );


    const maxPerTx =
        ethers.parseUnits(
            String(
                SALE_CONFIG.maxTokensPerTx
            ),
            18
        );


    const remaining =
        maxSaleTokens -
        state.tokensSoldRaw;


    let high =
        remaining <
        maxPerTx
            ? remaining
            : maxPerTx;


    if (
        high <= 0n
    ) {

        return {
            tokenAmount:
                0n,

            cost:
                0n
        };

    }


    /*
     * Search in whole SNAO units.
     *
     * This keeps purchase amounts simple and avoids
     * displaying tiny fractional SNAO values.
     */

    const oneToken =
        ethers.parseUnits(
            "1",
            18
        );


    let lowTokens =
        0n;


    let highTokens =
        high /
        oneToken;


    let bestTokens =
        0n;


    let bestCost =
        0n;


    while (
        lowTokens <=
        highTokens
    ) {

        const middleTokens =
            (
                lowTokens +
                highTokens
            ) /
            2n;


        if (
            middleTokens <= 0n
        ) {

            lowTokens =
                1n;

            continue;

        }


        const candidateAmount =
            middleTokens *
            oneToken;


        let candidateCost;


        try {

            candidateCost =
                await saleContract
                    .quoteCost(
                        candidateAmount
                    );

        } catch (error) {

            highTokens =
                middleTokens - 1n;

            continue;

        }


        if (
            candidateCost <=
            paymentBudget
        ) {

            bestTokens =
                candidateAmount;

            bestCost =
                candidateCost;

            lowTokens =
                middleTokens + 1n;

        } else {

            highTokens =
                middleTokens - 1n;

        }

    }


    return {

        tokenAmount:
            bestTokens,

        cost:
            bestCost

    };

}


/* =====================================================
   QUOTE
===================================================== */

async function updateSaleQuote() {

    quotedTokenAmount =
        0n;

    quotedPaymentAmount =
        0n;


    if (
        saleSnaoOutput
    ) {

        saleSnaoOutput.value =
            "";

    }


    if (
        !saleUsdtInput
    ) {

        return;

    }


    const inputValue =
        saleUsdtInput
            .value
            .trim()
            .replace(",", ".");


    if (
        !inputValue ||
        Number(inputValue) <= 0
    ) {

        await updatePurchaseAvailability();

        return;

    }


    if (
        !saleContractsConfigured() ||
        !saleContract
    ) {

        saleSetStatus(
            "Wallet can be connected, but the official mainnet sale contract has not been configured yet."
        );


        await updatePurchaseAvailability();

        return;

    }


    try {

        const paymentBudget =
            ethers.parseUnits(
                inputValue,
                paymentDecimals
            );


        saleSetStatus(
            "Calculating contract quote..."
        );


        const quote =
            await findTokenAmountForBudget(
                paymentBudget
            );


        quotedTokenAmount =
            quote.tokenAmount;


        quotedPaymentAmount =
            quote.cost;


        if (
            quotedTokenAmount <= 0n
        ) {

            saleSetStatus(
                "The entered amount is too small for a SNAO purchase.",
                "error"
            );


            await updatePurchaseAvailability();

            return;

        }


        const tokenDisplay =
            ethers.formatUnits(
                quotedTokenAmount,
                18
            );


        if (
            saleSnaoOutput
        ) {

            saleSnaoOutput.value =
                saleFormatNumber(
                    tokenDisplay,
                    0
                );

        }


        const actualCost =
            ethers.formatUnits(
                quotedPaymentAmount,
                paymentDecimals
            );


        saleSetStatus(
            "Contract quote: " +
            saleFormatNumber(
                tokenDisplay,
                0
            ) +
            " SNAO for " +
            saleFormatUSD(
                actualCost,
                6
            ) +
            "."
        );


        await updatePurchaseAvailability();

    } catch (error) {

        console.error(
            "Quote error:",
            error
        );


        quotedTokenAmount =
            0n;

        quotedPaymentAmount =
            0n;


        saleSetStatus(
            saleReadableError(error),
            "error"
        );


        await updatePurchaseAvailability();

    }

}


/* =====================================================
   INPUT LISTENER
===================================================== */

if (
    saleUsdtInput
) {

    /*
     * The USDT field must be editable once the wallet
     * and official contracts are ready.
     */

    saleUsdtInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                quoteTimer
            );


            quoteTimer =
                setTimeout(
                    updateSaleQuote,
                    450
                );

        }
    );

}


/* =====================================================
   ALLOWANCE / APPROVE
===================================================== */

async function ensurePaymentAllowance(
    requiredAmount
) {

    if (
        !paymentContract ||
        !connectedAccount
    ) {

        throw new Error(
            "Payment token is not initialized."
        );

    }


    const allowance =
        await paymentContract
            .allowance(

                connectedAccount,

                SALE_CONFIG.saleContract

            );


    if (
        allowance >=
        requiredAmount
    ) {

        return;

    }


    saleSetStatus(
        "USDT approval required. Confirm the approval in your wallet."
    );


    const approvalTransaction =
        await paymentContract
            .approve(

                SALE_CONFIG.saleContract,

                requiredAmount

            );


    saleSetStatus(
        "USDT approval submitted. Waiting for confirmation..."
    );


    await approvalTransaction
        .wait();


    saleSetStatus(
        "USDT approved.",
        "success"
    );

}


/* =====================================================
   BUY SNAO
===================================================== */

async function buySnao() {

    if (
        transactionRunning
    ) {

        return;

    }


    if (
        !saleContractsConfigured()
    ) {

        saleSetStatus(
            "Official mainnet sale contracts are not configured.",
            "error"
        );

        return;

    }


    if (
        !connectedAccount ||
        !saleContract ||
        !paymentContract
    ) {

        saleSetStatus(
            "Connect your wallet first.",
            "error"
        );

        return;

    }


    if (
        quotedTokenAmount <= 0n ||
        quotedPaymentAmount <= 0n
    ) {

        saleSetStatus(
            "Enter a valid USDT amount first.",
            "error"
        );

        return;

    }


    try {

        transactionRunning =
            true;


        if (
            saleBuyButton
        ) {

            saleBuyButton.disabled =
                true;

            saleBuyButton.textContent =
                "PROCESSING...";
        }


        /*
         * Recalculate immediately before the purchase.
         *
         * Another buyer may have completed a lot since
         * the user's previous quote.
         */

        const freshCost =
            await saleContract
                .quoteCost(
                    quotedTokenAmount
                );


        quotedPaymentAmount =
            freshCost;


        await ensurePaymentAllowance(
            freshCost
        );


        saleSetStatus(
            "Confirm the SNAO purchase in your wallet."
        );


        const purchaseTransaction =
            await saleContract
                .buyTokens(
                    quotedTokenAmount
                );


        saleSetStatus(
            "Purchase submitted. Waiting for blockchain confirmation..."
        );


        const receipt =
            await purchaseTransaction
                .wait();


        if (
            !receipt ||
            receipt.status !== 1
        ) {

            throw new Error(
                "Transaction was not confirmed successfully."
            );

        }


        saleSetStatus(
            "Purchase confirmed on BNB Smart Chain.",
            "success"
        );


        if (
            saleUsdtInput
        ) {

            saleUsdtInput.value =
                "";

        }


        if (
            saleSnaoOutput
        ) {

            saleSnaoOutput.value =
                "";

        }


        quotedTokenAmount =
            0n;

        quotedPaymentAmount =
            0n;


        /*
         * Immediately synchronize all operational
         * numbers after the confirmed purchase.
         */

        await refreshSaleData();

    } catch (error) {

        console.error(
            "Purchase error:",
            error
        );


        saleSetStatus(
            saleReadableError(error),
            "error"
        );

    } finally {

        transactionRunning =
            false;


        await updatePurchaseAvailability();

    }

}


/* =====================================================
   READABLE ERRORS
===================================================== */

function saleReadableError(
    error
) {

    if (!error) {

        return "Unknown transaction error.";

    }


    if (
        error.code === 4001 ||
        error.code === "ACTION_REJECTED"
    ) {

        return "Transaction cancelled in wallet.";

    }


    const possibleMessage =
        error.shortMessage ||
        error.reason ||
        error.message ||
        "";


    if (
        possibleMessage.includes(
            "Sale not started"
        )
    ) {

        return "The Public Sale has not started yet.";

    }


    if (
        possibleMessage.includes(
            "Sale ended"
        )
    ) {

        return "The Public Sale has ended.";

    }


    if (
        possibleMessage.includes(
            "Sale finalized"
        )
    ) {

        return "The Public Sale has already been finalized.";

    }


    if (
        possibleMessage.includes(
            "Hard cap exceeded"
        )
    ) {

        return "This purchase would exceed the sale hard cap.";

    }


    if (
        possibleMessage.includes(
            "Purchase too small"
        )
    ) {

        return "Purchase amount is too small.";

    }


    if (
        possibleMessage.includes(
            "user rejected"
        )
    ) {

        return "Transaction cancelled in wallet.";

    }


    if (
        possibleMessage.length >
        180
    ) {

        return (
            possibleMessage
                .slice(
                    0,
                    177
                ) +
            "..."
        );

    }


    return (
        possibleMessage ||
        "Transaction could not be completed."
    );

}


/* =====================================================
   WALLET EVENTS
===================================================== */

if (
    window.ethereum
) {

    window.ethereum.on(
        "accountsChanged",
        async (
            accounts
        ) => {

            if (
                !accounts ||
                accounts.length === 0
            ) {

                connectedAccount =
                    null;

                signer =
                    null;

                saleContract =
                    null;

                paymentContract =
                    null;


                if (
                    saleConnectButton
                ) {

                    saleConnectButton.textContent =
                        "CONNECT WALLET";

                }


                saleSetText(
                    saleUserContribution,
                    "Connect Wallet"
                );


                await updatePurchaseAvailability();

                return;

            }


            connectedAccount =
                accounts[0];


            browserProvider =
                new ethers.BrowserProvider(
                    window.ethereum
                );


            signer =
                await browserProvider
                    .getSigner();


            if (
                saleContractsConfigured()
            ) {

                await initializeContracts();

                await refreshSaleData();

            }


            if (
                saleConnectButton
            ) {

                saleConnectButton.textContent =
                    saleShortAddress(
                        connectedAccount
                    );

            }

        }
    );


    window.ethereum.on(
        "chainChanged",
        () => {

            /*
             * Reload is the safest way to discard stale
             * provider and contract instances.
             */

            window.location.reload();

        }
    );

}


/* =====================================================
   BUTTON EVENTS
===================================================== */

if (
    saleConnectButton
) {

    saleConnectButton
        .addEventListener(
            "click",
            connectSaleWallet
        );

}


if (
    saleBuyButton
) {

    saleBuyButton
        .addEventListener(
            "click",
            buySnao
        );

}


/* =====================================================
   SMOOTH INTERNAL LINKS
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "start"
                        }
                    );

                }
            );

        }
    );


/* =====================================================
   INITIALIZE
===================================================== */

async function initializeSnaoSalePage() {

    renderPreLaunchState();


    /*
     * Contract addresses are intentionally null until
     * verified MAINNET deployment.
     */

    if (
        !saleContractsConfigured()
    ) {

        saleSetStatus(
            "Pre-launch — wallet connection is available, but purchasing remains disabled until the official mainnet contracts are configured."
        );


        if (
            saleConnectButton
        ) {

            saleConnectButton.disabled =
                false;

            saleConnectButton.textContent =
                "CONNECT WALLET";

        }


        await updatePurchaseAvailability();

        return;

    }


    /*
     * If contracts are configured, the page can read
     * the blockchain after wallet connection.
     */

    if (
        saleConnectButton
    ) {

        saleConnectButton.disabled =
            false;

    }


    /*
     * Refresh periodically after a wallet has connected.
     */

    clearInterval(
        refreshTimer
    );


    refreshTimer =
        setInterval(
            async () => {

                if (
                    saleContract
                ) {

                    await refreshSaleData();

                }

            },
            15000
        );

}


/* =====================================================
   START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSnaoSalePage,
        {
            once: true
        }
    );

} else {

    initializeSnaoSalePage();

}


/* =====================================================
   END
===================================================== */
