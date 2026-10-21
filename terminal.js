/* =====================================================
   SNAO OCEAN TERMINAL
   terminal.js

   DATA POLICY
   -----------------------------------------------------
   - Market price data: CoinGecko public API
   - Global market data: CoinGecko public API
   - Top movers: CoinGecko public API
   - Fear & Greed: Alternative.me public API
   - Ocean Score: Experimental SNAO indicator
   - Liquidity Pressure: Experimental SNAO indicator
   - Whale Confidence: Preview / experimental indicator
   - Narratives: Demonstration intelligence
   - Ocean Flow: Demonstration data
   - Whale Intelligence: Demonstration data
   - Smart Money: Demonstration / experimental
   - Sardine AI: Preview / interface concept

   Experimental or demonstration indicators must never
   be presented as verified on-chain intelligence or
   verified trading signals.
===================================================== */


/* =====================================================
   BASIC HELPERS
===================================================== */

function terminalClamp(value, min = 0, max = 100) {

    return Math.max(
        min,
        Math.min(
            max,
            Number(value) || 0
        )
    );

}


function terminalSafeNumber(value, fallback = 0) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function terminalFormatPercent(
    value,
    digits = 2
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    const prefix =
        number > 0
            ? "+"
            : "";

    return (
        prefix +
        number.toFixed(digits) +
        "%"
    );

}


function terminalFormatCurrency(
    value,
    maximumFractionDigits = 2
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    if (number >= 1000) {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 2
            }
        ).format(number);

    }

    if (number >= 1) {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits
            }
        ).format(number);

    }

    if (number >= 0.01) {
        return `$${number.toFixed(4)}`;
    }

    return `$${number.toFixed(8)}`;

}


function terminalFormatCompactNumber(value) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            notation: "compact",
            maximumFractionDigits: 2
        }
    ).format(number);

}


function terminalSetText(
    element,
    value
) {

    if (!element) {
        return;
    }

    element.textContent =
        value;

}


function terminalSetLoading(element) {

    if (!element) {
        return;
    }

    element.textContent =
        "Loading...";

}


function terminalSetUnavailable(element) {

    if (!element) {
        return;
    }

    element.textContent =
        "--";

}


function terminalSetProgress(
    element,
    property,
    value
) {

    if (!element) {
        return;
    }

    const safeValue =
        terminalClamp(value);

    element.style.setProperty(
        property,
        `${safeValue}%`
    );

}


function terminalGetElement(id) {

    return document.getElementById(id);

}


/* =====================================================
   CURRENT TIME
===================================================== */

const terminalCurrentTime =
    terminalGetElement(
        "terminalCurrentTime"
    );


function updateTerminalCurrentTime() {

    if (!terminalCurrentTime) {
        return;
    }

    const now =
        new Date();

    terminalCurrentTime.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


updateTerminalCurrentTime();

setInterval(
    updateTerminalCurrentTime,
    30000
);


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

const terminalMenuButton =
    terminalGetElement(
        "terminalMenuButton"
    );

const terminalSidebar =
    terminalGetElement(
        "terminalSidebar"
    );

const terminalSidebarBackdrop =
    terminalGetElement(
        "terminalSidebarBackdrop"
    );


function closeTerminalSidebar() {

    if (terminalSidebar) {

        terminalSidebar.classList.remove(
            "open"
        );

    }

    if (terminalMenuButton) {

        terminalMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    if (terminalSidebarBackdrop) {

        terminalSidebarBackdrop.classList.remove(
            "active"
        );

    }

    document.body.classList.remove(
        "terminal-menu-open"
    );

}


function openTerminalSidebar() {

    if (!terminalSidebar) {
        return;
    }

    terminalSidebar.classList.add(
        "open"
    );

    if (terminalMenuButton) {

        terminalMenuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    if (terminalSidebarBackdrop) {

        terminalSidebarBackdrop.classList.add(
            "active"
        );

    }

    document.body.classList.add(
        "terminal-menu-open"
    );

}


if (
    terminalMenuButton &&
    terminalSidebar
) {

    terminalMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                terminalSidebar.classList.contains(
                    "open"
                );

            if (isOpen) {

                closeTerminalSidebar();

            } else {

                openTerminalSidebar();

            }

        }
    );

}


if (terminalSidebarBackdrop) {

    terminalSidebarBackdrop.addEventListener(
        "click",
        closeTerminalSidebar
    );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {
            closeTerminalSidebar();
        }

    }
);


document
    .querySelectorAll(
        ".terminal-sidebar-navigation a"
    )
    .forEach((link) => {

        link.addEventListener(
            "click",
            closeTerminalSidebar
        );

    });


/* =====================================================
   ACTIVE SIDEBAR SECTION
===================================================== */

const terminalObservedSections =
    document.querySelectorAll(
        ".terminal-main section[id]"
    );

const terminalNavigationLinks =
    document.querySelectorAll(
        ".terminal-sidebar-navigation a[href^='#']"
    );


