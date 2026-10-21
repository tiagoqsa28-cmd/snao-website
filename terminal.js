/* =====================================================
   SNAO OCEAN TERMINAL
   terminal.js

   DATA POLICY
   -----------------------------------------------------
   - Market price data: CoinGecko public API
   - Global market data: CoinGecko public API
   - Top movers: CoinGecko public API
   - Ocean Score: Experimental SNAO indicator
   - Liquidity Pressure: Experimental SNAO indicator
   - Whale Confidence: Preview / experimental indicator
   - Narratives: Demonstration intelligence
   - Ocean Flow: Demonstration data
   - Whale Intelligence: Demonstration data
   - Sardine AI: Preview / interface concept

   Experimental or demonstration indicators must never
   be presented as verified on-chain intelligence.
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


function terminalFormatCompactNumber(
    value
) {

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


function terminalSetLoading(
    element
) {

    if (!element) {
        return;
    }

    element.textContent =
        "Loading...";
}


function terminalSetUnavailable(
    element
) {

    if (!element) {
        return;
    }

    element.textContent =
        "--";
}


/* =====================================================
   CURRENT TIME
===================================================== */

const terminalCurrentTime =
    document.getElementById(
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
    document.getElementById(
        "terminalMenuButton"
    );

const terminalSidebar =
    document.querySelector(
        ".terminal-sidebar"
    );

const terminalSidebarBackdrop =
    document.getElementById(
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

                        if (
                            !entry.isIntersecting
                        ) {
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
        "https://api.coingecko.com/api/v3/simple/price"

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

    btcDominance: null,

    totalMarketCap: null,

    marketChange24h: null,

    activeCryptocurrencies: null,

    selectedAsset:
        "BTC",

    lastSuccessfulUpdate:
        null

};


/* =====================================================
   LIVE GLOBAL MARKET ELEMENTS
===================================================== */

const liveBtcDominance =
    document.getElementById(
        "liveBtcDominance"
    );

const liveTotalMarketCap =
    document.getElementById(
        "liveTotalMarketCap"
    );

const liveMarketChange =
    document.getElementById(
        "liveMarketChange"
    );

const liveActiveCryptocurrencies =
    document.getElementById(
        "liveActiveCryptocurrencies"
    );

const liveOceanScore =
    document.getElementById(
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

                } else if (
                    marketChange < 0
                ) {

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
         * These indicators use real global
         * market inputs, but the resulting
         * scores remain experimental SNAO
         * analytical estimates.
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

   IMPORTANT:
   Only identity / CoinGecko mapping is stored here.

   Price, market cap, volume and 24h change are loaded
   from CoinGecko.

   Preview intelligence is generated separately and is
   explicitly treated as experimental / demonstration.
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
    document.getElementById(
        "terminalAssetSearch"
    );

const terminalAssetSearchButton =
    document.getElementById(
        "terminalAssetSearchButton"
    );

const terminalAssetButtons =
    document.querySelectorAll(
        "[data-terminal-asset]"
    );


const terminalAssetElements = {

    name:
        document.getElementById(
            "selectedAssetName"
        ),

    ticker:
        document.getElementById(
            "selectedAssetTicker"
        ),

    symbol:
        document.getElementById(
            "selectedAssetSymbol"
        ),

    price:
        document.getElementById(
            "selectedAssetPrice"
        ),

    change:
        document.getElementById(
            "selectedAssetChange"
        ),

    marketCap:
        document.getElementById(
            "selectedAssetMarketCap"
        ),

    volume:
        document.getElementById(
            "selectedAssetVolume"
        ),

    aiScore:
        document.getElementById(
            "selectedAssetAIScore"
        ),

    whales:
        document.getElementById(
            "selectedAssetWhales"
        ),

    risk:
        document.getElementById(
            "selectedAssetRisk"
        ),

    sentiment:
        document.getElementById(
            "selectedAssetSentiment"
        ),

    state:
        document.getElementById(
            "selectedAssetState"
        ),

    summary:
        document.getElementById(
            "selectedAssetSummary"
        )

};


/* =====================================================
   ASSET MARKET CACHE
===================================================== */

const terminalAssetMarketCache = {};


/* =====================================================
   ASSET PREVIEW INTELLIGENCE

   This is NOT verified whale/on-chain intelligence.

   It converts public price/volume movement into a
   simple experimental interface preview.
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


    let score =
        50;


    score +=
        terminalClamp(
            change * 3,
            -20,
            20
        );


    score +=
        terminalClamp(
            volumeRatio * 100,
            0,
            15
        );


    score =
        Math.round(
            terminalClamp(
                score,
                0,
                100
            )
        );


    let sentiment =
        "Neutral";

    let state =
        "Neutral";

    let risk =
        "Medium";


    if (change >= 5) {

        sentiment =
            "Positive";

        state =
            "Strong Momentum";

        risk =
            "Elevated";

    } else if (
        change >= 1
    ) {

        sentiment =
            "Positive";

        state =
            "Positive Momentum";

    } else if (
        change <= -5
    ) {

        sentiment =
            "Negative";

        state =
            "Strong Downside";

        risk =
            "Elevated";

    } else if (
        change <= -1
    ) {

        sentiment =
            "Negative";

        state =
            "Negative Momentum";

    }


    /*
     * We intentionally do NOT claim
     * verified whale activity here.
     */

    const whales =
        "Demo";


    const directionText =
        change > 1
            ? "positive"
            : change < -1
                ? "negative"
                : "mixed";


    const summary =
        `Experimental SNAO preview based on public market data. ` +
        `The asset currently shows ${directionText} 24-hour price momentum ` +
        `with a ${terminalFormatPercent(change)} change. ` +
        `Whale activity and on-chain behavior are not verified by this preview.`;


    return {
        score,
        whales,
        risk,
        sentiment,
        state,
        positive:
            change >= 0,
        summary
    };

}


/* =====================================================
   LOAD ASSET MARKET DATA
   REAL DATA — COINGECKO
===================================================== */

async function loadTerminalAssetMarketData() {

    const assets =
        Object.entries(
            terminalAssetDatabase
        );


    const ids =
        assets
            .map(
                ([, asset]) =>
                    asset.coinGeckoId
            )
            .join(",");


    const url =
        `${TERMINAL_API.markets}` +
        `?vs_currency=usd` +
        `&ids=${encodeURIComponent(ids)}` +
        `&order=market_cap_desc` +
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
                `Asset market request failed: ${response.status}`
            );

        }


        const coins =
            await response.json();


        if (
            !Array.isArray(coins)
        ) {

            throw new Error(
                "Invalid asset market response."
            );

        }


        coins.forEach(
            (coin) => {

                const tickerEntry =
                    assets.find(
                        ([, asset]) =>
                            asset.coinGeckoId ===
                            coin.id
                    );


                if (!tickerEntry) {
                    return;
                }


                const [
                    ticker
                ] =
                    tickerEntry;


                terminalAssetMarketCache[
                    ticker
                ] =
                    coin;

            }
        );


        renderSelectedTerminalAsset(
            terminalMarketState.selectedAsset
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: asset market data unavailable.",
            error
        );


        renderSelectedTerminalAsset(
            terminalMarketState.selectedAsset
        );


        return false;

    }

}


/* =====================================================
   RENDER SELECTED ASSET
===================================================== */

function renderSelectedTerminalAsset(
    ticker
) {

    const normalizedTicker =
        String(
            ticker || "BTC"
        )
            .trim()
            .toUpperCase();


    const asset =
        terminalAssetDatabase[
            normalizedTicker
        ];


    if (!asset) {
        return false;
    }


    terminalMarketState.selectedAsset =
        normalizedTicker;


    const marketData =
        terminalAssetMarketCache[
            normalizedTicker
        ];


    const preview =
        calculateAssetPreviewIntelligence(
            marketData
        );


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


    if (marketData) {

        terminalSetText(
            terminalAssetElements.price,
            terminalFormatCurrency(
                marketData.current_price
            )
        );


        terminalSetText(
            terminalAssetElements.change,
            terminalFormatPercent(
                marketData
                    .price_change_percentage_24h
            )
        );


        terminalSetText(
            terminalAssetElements.marketCap,
            terminalFormatCurrency(
                marketData.market_cap
            )
        );


        terminalSetText(
            terminalAssetElements.volume,
            terminalFormatCurrency(
                marketData.total_volume
            )
        );

    } else {

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

    }


    terminalSetText(
        terminalAssetElements.aiScore,
        preview.score === "--"
            ? "--"
            : `${preview.score}`
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


    if (
        terminalAssetElements.change
    ) {

        const change =
            marketData
                ? terminalSafeNumber(
                    marketData
                        .price_change_percentage_24h,
                    0
                )
                : 0;


        terminalAssetElements.change
            .classList.toggle(
                "terminal-analysis-positive",
                change >= 0
            );


        terminalAssetElements.change
            .classList.toggle(
                "terminal-analysis-negative",
                change < 0
            );

    }


    if (
        terminalAssetElements.state
    ) {

        terminalAssetElements.state
            .classList.toggle(
                "negative",
                !preview.positive
            );

    }


    terminalAssetButtons.forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset
                    .terminalAsset ===
                    normalizedTicker
            );

        }
    );


    if (terminalAssetSearch) {

        terminalAssetSearch.value =
            normalizedTicker;

    }


    return true;

}


