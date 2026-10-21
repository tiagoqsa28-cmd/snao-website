/* =====================================================
   SNAO PUBLIC SALE
   sale.js

   PRE-LAUNCH CONFIGURATION

   IMPORTANT:
   Wallet connection and purchasing remain disabled
   until the final mainnet contracts are deployed,
   verified and configured here.
===================================================== */


/* =====================================================
   SALE CONFIGURATION
===================================================== */

const SALE_CONFIG = {

    isLive: false,

    network:
        "BNB Smart Chain",

    chainId:
        56,

    paymentSymbol:
        "USDT",

    gasSymbol:
        "BNB",

    saleTokenSymbol:
        "SNAO",

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

    scheduledDate:
        "2026-11-01",

    /*
     * These remain null until the final mainnet
     * addresses are verified.
     */

    saleContract:
        null,

    tokenContract:
        null,

    paymentToken:
        null

};


/* =====================================================
   HELPERS
===================================================== */

function saleGetElement(id) {

    return document.getElementById(id);

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
   MOBILE NAVIGATION
===================================================== */

const saleMenuButton =
    saleGetElement(
        "saleMenuButton"
    );


const saleNavigation =
    saleGetElement(
        "saleNavigation"
    );


function closeSaleNavigation() {

    if (!saleNavigation) {
        return;
    }


    saleNavigation.classList.remove(
        "open"
    );


    document.body.classList.remove(
        "sale-menu-open"
    );


    if (saleMenuButton) {

        saleMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        saleMenuButton.textContent =
            "☰";

    }

}


function openSaleNavigation() {

    if (!saleNavigation) {
        return;
    }


    saleNavigation.classList.add(
        "open"
    );


    document.body.classList.add(
        "sale-menu-open"
    );


    if (saleMenuButton) {

        saleMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );


        saleMenuButton.textContent =
            "×";

    }

}


if (
    saleMenuButton &&
    saleNavigation
) {

    saleMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                saleNavigation.classList.contains(
                    "open"
                );


            if (isOpen) {

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
   CLOSE MOBILE MENU ON RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth >
            850
        ) {

            closeSaleNavigation();

        }

    }
);


/* =====================================================
   CURRENT YEAR
===================================================== */

const saleCurrentYear =
    saleGetElement(
        "saleCurrentYear"
    );


if (saleCurrentYear) {

    saleCurrentYear.textContent =
        new Date()
            .getFullYear();

}


/* =====================================================
   PRE-LAUNCH PURCHASE INTERFACE
===================================================== */

const saleConnectButton =
    saleGetElement(
        "saleConnectButton"
    );


const saleUsdtInput =
    saleGetElement(
        "saleUsdtInput"
    );


const saleSnaoOutput =
    saleGetElement(
        "saleSnaoOutput"
    );


function applyPreLaunchState() {

    /*
     * The website must never imply that purchasing
     * is active before the verified mainnet sale
     * contract is configured.
     */

    if (
        SALE_CONFIG.isLive !== true ||
        !SALE_CONFIG.saleContract ||
        !SALE_CONFIG.paymentToken
    ) {

        if (saleConnectButton) {

            saleConnectButton.disabled =
                true;


            saleConnectButton.textContent =
                "SALE NOT LIVE";

        }


        if (saleUsdtInput) {

            saleUsdtInput.disabled =
                true;

            saleUsdtInput.value =
                "";

        }


        if (saleSnaoOutput) {

            saleSnaoOutput.disabled =
                true;

            saleSnaoOutput.value =
                "";

        }


        return;

    }

}


/* =====================================================
   CONTRACT ACTIVATION GUARD

   Even if someone accidentally changes isLive to true,
   the interface remains disabled unless BOTH the sale
   contract and payment-token address are configured.
===================================================== */

function saleContractsReady() {

    return Boolean(

        SALE_CONFIG.isLive === true &&

        SALE_CONFIG.saleContract &&

        SALE_CONFIG.paymentToken

    );

}


/* =====================================================
   PURCHASE ACTIVATION PLACEHOLDER

   This function intentionally contains no Web3 / ethers
   interaction yet.

   The final wallet implementation should only be added
   after:
   - mainnet deployment
   - final contract review
   - correct BNB Chain addresses
   - payment-token verification
   - public source verification
===================================================== */

function initializeSalePurchaseInterface() {

    if (
        !saleContractsReady()
    ) {

        applyPreLaunchState();

        return;

    }


    /*
     * MAINNET WALLET CONNECTION
     * WILL BE IMPLEMENTED HERE
     * AFTER FINAL DEPLOYMENT.
     */

}


/* =====================================================
   INTERNAL SMOOTH SCROLL
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
   CONFIGURATION VALIDATION
===================================================== */

function validateSaleConfiguration() {

    const expectedSaleTokens =
        SALE_CONFIG.lotSize *
        SALE_CONFIG.totalLots;


    if (
        expectedSaleTokens !==
        SALE_CONFIG.totalSaleTokens
    ) {

        console.warn(
            "SNAO Sale configuration mismatch: lot structure does not equal total sale allocation."
        );

    }


    if (
        SALE_CONFIG.totalSaleTokens >
        SALE_CONFIG.totalSupply
    ) {

        console.warn(
            "SNAO Sale configuration mismatch: sale allocation exceeds total supply."
        );

    }


    if (
        SALE_CONFIG.isLive &&
        !saleContractsReady()
    ) {

        console.warn(
            "SNAO Sale cannot activate: verified contract configuration is incomplete."
        );

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeSnaoSalePage() {

    validateSaleConfiguration();

    applyPreLaunchState();

    initializeSalePurchaseInterface();

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
   END — SNAO PUBLIC SALE
===================================================== */