if (
    terminalObservedSections.length &&
    terminalNavigationLinks.length
) {

    const terminalSectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        terminalNavigationLinks.forEach(
                            (link) => {

                                const isCurrent =
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`;

                                link.classList.toggle(
                                    "active",
                                    isCurrent
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-25% 0px -65% 0px"
            }
        );


    terminalObservedSections.forEach(
        (section) => {

            terminalSectionObserver.observe(
                section
            );

        }
    );

}


/* =====================================================
   MARKET API CONFIGURATION
===================================================== */

const TERMINAL_API = {

    global:
        "https://api.coingecko.com/api/v3/global",

    markets:
        "https://api.coingecko.com/api/v3/coins/markets",

    simplePrice:
        "https://api.coingecko.com/api/v3/simple/price",

    fearGreed:
        "https://api.alternative.me/fng/?limit=1&format=json"

};


const terminalFetchOptions = {

    headers: {
        accept:
            "application/json"
    },

    cache:
        "no-store"

};


/* =====================================================
   GLOBAL MARKET STATE
===================================================== */

const terminalMarketState = {

    btcDominance:
        null,

    totalMarketCap:
        null,

    marketChange24h:
        null,

    activeCryptocurrencies:
        null,

    selectedAsset:
        "BTC",

    lastSuccessfulUpdate:
        null

};


/* =====================================================
   LIVE GLOBAL MARKET ELEMENTS
===================================================== */

const liveBtcDominance =
    terminalGetElement(
        "liveBtcDominance"
    );

const liveTotalMarketCap =
    terminalGetElement(
        "liveTotalMarketCap"
    );

const liveMarketChange =
    terminalGetElement(
        "liveMarketChange"
    );

const liveActiveCryptocurrencies =
    terminalGetElement(
        "liveActiveCryptocurrencies"
    );

const liveOceanScore =
    terminalGetElement(
        "liveOceanScore"
    );


/* =====================================================
   GLOBAL MARKET DATA
   REAL DATA — COINGECKO
===================================================== */

async function loadGlobalMarketData() {

    try {

        const response =
            await fetch(
                TERMINAL_API.global,
                terminalFetchOptions
            );


        if (!response.ok) {

            throw new Error(
                `Global market request failed: ${response.status}`
            );

        }


        const result =
            await response.json();

        const data =
            result?.data;


        if (!data) {

            throw new Error(
                "Global market data unavailable."
            );

        }


        const btcDominance =
            terminalSafeNumber(
                data
                    .market_cap_percentage
                    ?.btc,
                NaN
            );


        const totalMarketCap =
            terminalSafeNumber(
                data
                    .total_market_cap
                    ?.usd,
                NaN
            );


        const marketChange =
            terminalSafeNumber(
                data
                    .market_cap_change_percentage_24h_usd,
                NaN
            );


        const activeCryptocurrencies =
            terminalSafeNumber(
                data
                    .active_cryptocurrencies,
                NaN
            );


        if (
            Number.isFinite(
                btcDominance
            )
        ) {

            terminalMarketState.btcDominance =
                btcDominance;

            terminalSetText(
                liveBtcDominance,
                `${btcDominance.toFixed(2)}%`
            );

        }


        if (
            Number.isFinite(
                totalMarketCap
            )
        ) {

            terminalMarketState.totalMarketCap =
                totalMarketCap;

            terminalSetText(
                liveTotalMarketCap,
                terminalFormatCurrency(
                    totalMarketCap
                )
            );

        }


        if (
            Number.isFinite(
                marketChange
            )
        ) {

            terminalMarketState.marketChange24h =
                marketChange;

            terminalSetText(
                liveMarketChange,
                terminalFormatPercent(
                    marketChange
                )
            );


            if (liveMarketChange) {

                liveMarketChange.classList.remove(
                    "live-market-positive",
                    "live-market-negative",
                    "live-market-neutral"
                );


                if (marketChange > 0) {

                    liveMarketChange.classList.add(
                        "live-market-positive"
                    );

                } else if (marketChange < 0) {

                    liveMarketChange.classList.add(
                        "live-market-negative"
                    );

                } else {

                    liveMarketChange.classList.add(
                        "live-market-neutral"
                    );

                }

            }

        }


        if (
            Number.isFinite(
                activeCryptocurrencies
            )
        ) {

            terminalMarketState.activeCryptocurrencies =
                activeCryptocurrencies;

            terminalSetText(
                liveActiveCryptocurrencies,
                Math.round(
                    activeCryptocurrencies
                ).toLocaleString(
                    "en-US"
                )
            );

        }


        terminalMarketState.lastSuccessfulUpdate =
            Date.now();


        /*
         * These indicators may use public market
         * information as input, but their resulting
         * scores remain experimental SNAO estimates.
         */

        renderOceanScoreBreakdown();

        renderLiquidityPressure();

        renderWhaleConfidence();


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: global market data unavailable.",
            error
        );


        if (
            terminalMarketState.btcDominance ===
            null
        ) {

            terminalSetUnavailable(
                liveBtcDominance
            );

        }


        if (
            terminalMarketState.totalMarketCap ===
            null
        ) {

            terminalSetUnavailable(
                liveTotalMarketCap
            );

        }


        if (
            terminalMarketState.marketChange24h ===
            null
        ) {

            terminalSetUnavailable(
                liveMarketChange
            );

        }


        if (
            terminalMarketState.activeCryptocurrencies ===
            null
        ) {

            terminalSetUnavailable(
                liveActiveCryptocurrencies
            );

        }


        return false;

    }

}


/* =====================================================
   ASSET DATABASE

   Only identity / CoinGecko mapping is stored here.

   Price, market cap, volume and 24h change are loaded
   from CoinGecko.

   Preview intelligence is generated separately and is
   explicitly experimental / demonstration.
===================================================== */

const terminalAssetDatabase = {

    BTC: {
        coinGeckoId:
            "bitcoin",
        name:
            "Bitcoin",
        symbol:
            "₿"
    },

    ETH: {
        coinGeckoId:
            "ethereum",
        name:
            "Ethereum",
        symbol:
            "Ξ"
    },

    SOL: {
        coinGeckoId:
            "solana",
        name:
            "Solana",
        symbol:
            "S"
    },

    BNB: {
        coinGeckoId:
            "binancecoin",
        name:
            "BNB",
        symbol:
            "B"
    },

    XRP: {
        coinGeckoId:
            "ripple",
        name:
            "XRP",
        symbol:
            "X"
    }

};


/* =====================================================
   SELECTED ASSET ELEMENTS
===================================================== */

const terminalAssetSearch =
    terminalGetElement(
        "terminalAssetSearch"
    );

const terminalAssetSearchButton =
    terminalGetElement(
        "terminalAssetSearchButton"
    );

const terminalAssetButtons =
    document.querySelectorAll(
        "[data-terminal-asset]"
    );


const terminalAssetElements = {

    name:
        terminalGetElement(
            "selectedAssetName"
        ),

    ticker:
        terminalGetElement(
            "selectedAssetTicker"
        ),

    symbol:
        terminalGetElement(
            "selectedAssetSymbol"
        ),

    price:
        terminalGetElement(
            "selectedAssetPrice"
        ),

    change:
        terminalGetElement(
            "selectedAssetChange"
        ),

    marketCap:
        terminalGetElement(
            "selectedAssetMarketCap"
        ),

    volume:
        terminalGetElement(
            "selectedAssetVolume"
        ),

    aiScore:
    terminalGetElement(
        "selectedAssetAiScore"
    ),

    whales:
        terminalGetElement(
            "selectedAssetWhales"
        ),

    risk:
        terminalGetElement(
            "selectedAssetRisk"
        ),

    sentiment:
        terminalGetElement(
            "selectedAssetSentiment"
        ),

    state:
        terminalGetElement(
            "selectedAssetState"
        ),

    summary:
        terminalGetElement(
            "selectedAssetSummary"
        )

};


/* =====================================================
   ASSET MARKET CACHE
===================================================== */

const terminalAssetMarketCache = {};


/* =====================================================
   ASSET PREVIEW INTELLIGENCE

   NOT verified whale or on-chain intelligence.

   Public price and volume information is transformed
   into an experimental interface preview.
===================================================== */

function calculateAssetPreviewIntelligence(
    marketData
) {

    if (!marketData) {

        return {
            score: "--",
            whales: "Preview",
            risk: "Unavailable",
            sentiment: "Unavailable",
            state: "No Data",
            positive: true,
            summary:
                "Market data is currently unavailable. " +
                "Experimental SNAO intelligence cannot be calculated."
        };

    }


    const change =
        terminalSafeNumber(
            marketData
                .price_change_percentage_24h,
            0
        );


    const volume =
        terminalSafeNumber(
            marketData.total_volume,
            0
        );


    const marketCap =
        terminalSafeNumber(
            marketData.market_cap,
            0
        );


    const volumeRatio =
        marketCap > 0
            ? volume / marketCap
            : 0;


    const momentumScore =
        terminalClamp(
            50 + change * 4
        );


    const activityScore =
        terminalClamp(
            40 + volumeRatio * 300
        );


    const score =
        Math.round(
            momentumScore * 0.65 +
            activityScore * 0.35
        );


    let risk =
        "Medium";

    if (
        Math.abs(change) >= 8
    ) {

        risk =
            "High";

    } else if (
        Math.abs(change) <= 2
    ) {

        risk =
            "Low";

    }


    let sentiment =
        "Neutral";

    if (change > 2) {

        sentiment =
            "Positive";

    } else if (change < -2) {

        sentiment =
            "Negative";

    }


    let state =
        "Balanced";

    if (score >= 70) {

        state =
            "Positive Momentum";

    } else if (score <= 35) {

        state =
            "Weak Momentum";

    }


    return {

        score,

        whales:
            "Preview",

        risk,

        sentiment,

        state,

        positive:
            change >= 0,

        summary:
            `Experimental SNAO preview based on public market data. ` +
            `24h price change is ${terminalFormatPercent(change)}. ` +
            `This score is not verified whale or institutional intelligence.`

    };

}

/* =====================================================
   LOAD SELECTED ASSET
   REAL MARKET DATA — COINGECKO
===================================================== */

async function loadSelectedAsset(
    ticker = terminalMarketState.selectedAsset
) {

    const normalizedTicker =
        String(ticker)
            .trim()
            .toUpperCase();

    const asset =
        terminalAssetDatabase[
            normalizedTicker
        ];


    if (!asset) {

        terminalSetText(
            terminalAssetElements.state,
            "Asset Not Supported"
        );

        terminalSetText(
            terminalAssetElements.summary,
            "This preview currently supports BTC, ETH, SOL, BNB and XRP."
        );

        return false;

    }


    terminalMarketState.selectedAsset =
        normalizedTicker;


    terminalSetText(
        terminalAssetElements.name,
        asset.name
    );

    terminalSetText(
        terminalAssetElements.ticker,
        normalizedTicker
    );

    terminalSetText(
        terminalAssetElements.symbol,
        asset.symbol
    );


    terminalSetLoading(
        terminalAssetElements.price
    );

    terminalSetLoading(
        terminalAssetElements.change
    );

    terminalSetLoading(
        terminalAssetElements.marketCap
    );

    terminalSetLoading(
        terminalAssetElements.volume
    );


    try {

        let marketData =
            terminalAssetMarketCache[
                normalizedTicker
            ];


        if (!marketData) {

            const url =
                `${TERMINAL_API.markets}` +
                `?vs_currency=usd` +
                `&ids=${encodeURIComponent(asset.coinGeckoId)}` +
                `&order=market_cap_desc` +
                `&per_page=1` +
                `&page=1` +
                `&sparkline=false` +
                `&price_change_percentage=24h`;


            const response =
                await fetch(
                    url,
                    terminalFetchOptions
                );


            if (!response.ok) {

                throw new Error(
                    `Asset request failed: ${response.status}`
                );

            }


            const result =
                await response.json();


            if (
                !Array.isArray(result) ||
                !result.length
            ) {

                throw new Error(
                    "Asset market data unavailable."
                );

            }


            marketData =
                result[0];


            terminalAssetMarketCache[
                normalizedTicker
            ] =
                marketData;

        }


        const price =
            terminalSafeNumber(
                marketData.current_price,
                NaN
            );

        const change =
            terminalSafeNumber(
                marketData
                    .price_change_percentage_24h,
                NaN
            );

        const marketCap =
            terminalSafeNumber(
                marketData.market_cap,
                NaN
            );

        const volume =
            terminalSafeNumber(
                marketData.total_volume,
                NaN
            );


        terminalSetText(
            terminalAssetElements.price,
            terminalFormatCurrency(
                price,
                6
            )
        );


        terminalSetText(
            terminalAssetElements.change,
            terminalFormatPercent(
                change
            )
        );


        terminalSetText(
            terminalAssetElements.marketCap,
            terminalFormatCurrency(
                marketCap
            )
        );


        terminalSetText(
            terminalAssetElements.volume,
            terminalFormatCurrency(
                volume
            )
        );


        if (
            terminalAssetElements.change
        ) {

            terminalAssetElements.change
                .classList.remove(
                    "positive",
                    "negative",
                    "neutral"
                );


            if (change > 0) {

                terminalAssetElements.change
                    .classList.add(
                        "positive"
                    );

            } else if (change < 0) {

                terminalAssetElements.change
                    .classList.add(
                        "negative"
                    );

            } else {

                terminalAssetElements.change
                    .classList.add(
                        "neutral"
                    );

            }

        }


        const preview =
            calculateAssetPreviewIntelligence(
                marketData
            );


        terminalSetText(
            terminalAssetElements.aiScore,
            preview.score === "--"
                ? "--"
                : `${preview.score}/100`
        );


        terminalSetText(
            terminalAssetElements.whales,
            preview.whales
        );


        terminalSetText(
            terminalAssetElements.risk,
            preview.risk
        );


        terminalSetText(
            terminalAssetElements.sentiment,
            preview.sentiment
        );


        terminalSetText(
            terminalAssetElements.state,
            preview.state
        );


        terminalSetText(
            terminalAssetElements.summary,
            preview.summary
        );


        terminalAssetButtons.forEach(
            (button) => {

                const buttonTicker =
                    String(
                        button.dataset
                            .terminalAsset || ""
                    )
                        .trim()
                        .toUpperCase();


                button.classList.toggle(
                    "active",
                    buttonTicker ===
                        normalizedTicker
                );

            }
        );


        return true;

    } catch (error) {

        console.warn(
            `SNAO Terminal: ${normalizedTicker} market data unavailable.`,
            error
        );


        terminalSetUnavailable(
            terminalAssetElements.price
        );

        terminalSetUnavailable(
            terminalAssetElements.change
        );

        terminalSetUnavailable(
            terminalAssetElements.marketCap
        );

        terminalSetUnavailable(
            terminalAssetElements.volume
        );


        terminalSetText(
            terminalAssetElements.aiScore,
            "--"
        );

        terminalSetText(
            terminalAssetElements.whales,
            "Preview"
        );

        terminalSetText(
            terminalAssetElements.risk,
            "Unavailable"
        );

        terminalSetText(
            terminalAssetElements.sentiment,
            "Unavailable"
        );

        terminalSetText(
            terminalAssetElements.state,
            "No Data"
        );

        terminalSetText(
            terminalAssetElements.summary,
            "Public market data is temporarily unavailable. Experimental SNAO analysis has not been calculated."
        );


        return false;

    }

}


/* =====================================================
   ASSET BUTTONS
===================================================== */

terminalAssetButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const ticker =
                    button.dataset
                        .terminalAsset;


                if (!ticker) {
                    return;
                }


                loadSelectedAsset(
                    ticker
                );

            }
        );

    }
);


/* =====================================================
   ASSET SEARCH
===================================================== */

function submitTerminalAssetSearch() {

    if (!terminalAssetSearch) {
        return;
    }


    const query =
        terminalAssetSearch
            .value
            .trim()
            .toUpperCase();


    if (!query) {
        return;
    }


    let ticker =
        query;


    if (
        !terminalAssetDatabase[
            ticker
        ]
    ) {

        ticker =
            Object.keys(
                terminalAssetDatabase
            ).find(
                (key) => {

                    const asset =
                        terminalAssetDatabase[
                            key
                        ];

                    return (
                        asset.name
                            .toUpperCase() ===
                        query
                    );

                }
            );

    }


    if (
        !ticker ||
        !terminalAssetDatabase[
            ticker
        ]
    ) {

        terminalSetText(
            terminalAssetElements.state,
            "Asset Not Supported"
        );

        terminalSetText(
            terminalAssetElements.summary,
            "Search currently supports BTC, ETH, SOL, BNB and XRP."
        );

        return;

    }


    loadSelectedAsset(
        ticker
    );

}


if (
    terminalAssetSearchButton &&
    terminalAssetSearch
) {

    terminalAssetSearchButton
        .addEventListener(
            "click",
            submitTerminalAssetSearch
        );

}


if (terminalAssetSearch) {

    terminalAssetSearch
        .addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    submitTerminalAssetSearch();

                }

            }
        );

}


/* =====================================================
   OCEAN SCORE
   EXPERIMENTAL SNAO INDICATOR

   IMPORTANT:
   This score is an experimental analytical estimate.
   It must not be presented as verified market,
   institutional or on-chain intelligence.
===================================================== */

const oceanScoreElements = {

    ring:
        terminalGetElement(
            "oceanScoreMainRing"
        ),

    value:
        terminalGetElement(
            "oceanScoreMainValue"
        ),

    condition:
        terminalGetElement(
            "oceanScoreCondition"
        ),

    description:
        terminalGetElement(
            "oceanScoreDescription"
        ),

    trendValue:
        terminalGetElement(
            "oceanTrendValue"
        ),

    trendProgress:
        terminalGetElement(
            "oceanTrendProgress"
        ),

    sentimentValue:
        terminalGetElement(
            "oceanSentimentValue"
        ),

    sentimentProgress:
        terminalGetElement(
            "oceanSentimentProgress"
        ),

    bitcoinValue:
        terminalGetElement(
            "oceanBitcoinValue"
        ),

    bitcoinProgress:
        terminalGetElement(
            "oceanBitcoinProgress"
        ),

    liquidityValue:
        terminalGetElement(
            "oceanLiquidityValue"
        ),

    liquidityProgress:
        terminalGetElement(
            "oceanLiquidityProgress"
        ),

    riskValue:
        terminalGetElement(
            "oceanRiskValue"
        ),

    riskProgress:
        terminalGetElement(
            "oceanRiskProgress"
        ),

    aiTitle:
        terminalGetElement(
            "oceanScoreAiTitle"
        ),

    aiText:
        terminalGetElement(
            "oceanScoreAiText"
        ),

    direction:
        terminalGetElement(
            "oceanScoreDirection"
        ),

    confidence:
        terminalGetElement(
            "oceanScoreConfidence"
        ),

    riskLevel:
        terminalGetElement(
            "oceanScoreRiskLevel"
        ),

    refresh:
        terminalGetElement(
            "oceanScoreRefresh"
        )

};


/* =====================================================
   OCEAN SCORE CALCULATION
===================================================== */

function calculateOceanScorePreview() {

    const marketChange =
        terminalSafeNumber(
            terminalMarketState
                .marketChange24h,
            0
        );


    const btcDominance =
        terminalSafeNumber(
            terminalMarketState
                .btcDominance,
            50
        );


    /*
     * Experimental components.
     *
     * Public market values can influence the preview,
     * but the resulting component scores are SNAO
     * experimental analytical estimates.
     */

    const trend =
        Math.round(
            terminalClamp(
                55 +
                marketChange * 4
            )
        );


    const sentiment =
        Math.round(
            terminalClamp(
                52 +
                marketChange * 5
            )
        );


    const bitcoin =
        Math.round(
            terminalClamp(
                50 +
                (btcDominance - 45) * 2
            )
        );


    const liquidity =
        Math.round(
            terminalClamp(
                58 +
                marketChange * 2.5
            )
        );


    /*
     * Higher value means stronger risk control,
     * not higher market risk.
     */

    const riskControl =
        Math.round(
            terminalClamp(
                70 -
                Math.abs(
                    marketChange
                ) * 4
            )
        );


    const score =
        Math.round(
            trend * 0.25 +
            sentiment * 0.20 +
            bitcoin * 0.20 +
            liquidity * 0.20 +
            riskControl * 0.15
        );


    return {
        trend,
        sentiment,
        bitcoin,
        liquidity,
        riskControl,
        score
    };

}


/* =====================================================
   OCEAN SCORE CONDITION
===================================================== */

function getOceanScoreCondition(
    score
) {

    if (score >= 80) {

        return {
            condition:
                "Strong Positive",
            direction:
                "Positive",
            risk:
                "Low",
            description:
                "Experimental conditions currently indicate strong positive market momentum across the SNAO preview model.",
            title:
                "Experimental market conditions are strongly positive.",
            text:
                "The SNAO preview model currently combines public market momentum with experimental sentiment, liquidity and risk components. This is not a verified trading signal."
        };

    }


    if (score >= 65) {

        return {
            condition:
                "Moderate Bullish",
            direction:
                "Positive",
            risk:
                "Medium",
            description:
                "The experimental SNAO model currently indicates moderately positive market conditions.",
            title:
                "Experimental conditions currently lean positive.",
            text:
                "Public market inputs currently support a positive experimental reading. The Ocean Score remains a preview analytical indicator and should not be treated as investment advice."
        };

    }


    if (score >= 45) {

        return {
            condition:
                "Balanced",
            direction:
                "Neutral",
            risk:
                "Medium",
            description:
                "The experimental SNAO model currently indicates relatively balanced market conditions.",
            title:
                "Experimental conditions are currently balanced.",
            text:
                "The preview model does not currently show a strong directional bias. Ocean Score values are experimental and are not verified trading signals."
        };

    }


    if (score >= 30) {

        return {
            condition:
                "Moderate Bearish",
            direction:
                "Negative",
            risk:
                "High",
            description:
                "The experimental SNAO model currently indicates weaker market conditions and increased caution.",
            title:
                "Experimental conditions currently lean negative.",
            text:
                "Public market inputs currently support a weaker experimental reading. This does not constitute a forecast or trading recommendation."
        };

    }


    return {
        condition:
            "High Risk",
        direction:
            "Negative",
        risk:
            "High",
        description:
            "The experimental SNAO model currently indicates elevated market weakness and risk.",
        title:
            "Experimental conditions currently show elevated risk.",
        text:
            "The preview model currently reflects weaker market conditions. This is an experimental analytical estimate, not a verified market forecast."
    };

}


/* =====================================================
   RENDER OCEAN SCORE
===================================================== */

function renderOceanScoreBreakdown() {

    const result =
        calculateOceanScorePreview();


    const interpretation =
        getOceanScoreCondition(
            result.score
        );


    terminalSetText(
        oceanScoreElements.value,
        result.score
    );


    terminalSetText(
        liveOceanScore,
        result.score
    );


    terminalSetProgress(
        oceanScoreElements.ring,
        "--ocean-score-value",
        result.score
    );


    /*
     * terminal.css also contains the newer
     * --ocean-score variable. Setting both keeps
     * compatibility with the current CSS.
     */

    terminalSetProgress(
        oceanScoreElements.ring,
        "--ocean-score",
        result.score
    );


    terminalSetText(
        oceanScoreElements.condition,
        interpretation.condition
    );


    terminalSetText(
        oceanScoreElements.description,
        interpretation.description
    );


    terminalSetText(
        oceanScoreElements.trendValue,
        result.trend
    );


    terminalSetProgress(
        oceanScoreElements.trendProgress,
        "--component-value",
        result.trend
    );


    terminalSetText(
        oceanScoreElements.sentimentValue,
        result.sentiment
    );


    terminalSetProgress(
        oceanScoreElements.sentimentProgress,
        "--component-value",
        result.sentiment
    );


    terminalSetText(
        oceanScoreElements.bitcoinValue,
        result.bitcoin
    );


    terminalSetProgress(
        oceanScoreElements.bitcoinProgress,
        "--component-value",
        result.bitcoin
    );


    terminalSetText(
        oceanScoreElements.liquidityValue,
        result.liquidity
    );


    terminalSetProgress(
        oceanScoreElements.liquidityProgress,
        "--component-value",
        result.liquidity
    );


    terminalSetText(
        oceanScoreElements.riskValue,
        result.riskControl
    );


    terminalSetProgress(
        oceanScoreElements.riskProgress,
        "--component-value",
        result.riskControl
    );


    terminalSetText(
        oceanScoreElements.aiTitle,
        interpretation.title
    );


    terminalSetText(
        oceanScoreElements.aiText,
        interpretation.text
    );


    terminalSetText(
        oceanScoreElements.direction,
        interpretation.direction
    );


    terminalSetText(
        oceanScoreElements.confidence,
        `${result.score}%`
    );


    terminalSetText(
        oceanScoreElements.riskLevel,
        interpretation.risk
    );

}


/* =====================================================
   OCEAN SCORE REFRESH
===================================================== */

if (
    oceanScoreElements.refresh
) {

    oceanScoreElements.refresh
        .addEventListener(
            "click",
            () => {

                renderOceanScoreBreakdown();

            }
        );

}


/* =====================================================
   MARKET TICKER
   REAL DATA — COINGECKO
===================================================== */

const terminalTickerElements = {

    BTC: {
        price:
            terminalGetElement(
                "btcTerminalPrice"
            ),
        change:
            terminalGetElement(
                "btcTerminalChange"
            )
    },

    ETH: {
        price:
            terminalGetElement(
                "ethTerminalPrice"
            ),
        change:
            terminalGetElement(
                "ethTerminalChange"
            )
    },

    BNB: {
        price:
            terminalGetElement(
                "bnbTerminalPrice"
            ),
        change:
            terminalGetElement(
                "bnbTerminalChange"
            )
    }

};


/* =====================================================
   UPDATE TICKER CARD
===================================================== */

function renderTerminalTickerAsset(
    ticker,
    marketData
) {

    const elements =
        terminalTickerElements[
            ticker
        ];


    if (!elements) {
        return;
    }


    if (!marketData) {

        terminalSetUnavailable(
            elements.price
        );

        terminalSetUnavailable(
            elements.change
        );

        return;

    }


    const price =
        terminalSafeNumber(
            marketData.current_price,
            NaN
        );


    const change =
        terminalSafeNumber(
            marketData
                .price_change_percentage_24h,
            NaN
        );


    terminalSetText(
        elements.price,
        terminalFormatCurrency(
            price,
            6
        )
    );


    terminalSetText(
        elements.change,
        terminalFormatPercent(
            change
        )
    );


    if (elements.change) {

        elements.change.classList.remove(
            "positive",
            "negative",
            "neutral"
        );


        if (change > 0) {

            elements.change.classList.add(
                "positive"
            );

        } else if (change < 0) {

            elements.change.classList.add(
                "negative"
            );

        } else {

            elements.change.classList.add(
                "neutral"
            );

        }

    }

}


/* =====================================================
   LOAD TICKER MARKET DATA
===================================================== */

async function loadTerminalTickerData() {

    const ids = [
        terminalAssetDatabase.BTC.coinGeckoId,
        terminalAssetDatabase.ETH.coinGeckoId,
        terminalAssetDatabase.BNB.coinGeckoId
    ].join(",");


    const url =
        `${TERMINAL_API.markets}` +
        `?vs_currency=usd` +
        `&ids=${encodeURIComponent(ids)}` +
        `&order=market_cap_desc` +
        `&per_page=10` +
        `&page=1` +
        `&sparkline=false` +
        `&price_change_percentage=24h`;


    try {

        const response =
            await fetch(
                url,
                terminalFetchOptions
            );


        if (!response.ok) {

            throw new Error(
                `Ticker request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!Array.isArray(result)) {

            throw new Error(
                "Ticker market data unavailable."
            );

        }


        const tickerMap = {

            bitcoin:
                "BTC",

            ethereum:
                "ETH",

            binancecoin:
                "BNB"

        };


        result.forEach(
            (marketData) => {

                const ticker =
                    tickerMap[
                        marketData.id
                    ];


                if (!ticker) {
                    return;
                }


                terminalAssetMarketCache[
                    ticker
                ] =
                    marketData;


                renderTerminalTickerAsset(
                    ticker,
                    marketData
                );

            }
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: ticker data unavailable.",
            error
        );


        Object.values(
            terminalTickerElements
        ).forEach(
            (elements) => {

                terminalSetUnavailable(
                    elements.price
                );

                terminalSetUnavailable(
                    elements.change
                );

            }
        );


        return false;

    }

}