/* =====================================================
   SELECT ASSET
===================================================== */

function selectTerminalAsset(
    ticker
) {

    const normalizedTicker =
        String(
            ticker || ""
        )
            .trim()
            .toUpperCase();


    if (
        !terminalAssetDatabase[
            normalizedTicker
        ]
    ) {

        if (terminalAssetSearch) {

            terminalAssetSearch.value =
                terminalMarketState
                    .selectedAsset;

        }


        if (
            terminalAssetElements.summary
        ) {

            terminalAssetElements
                .summary
                .textContent =
                "This preview currently supports BTC, ETH, SOL, BNB and XRP.";

        }


        return false;
    }


    renderSelectedTerminalAsset(
        normalizedTicker
    );


    return true;

}


/* =====================================================
   ASSET BUTTON EVENTS
===================================================== */

terminalAssetButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                selectTerminalAsset(
                    button.dataset
                        .terminalAsset
                );

            }
        );

    }
);


/* =====================================================
   ASSET SEARCH EVENTS
===================================================== */

if (
    terminalAssetSearchButton
) {

    terminalAssetSearchButton.addEventListener(
        "click",
        async () => {

            if (!terminalAssetSearch) {
                return;
            }


            terminalAssetSearchButton.disabled =
                true;

            terminalAssetSearchButton.textContent =
                "Analyzing...";


            selectTerminalAsset(
                terminalAssetSearch.value
            );


            await loadTerminalAssetMarketData();


            terminalAssetSearchButton.textContent =
                "Analysis Ready";


            setTimeout(
                () => {

                    terminalAssetSearchButton.textContent =
                        "Analyze";

                    terminalAssetSearchButton.disabled =
                        false;

                },
                900
            );

        }
    );

}


if (terminalAssetSearch) {

    terminalAssetSearch.addEventListener(
        "keydown",
        async (event) => {

            if (
                event.key !==
                "Enter"
            ) {
                return;
            }


            event.preventDefault();


            selectTerminalAsset(
                terminalAssetSearch.value
            );


            await loadTerminalAssetMarketData();

        }
    );

}


/* =====================================================
   END OF PART 01

   CONTINUE DIRECTLY WITH PART 02 BELOW THIS LINE.
   DO NOT CLOSE OR ADD ANYTHING AFTER THIS SECTION YET.
===================================================== */

/* =====================================================
   OCEAN SCORE
   EXPERIMENTAL SNAO INDICATOR

   The score may use selected public market inputs,
   but the methodology and resulting score are an
   experimental SNAO analytical model.

   It is NOT a verified trading signal.
===================================================== */

const oceanScoreElements = {

    score:
        document.getElementById(
            "oceanScoreValue"
        ),

    condition:
        document.getElementById(
            "oceanScoreCondition"
        ),

    confidence:
        document.getElementById(
            "oceanScoreConfidence"
        ),

    risk:
        document.getElementById(
            "oceanScoreRiskLevel"
        ),

    summary:
        document.getElementById(
            "oceanScoreSummary"
        ),

    ring:
        document.getElementById(
            "oceanScoreRing"
        ),

    refresh:
        document.getElementById(
            "oceanScoreRefresh"
        )

};


/* =====================================================
   OCEAN SCORE COMPONENTS
===================================================== */

const oceanScoreComponents = {

    momentum: {
        value:
            document.getElementById(
                "oceanScoreMomentumValue"
            ),
        bar:
            document.getElementById(
                "oceanScoreMomentumBar"
            )
    },

    liquidity: {
        value:
            document.getElementById(
                "oceanScoreLiquidityValue"
            ),
        bar:
            document.getElementById(
                "oceanScoreLiquidityBar"
            )
    },

    sentiment: {
        value:
            document.getElementById(
                "oceanScoreSentimentValue"
            ),
        bar:
            document.getElementById(
                "oceanScoreSentimentBar"
            )
    },

    stability: {
        value:
            document.getElementById(
                "oceanScoreStabilityValue"
            ),
        bar:
            document.getElementById(
                "oceanScoreStabilityBar"
            )
    }

};


/* =====================================================
   OCEAN SCORE CALCULATION
===================================================== */

function calculateOceanScore() {

    const marketChange =
        terminalMarketState
            .marketChange24h;


    const btcDominance =
        terminalMarketState
            .btcDominance;


    /*
     * Neutral values are used when live
     * global market data is unavailable.
     */

    let momentum =
        50;

    let liquidity =
        50;

    let sentiment =
        50;

    let stability =
        50;


    if (
        Number.isFinite(
            marketChange
        )
    ) {

        momentum =
            terminalClamp(
                50 +
                marketChange * 5
            );


        sentiment =
            terminalClamp(
                50 +
                marketChange * 4
            );


        stability =
            terminalClamp(
                70 -
                Math.abs(
                    marketChange
                ) * 4
            );

    }


    if (
        Number.isFinite(
            btcDominance
        )
    ) {

        /*
         * This is an experimental weighting.
         * BTC dominance is not equivalent to
         * liquidity by itself.
         */

        liquidity =
            terminalClamp(
                50 +
                (
                    btcDominance -
                    50
                ) * 0.8
            );

    }


    const score =
        Math.round(
            (
                momentum * 0.30 +
                liquidity * 0.25 +
                sentiment * 0.25 +
                stability * 0.20
            )
        );


    return {

        score:
            terminalClamp(
                score
            ),

        momentum:
            Math.round(
                momentum
            ),

        liquidity:
            Math.round(
                liquidity
            ),

        sentiment:
            Math.round(
                sentiment
            ),

        stability:
            Math.round(
                stability
            )

    };

}


/* =====================================================
   OCEAN SCORE CLASSIFICATION
===================================================== */

function getOceanScoreClassification(
    score
) {

    if (score >= 80) {

        return {
            condition:
                "Strong Positive",
            risk:
                "Medium",
            summary:
                "Experimental SNAO model currently shows strong positive market momentum. This is an analytical estimate, not a verified trading signal."
        };

    }


    if (score >= 65) {

        return {
            condition:
                "Moderately Positive",
            risk:
                "Medium",
            summary:
                "Experimental SNAO model currently indicates moderately positive market conditions. The score should be treated as research-oriented information only."
        };

    }


    if (score >= 45) {

        return {
            condition:
                "Neutral / Mixed",
            risk:
                "Medium",
            summary:
                "Experimental SNAO model currently shows mixed market conditions without a strong directional conclusion."
        };

    }


    if (score >= 30) {

        return {
            condition:
                "Moderately Negative",
            risk:
                "Elevated",
            summary:
                "Experimental SNAO model currently indicates weaker market conditions and elevated uncertainty."
        };

    }


    return {
        condition:
            "Strong Negative",
        risk:
            "High",
        summary:
            "Experimental SNAO model currently indicates significant downside pressure. This does not predict future market performance."
    };

}


/* =====================================================
   OCEAN SCORE COMPONENT RENDER
===================================================== */

function renderOceanScoreComponent(
    component,
    value
) {

    if (!component) {
        return;
    }


    if (component.value) {

        component.value.textContent =
            `${Math.round(value)}%`;

    }


    if (component.bar) {

        component.bar.style.setProperty(
            "--score-value",
            `${terminalClamp(value)}%`
        );


        component.bar.style.width =
            `${terminalClamp(value)}%`;

    }

}


/* =====================================================
   RENDER OCEAN SCORE
===================================================== */