/* =====================================================
   TOP MOVERS
   REAL MARKET DATA — COINGECKO
===================================================== */

const topGainersList =
    terminalGetElement(
        "topGainersList"
    );

const topLosersList =
    terminalGetElement(
        "topLosersList"
    );


function createTopMoverRow(
    asset
) {

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "top-mover-item";


    const identity =
        document.createElement(
            "div"
        );

    identity.className =
        "top-mover-identity";


    const symbol =
        document.createElement(
            "strong"
        );

    symbol.textContent =
        String(
            asset.symbol || ""
        ).toUpperCase();


    const name =
        document.createElement(
            "span"
        );

    name.textContent =
        asset.name || "--";


    identity.appendChild(
        symbol
    );

    identity.appendChild(
        name
    );


    const market =
        document.createElement(
            "div"
        );

    market.className =
        "top-mover-market";


    const price =
        document.createElement(
            "strong"
        );

    price.textContent =
        terminalFormatCurrency(
            asset.current_price,
            6
        );


    const change =
        document.createElement(
            "span"
        );


    const changeValue =
        terminalSafeNumber(
            asset
                .price_change_percentage_24h,
            0
        );


    change.textContent =
        terminalFormatPercent(
            changeValue
        );


    change.classList.add(
        changeValue >= 0
            ? "positive"
            : "negative"
    );


    market.appendChild(
        price
    );

    market.appendChild(
        change
    );


    row.appendChild(
        identity
    );

    row.appendChild(
        market
    );


    return row;

}