function renderOceanScoreBreakdown() {

    const result =
        calculateOceanScore();


    const classification =
        getOceanScoreClassification(
            result.score
        );


    terminalSetText(
        oceanScoreElements.score,
        result.score
    );


    terminalSetText(
        liveOceanScore,
        result.score
    );


    terminalSetText(
        oceanScoreElements.condition,
        classification.condition
    );


    terminalSetText(
        oceanScoreElements.risk,
        classification.risk
    );


    terminalSetText(
        oceanScoreElements.summary,
        classification.summary
    );


    /*
     * Confidence here means model confidence
     * inside this experimental interface.
     * It is NOT probability of future return.
     */

    const confidence =
        Math.round(
            terminalClamp(
                55 +
                Math.abs(
                    result.score -
                    50
                ) * 0.55,
                55,
                82
            )
        );


    terminalSetText(
        oceanScoreElements.confidence,
        `${confidence}%`
    );


    if (
        oceanScoreElements.ring
    ) {

        oceanScoreElements.ring
            .style
            .setProperty(
                "--ocean-score",
                `${result.score}%`
            );

    }


    renderOceanScoreComponent(
        oceanScoreComponents.momentum,
        result.momentum
    );


    renderOceanScoreComponent(
        oceanScoreComponents.liquidity,
        result.liquidity
    );


    renderOceanScoreComponent(
        oceanScoreComponents.sentiment,
        result.sentiment
    );


    renderOceanScoreComponent(
        oceanScoreComponents.stability,
        result.stability
    );


    return result;

}


/* =====================================================
   OCEAN SCORE REFRESH
===================================================== */

if (
    oceanScoreElements.refresh
) {

    oceanScoreElements
        .refresh
        .addEventListener(
            "click",
            async () => {

                oceanScoreElements
                    .refresh
                    .disabled =
                    true;


                oceanScoreElements
                    .refresh
                    .textContent =
                    "↻ Recalculating...";


                await loadGlobalMarketData();


                renderOceanScoreBreakdown();


                setTimeout(
                    () => {

                        oceanScoreElements
                            .refresh
                            .textContent =
                            "↻ Recalculate Ocean Score";


                        oceanScoreElements
                            .refresh
                            .disabled =
                            false;

                    },
                    700
                );

            }
        );

}


/* =====================================================
   TRENDING NARRATIVES
   DEMONSTRATION INTELLIGENCE

   These values are illustrative.
   They are NOT a live narrative-ranking feed.
===================================================== */

const terminalNarrativeDatabase = {

    ai: {

        title:
            "Artificial Intelligence",

        score:
            95,

        state:
            "Demo Leader",

        summary:
            "Illustrative narrative preview showing how the SNAO Terminal may organize AI-related market attention. This score is demonstration data, not a verified live ranking."

    },


    rwa: {

        title:
            "Real World Assets",

        score:
            88,

        state:
            "Demo Strong",

        summary:
            "Illustrative preview of how tokenized real-world-asset narratives may be ranked inside the future intelligence layer."

    },


    defi: {

        title:
            "DeFi",

        score:
            82,

        state:
            "Demo Active",

        summary:
            "Demonstration intelligence showing a possible DeFi narrative ranking. It does not represent verified current market attention."

    },


    gaming: {

        title:
            "Gaming",

        score:
            74,

        state:
            "Demo Moderate",

        summary:
            "Illustrative gaming-market narrative used to demonstrate the planned attention-ranking interface."

    },


    memes: {

        title:
            "Memecoins",

        score:
            69,

        state:
            "Demo Speculative",

        summary:
            "Demonstration narrative showing how speculative market attention may eventually be organized by Sardine AI."

    }

};


/* =====================================================
   NARRATIVE ELEMENTS
===================================================== */

const terminalNarrativeItems =
    document.querySelectorAll(
        "[data-narrative]"
    );


const terminalNarrativeTitle =
    document.getElementById(
        "narrativeAnalysisTitle"
    );


const terminalNarrativeScore =
    document.getElementById(
        "narrativeAnalysisScore"
    );


const terminalNarrativeState =
    document.getElementById(
        "narrativeAnalysisState"
    );


const terminalNarrativeSummary =
    document.getElementById(
        "narrativeAnalysisText"
    );


/* =====================================================
   RENDER NARRATIVE
===================================================== */

function renderTerminalNarrative(
    key
) {

    const narrative =
        terminalNarrativeDatabase[
            key
        ];


    if (!narrative) {
        return;
    }


    terminalNarrativeItems.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset.narrative ===
                    key
            );

        }
    );


    terminalSetText(
        terminalNarrativeTitle,
        narrative.title
    );


    terminalSetText(
        terminalNarrativeScore,
        `${narrative.score}%`
    );


    terminalSetText(
        terminalNarrativeState,
        narrative.state
    );


    terminalSetText(
        terminalNarrativeSummary,
        narrative.summary
    );

}


/* =====================================================
   NARRATIVE EVENTS
===================================================== */

terminalNarrativeItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                renderTerminalNarrative(
                    item.dataset
                        .narrative
                );

            }
        );

    }
);


/* =====================================================
   OCEAN FLOW
   DEMONSTRATION DATA

   IMPORTANT:
   This section does NOT claim verified exchange
   transfers or institutional wallet movements.
===================================================== */

const terminalFlowDatabase = [

    {
        exchange:
            "Binance",
        flow:
            184,
        direction:
            "inflow"
    },

    {
        exchange:
            "Coinbase",
        flow:
            96,
        direction:
            "inflow"
    },

    {
        exchange:
            "OKX",
        flow:
            -42,
        direction:
            "outflow"
    },

    {
        exchange:
            "Bybit",
        flow:
            71,
        direction:
            "inflow"
    },

    {
        exchange:
            "Kraken",
        flow:
            24,
        direction:
            "inflow"
    }

];


/* =====================================================
   OCEAN FLOW ELEMENTS
===================================================== */

const oceanFlowElements = {

    totalInflow:
        document.getElementById(
            "flowTotalInflow"
        ),

    totalOutflow:
        document.getElementById(
            "flowTotalOutflow"
        ),

    netFlow:
        document.getElementById(
            "flowNetFlow"
        ),

    status:
        document.getElementById(
            "flowCoreStatus"
        ),

    title:
        document.getElementById(
            "flowAnalysisTitle"
        ),

    text:
        document.getElementById(
            "flowAnalysisText"
        ),

    confidence:
        document.getElementById(
            "flowConfidence"
        ),

    risk:
        document.getElementById(
            "flowRisk"
        ),

    signal:
        document.getElementById(
            "flowSignal"
        ),

    refresh:
        document.querySelector(
            ".flow-analysis-button"
        )

};


/* =====================================================
   FLOW CALCULATION
===================================================== */

function calculateDemoOceanFlow() {

    const inflows =
        terminalFlowDatabase
            .filter(
                (item) =>
                    item.flow > 0
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    item.flow,
                0
            );


    const outflows =
        terminalFlowDatabase
            .filter(
                (item) =>
                    item.flow < 0
            )
            .reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Math.abs(
                        item.flow
                    ),
                0
            );


    const net =
        inflows -
        outflows;


    return {
        inflows,
        outflows,
        net
    };

}


/* =====================================================
   RENDER OCEAN FLOW
===================================================== */

function renderDemoOceanFlow() {

    const result =
        calculateDemoOceanFlow();


    terminalSetText(
        oceanFlowElements.totalInflow,
        `+$${result.inflows}M`
    );


    terminalSetText(
        oceanFlowElements.totalOutflow,
        `-$${result.outflows}M`
    );


    terminalSetText(
        oceanFlowElements.netFlow,
        `${result.net >= 0 ? "+" : "-"}$${Math.abs(result.net)}M`
    );


    terminalSetText(
        oceanFlowElements.status,
        "Simulation"
    );


    terminalSetText(
        oceanFlowElements.title,
        "Illustrative exchange-flow scenario."
    );


    terminalSetText(
        oceanFlowElements.text,
        "This demonstration uses predefined exchange-flow values to preview the planned Ocean Flow interface. It does not represent verified transfers, exchange reserves or institutional activity."
    );


    terminalSetText(
        oceanFlowElements.confidence,
        "Demo"
    );


    terminalSetText(
        oceanFlowElements.risk,
        "Preview"
    );


    terminalSetText(
        oceanFlowElements.signal,
        "Simulation"
    );

}


/* =====================================================
   REFRESH OCEAN FLOW DEMO
===================================================== */

if (
    oceanFlowElements.refresh
) {

    oceanFlowElements
        .refresh
        .addEventListener(
            "click",
            () => {

                oceanFlowElements
                    .refresh
                    .disabled =
                    true;


                oceanFlowElements
                    .refresh
                    .textContent =
                    "Refreshing Demo...";


                renderDemoOceanFlow();


                setTimeout(
                    () => {

                        oceanFlowElements
                            .refresh
                            .textContent =
                            "Refresh Demo Analysis";


                        oceanFlowElements
                            .refresh
                            .disabled =
                            false;

                    },
                    650
                );

            }
        );

}


/* =====================================================
   WHALE INTELLIGENCE
   DEMONSTRATION DATA

   The table in terminal.html is a visual preview.
   No address shown in the preview should be treated
   as a verified tracked wallet.
===================================================== */

const whaleIntelligenceElements = {

    summaryTitle:
        document.getElementById(
            "whaleTableSummaryTitle"
        ),

    summaryText:
        document.getElementById(
            "whaleTableSummaryText"
        ),

    refresh:
        document.querySelector(
            ".whale-table-refresh"
        )

};


/* =====================================================
   WHALE PREVIEW STATES
===================================================== */

const whalePreviewStates = [

    {
        title:
            "Demonstration scenario: net accumulation.",

        text:
            "Illustrative wallet activity is being used to demonstrate the planned Whale Intelligence interface. These values are not verified live wallet transactions."
    },

    {
        title:
            "Demonstration scenario: mixed whale activity.",

        text:
            "This preview illustrates how accumulation and distribution signals may eventually appear after verified on-chain integrations are connected."
    },

    {
        title:
            "Demonstration scenario: elevated transfer activity.",

        text:
            "The current table is interface demonstration data only. SNAO does not currently claim verified institutional or whale-wallet tracking from this section."
    }

];


let whalePreviewIndex =
    0;


/* =====================================================
   RENDER WHALE PREVIEW
===================================================== */

function renderWhalePreview() {

    const preview =
        whalePreviewStates[
            whalePreviewIndex
        ];


    terminalSetText(
        whaleIntelligenceElements
            .summaryTitle,
        preview.title
    );


    terminalSetText(
        whaleIntelligenceElements
            .summaryText,
        preview.text
    );

}


/* =====================================================
   WHALE PREVIEW REFRESH
===================================================== */

if (
    whaleIntelligenceElements.refresh
) {

    whaleIntelligenceElements
        .refresh
        .addEventListener(
            "click",
            () => {

                whaleIntelligenceElements
                    .refresh
                    .disabled =
                    true;


                whaleIntelligenceElements
                    .refresh
                    .textContent =
                    "Refreshing Demo...";


                whalePreviewIndex =
                    (
                        whalePreviewIndex +
                        1
                    ) %
                    whalePreviewStates.length;


                renderWhalePreview();


                setTimeout(
                    () => {

                        whaleIntelligenceElements
                            .refresh
                            .textContent =
                            "Refresh Demo";


                        whaleIntelligenceElements
                            .refresh
                            .disabled =
                            false;

                    },
                    650
                );

            }
        );

}


/* =====================================================
   TOP MOVERS
   REAL MARKET DATA — COINGECKO
===================================================== */

const topGainersContainer =
    document.getElementById(
        "topGainers"
    );


const topLosersContainer =
    document.getElementById(
        "topLosers"
    );


const topMoversRefreshButton =
    document.getElementById(
        "topMoversRefresh"
    );


/* =====================================================
   CREATE TOP MOVER CARD
===================================================== */

function createTopMoverCard(
    coin,
    type
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        `top-mover-item ${type}`;


    const change =
        terminalSafeNumber(
            coin
                .price_change_percentage_24h,
            0
        );


    const symbol =
        String(
            coin.symbol || ""
        ).toUpperCase();


    const name =
        String(
            coin.name || symbol
        );


    const image =
        coin.image
            ? `<img src="${coin.image}" alt="" loading="lazy">`
            : "";


    article.innerHTML = `
        <div class="top-mover-asset">
            ${image}
            <div>
                <strong>${name}</strong>
                <span>${symbol}</span>
            </div>
        </div>

        <div class="top-mover-price">
            <strong>
                ${terminalFormatCurrency(
                    coin.current_price
                )}
            </strong>

            <span class="${
                change >= 0
                    ? "positive"
                    : "negative"
            }">
                ${terminalFormatPercent(
                    change
                )}
            </span>
        </div>
    `;


    return article;

}


/* =====================================================
   RENDER TOP MOVERS
===================================================== */

function renderTopMovers(
    coins
) {

    if (
        !Array.isArray(coins) ||
        !coins.length
    ) {
        return;
    }


    const validCoins =
        coins.filter(
            (coin) =>
                Number.isFinite(
                    Number(
                        coin
                            .price_change_percentage_24h
                    )
                )
        );


    const gainers =
        [...validCoins]
            .sort(
                (a, b) =>
                    Number(
                        b
                            .price_change_percentage_24h
                    ) -
                    Number(
                        a
                            .price_change_percentage_24h
                    )
            )
            .slice(
                0,
                5
            );


    const losers =
        [...validCoins]
            .sort(
                (a, b) =>
                    Number(
                        a
                            .price_change_percentage_24h
                    ) -
                    Number(
                        b
                            .price_change_percentage_24h
                    )
            )
            .slice(
                0,
                5
            );


    if (topGainersContainer) {

        topGainersContainer.innerHTML =
            "";


        gainers.forEach(
            (coin) => {

                topGainersContainer
                    .appendChild(
                        createTopMoverCard(
                            coin,
                            "gainer"
                        )
                    );

            }
        );

    }


    if (topLosersContainer) {

        topLosersContainer.innerHTML =
            "";


        losers.forEach(
            (coin) => {

                topLosersContainer
                    .appendChild(
                        createTopMoverCard(
                            coin,
                            "loser"
                        )
                    );

            }
        );

    }

}


/* =====================================================
   LOAD TOP MOVERS
===================================================== */

async function loadTopMovers() {

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


        const coins =
            await response.json();


        if (
            !Array.isArray(coins)
        ) {

            throw new Error(
                "Invalid top movers response."
            );

        }


        renderTopMovers(
            coins
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: top movers unavailable.",
            error
        );


        if (topGainersContainer) {

            topGainersContainer.innerHTML =
                `<p class="terminal-data-error">
                    Live market data temporarily unavailable.
                </p>`;

        }


        if (topLosersContainer) {

            topLosersContainer.innerHTML =
                `<p class="terminal-data-error">
                    Live market data temporarily unavailable.
                </p>`;

        }


        return false;

    }

}


/* =====================================================
   TOP MOVERS REFRESH
===================================================== */

if (
    topMoversRefreshButton
) {

    topMoversRefreshButton.addEventListener(
        "click",
        async () => {

            topMoversRefreshButton.disabled =
                true;


            topMoversRefreshButton.textContent =
                "Refreshing...";


            await loadTopMovers();


            topMoversRefreshButton.textContent =
                "Updated";


            setTimeout(
                () => {

                    topMoversRefreshButton.textContent =
                        "Refresh";

                    topMoversRefreshButton.disabled =
                        false;

                },
                800
            );

        }
    );

}


/* =====================================================
   END OF PART 02

   CONTINUE DIRECTLY WITH PART 03 BELOW THIS LINE.
   DO NOT CLOSE THE FILE YET.
===================================================== */

/* =====================================================
   FEAR & GREED
   EXTERNAL MARKET DATA + SNAO PREVIEW

   The index value may come from Alternative.me.
   Additional SNAO interpretations remain experimental.
===================================================== */

const fearGreedElements = {

    value:
        document.getElementById(
            "fearGreedValue"
        ),

    state:
        document.getElementById(
            "fearGreedState"
        ),

    gauge:
        document.getElementById(
            "fearGreedGauge"
        ),

    needle:
        document.getElementById(
            "fearGreedNeedle"
        ),

    title:
        document.getElementById(
            "fearGreedTitle"
        ),

    text:
        document.getElementById(
            "fearGreedText"
        ),

    retail:
        document.getElementById(
            "fearGreedRetail"
        ),

    institutional:
        document.getElementById(
            "fearGreedInstitutional"
        ),

    volatility:
        document.getElementById(
            "fearGreedVolatility"
        ),

    regime:
        document.getElementById(
            "fearGreedRegime"
        ),

    refresh:
        document.getElementById(
            "fearGreedLiveRefresh"
        ),

    metric:
        document.getElementById(
            "terminalFearGreedMetric"
        ),

    metricProgress:
        document.getElementById(
            "terminalFearGreedMetricProgress"
        )

};