/* =====================================================
   RENDER TOP MOVERS
===================================================== */

function renderTopMovers(
    gainers,
    losers
) {

    if (topGainersList) {

        topGainersList.innerHTML =
            "";


        gainers.forEach(
            (asset) => {

                topGainersList.appendChild(
                    createTopMoverRow(
                        asset
                    )
                );

            }
        );


        if (!gainers.length) {

            topGainersList.textContent =
                "Market data unavailable.";

        }

    }


    if (topLosersList) {

        topLosersList.innerHTML =
            "";


        losers.forEach(
            (asset) => {

                topLosersList.appendChild(
                    createTopMoverRow(
                        asset
                    )
                );

            }
        );


        if (!losers.length) {

            topLosersList.textContent =
                "Market data unavailable.";

        }

    }

}


/* =====================================================
   LOAD TOP MOVERS
===================================================== */

async function loadTopMovers() {

    if (
        !topGainersList &&
        !topLosersList
    ) {
        return false;
    }


    terminalSetLoading(
        topGainersList
    );

    terminalSetLoading(
        topLosersList
    );


    const url =
        `${TERMINAL_API.markets}` +
        `?vs_currency=usd` +
        `&order=market_cap_desc` +
        `&per_page=100` +
        `&page=1` +
        `&sparkline=false` +
        `&price_change_percentage=24h`;


    try {

        const response =
            await fetch(
                url,
                terminalFetchOptions
            );


        if (!response.ok) {

            throw new Error(
                `Top movers request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!Array.isArray(result)) {

            throw new Error(
                "Top movers data unavailable."
            );

        }


        const validAssets =
            result.filter(
                (asset) => {

                    const change =
                        Number(
                            asset
                                .price_change_percentage_24h
                        );


                    return (
                        Number.isFinite(
                            change
                        ) &&
                        Number.isFinite(
                            Number(
                                asset.current_price
                            )
                        )
                    );

                }
            );


        const gainers =
            [...validAssets]
                .sort(
                    (a, b) =>
                        Number(
                            b.price_change_percentage_24h
                        ) -
                        Number(
                            a.price_change_percentage_24h
                        )
                )
                .slice(
                    0,
                    5
                );


        const losers =
            [...validAssets]
                .sort(
                    (a, b) =>
                        Number(
                            a.price_change_percentage_24h
                        ) -
                        Number(
                            b.price_change_percentage_24h
                        )
                )
                .slice(
                    0,
                    5
                );


        renderTopMovers(
            gainers,
            losers
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: top movers unavailable.",
            error
        );


        if (topGainersList) {

            topGainersList.textContent =
                "Market data temporarily unavailable.";

        }


        if (topLosersList) {

            topLosersList.textContent =
                "Market data temporarily unavailable.";

        }


        return false;

    }

}


/* =====================================================
   FEAR & GREED
   EXTERNAL MARKET DATA — ALTERNATIVE.ME
===================================================== */

const fearGreedElements = {

    gauge:
        terminalGetElement(
            "fearGreedGauge"
        ),

    needle:
        terminalGetElement(
            "fearGreedNeedle"
        ),

    value:
        terminalGetElement(
            "fearGreedValue"
        ),

    state:
        terminalGetElement(
            "fearGreedState"
        ),

    title:
        terminalGetElement(
            "fearGreedTitle"
        ),

    text:
        terminalGetElement(
            "fearGreedText"
        ),

    retail:
        terminalGetElement(
            "fearGreedRetail"
        ),

    institutional:
        terminalGetElement(
            "fearGreedInstitutional"
        ),

    volatility:
        terminalGetElement(
            "fearGreedVolatility"
        ),

    regime:
        terminalGetElement(
            "fearGreedRegime"
        ),

    refresh:
        terminalGetElement(
            "fearGreedLiveRefresh"
        )

};


/* =====================================================
   FEAR & GREED HELPERS
===================================================== */

function getFearGreedState(
    value,
    apiClassification = ""
) {

    const score =
        terminalClamp(
            value
        );


    if (apiClassification) {

        return String(
            apiClassification
        );

    }


    if (score <= 24) {
        return "Extreme Fear";
    }


    if (score <= 44) {
        return "Fear";
    }


    if (score <= 55) {
        return "Neutral";
    }


    if (score <= 74) {
        return "Greed";
    }


    return "Extreme Greed";

}


function getFearGreedInterpretation(
    value
) {

    const score =
        terminalClamp(
            value
        );


    if (score <= 24) {

        return {
            title:
                "Market sentiment indicates extreme fear.",
            text:
                "The external Fear & Greed Index currently reflects very cautious market sentiment. SNAO interpretation shown here is informational and not investment advice.",
            retail:
                "Very Cautious",
            institutional:
                "Preview Only",
            volatility:
                "Elevated",
            regime:
                "Risk-Off"
        };

    }


    if (score <= 44) {

        return {
            title:
                "Market sentiment currently leans fearful.",
            text:
                "The external sentiment index currently reflects cautious market conditions. Additional SNAO interpretation is experimental and should not be treated as a trading signal.",
            retail:
                "Cautious",
            institutional:
                "Preview Only",
            volatility:
                "Moderate / High",
            regime:
                "Cautious"
        };

    }


    if (score <= 55) {

        return {
            title:
                "Market sentiment is currently neutral.",
            text:
                "The external Fear & Greed Index currently shows no strong sentiment extreme. Additional SNAO interpretation remains experimental.",
            retail:
                "Neutral",
            institutional:
                "Preview Only",
            volatility:
                "Moderate",
            regime:
                "Balanced"
        };

    }


    if (score <= 74) {

        return {
            title:
                "Market sentiment currently leans toward greed.",
            text:
                "The external sentiment index currently reflects stronger market optimism. This does not confirm institutional activity or future market direction.",
            retail:
                "Optimistic",
            institutional:
                "Preview Only",
            volatility:
                "Moderate",
            regime:
                "Risk-On"
        };

    }


    return {
        title:
            "Market sentiment indicates extreme greed.",
        text:
            "The external Fear & Greed Index currently reflects very strong market optimism. Elevated optimism can also coincide with increased market risk. This is not investment advice.",
        retail:
            "Very Optimistic",
        institutional:
            "Preview Only",
        volatility:
            "Watch Closely",
        regime:
            "High Optimism"
    };

}


/* =====================================================
   RENDER FEAR & GREED
===================================================== */

function renderFearGreed(
    value,
    classification
) {

    const score =
        Math.round(
            terminalClamp(
                value
            )
        );


    const state =
        getFearGreedState(
            score,
            classification
        );


    const interpretation =
        getFearGreedInterpretation(
            score
        );


    terminalSetText(
        fearGreedElements.value,
        score
    );


    terminalSetText(
        fearGreedElements.state,
        state
    );


    terminalSetText(
        fearGreedElements.title,
        interpretation.title
    );


    terminalSetText(
        fearGreedElements.text,
        interpretation.text
    );


    terminalSetText(
        fearGreedElements.retail,
        interpretation.retail
    );


    terminalSetText(
        fearGreedElements.institutional,
        interpretation.institutional
    );


    terminalSetText(
        fearGreedElements.volatility,
        interpretation.volatility
    );


    terminalSetText(
        fearGreedElements.regime,
        interpretation.regime
    );


    if (
        fearGreedElements.gauge
    ) {

        fearGreedElements.gauge
            .style
            .setProperty(
                "--fear-greed-position",
                `${score}%`
            );

    }


    if (
        fearGreedElements.needle
    ) {

        /*
         * Gauge range:
         * 0   = approximately -90 degrees
         * 100 = approximately +90 degrees
         */

        const angle =
            -90 +
            score * 1.8;


        fearGreedElements.needle
            .style
            .transform =
                `rotate(${angle}deg)`;

    }

}


/* =====================================================
   LOAD FEAR & GREED
===================================================== */

async function loadFearGreed() {

    if (
        !fearGreedElements.value
    ) {
        return false;
    }


    terminalSetText(
        fearGreedElements.value,
        "--"
    );


    terminalSetText(
        fearGreedElements.state,
        "Loading"
    );


    try {

        const response =
            await fetch(
                TERMINAL_API.fearGreed,
                terminalFetchOptions
            );


        if (!response.ok) {

            throw new Error(
                `Fear & Greed request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        const entry =
            Array.isArray(
                result?.data
            )
                ? result.data[0]
                : null;


        if (!entry) {

            throw new Error(
                "Fear & Greed data unavailable."
            );

        }


        const value =
            Number(
                entry.value
            );


        if (
            !Number.isFinite(
                value
            )
        ) {

            throw new Error(
                "Invalid Fear & Greed value."
            );

        }


        renderFearGreed(
            value,
            entry.value_classification
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: Fear & Greed data unavailable.",
            error
        );


        terminalSetText(
            fearGreedElements.value,
            "--"
        );


        terminalSetText(
            fearGreedElements.state,
            "Unavailable"
        );


        terminalSetText(
            fearGreedElements.title,
            "External sentiment data unavailable."
        );


        terminalSetText(
            fearGreedElements.text,
            "The external Fear & Greed Index could not be loaded. No replacement or simulated live value is being displayed."
        );


        terminalSetText(
            fearGreedElements.retail,
            "--"
        );


        terminalSetText(
            fearGreedElements.institutional,
            "Preview"
        );


        terminalSetText(
            fearGreedElements.volatility,
            "--"
        );


        terminalSetText(
            fearGreedElements.regime,
            "--"
        );


        return false;

    }

}


/* =====================================================
   FEAR & GREED REFRESH
===================================================== */

if (
    fearGreedElements.refresh
) {

    fearGreedElements.refresh
        .addEventListener(
            "click",
            async () => {

                fearGreedElements.refresh.disabled =
                    true;


                try {

                    await loadFearGreed();

                } finally {

                    fearGreedElements.refresh.disabled =
                        false;

                }

            }
        );

}


/* =====================================================
   TRENDING NARRATIVES
   DEMONSTRATION INTELLIGENCE

   These are demonstration values for the planned
   SNAO narrative-analysis interface. They are NOT
   presented as verified real-time narrative scores.
===================================================== */

const terminalNarrativeItems =
    document.querySelectorAll(
        ".terminal-narrative-item[data-narrative]"
    );


const terminalNarrativeDatabase = {

    ai: {
        title:
            "Artificial Intelligence",
        condition:
            "Demo: High Attention",
        description:
            "Demonstration narrative showing how SNAO could summarize attention around AI infrastructure, agents and crypto-related artificial intelligence.",
        confidence:
            "95%"
    },

    rwa: {
        title:
            "Real World Assets",
        condition:
            "Demo: Strong Attention",
        description:
            "Demonstration narrative showing how SNAO could track attention around tokenized real-world assets and financial infrastructure.",
        confidence:
            "78%"
    },

    defi: {
        title:
            "Decentralized Finance",
        condition:
            "Demo: Moderate Attention",
        description:
            "Demonstration narrative showing how SNAO could evaluate attention across decentralized finance protocols and liquidity markets.",
        confidence:
            "71%"
    },

    gaming: {
        title:
            "Gaming",
        condition:
            "Demo: Developing Attention",
        description:
            "Demonstration narrative showing how SNAO could summarize market attention around blockchain gaming and digital economies.",
        confidence:
            "63%"
    },

    memes: {
        title:
            "Meme Assets",
        condition:
            "Demo: Speculative Attention",
        description:
            "Demonstration narrative illustrating how SNAO could identify highly speculative market-attention clusters.",
        confidence:
            "58%"
    }

};


/* =====================================================
   NARRATIVE DETAIL ELEMENTS

   These selectors intentionally use classes/data
   attributes where possible so the module remains
   compatible even if optional detail IDs are absent.
===================================================== */

const terminalNarrativePanel =
    terminalGetElement(
        "narratives"
    );


function renderTerminalNarrative(
    narrativeKey
) {

    const data =
        terminalNarrativeDatabase[
            narrativeKey
        ];


    if (!data) {
        return;
    }


    terminalNarrativeItems.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset.narrative ===
                    narrativeKey
            );

        }
    );


    if (!terminalNarrativePanel) {
        return;
    }


    const titleElement =
        terminalNarrativePanel.querySelector(
            "[data-narrative-title]"
        );


    const conditionElement =
        terminalNarrativePanel.querySelector(
            "[data-narrative-condition]"
        );


    const descriptionElement =
        terminalNarrativePanel.querySelector(
            "[data-narrative-description]"
        );


    const confidenceElement =
        terminalNarrativePanel.querySelector(
            "[data-narrative-confidence]"
        );


    terminalSetText(
        titleElement,
        data.title
    );


    terminalSetText(
        conditionElement,
        data.condition
    );


    terminalSetText(
        descriptionElement,
        data.description
    );


    terminalSetText(
        confidenceElement,
        data.confidence
    );

}