/* =====================================================
   FEAR & GREED STATE
===================================================== */

let terminalFearGreedState = {

    value: null,

    classification: null,

    lastUpdated: null

};


/* =====================================================
   FEAR & GREED CLASSIFICATION
===================================================== */

function getFearGreedClassification(
    value
) {

    const score =
        terminalClamp(
            value
        );


    if (score <= 24) {

        return {
            label:
                "Extreme Fear",

            title:
                "Extreme Fear",

            retail:
                "Very Defensive",

            volatility:
                "Elevated",

            regime:
                "Risk-Off",

            text:
                "The external sentiment index currently indicates Extreme Fear. SNAO interpretations shown alongside the index are experimental and do not predict a market reversal."
        };

    }


    if (score <= 44) {

        return {
            label:
                "Fear",

            title:
                "Fear",

            retail:
                "Defensive",

            volatility:
                "Elevated",

            regime:
                "Cautious",

            text:
                "The external sentiment index currently indicates Fear. This reflects market psychology and should not be interpreted as a buy or sell signal."
        };

    }


    if (score <= 55) {

        return {
            label:
                "Neutral",

            title:
                "Neutral Sentiment",

            retail:
                "Balanced",

            volatility:
                "Moderate",

            regime:
                "Mixed",

            text:
                "The external sentiment index currently indicates broadly neutral market psychology."
        };

    }


    if (score <= 74) {

        return {
            label:
                "Greed",

            title:
                "Greed",

            retail:
                "Optimistic",

            volatility:
                "Moderate",

            regime:
                "Risk-On",

            text:
                "The external sentiment index currently indicates Greed. Stronger optimism can coexist with elevated market risk."
        };

    }


    return {
        label:
            "Extreme Greed",

        title:
            "Extreme Greed",

        retail:
            "Highly Optimistic",

        volatility:
            "Elevated",

        regime:
            "Risk-On",

        text:
            "The external sentiment index currently indicates Extreme Greed. This does not guarantee continued price appreciation and may coincide with increased market risk."
    };

}


/* =====================================================
   RENDER FEAR & GREED
===================================================== */

function renderFearGreed(
    value
) {

    const score =
        Math.round(
            terminalClamp(
                value
            )
        );


    const classification =
        getFearGreedClassification(
            score
        );


    terminalFearGreedState.value =
        score;


    terminalFearGreedState.classification =
        classification.label;


    terminalFearGreedState.lastUpdated =
        Date.now();


    terminalSetText(
        fearGreedElements.value,
        score
    );


    terminalSetText(
        fearGreedElements.state,
        classification.label
    );


    terminalSetText(
        fearGreedElements.title,
        classification.title
    );


    terminalSetText(
        fearGreedElements.text,
        classification.text
    );


    terminalSetText(
        fearGreedElements.retail,
        classification.retail
    );


    /*
     * We do not have a verified institutional
     * sentiment data source connected here.
     */

    terminalSetText(
        fearGreedElements.institutional,
        "Preview"
    );


    terminalSetText(
        fearGreedElements.volatility,
        classification.volatility
    );


    terminalSetText(
        fearGreedElements.regime,
        classification.regime
    );


    terminalSetText(
        fearGreedElements.metric,
        score
    );


    if (
        fearGreedElements.metricProgress
    ) {

        fearGreedElements
            .metricProgress
            .style
            .setProperty(
                "--value",
                `${score}%`
            );

        fearGreedElements
            .metricProgress
            .style
            .width =
            `${score}%`;

    }


    if (
        fearGreedElements.gauge
    ) {

        fearGreedElements
            .gauge
            .style
            .setProperty(
                "--fear-greed-position",
                `${score}%`
            );

    }


    if (
        fearGreedElements.needle
    ) {

        const angle =
            -90 +
            (
                score / 100
            ) * 180;


        fearGreedElements
            .needle
            .style
            .transform =
            `rotate(${angle}deg)`;

    }

}


/* =====================================================
   LOAD FEAR & GREED
   EXTERNAL DATA — ALTERNATIVE.ME
===================================================== */