/* =====================================================
   NARRATIVE INTERACTIONS
===================================================== */

terminalNarrativeItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                const narrativeKey =
                    item.dataset
                        .narrative;


                if (!narrativeKey) {
                    return;
                }


                renderTerminalNarrative(
                    narrativeKey
                );

            }
        );

    }
);


/* =====================================================
   INITIAL NARRATIVE
===================================================== */

if (
    terminalNarrativeItems.length
) {

    const initialNarrative =
        terminalNarrativeItems[0]
            .dataset
            .narrative;


    if (initialNarrative) {

        renderTerminalNarrative(
            initialNarrative
        );

    }

}

/* =====================================================
   OCEAN FLOW
   DEMONSTRATION MODULE

   The current HTML contains illustrative exchange-flow
   values. This JavaScript only refreshes the preview
   presentation. It does NOT create or claim real
   exchange-transfer monitoring.
===================================================== */

const oceanFlowPanel =
    terminalGetElement(
        "ocean-flow"
    );


const oceanFlowPreviewSets = [

    {
        inflow:
            "+$418M",
        outflow:
            "-$291M",
        net:
            "+$127M",
        source:
            "Coinbase",
        destination:
            "Binance"
    },

    {
        inflow:
            "+$362M",
        outflow:
            "-$248M",
        net:
            "+$114M",
        source:
            "Binance",
        destination:
            "OKX"
    },

    {
        inflow:
            "+$305M",
        outflow:
            "-$337M",
        net:
            "-$32M",
        source:
            "Bybit",
        destination:
            "Coinbase"
    }

];


let oceanFlowPreviewIndex =
    0;


/* =====================================================
   RENDER OCEAN FLOW PREVIEW
===================================================== */

function renderDemoOceanFlow() {

    if (!oceanFlowPanel) {
        return;
    }


    const preview =
        oceanFlowPreviewSets[
            oceanFlowPreviewIndex %
            oceanFlowPreviewSets.length
        ];


    const statValues =
        oceanFlowPanel.querySelectorAll(
            ".flow-analysis-stats strong"
        );


    if (statValues[0]) {

        statValues[0].textContent =
            preview.inflow;

    }


    if (statValues[1]) {

        statValues[1].textContent =
            preview.outflow;

    }


    if (statValues[2]) {

        statValues[2].textContent =
            preview.net;


        statValues[2].classList.remove(
            "positive",
            "negative"
        );


        statValues[2].classList.add(
            preview.net.startsWith("-")
                ? "negative"
                : "positive"
        );

    }


    const routeValues =
        oceanFlowPanel.querySelectorAll(
            ".flow-dominant-route strong"
        );


    if (routeValues[0]) {

        routeValues[0].textContent =
            preview.source;

    }


    if (routeValues[1]) {

        routeValues[1].textContent =
            preview.destination;

    }

}


/* =====================================================
   OCEAN FLOW REFRESH
===================================================== */

if (oceanFlowPanel) {

    const oceanFlowRefresh =
        oceanFlowPanel.querySelector(
            ".flow-analysis-button"
        );


    if (oceanFlowRefresh) {

        oceanFlowRefresh.addEventListener(
            "click",
            () => {

                oceanFlowPreviewIndex =
                    (
                        oceanFlowPreviewIndex +
                        1
                    ) %
                    oceanFlowPreviewSets.length;


                renderDemoOceanFlow();

            }
        );

    }

}


/* =====================================================
   WHALE INTELLIGENCE
   DEMONSTRATION DATA ONLY
===================================================== */

const whaleTableRefresh =
    terminalGetElement(
        "whaleTableRefresh"
    );

const whaleIntelligenceTableBody =
    terminalGetElement(
        "whaleIntelligenceTableBody"
    );


const whalePreviewDatasets = [

    [
        {
            asset:
                "BTC",
            movement:
                "1,240 BTC",
            value:
                "$84.8M",
            type:
                "Transfer",
            source:
                "Exchange",
            destination:
                "Private Wallet",
            signal:
                "Demo Accumulation",
            className:
                "positive"
        },

        {
            asset:
                "ETH",
            movement:
                "18,420 ETH",
            value:
                "$69.6M",
            type:
                "Transfer",
            source:
                "Private Wallet",
            destination:
                "Exchange",
            signal:
                "Demo Distribution",
            className:
                "negative"
        },

        {
            asset:
                "SOL",
            movement:
                "210,000 SOL",
            value:
                "$31.5M",
            type:
                "Transfer",
            source:
                "Exchange",
            destination:
                "Private Wallet",
            signal:
                "Demo Accumulation",
            className:
                "positive"
        },

        {
            asset:
                "USDT",
            movement:
                "52M USDT",
            value:
                "$52M",
            type:
                "Transfer",
            source:
                "Private Wallet",
            destination:
                "Exchange",
            signal:
                "Demo Liquidity",
            className:
                "neutral"
        }
    ],

    [
        {
            asset:
                "BTC",
            movement:
                "980 BTC",
            value:
                "$67.1M",
            type:
                "Transfer",
            source:
                "Private Wallet",
            destination:
                "Exchange",
            signal:
                "Demo Distribution",
            className:
                "negative"
        },

        {
            asset:
                "ETH",
            movement:
                "14,800 ETH",
            value:
                "$55.9M",
            type:
                "Transfer",
            source:
                "Exchange",
            destination:
                "Private Wallet",
            signal:
                "Demo Accumulation",
            className:
                "positive"
        },

        {
            asset:
                "BNB",
            movement:
                "72,000 BNB",
            value:
                "$43.2M",
            type:
                "Transfer",
            source:
                "Exchange",
            destination:
                "Private Wallet",
            signal:
                "Demo Accumulation",
            className:
                "positive"
        },

        {
            asset:
                "USDT",
            movement:
                "38M USDT",
            value:
                "$38M",
            type:
                "Transfer",
            source:
                "Exchange",
            destination:
                "Private Wallet",
            signal:
                "Demo Liquidity",
            className:
                "neutral"
        }
    ]

];


let whalePreviewDatasetIndex =
    0;


/* =====================================================
   BUILD WHALE PREVIEW ROW
===================================================== */

function createWhalePreviewRow(
    transaction
) {

    const row =
        document.createElement(
            "tr"
        );


    const assetCell =
        document.createElement(
            "td"
        );

    const assetStrong =
        document.createElement(
            "strong"
        );

    assetStrong.textContent =
        transaction.asset;

    assetCell.appendChild(
        assetStrong
    );


    const movementCell =
        document.createElement(
            "td"
        );

    movementCell.textContent =
        transaction.movement;


    const valueCell =
        document.createElement(
            "td"
        );

    valueCell.textContent =
        transaction.value;


    const typeCell =
        document.createElement(
            "td"
        );

    typeCell.textContent =
        transaction.type;


    const sourceCell =
        document.createElement(
            "td"
        );

    sourceCell.textContent =
        transaction.source;


    const destinationCell =
        document.createElement(
            "td"
        );

    destinationCell.textContent =
        transaction.destination;


    const signalCell =
        document.createElement(
            "td"
        );


    const signal =
        document.createElement(
            "span"
        );

    signal.className =
        `whale-table-signal ${transaction.className}`;

    signal.textContent =
        transaction.signal;


    signalCell.appendChild(
        signal
    );


    row.append(
        assetCell,
        movementCell,
        valueCell,
        typeCell,
        sourceCell,
        destinationCell,
        signalCell
    );


    return row;

}


/* =====================================================
   RENDER WHALE PREVIEW
===================================================== */

function renderWhalePreview() {

    if (
        !whaleIntelligenceTableBody
    ) {
        return;
    }


    const dataset =
        whalePreviewDatasets[
            whalePreviewDatasetIndex %
            whalePreviewDatasets.length
        ];


    whaleIntelligenceTableBody.innerHTML =
        "";


    dataset.forEach(
        (transaction) => {

            whaleIntelligenceTableBody
                .appendChild(
                    createWhalePreviewRow(
                        transaction
                    )
                );

        }
    );

}


/* =====================================================
   WHALE PREVIEW REFRESH
===================================================== */

if (whaleTableRefresh) {

    whaleTableRefresh.addEventListener(
        "click",
        () => {

            whalePreviewDatasetIndex =
                (
                    whalePreviewDatasetIndex +
                    1
                ) %
                whalePreviewDatasets.length;


            renderWhalePreview();

        }
    );

}


/* =====================================================
   SMART MONEY RADAR
   EXPERIMENTAL / DEMONSTRATION

   No verified institutional positions are used here.
===================================================== */

const smartMoneyElements = {

    panel:
        terminalGetElement(
            "smart-money"
        ),

    value:
        terminalGetElement(
            "smartMoneyValue"
        ),

    whale:
        terminalGetElement(
            "smartWhaleSignal"
        ),

    exchange:
        terminalGetElement(
            "smartExchangeSignal"
        ),

    liquidity:
        terminalGetElement(
            "smartLiquiditySignal"
        ),

    bias:
        terminalGetElement(
            "smartBiasSignal"
        ),

    title:
        terminalGetElement(
            "smartMoneyTitle"
        ),

    text:
        terminalGetElement(
            "smartMoneyText"
        )

};


const smartMoneyPreviewSets = [

    {
        score:
            81,
        whale:
            "Demo: High",
        exchange:
            "Demo: Positive",
        liquidity:
            "Demo: Increasing",
        bias:
            "Demo: Bullish",
        title:
            "Demonstration institutional analysis.",
        text:
            "This preview illustrates how Sardine AI is intended to combine whale activity, exchange flows and liquidity conditions into a simplified market interpretation. It is not a verified institutional activity signal."
    },

    {
        score:
            67,
        whale:
            "Demo: Moderate",
        exchange:
            "Demo: Neutral",
        liquidity:
            "Demo: Stable",
        bias:
            "Demo: Balanced",
        title:
            "Demonstration conditions are relatively balanced.",
        text:
            "This experimental preview demonstrates a more neutral combination of large-wallet, exchange-flow and liquidity components. The values do not represent verified institutional positions."
    },

    {
        score:
            54,
        whale:
            "Demo: Mixed",
        exchange:
            "Demo: Negative",
        liquidity:
            "Demo: Stable",
        bias:
            "Demo: Cautious",
        title:
            "Demonstration conditions currently show caution.",
        text:
            "This preview demonstrates how weaker experimental components could produce a more cautious Smart Money interpretation. It is not a trading signal or verified institutional analysis."
    }

];


let smartMoneyPreviewIndex =
    0;


/* =====================================================
   RENDER SMART MONEY
===================================================== */

function renderSmartMoneyPreview() {

    const preview =
        smartMoneyPreviewSets[
            smartMoneyPreviewIndex %
            smartMoneyPreviewSets.length
        ];


    terminalSetText(
        smartMoneyElements.value,
        preview.score
    );


    terminalSetText(
        smartMoneyElements.whale,
        preview.whale
    );


    terminalSetText(
        smartMoneyElements.exchange,
        preview.exchange
    );


    terminalSetText(
        smartMoneyElements.liquidity,
        preview.liquidity
    );


    terminalSetText(
        smartMoneyElements.bias,
        preview.bias
    );


    terminalSetText(
        smartMoneyElements.title,
        preview.title
    );


    terminalSetText(
        smartMoneyElements.text,
        preview.text
    );


    if (
        smartMoneyElements.panel
    ) {

        const circle =
            smartMoneyElements.panel
                .querySelector(
                    ".smart-money-circle"
                );


        terminalSetProgress(
            circle,
            "--smart-money-score",
            preview.score
        );

    }

}


/* =====================================================
   SMART MONEY REFRESH
===================================================== */

if (
    smartMoneyElements.panel
) {

    const smartMoneyRefresh =
        smartMoneyElements.panel
            .querySelector(
                ".smart-money-analysis button"
            );


    if (smartMoneyRefresh) {

        smartMoneyRefresh.addEventListener(
            "click",
            () => {

                smartMoneyPreviewIndex =
                    (
                        smartMoneyPreviewIndex +
                        1
                    ) %
                    smartMoneyPreviewSets.length;


                renderSmartMoneyPreview();

            }
        );

    }

}


/* =====================================================
   LIQUIDITY PRESSURE INDEX
   EXPERIMENTAL SNAO INDICATOR
===================================================== */

const liquidityPressureElements = {

    ring:
        terminalGetElement(
            "liquidityPressureRing"
        ),

    value:
        terminalGetElement(
            "liquidityPressureValue"
        ),

    condition:
        terminalGetElement(
            "liquidityPressureCondition"
        ),

    description:
        terminalGetElement(
            "liquidityPressureDescription"
        ),

    stablecoinValue:
        terminalGetElement(
            "liquidityStablecoinValue"
        ),

    stablecoinProgress:
        terminalGetElement(
            "liquidityStablecoinProgress"
        ),

    exchangeValue:
        terminalGetElement(
            "liquidityExchangeValue"
        ),

    exchangeProgress:
        terminalGetElement(
            "liquidityExchangeProgress"
        ),

    volumeValue:
        terminalGetElement(
            "liquidityVolumeValue"
        ),

    volumeProgress:
        terminalGetElement(
            "liquidityVolumeProgress"
        ),

    capitalValue:
        terminalGetElement(
            "liquidityCapitalValue"
        ),

    capitalProgress:
        terminalGetElement(
            "liquidityCapitalProgress"
        ),

    title:
        terminalGetElement(
            "liquidityPressureTitle"
        ),

    text:
        terminalGetElement(
            "liquidityPressureText"
        ),

    signal:
        terminalGetElement(
            "liquidityPressureSignal"
        ),

    confidence:
        terminalGetElement(
            "liquidityPressureConfidence"
        ),

    impact:
        terminalGetElement(
            "liquidityPressureImpact"
        ),

    refresh:
        terminalGetElement(
            "liquidityPressureRefresh"
        )

};


/* =====================================================
   CALCULATE LIQUIDITY PRESSURE
===================================================== */

function calculateLiquidityPressurePreview() {

    const marketChange =
        terminalSafeNumber(
            terminalMarketState
                .marketChange24h,
            0
        );


    const totalMarketCap =
        terminalSafeNumber(
            terminalMarketState
                .totalMarketCap,
            0
        );


    /*
     * These values are experimental estimates.
     * They do not represent direct measurements of
     * stablecoin flows or exchange reserves.
     */

    const stablecoin =
        Math.round(
            terminalClamp(
                68 +
                marketChange * 3
            )
        );


    const exchange =
        Math.round(
            terminalClamp(
                65 +
                marketChange * 2.5
            )
        );


    const volume =
        Math.round(
            terminalClamp(
                62 +
                marketChange * 3.5
            )
        );


    const marketCapAdjustment =
        totalMarketCap > 0
            ? Math.min(
                12,
                Math.log10(
                    totalMarketCap
                ) - 10
            )
            : 0;


    const capital =
        Math.round(
            terminalClamp(
                66 +
                marketCapAdjustment +
                marketChange * 2
            )
        );


    const score =
        Math.round(
            stablecoin * 0.25 +
            exchange * 0.25 +
            volume * 0.25 +
            capital * 0.25
        );


    return {
        stablecoin,
        exchange,
        volume,
        capital,
        score
    };

}


/* =====================================================
   LIQUIDITY INTERPRETATION
===================================================== */

function getLiquidityPressureInterpretation(
    score
) {

    if (score >= 75) {

        return {
            condition:
                "Positive Liquidity",
            title:
                "Experimental liquidity conditions are positive.",
            text:
                "The SNAO preview model currently produces a stronger liquidity reading from its experimental components. This is not a verified real-time liquidity assessment.",
            signal:
                "Demo: Positive",
            impact:
                "Demo: Positive"
        };

    }


    if (score >= 55) {

        return {
            condition:
                "Balanced Liquidity",
            title:
                "Experimental liquidity conditions are balanced.",
            text:
                "The SNAO preview model currently shows a balanced liquidity estimate. The components are experimental and should not be interpreted as verified capital-flow data.",
            signal:
                "Demo: Balanced",
            impact:
                "Demo: Neutral"
        };

    }


    return {
        condition:
            "Tight Liquidity",
        title:
            "Experimental liquidity conditions appear tighter.",
        text:
            "The SNAO preview model currently produces a weaker liquidity estimate. This is an experimental analytical reading, not a verified market signal.",
        signal:
            "Demo: Cautious",
        impact:
            "Demo: Negative"
    };

}