async function loadFearGreed() {

    try {

        const response =
            await fetch(
                "https://api.alternative.me/fng/?limit=1&format=json",
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Fear & Greed request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        const value =
            Number(
                result
                    ?.data
                    ?.[0]
                    ?.value
            );


        if (
            !Number.isFinite(
                value
            )
        ) {

            throw new Error(
                "Invalid Fear & Greed response."
            );

        }


        renderFearGreed(
            value
        );


        return true;

    } catch (error) {

        console.warn(
            "SNAO Terminal: Fear & Greed data unavailable.",
            error
        );


        terminalFearGreedState.value =
            null;


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
            "Market sentiment unavailable"
        );


        terminalSetText(
            fearGreedElements.text,
            "The external Fear & Greed data source is temporarily unavailable."
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


        terminalSetText(
            fearGreedElements.metric,
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

    fearGreedElements
        .refresh
        .addEventListener(
            "click",
            async () => {

                fearGreedElements
                    .refresh
                    .disabled =
                    true;


                fearGreedElements
                    .refresh
                    .textContent =
                    "↻ Refreshing...";


                await loadFearGreed();


                fearGreedElements
                    .refresh
                    .textContent =
                    "Updated";


                setTimeout(
                    () => {

                        fearGreedElements
                            .refresh
                            .textContent =
                            "↻ Refresh Index";


                        fearGreedElements
                            .refresh
                            .disabled =
                            false;

                    },
                    800
                );

            }
        );

}


/* =====================================================
   SMART MONEY RADAR
   EXPERIMENTAL / DEMONSTRATION

   No verified institutional wallet feed is connected.
===================================================== */

const smartMoneyElements = {

    score:
        document.getElementById(
            "smartMoneyScore"
        ),

    ring:
        document.getElementById(
            "smartMoneyRing"
        ),

    accumulation:
        document.getElementById(
            "smartAccumulationSignal"
        ),

    exchangeFlow:
        document.getElementById(
            "smartExchangeFlowSignal"
        ),

    stablecoin:
        document.getElementById(
            "smartStablecoinSignal"
        ),

    bias:
        document.getElementById(
            "smartBiasSignal"
        ),

    title:
        document.getElementById(
            "smartMoneyTitle"
        ),

    text:
        document.getElementById(
            "smartMoneyText"
        ),

    refresh:
        document.querySelector(
            "#smart-money button"
        )

};


/* =====================================================
   SMART MONEY DEMO STATES
===================================================== */

const smartMoneyPreviewStates = [

    {
        score:
            72,

        accumulation:
            "Demo Positive",

        exchangeFlow:
            "Demo Mixed",

        stablecoin:
            "Demo Stable",

        bias:
            "Preview Positive",

        title:
            "Smart Money preview scenario.",

        text:
            "This demonstration illustrates how future verified on-chain and liquidity inputs could be combined into a Smart Money score. No institutional activity is being claimed."
    },

    {
        score:
            58,

        accumulation:
            "Demo Neutral",

        exchangeFlow:
            "Demo Balanced",

        stablecoin:
            "Demo Stable",

        bias:
            "Preview Neutral",

        title:
            "Mixed Smart Money preview.",

        text:
            "This scenario demonstrates a balanced analytical state. Values are illustrative and are not derived from verified institutional wallets."
    },

    {
        score:
            43,

        accumulation:
            "Demo Weak",

        exchangeFlow:
            "Demo Outflow",

        stablecoin:
            "Demo Mixed",

        bias:
            "Preview Cautious",

        title:
            "Cautious Smart Money preview.",

        text:
            "This demonstration shows how a weaker future Smart Money reading could appear. It is not a live institutional-flow signal."
    }

];


let smartMoneyPreviewIndex =
    0;


/* =====================================================
   RENDER SMART MONEY
===================================================== */

function renderSmartMoneyPreview() {

    const preview =
        smartMoneyPreviewStates[
            smartMoneyPreviewIndex
        ];


    terminalSetText(
        smartMoneyElements.score,
        preview.score
    );


    terminalSetText(
        smartMoneyElements.accumulation,
        preview.accumulation
    );


    terminalSetText(
        smartMoneyElements.exchangeFlow,
        preview.exchangeFlow
    );


    terminalSetText(
        smartMoneyElements.stablecoin,
        preview.stablecoin
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
        smartMoneyElements.ring
    ) {

        smartMoneyElements
            .ring
            .style
            .setProperty(
                "--smart-money-score",
                `${preview.score}%`
            );

    }

}


/* =====================================================
   SMART MONEY REFRESH
===================================================== */

if (
    smartMoneyElements.refresh
) {

    smartMoneyElements
        .refresh
        .addEventListener(
            "click",
            () => {

                smartMoneyElements
                    .refresh
                    .disabled =
                    true;


                smartMoneyElements
                    .refresh
                    .textContent =
                    "Refreshing Preview...";


                smartMoneyPreviewIndex =
                    (
                        smartMoneyPreviewIndex +
                        1
                    ) %
                    smartMoneyPreviewStates.length;


                renderSmartMoneyPreview();


                setTimeout(
                    () => {

                        smartMoneyElements
                            .refresh
                            .textContent =
                            "Refresh Preview";


                        smartMoneyElements
                            .refresh
                            .disabled =
                            false;

                    },
                    650
                );

            }
        );

}


/* =====================================================
   LIQUIDITY PRESSURE INDEX
   EXPERIMENTAL SNAO INDICATOR

   This indicator uses selected public market inputs.
   It is NOT direct proof of capital inflow/outflow.
===================================================== */

const liquidityPressureElements = {

    value:
        document.getElementById(
            "liquidityPressureValue"
        ),

    ring:
        document.getElementById(
            "liquidityPressureRing"
        ),

    state:
        document.getElementById(
            "liquidityPressureState"
        ),

    marketCap:
        document.getElementById(
            "liquidityPressureMarketCap"
        ),

    marketChange:
        document.getElementById(
            "liquidityPressureMarketChange"
        ),

    btcDominance:
        document.getElementById(
            "liquidityPressureBtcDominance"
        ),

    title:
        document.getElementById(
            "liquidityPressureTitle"
        ),

    text:
        document.getElementById(
            "liquidityPressureText"
        ),

    refresh:
        document.querySelector(
            "#liquidity-pressure button"
        )

};


/* =====================================================
   CALCULATE LIQUIDITY PRESSURE
===================================================== */

function calculateLiquidityPressure() {

    const marketChange =
        terminalMarketState
            .marketChange24h;


    const btcDominance =
        terminalMarketState
            .btcDominance;


    let score =
        50;


    if (
        Number.isFinite(
            marketChange
        )
    ) {

        score +=
            terminalClamp(
                marketChange * 4,
                -20,
                20
            );

    }


    if (
        Number.isFinite(
            btcDominance
        )
    ) {

        score +=
            terminalClamp(
                (
                    btcDominance -
                    50
                ) * 0.35,
                -8,
                8
            );

    }


    return Math.round(
        terminalClamp(
            score,
            15,
            85
        )
    );

}


/* =====================================================
   LIQUIDITY PRESSURE CLASSIFICATION
===================================================== */

function getLiquidityPressureState(
    score
) {

    if (score >= 70) {

        return {
            state:
                "High Experimental Reading",

            title:
                "Higher modeled liquidity pressure.",

            text:
                "The experimental model currently produces a higher liquidity-pressure reading from selected public market inputs. It does not confirm actual stablecoin inflows or institutional capital deployment."
        };

    }


    if (score >= 55) {

        return {
            state:
                "Moderate Positive",

            title:
                "Moderately positive modeled pressure.",

            text:
                "The experimental SNAO model currently indicates moderately positive liquidity conditions based on limited public market inputs."
        };

    }


    if (score >= 40) {

        return {
            state:
                "Neutral",

            title:
                "Balanced modeled liquidity pressure.",

            text:
                "The current experimental reading is broadly neutral and should not be interpreted as verified capital-flow data."
        };

    }


    return {
        state:
            "Moderate Negative",

        title:
            "Weaker modeled liquidity pressure.",

        text:
            "The experimental model currently produces a weaker liquidity reading. This does not verify exchange outflows, stablecoin contraction or future price direction."
    };

}


/* =====================================================
   RENDER LIQUIDITY PRESSURE
===================================================== */

function renderLiquidityPressure() {

    const score =
        calculateLiquidityPressure();


    const classification =
        getLiquidityPressureState(
            score
        );


    terminalSetText(
        liquidityPressureElements.value,
        score
    );


    terminalSetText(
        liquidityPressureElements.state,
        classification.state
    );


    terminalSetText(
        liquidityPressureElements.title,
        classification.title
    );


    terminalSetText(
        liquidityPressureElements.text,
        classification.text
    );


    terminalSetText(
        liquidityPressureElements.marketCap,
        Number.isFinite(
            terminalMarketState
                .totalMarketCap
        )
            ? terminalFormatCurrency(
                terminalMarketState
                    .totalMarketCap
            )
            : "--"
    );


    terminalSetText(
        liquidityPressureElements.marketChange,
        Number.isFinite(
            terminalMarketState
                .marketChange24h
        )
            ? terminalFormatPercent(
                terminalMarketState
                    .marketChange24h
            )
            : "--"
    );


    terminalSetText(
        liquidityPressureElements.btcDominance,
        Number.isFinite(
            terminalMarketState
                .btcDominance
        )
            ? `${terminalMarketState.btcDominance.toFixed(2)}%`
            : "--"
    );


    if (
        liquidityPressureElements.ring
    ) {

        liquidityPressureElements
            .ring
            .style
            .setProperty(
                "--liquidity-pressure-value",
                `${score}%`
            );

    }


    return score;

}


/* =====================================================
   LIQUIDITY PRESSURE REFRESH
===================================================== */

if (
    liquidityPressureElements.refresh
) {

    liquidityPressureElements
        .refresh
        .addEventListener(
            "click",
            async () => {

                liquidityPressureElements
                    .refresh
                    .disabled =
                    true;


                liquidityPressureElements
                    .refresh
                    .textContent =
                    "Recalculating...";


                await loadGlobalMarketData();


                renderLiquidityPressure();


                setTimeout(
                    () => {

                        liquidityPressureElements
                            .refresh
                            .textContent =
                            "Recalculate Index";


                        liquidityPressureElements
                            .refresh
                            .disabled =
                            false;

                    },
                    700
                );

            }
        );

}


/* =====================================================
   WHALE CONFIDENCE INDEX
   EXPERIMENTAL / PREVIEW

   No verified whale-wallet feed is connected.
===================================================== */

const whaleConfidenceElements = {

    value:
        document.getElementById(
            "whaleConfidenceValue"
        ),

    ring:
        document.getElementById(
            "whaleConfidenceRing"
        ),

    state:
        document.getElementById(
            "whaleConfidenceState"
        ),

    accumulation:
        document.getElementById(
            "whaleConfidenceAccumulation"
        ),

    distribution:
        document.getElementById(
            "whaleConfidenceDistribution"
        ),

    activity:
        document.getElementById(
            "whaleConfidenceActivity"
        ),

    title:
        document.getElementById(
            "whaleConfidenceTitle"
        ),

    text:
        document.getElementById(
            "whaleConfidenceText"
        ),

    refresh:
        document.querySelector(
            "#whale-confidence-index button"
        )

};


/* =====================================================
   WHALE CONFIDENCE PREVIEW
===================================================== */

function calculateWhaleConfidencePreview() {

    /*
     * Because verified whale data is not connected,
     * this score is intentionally bounded and should
     * only be treated as a UI / model preview.
     */

    const marketChange =
        terminalMarketState
            .marketChange24h;


    let score =
        55;


    if (
        Number.isFinite(
            marketChange
        )
    ) {

        score +=
            terminalClamp(
                marketChange * 2,
                -10,
                10
            );

    }


    return Math.round(
        terminalClamp(
            score,
            35,
            70
        )
    );

}


/* =====================================================
   RENDER WHALE CONFIDENCE
===================================================== */

function renderWhaleConfidence() {

    const score =
        calculateWhaleConfidencePreview();


    let state =
        "Neutral Preview";


    if (score >= 62) {

        state =
            "Positive Preview";

    } else if (
        score <= 45
    ) {

        state =
            "Cautious Preview";

    }


    terminalSetText(
        whaleConfidenceElements.value,
        score
    );


    terminalSetText(
        whaleConfidenceElements.state,
        state
    );


    terminalSetText(
        whaleConfidenceElements.accumulation,
        "Demo"
    );


    terminalSetText(
        whaleConfidenceElements.distribution,
        "Demo"
    );


    terminalSetText(
        whaleConfidenceElements.activity,
        "Not Verified"
    );


    terminalSetText(
        whaleConfidenceElements.title,
        "Whale Confidence preview."
    );


    terminalSetText(
        whaleConfidenceElements.text,
        "This experimental preview does not use a verified live whale-wallet feed. Future on-chain integrations are intended to replace demonstration inputs."
    );


    if (
        whaleConfidenceElements.ring
    ) {

        whaleConfidenceElements
            .ring
            .style
            .setProperty(
                "--whale-confidence",
                `${score}%`
            );

    }


    return score;

}


/* =====================================================
   WHALE CONFIDENCE REFRESH
===================================================== */

if (
    whaleConfidenceElements.refresh
) {

    whaleConfidenceElements
        .refresh
        .addEventListener(
            "click",
            async () => {

                whaleConfidenceElements
                    .refresh
                    .disabled =
                    true;


                whaleConfidenceElements
                    .refresh
                    .textContent =
                    "Refreshing Preview...";


                await loadGlobalMarketData();


                renderWhaleConfidence();


                setTimeout(
                    () => {

                        whaleConfidenceElements
                            .refresh
                            .textContent =
                            "Refresh Preview";


                        whaleConfidenceElements
                            .refresh
                            .disabled =
                            false;

                    },
                    700
                );

            }
        );

}


/* =====================================================
   SARDINE AI
   PRODUCT PREVIEW

   The current interface does not claim a live
   autonomous investment-advice system.
===================================================== */

const sardineAiText =
    document.getElementById(
        "terminalAiText"
    );


const sardineAiButtons =
    document.querySelectorAll(
        "[data-ai-message]"
    );


const sardineAiPreviewMessages = {

    market:
        "Sardine AI is being designed to combine public market data, liquidity conditions, sentiment and future SNAO indicators into concise analytical summaries. Current outputs are product previews.",

    whales:
        "Future Sardine AI whale analysis is intended to use verified on-chain integrations. The current Terminal does not claim live institutional or whale-wallet intelligence.",

    risk:
        "The future risk layer is designed to combine volatility, liquidity, market structure and additional verified inputs. Current risk outputs remain experimental and are not investment recommendations."

};


/* =====================================================
   SARDINE AI BUTTONS
===================================================== */

sardineAiButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const key =
                    button.dataset
                        .aiMessage;


                const message =
                    sardineAiPreviewMessages[
                        key
                    ];


                if (
                    !message ||
                    !sardineAiText
                ) {
                    return;
                }


                sardineAiButtons.forEach(
                    (item) => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                sardineAiText.textContent =
                    "Analyzing preview...";


                setTimeout(
                    () => {

                        sardineAiText.textContent =
                            message;

                    },
                    350
                );

            }
        );

    }
);