/* =====================================================
   RENDER LIQUIDITY PRESSURE
===================================================== */

function renderLiquidityPressure() {

    const result =
        calculateLiquidityPressurePreview();


    const interpretation =
        getLiquidityPressureInterpretation(
            result.score
        );


    terminalSetText(
        liquidityPressureElements.value,
        result.score
    );


    terminalSetProgress(
        liquidityPressureElements.ring,
        "--liquidity-pressure-value",
        result.score
    );


    terminalSetText(
        liquidityPressureElements.condition,
        interpretation.condition
    );


    terminalSetText(
        liquidityPressureElements.description,
        "Experimental SNAO preview combining public market conditions with demonstration liquidity components. It does not represent verified stablecoin or exchange-flow monitoring."
    );


    terminalSetText(
        liquidityPressureElements.stablecoinValue,
        result.stablecoin
    );


    terminalSetProgress(
        liquidityPressureElements.stablecoinProgress,
        "--liquidity-value",
        result.stablecoin
    );


    terminalSetText(
        liquidityPressureElements.exchangeValue,
        result.exchange
    );


    terminalSetProgress(
        liquidityPressureElements.exchangeProgress,
        "--liquidity-value",
        result.exchange
    );


    terminalSetText(
        liquidityPressureElements.volumeValue,
        result.volume
    );


    terminalSetProgress(
        liquidityPressureElements.volumeProgress,
        "--liquidity-value",
        result.volume
    );


    terminalSetText(
        liquidityPressureElements.capitalValue,
        result.capital
    );


    terminalSetProgress(
        liquidityPressureElements.capitalProgress,
        "--liquidity-value",
        result.capital
    );


    terminalSetText(
        liquidityPressureElements.title,
        interpretation.title
    );


    terminalSetText(
        liquidityPressureElements.text,
        interpretation.text
    );


    terminalSetText(
        liquidityPressureElements.signal,
        interpretation.signal
    );


    terminalSetText(
        liquidityPressureElements.confidence,
        `${result.score}%`
    );


    terminalSetText(
        liquidityPressureElements.impact,
        interpretation.impact
    );

}


/* =====================================================
   LIQUIDITY PRESSURE REFRESH
===================================================== */

if (
    liquidityPressureElements.refresh
) {

    liquidityPressureElements.refresh
        .addEventListener(
            "click",
            () => {

                renderLiquidityPressure();

            }
        );

}


/* =====================================================
   WHALE CONFIDENCE INDEX
   EXPERIMENTAL PREVIEW

   No verified whale wallet information is used.
===================================================== */

const whaleConfidenceElements = {

    ring:
        terminalGetElement(
            "whaleConfidenceRing"
        ),

    value:
        terminalGetElement(
            "whaleConfidenceValue"
        ),

    condition:
        terminalGetElement(
            "whaleConfidenceCondition"
        ),

    description:
        terminalGetElement(
            "whaleConfidenceDescription"
        ),

    accumulationValue:
        terminalGetElement(
            "whaleAccumulationValue"
        ),

    accumulationProgress:
        terminalGetElement(
            "whaleAccumulationProgress"
        ),

    outflowValue:
        terminalGetElement(
            "whaleOutflowValue"
        ),

    outflowProgress:
        terminalGetElement(
            "whaleOutflowProgress"
        ),

    holdingValue:
        terminalGetElement(
            "whaleHoldingValue"
        ),

    holdingProgress:
        terminalGetElement(
            "whaleHoldingProgress"
        ),

    transferValue:
        terminalGetElement(
            "whaleTransferValue"
        ),

    transferProgress:
        terminalGetElement(
            "whaleTransferProgress"
        ),

    title:
        terminalGetElement(
            "whaleConfidenceTitle"
        ),

    text:
        terminalGetElement(
            "whaleConfidenceText"
        ),

    direction:
        terminalGetElement(
            "whaleConfidenceDirection"
        ),

    confidence:
        terminalGetElement(
            "whaleConfidenceConfidence"
        ),

    risk:
        terminalGetElement(
            "whaleConfidenceRisk"
        ),

    refresh:
        terminalGetElement(
            "whaleConfidenceRefresh"
        )

};


/* =====================================================
   CALCULATE WHALE CONFIDENCE PREVIEW
===================================================== */

function calculateWhaleConfidencePreview() {

    const marketChange =
        terminalSafeNumber(
            terminalMarketState
                .marketChange24h,
            0
        );


    /*
     * Demonstration components.
     * These values do not come from verified whale
     * wallets or real-time on-chain monitoring.
     */

    const accumulation =
        Math.round(
            terminalClamp(
                70 +
                marketChange * 3
            )
        );


    const outflow =
        Math.round(
            terminalClamp(
                66 +
                marketChange * 2.5
            )
        );


    const holding =
        Math.round(
            terminalClamp(
                72 +
                marketChange * 2
            )
        );


    const transfer =
        Math.round(
            terminalClamp(
                68 +
                marketChange * 2.75
            )
        );


    const score =
        Math.round(
            accumulation * 0.30 +
            outflow * 0.25 +
            holding * 0.25 +
            transfer * 0.20
        );


    return {
        accumulation,
        outflow,
        holding,
        transfer,
        score
    };

}


/* =====================================================
   WHALE CONFIDENCE INTERPRETATION
===================================================== */

function getWhaleConfidenceInterpretation(
    score
) {

    if (score >= 75) {

        return {
            condition:
                "Demo: High Confidence",
            title:
                "Demonstration large-wallet conviction is elevated.",
            text:
                "This experimental preview illustrates how future on-chain and exchange-flow inputs could contribute to a Whale Confidence Index. No verified whale-wallet positions are represented.",
            direction:
                "Demo: Positive",
            risk:
                "Demo: Moderate"
        };

    }


    if (score >= 55) {

        return {
            condition:
                "Demo: Balanced Confidence",
            title:
                "Demonstration large-wallet conviction is balanced.",
            text:
                "This experimental preview currently produces a balanced Whale Confidence reading. It is not based on verified whale-wallet monitoring.",
            direction:
                "Demo: Neutral",
            risk:
                "Demo: Moderate"
        };

    }


    return {
        condition:
            "Demo: Low Confidence",
        title:
            "Demonstration large-wallet conviction is weaker.",
        text:
            "This experimental preview currently produces a weaker Whale Confidence reading. It is not a verified on-chain or institutional signal.",
        direction:
            "Demo: Negative",
        risk:
            "Demo: Elevated"
    };

}


/* =====================================================
   RENDER WHALE CONFIDENCE
===================================================== */

function renderWhaleConfidence() {

    const result =
        calculateWhaleConfidencePreview();


    const interpretation =
        getWhaleConfidenceInterpretation(
            result.score
        );


    terminalSetText(
        whaleConfidenceElements.value,
        result.score
    );


    terminalSetProgress(
        whaleConfidenceElements.ring,
        "--whale-confidence-value",
        result.score
    );


    /*
     * Current CSS also supports --whale-confidence.
     * Set both variables for compatibility.
     */

    terminalSetProgress(
        whaleConfidenceElements.ring,
        "--whale-confidence",
        result.score
    );


    terminalSetText(
        whaleConfidenceElements.condition,
        interpretation.condition
    );


    terminalSetText(
        whaleConfidenceElements.description,
        "Experimental preview of how SNAO could evaluate large-wallet conviction using future on-chain activity, exchange flows and wallet behavior."
    );


    terminalSetText(
        whaleConfidenceElements.accumulationValue,
        result.accumulation
    );


    terminalSetProgress(
        whaleConfidenceElements.accumulationProgress,
        "--whale-value",
        result.accumulation
    );


    terminalSetText(
        whaleConfidenceElements.outflowValue,
        result.outflow
    );


    terminalSetProgress(
        whaleConfidenceElements.outflowProgress,
        "--whale-value",
        result.outflow
    );


    terminalSetText(
        whaleConfidenceElements.holdingValue,
        result.holding
    );


    terminalSetProgress(
        whaleConfidenceElements.holdingProgress,
        "--whale-value",
        result.holding
    );


    terminalSetText(
        whaleConfidenceElements.transferValue,
        result.transfer
    );


    terminalSetProgress(
        whaleConfidenceElements.transferProgress,
        "--whale-value",
        result.transfer
    );


    terminalSetText(
        whaleConfidenceElements.title,
        interpretation.title
    );


    terminalSetText(
        whaleConfidenceElements.text,
        interpretation.text
    );


    terminalSetText(
        whaleConfidenceElements.direction,
        interpretation.direction
    );


    terminalSetText(
        whaleConfidenceElements.confidence,
        `${result.score}%`
    );


    terminalSetText(
        whaleConfidenceElements.risk,
        interpretation.risk
    );

}


/* =====================================================
   WHALE CONFIDENCE REFRESH
===================================================== */

if (
    whaleConfidenceElements.refresh
) {

    whaleConfidenceElements.refresh
        .addEventListener(
            "click",
            () => {

                renderWhaleConfidence();

            }
        );

}

/* =====================================================
   SARDINE AI
   PRODUCT PREVIEW

   These messages are predefined preview summaries.
   They are not live AI-generated financial advice.
===================================================== */

const terminalAiText =
    terminalGetElement(
        "terminalAiText"
    );


const sardineAiPreviewMessages = {

    market:
        "Sardine AI is being designed to combine public market data, sentiment, liquidity and experimental SNAO indicators into concise market summaries. This preview is informational and does not predict future market performance.",

    whales:
        "Future Sardine AI modules are intended to incorporate verified on-chain information and large-wallet activity. The current Terminal whale modules use demonstration data and do not represent verified whale movements.",

    risk:
        "Sardine AI is planned to combine volatility, liquidity, sentiment and future on-chain intelligence into simplified risk assessments. Current risk interpretations are experimental and are not investment recommendations."

};


const sardineAiButtons =
    document.querySelectorAll(
        "[data-ai-message]"
    );


sardineAiButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const messageKey =
                    button.dataset
                        .aiMessage;


                const message =
                    sardineAiPreviewMessages[
                        messageKey
                    ];


                if (!message) {
                    return;
                }


                terminalSetText(
                    terminalAiText,
                    message
                );


                sardineAiButtons.forEach(
                    (item) => {

                        item.classList.toggle(
                            "active",
                            item === button
                        );

                    }
                );

            }
        );

    }
);


/* =====================================================
   OCEAN RISK
   EXPERIMENTAL PREVIEW

   The HTML currently presents Ocean Risk as a preview.
   We update the visible value using public market
   movement as one input, without claiming a verified
   real-time risk model.
===================================================== */

const oceanRiskPanel =
    terminalGetElement(
        "risk"
    );


function calculateOceanRiskPreview() {

    const marketChange =
        terminalSafeNumber(
            terminalMarketState
                .marketChange24h,
            0
        );


    const absoluteMovement =
        Math.abs(
            marketChange
        );


    /*
     * Experimental estimate:
     * larger 24h global-market movement increases
     * the preview risk level.
     */

    return Math.round(
        terminalClamp(
            30 +
            absoluteMovement * 6,
            20,
            90
        )
    );

}


/* =====================================================
   RENDER OCEAN RISK
===================================================== */

function renderOceanRiskPreview() {

    if (!oceanRiskPanel) {
        return;
    }


    const value =
        calculateOceanRiskPreview();


    /*
     * The main strong element in this card contains
     * the displayed risk percentage.
     */

    const valueElement =
        oceanRiskPanel.querySelector(
            ":scope > strong"
        ) ||
        oceanRiskPanel.querySelector(
            "strong"
        );


    if (valueElement) {

        valueElement.textContent =
            `${value}%`;

    }


    const description =
        oceanRiskPanel.querySelector(
            "p"
        );


    if (description) {

        if (value >= 70) {

            description.textContent =
                "Experimental risk conditions are elevated. This preview uses public market movement as an input and is not a verified trading-risk signal.";

        } else if (value >= 45) {

            description.textContent =
                "Experimental risk conditions are moderate. This preview is an analytical estimate and not investment advice.";

        } else {

            description.textContent =
                "Experimental risk conditions are currently lower. This preview does not guarantee future market stability.";

        }

    }

}


/* =====================================================
   OCEAN HEATMAP
   MARKET DATA — COINGECKO WHEN AVAILABLE

   Unlike the original demonstration percentages,
   this function attempts to load current 24h market
   changes for the assets already shown in the HTML.

   If the request fails, the section is explicitly
   marked unavailable instead of generating fake
   live percentages.
===================================================== */

const terminalHeatmap =
    document.querySelector(
        "#heatmap .terminal-heatmap"
    );


const terminalHeatmapCoinIds = {

    BTC:
        "bitcoin",

    ETH:
        "ethereum",

    SOL:
        "solana",

    BNB:
        "binancecoin",

    XRP:
        "ripple",

    DOGE:
        "dogecoin",

    LINK:
        "chainlink",

    AVAX:
        "avalanche-2"

};


/* =====================================================
   HEATMAP CLASSIFICATION
===================================================== */

function getHeatmapClass(
    change
) {

    const value =
        terminalSafeNumber(
            change,
            0
        );


    if (value >= 4) {
        return "strong-positive";
    }


    if (value > 0) {
        return "positive";
    }


    if (value <= -4) {
        return "strong-negative";
    }


    if (value < 0) {
        return "negative";
    }


    return "neutral";

}


/* =====================================================
   RENDER HEATMAP ASSET
===================================================== */

function renderHeatmapAsset(
    element,
    change
) {

    if (!element) {
        return;
    }


    const valueElement =
        element.querySelector(
            "span"
        );


    if (!valueElement) {
        return;
    }


    element.classList.remove(
        "positive",
        "negative",
        "strong-positive",
        "strong-negative",
        "neutral"
    );


    element.classList.add(
        getHeatmapClass(
            change
        )
    );


    valueElement.textContent =
        terminalFormatPercent(
            change
        );

}


/* =====================================================
   LOAD HEATMAP MARKET DATA
===================================================== */

async function loadTerminalHeatmap() {

    if (!terminalHeatmap) {
        return false;
    }


    const assets =
        Array.from(
            terminalHeatmap.querySelectorAll(
                ".heatmap-asset"
            )
        );


    if (!assets.length) {
        return false;
    }


    const ids =
        Object.values(
            terminalHeatmapCoinIds
        ).join(",");


    const url =
        `${TERMINAL_API.markets}` +
        `?vs_currency=usd` +
        `&ids=${encodeURIComponent(ids)}` +
        `&order=market_cap_desc` +
        `&per_page=20` +
        `&page=1` +
        `&sparkline=false` +
        `&price_change_percentage=24h`;


    try {

        const response =
            await fetch(
                url,
                terminalFetchOptions
            );


        if (!response.ok) {

            throw new Error(
                `Heatmap request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!Array.isArray(result)) {

            throw new Error(
                "Heatmap market data unavailable."
            );

        }


        const marketMap = {};


        result.forEach(
            (asset) => {

                marketMap[
                    asset.id
                ] =
                    asset;

            }
        );


        assets.forEach(
            (element) => {

                const symbolElement =
                    element.querySelector(
                        "strong"
                    );


                if (!symbolElement) {
                    return;
                }


                const ticker =
                    symbolElement
                        .textContent
                        .trim()
                        .toUpperCase();


                const coinId =
                    terminalHeatmapCoinIds[
                        ticker
                    ];


                const marketData =
                    marketMap[
                        coinId
                    ];


                const change =
                    Number(
                        marketData
                            ?.price_change_percentage_24h
                    );


                if (
                    Number.isFinite(
                        change
                    )
                ) {

                    renderHeatmapAsset(
                        element,
                        change
                    );

                } else {

                    const valueElement =
                        element.querySelector(
                            "span"
                        );


                    if (valueElement) {

                        valueElement.textContent =
                            "--";

                    }


                    element.classList.remove(
                        "positive",
                        "negative",
                        "strong-positive",
                        "strong-negative"
                    );


                    element.classList.add(
                        "neutral"
                    );

                }

            }
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: heatmap data unavailable.",
            error
        );


        assets.forEach(
            (element) => {

                const valueElement =
                    element.querySelector(
                        "span"
                    );


                if (valueElement) {

                    valueElement.textContent =
                        "--";

                }


                element.classList.remove(
                    "positive",
                    "negative",
                    "strong-positive",
                    "strong-negative"
                );


                element.classList.add(
                    "neutral"
                );

            }
        );


        return false;

    }

}


/* =====================================================
   INTELLIGENCE NEWS

   No automatic news generation is performed here.

   The HTML intentionally describes this feature as
   Coming Soon, so JavaScript must not fabricate current
   market-news reports.
===================================================== */

function preserveIntelligenceNewsStatus() {

    const newsPanel =
        terminalGetElement(
            "news"
        );


    if (!newsPanel) {
        return;
    }


    /*
     * Deliberately no simulated news updates.
     * The section remains a product-development preview.
     */

}


/* =====================================================
   TERMINAL REFRESH BUTTON
===================================================== */

const terminalRefreshButton =
    terminalGetElement(
        "terminalRefreshButton"
    );


async function refreshTerminalMarketData() {

    if (
        terminalRefreshButton
    ) {

        terminalRefreshButton.disabled =
            true;

        terminalRefreshButton.classList.add(
            "is-loading"
        );

        terminalRefreshButton.textContent =
            "↻ Refreshing...";

    }


    /*
     * Clear the market cache so selected assets and
     * ticker cards can receive fresh public data.
     */

    Object.keys(
        terminalAssetMarketCache
    ).forEach(
        (key) => {

            delete terminalAssetMarketCache[
                key
            ];

        }
    );


    try {

        await Promise.allSettled(
            [
                loadGlobalMarketData(),
                loadTerminalTickerData(),
                loadTopMovers(),
                loadFearGreed(),
                loadTerminalHeatmap()
            ]
        );


        await loadSelectedAsset(
            terminalMarketState
                .selectedAsset
        );


        /*
         * Re-render experimental indicators after
         * fresh public market inputs are available.
         */

        renderOceanScoreBreakdown();

        renderLiquidityPressure();

        renderWhaleConfidence();

        renderOceanRiskPreview();


        updateTerminalCurrentTime();

    } finally {

        if (
            terminalRefreshButton
        ) {

            terminalRefreshButton.disabled =
                false;

            terminalRefreshButton.classList.remove(
                "is-loading"
            );

            terminalRefreshButton.textContent =
                "↻ Refresh";

        }

    }

}


if (
    terminalRefreshButton
) {

    terminalRefreshButton.addEventListener(
        "click",
        refreshTerminalMarketData
    );

}


/* =====================================================
   PERIODIC MARKET REFRESH

   Public market information is refreshed every
   5 minutes. Demonstration modules are NOT randomly
   changed in the background.
===================================================== */

const TERMINAL_MARKET_REFRESH_INTERVAL =
    5 * 60 * 1000;


async function automaticTerminalMarketRefresh() {

    /*
     * Do not visually disable the main refresh button
     * for background updates.
     */

    Object.keys(
        terminalAssetMarketCache
    ).forEach(
        (key) => {

            delete terminalAssetMarketCache[
                key
            ];

        }
    );


    await Promise.allSettled(
        [
            loadGlobalMarketData(),
            loadTerminalTickerData(),
            loadTopMovers(),
            loadFearGreed(),
            loadTerminalHeatmap()
        ]
    );


    await loadSelectedAsset(
        terminalMarketState
            .selectedAsset
    );


    renderOceanScoreBreakdown();

    renderLiquidityPressure();

    renderWhaleConfidence();

    renderOceanRiskPreview();

    updateTerminalCurrentTime();

}


/* =====================================================
   INITIALIZE TERMINAL
===================================================== */

async function initializeSnaoTerminal() {

    /*
     * Demonstration / preview modules.
     */

    renderDemoOceanFlow();

    renderWhalePreview();

    renderSmartMoneyPreview();

    preserveIntelligenceNewsStatus();


    /*
     * Initial experimental indicators can render
     * immediately and are recalculated after public
     * market data arrives.
     */

    renderOceanScoreBreakdown();

    renderLiquidityPressure();

    renderWhaleConfidence();

    renderOceanRiskPreview();


    /*
     * Load real external/public market data.
     */

    await Promise.allSettled(
        [
            loadGlobalMarketData(),
            loadTerminalTickerData(),
            loadTopMovers(),
            loadFearGreed(),
            loadTerminalHeatmap()
        ]
    );


    /*
     * Selected asset uses CoinGecko market data.
     */

    await loadSelectedAsset(
        terminalMarketState
            .selectedAsset
    );


    /*
     * Recalculate experimental indicators after the
     * external market inputs have loaded.
     */

    renderOceanScoreBreakdown();

    renderLiquidityPressure();

    renderWhaleConfidence();

    renderOceanRiskPreview();

    updateTerminalCurrentTime();

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
        initializeSnaoTerminal,
        {
            once: true
        }
    );

} else {

    initializeSnaoTerminal();

}


/* =====================================================
   BACKGROUND REFRESH
===================================================== */

setInterval(
    automaticTerminalMarketRefresh,
    TERMINAL_MARKET_REFRESH_INTERVAL
);


/* =====================================================
   END — SNAO OCEAN TERMINAL
===================================================== */