/* =====================================================
   END OF PART 03

   CONTINUE DIRECTLY WITH PART 04 BELOW THIS LINE.
   PART 04 WILL INITIALIZE THE TERMINAL AND CLOSE THE FILE.
===================================================== */

/* =====================================================
   MARKET TICKER
   REAL MARKET DATA — COINGECKO
===================================================== */

const terminalTickerElements = {

    btcPrice:
        document.getElementById(
            "terminalBtcPrice"
        ),

    btcChange:
        document.getElementById(
            "terminalBtcChange"
        ),

    ethPrice:
        document.getElementById(
            "terminalEthPrice"
        ),

    ethChange:
        document.getElementById(
            "terminalEthChange"
        ),

    bnbPrice:
        document.getElementById(
            "terminalBnbPrice"
        ),

    bnbChange:
        document.getElementById(
            "terminalBnbChange"
        ),

    totalMarketCap:
        document.getElementById(
            "terminalTotalMarketCap"
        ),

    totalMarketChange:
        document.getElementById(
            "terminalTotalMarketChange"
        )

};


/* =====================================================
   TICKER STYLE HELPER
===================================================== */

function updateTickerChangeElement(
    element,
    value
) {

    if (!element) {
        return;
    }


    if (
        !Number.isFinite(
            Number(value)
        )
    ) {

        element.textContent =
            "--";

        element.classList.remove(
            "positive",
            "negative"
        );

        return;

    }


    const number =
        Number(value);


    element.textContent =
        terminalFormatPercent(
            number
        );


    element.classList.toggle(
        "positive",
        number >= 0
    );


    element.classList.toggle(
        "negative",
        number < 0
    );

}


/* =====================================================
   RENDER MARKET TICKER
===================================================== */

function renderMarketTicker() {

    const btc =
        terminalAssetMarketCache.BTC;

    const eth =
        terminalAssetMarketCache.ETH;

    const bnb =
        terminalAssetMarketCache.BNB;


    if (btc) {

        terminalSetText(
            terminalTickerElements.btcPrice,
            terminalFormatCurrency(
                btc.current_price
            )
        );


        updateTickerChangeElement(
            terminalTickerElements.btcChange,
            btc.price_change_percentage_24h
        );

    } else {

        terminalSetUnavailable(
            terminalTickerElements.btcPrice
        );

        terminalSetUnavailable(
            terminalTickerElements.btcChange
        );

    }


    if (eth) {

        terminalSetText(
            terminalTickerElements.ethPrice,
            terminalFormatCurrency(
                eth.current_price
            )
        );


        updateTickerChangeElement(
            terminalTickerElements.ethChange,
            eth.price_change_percentage_24h
        );

    } else {

        terminalSetUnavailable(
            terminalTickerElements.ethPrice
        );

        terminalSetUnavailable(
            terminalTickerElements.ethChange
        );

    }


    if (bnb) {

        terminalSetText(
            terminalTickerElements.bnbPrice,
            terminalFormatCurrency(
                bnb.current_price
            )
        );


        updateTickerChangeElement(
            terminalTickerElements.bnbChange,
            bnb.price_change_percentage_24h
        );

    } else {

        terminalSetUnavailable(
            terminalTickerElements.bnbPrice
        );

        terminalSetUnavailable(
            terminalTickerElements.bnbChange
        );

    }


    if (
        Number.isFinite(
            terminalMarketState.totalMarketCap
        )
    ) {

        terminalSetText(
            terminalTickerElements.totalMarketCap,
            terminalFormatCurrency(
                terminalMarketState.totalMarketCap
            )
        );

    } else {

        terminalSetUnavailable(
            terminalTickerElements.totalMarketCap
        );

    }


    if (
        Number.isFinite(
            terminalMarketState.marketChange24h
        )
    ) {

        updateTickerChangeElement(
            terminalTickerElements.totalMarketChange,
            terminalMarketState.marketChange24h
        );

    } else {

        terminalSetUnavailable(
            terminalTickerElements.totalMarketChange
        );

    }

}


/* =====================================================
   MAIN DASHBOARD OCEAN INDEX

   EXPERIMENTAL SNAO VALUE.
   Reuses the Ocean Score model so the interface does
   not show conflicting analytical values.
===================================================== */

const terminalOceanIndexElements = {

    value:
        document.getElementById(
            "terminalOceanIndex"
        ),

    change:
        document.getElementById(
            "terminalOceanIndexChange"
        ),

    status:
        document.getElementById(
            "terminalOceanStatus"
        ),

    condition:
        document.getElementById(
            "terminalMarketCondition"
        )

};


function renderTerminalOceanIndex() {

    const result =
        calculateOceanScore();


    const classification =
        getOceanScoreClassification(
            result.score
        );


    terminalSetText(
        terminalOceanIndexElements.value,
        result.score
    );


    terminalSetText(
        terminalOceanIndexElements.change,
        "Experimental"
    );


    terminalSetText(
        terminalOceanIndexElements.status,
        "Preview"
    );


    terminalSetText(
        terminalOceanIndexElements.condition,
        classification.condition
    );

}


/* =====================================================
   DASHBOARD METRICS

   Only Fear & Greed is external live sentiment data.
   Whale Activity, Stablecoin Flow and Ocean Risk remain
   demonstration / experimental interface values.
===================================================== */

const terminalDashboardMetrics = {

    whale:
        document.getElementById(
            "terminalWhaleMetric"
        ),

    whaleProgress:
        document.getElementById(
            "terminalWhaleMetricProgress"
        ),

    stablecoin:
        document.getElementById(
            "terminalStablecoinMetric"
        ),

    stablecoinProgress:
        document.getElementById(
            "terminalStablecoinMetricProgress"
        ),

    risk:
        document.getElementById(
            "terminalRiskMetric"
        ),

    riskProgress:
        document.getElementById(
            "terminalRiskMetricProgress"
        )

};


function renderDashboardPreviewMetrics() {

    /*
     * These are intentionally marked by the HTML
     * as Demo / Experimental.
     */

    const whalePreview =
        58;


    const stablecoinPreview =
        52;


    const oceanScore =
        calculateOceanScore()
            .score;


    const riskPreview =
        Math.round(
            terminalClamp(
                100 -
                oceanScore,
                20,
                80
            )
        );


    terminalSetText(
        terminalDashboardMetrics.whale,
        `${whalePreview}%`
    );


    terminalSetText(
        terminalDashboardMetrics.stablecoin,
        "Demo"
    );


    terminalSetText(
        terminalDashboardMetrics.risk,
        `${riskPreview}%`
    );


    if (
        terminalDashboardMetrics
            .whaleProgress
    ) {

        terminalDashboardMetrics
            .whaleProgress
            .style
            .width =
            `${whalePreview}%`;

    }


    if (
        terminalDashboardMetrics
            .stablecoinProgress
    ) {

        terminalDashboardMetrics
            .stablecoinProgress
            .style
            .width =
            `${stablecoinPreview}%`;

    }


    if (
        terminalDashboardMetrics
            .riskProgress
    ) {

        terminalDashboardMetrics
            .riskProgress
            .style
            .width =
            `${riskPreview}%`;

    }

}


/* =====================================================
   WHALE RADAR
   DEMONSTRATION ONLY
===================================================== */

const whaleRadarRows =
    document.querySelectorAll(
        "#whale-radar [data-whale-row]"
    );


function initializeWhaleRadarPreview() {

    whaleRadarRows.forEach(
        (row) => {

            row.setAttribute(
                "data-preview",
                "true"
            );

        }
    );

}


/* =====================================================
   HEATMAP
   DEMONSTRATION DATA

   Percentages are intentionally left as HTML preview
   values until a verified real-time heatmap integration
   is connected.
===================================================== */

function initializeHeatmapPreview() {

    const heatmap =
        document.getElementById(
            "heatmap"
        );


    if (!heatmap) {
        return;
    }


    heatmap.setAttribute(
        "data-terminal-source",
        "demonstration"
    );

}


/* =====================================================
   INTELLIGENCE NEWS
   COMING SOON

   No fake news generation or fabricated live headlines.
===================================================== */

function initializeIntelligenceNewsPreview() {

    const newsSection =
        document.getElementById(
            "news"
        );


    if (!newsSection) {
        return;
    }


    newsSection.setAttribute(
        "data-terminal-status",
        "coming-soon"
    );

}


/* =====================================================
   MAIN REFRESH BUTTON
===================================================== */

const terminalRefreshButton =
    document.getElementById(
        "terminalRefreshButton"
    );


/* =====================================================
   REFRESH ALL REAL MARKET DATA
===================================================== */

async function refreshTerminalMarketData() {

    /*
     * Requests are intentionally grouped to reduce
     * unnecessary API traffic.
     */

    const results =
        await Promise.allSettled(
            [
                loadGlobalMarketData(),
                loadTerminalAssetMarketData(),
                loadTopMovers(),
                loadFearGreed()
            ]
        );


    renderMarketTicker();

    renderOceanScoreBreakdown();

    renderTerminalOceanIndex();

    renderLiquidityPressure();

    renderWhaleConfidence();

    renderDashboardPreviewMetrics();


    updateTerminalCurrentTime();


    return results;

}


/* =====================================================
   MAIN REFRESH EVENT
===================================================== */

if (
    terminalRefreshButton
) {

    terminalRefreshButton.addEventListener(
        "click",
        async () => {

            if (
                terminalRefreshButton.disabled
            ) {
                return;
            }


            terminalRefreshButton.disabled =
                true;


            terminalRefreshButton.textContent =
                "↻ Refreshing";


            await refreshTerminalMarketData();


            terminalRefreshButton.textContent =
                "✓ Updated";


            setTimeout(
                () => {

                    terminalRefreshButton.textContent =
                        "↻ Refresh";

                    terminalRefreshButton.disabled =
                        false;

                },
                900
            );

        }
    );

}


/* =====================================================
   SAFE AUTOMATIC MARKET REFRESH

   CoinGecko's public API should not be hammered with
   frequent requests. The terminal refreshes selected
   market data every 5 minutes while the page is open.
===================================================== */

const TERMINAL_AUTO_REFRESH_INTERVAL =
    5 * 60 * 1000;


let terminalAutoRefreshTimer =
    null;


function startTerminalAutoRefresh() {

    if (
        terminalAutoRefreshTimer
    ) {

        clearInterval(
            terminalAutoRefreshTimer
        );

    }


    terminalAutoRefreshTimer =
        setInterval(
            async () => {

                /*
                 * Avoid unnecessary requests while the
                 * browser tab is not visible.
                 */

                if (
                    document.hidden
                ) {
                    return;
                }


                await refreshTerminalMarketData();

            },
            TERMINAL_AUTO_REFRESH_INTERVAL
        );

}


/* =====================================================
   PAGE VISIBILITY

   When the user returns after a long inactive period,
   refresh public market data.
===================================================== */

let terminalHiddenAt =
    null;


document.addEventListener(
    "visibilitychange",
    async () => {

        if (
            document.hidden
        ) {

            terminalHiddenAt =
                Date.now();

            return;

        }


        if (
            !terminalHiddenAt
        ) {
            return;
        }


        const inactiveTime =
            Date.now() -
            terminalHiddenAt;


        terminalHiddenAt =
            null;


        if (
            inactiveTime >
            TERMINAL_AUTO_REFRESH_INTERVAL
        ) {

            await refreshTerminalMarketData();

        }

    }
);


/* =====================================================
   INITIAL DEMONSTRATION SECTIONS
===================================================== */

function initializeTerminalPreviewSections() {

    renderTerminalNarrative(
        "ai"
    );


    renderDemoOceanFlow();


    renderWhalePreview();


    renderSmartMoneyPreview();


    initializeWhaleRadarPreview();


    initializeHeatmapPreview();


    initializeIntelligenceNewsPreview();


    /*
     * Sardine AI initial text.
     */

    if (
        sardineAiText
    ) {

        sardineAiText.textContent =
            sardineAiPreviewMessages.market;

    }

}


/* =====================================================
   INITIAL EXPERIMENTAL INDICATORS

   These render immediately with neutral/fallback inputs.
   They are recalculated after real public market data
   finishes loading.
===================================================== */

function initializeExperimentalIndicators() {

    renderOceanScoreBreakdown();


    renderTerminalOceanIndex();


    renderLiquidityPressure();


    renderWhaleConfidence();


    renderDashboardPreviewMetrics();

}


/* =====================================================
   INITIAL LOADING STATE
===================================================== */

function initializeTerminalLoadingState() {

    terminalSetLoading(
        liveBtcDominance
    );


    terminalSetLoading(
        liveTotalMarketCap
    );


    terminalSetLoading(
        liveMarketChange
    );


    terminalSetLoading(
        liveActiveCryptocurrencies
    );


    terminalSetLoading(
        terminalTickerElements.btcPrice
    );


    terminalSetLoading(
        terminalTickerElements.ethPrice
    );


    terminalSetLoading(
        terminalTickerElements.bnbPrice
    );


    terminalSetLoading(
        terminalTickerElements.totalMarketCap
    );


    terminalSetLoading(
        fearGreedElements.value
    );


    terminalSetLoading(
        fearGreedElements.metric
    );

}


/* =====================================================
   INITIAL TERMINAL LOAD
===================================================== */

async function initializeSnaoTerminal() {

    initializeTerminalLoadingState();


    initializeTerminalPreviewSections();


    initializeExperimentalIndicators();


    /*
     * Load real public market data.
     */

    await refreshTerminalMarketData();


    /*
     * Begin conservative automatic refresh.
     */

    startTerminalAutoRefresh();

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSnaoTerminal,
        {
            once:
                true
        }
    );

} else {

    initializeSnaoTerminal();

}


/* =====================================================
   TERMINAL ERROR SAFETY
===================================================== */

window.addEventListener(
    "unhandledrejection",
    (event) => {

        console.warn(
            "SNAO Terminal: an asynchronous request failed.",
            event.reason
        );

    }
);


/* =====================================================
   SNAO OCEAN TERMINAL
   END OF FILE
===================================================== */
