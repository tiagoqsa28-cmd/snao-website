/* =====================================================
   SNAO OCEAN TERMINAL — BASE
===================================================== */

const terminalCurrentTime =
    document.getElementById("terminalCurrentTime");

const terminalRefreshButton =
    document.getElementById("terminalRefreshButton");

const terminalMenuButton =
    document.getElementById("terminalMenuButton");

const terminalSidebar =
    document.getElementById("terminalSidebar");


/* =====================================================
   CLOCK
===================================================== */

function updateTerminalClock() {

    if (!terminalCurrentTime) {
        return;
    }

    const now = new Date();

    terminalCurrentTime.textContent =
        now.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}

updateTerminalClock();

setInterval(
    updateTerminalClock,
    1000
);


/* =====================================================
   REFRESH BUTTON
===================================================== */

if (terminalRefreshButton) {

    terminalRefreshButton.addEventListener(
    "click",
    async () => {

            terminalRefreshButton.textContent =
                "↻ Updating...";

            updateTerminalClock();

            await loadTerminalMarketData();

            setTimeout(() => {

                terminalRefreshButton.textContent =
                    "✓ Updated";

            }, 500);

            setTimeout(() => {

                terminalRefreshButton.textContent =
                    "↻ Refresh";

            }, 1400);

        }
    );

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

if (
    terminalMenuButton &&
    terminalSidebar
) {

    terminalMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                terminalSidebar.classList.toggle(
                    "open"
                );

            terminalMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    terminalSidebar
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    terminalSidebar.classList.remove(
                        "open"
                    );

                    terminalMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}

/* =====================================================
   OCEAN SCORE BREAKDOWN
===================================================== */

let latestOceanMarketChange = 0;
let latestOceanBtcDominance = 50;
let latestOceanFearGreed = 50;


const oceanScoreMainRing =
    document.getElementById(
        "oceanScoreMainRing"
    );

const oceanScoreMainValue =
    document.getElementById(
        "oceanScoreMainValue"
    );

const oceanScoreCondition =
    document.getElementById(
        "oceanScoreCondition"
    );

const oceanScoreDescription =
    document.getElementById(
        "oceanScoreDescription"
    );

const oceanTrendValue =
    document.getElementById(
        "oceanTrendValue"
    );

const oceanTrendProgress =
    document.getElementById(
        "oceanTrendProgress"
    );

const oceanSentimentValue =
    document.getElementById(
        "oceanSentimentValue"
    );

const oceanSentimentProgress =
    document.getElementById(
        "oceanSentimentProgress"
    );

const oceanBitcoinValue =
    document.getElementById(
        "oceanBitcoinValue"
    );

const oceanBitcoinProgress =
    document.getElementById(
        "oceanBitcoinProgress"
    );

const oceanLiquidityValue =
    document.getElementById(
        "oceanLiquidityValue"
    );

const oceanLiquidityProgress =
    document.getElementById(
        "oceanLiquidityProgress"
    );

const oceanRiskValue =
    document.getElementById(
        "oceanRiskValue"
    );

const oceanRiskProgress =
    document.getElementById(
        "oceanRiskProgress"
    );

const oceanScoreAiTitle =
    document.getElementById(
        "oceanScoreAiTitle"
    );

const oceanScoreAiText =
    document.getElementById(
        "oceanScoreAiText"
    );

const oceanScoreDirection =
    document.getElementById(
        "oceanScoreDirection"
    );

const oceanScoreConfidence =
    document.getElementById(
        "oceanScoreConfidence"
    );

const oceanScoreRiskLevel =
    document.getElementById(
        "oceanScoreRiskLevel"
    );

const oceanScoreRefresh =
    document.getElementById(
        "oceanScoreRefresh"
    );


function clampOceanValue(value) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(value)
        )
    );

}


function updateOceanComponent(
    valueElement,
    progressElement,
    value
) {

    const safeValue =
        clampOceanValue(value);


    if (valueElement) {
        valueElement.textContent =
            safeValue;
    }


    if (progressElement) {

        progressElement.style.setProperty(
            "--component-value",
            `${safeValue}%`
        );

    }

}


function calculateOceanScoreBreakdown() {

    const trendScore =
        clampOceanValue(
            50 +
            latestOceanMarketChange * 9
        );


    const sentimentScore =
        clampOceanValue(
            latestOceanFearGreed
        );


    const bitcoinScore =
        clampOceanValue(
            45 +
            latestOceanBtcDominance * 0.45
        );


    const liquidityScore =
        clampOceanValue(
            48 +
            Math.max(
                latestOceanMarketChange,
                0
            ) * 8 +
            latestOceanFearGreed * 0.22
        );


    const overheatingPenalty =
        Math.max(
            latestOceanFearGreed - 75,
            0
        );


    const riskControlScore =
        clampOceanValue(
            82 -
            Math.abs(
                latestOceanMarketChange
            ) * 6 -
            overheatingPenalty * 1.3
        );


    const totalScore =
        clampOceanValue(
            trendScore * 0.25 +
            sentimentScore * 0.2 +
            bitcoinScore * 0.15 +
            liquidityScore * 0.2 +
            riskControlScore * 0.2
        );


    return {
        trendScore,
        sentimentScore,
        bitcoinScore,
        liquidityScore,
        riskControlScore,
        totalScore
    };

}


function getOceanScoreInterpretation(score) {

    if (score >= 80) {

        return {
            condition:
                "Strong Bullish",

            title:
                "Market conditions show strong expansion.",

            description:
                "Momentum, sentiment and liquidity are aligned positively, " +
                "although overheating risk should be monitored.",

            direction:
                "Strong Positive",

            risk:
                "Elevated"
        };

    }


    if (score >= 65) {

        return {
            condition:
                "Moderate Bullish",

            title:
                "The market remains constructive.",

            description:
                "Positive momentum and improving liquidity support risk assets, " +
                "while overall market risk remains manageable.",

            direction:
                "Positive",

            risk:
                "Medium"
        };

    }


    if (score >= 45) {

        return {
            condition:
                "Neutral",

            title:
                "The market lacks strong directional confirmation.",

            description:
                "Sentiment and liquidity conditions are mixed. " +
                "Investors may wait for stronger confirmation.",

            direction:
                "Neutral",

            risk:
                "Medium"
        };

    }


    if (score >= 25) {

        return {
            condition:
                "Moderate Bearish",

            title:
                "Market pressure is increasing.",

            description:
                "Weak sentiment and reduced momentum indicate defensive " +
                "conditions and higher downside sensitivity.",

            direction:
                "Negative",

            risk:
                "High"
        };

    }


    return {
        condition:
            "Strong Bearish",

        title:
            "Market conditions show severe weakness.",

        description:
            "Fear, declining liquidity and negative momentum dominate " +
            "the current market environment.",

        direction:
            "Strong Negative",

        risk:
            "Very High"
    };

}


function renderOceanScoreBreakdown() {

    const breakdown =
        calculateOceanScoreBreakdown();


    const interpretation =
        getOceanScoreInterpretation(
            breakdown.totalScore
        );


    if (oceanScoreMainRing) {

        oceanScoreMainRing.style.setProperty(
            "--ocean-score-value",
            `${breakdown.totalScore}%`
        );

    }


    if (oceanScoreMainValue) {
        oceanScoreMainValue.textContent =
            breakdown.totalScore;
    }


    updateOceanComponent(
        oceanTrendValue,
        oceanTrendProgress,
        breakdown.trendScore
    );


    updateOceanComponent(
        oceanSentimentValue,
        oceanSentimentProgress,
        breakdown.sentimentScore
    );


    updateOceanComponent(
        oceanBitcoinValue,
        oceanBitcoinProgress,
        breakdown.bitcoinScore
    );


    updateOceanComponent(
        oceanLiquidityValue,
        oceanLiquidityProgress,
        breakdown.liquidityScore
    );


    updateOceanComponent(
        oceanRiskValue,
        oceanRiskProgress,
        breakdown.riskControlScore
    );


    if (oceanScoreCondition) {
        oceanScoreCondition.textContent =
            interpretation.condition;
    }


    if (oceanScoreDescription) {
        oceanScoreDescription.textContent =
            interpretation.description;
    }


    if (oceanScoreAiTitle) {
        oceanScoreAiTitle.textContent =
            interpretation.title;
    }


    if (oceanScoreAiText) {
        oceanScoreAiText.textContent =
            interpretation.description;
    }


    if (oceanScoreDirection) {
        oceanScoreDirection.textContent =
            interpretation.direction;
    }


    if (oceanScoreConfidence) {
        oceanScoreConfidence.textContent =
            `${breakdown.totalScore}%`;
    }


    if (oceanScoreRiskLevel) {
        oceanScoreRiskLevel.textContent =
            interpretation.risk;
    }


    if (liveOceanScore) {
        liveOceanScore.textContent =
            breakdown.totalScore;
    }

}


if (oceanScoreRefresh) {

    oceanScoreRefresh.addEventListener(
        "click",
        () => {

            oceanScoreRefresh.disabled =
                true;

            oceanScoreRefresh.textContent =
                "↻ Calculating...";


            renderOceanScoreBreakdown();


            setTimeout(() => {

                oceanScoreRefresh.textContent =
                    "✓ Score Updated";

            }, 550);


            setTimeout(() => {

                oceanScoreRefresh.textContent =
                    "↻ Recalculate Ocean Score";

                oceanScoreRefresh.disabled =
                    false;

            }, 1500);

        }
    );

}

/* =====================================================
   GLOBAL MARKET DATA — LIVE BAR
===================================================== */

const terminalGlobalMarketUrl =
    "https://api.coingecko.com/api/v3/global";


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


function formatGlobalMarketCap(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "--";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            notation: "compact",
            maximumFractionDigits: 2
        }
    ).format(value);

}


function calculateOceanScore(
    marketChange,
    btcDominance
) {

    let score = 50;

    if (
        typeof marketChange === "number"
    ) {
        score += marketChange * 4;
    }

    if (
        typeof btcDominance === "number"
    ) {

        if (btcDominance >= 45) {
            score += 8;
        }

        if (btcDominance >= 55) {
            score += 5;
        }

    }

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(score)
        )
    );

}


async function loadGlobalMarketData() {

    try {

        const response =
            await fetch(
                terminalGlobalMarketUrl,
                {
                    headers: {
                        accept:
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Global market request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        const globalData =
            result?.data;


        if (!globalData) {

            throw new Error(
                "Global market data was not returned."
            );

        }


        const btcDominance =
            globalData
                .market_cap_percentage
                ?.btc;


        const totalMarketCap =
            globalData
                .total_market_cap
                ?.usd;


        const marketChange =
            globalData
                .market_cap_change_percentage_24h_usd;

        latestOceanMarketChange =
    typeof marketChange === "number"
        ? marketChange
        : 0;

latestOceanBtcDominance =
    typeof btcDominance === "number"
        ? btcDominance
        : 50;

renderOceanScoreBreakdown();

renderLiquidityPressure();

renderWhaleConfidence();


        const activeCryptocurrencies =
            globalData
                .active_cryptocurrencies;


        if (
            liveBtcDominance &&
            typeof btcDominance === "number"
        ) {

            liveBtcDominance.textContent =
                `${btcDominance.toFixed(2)}%`;

        }


        if (liveTotalMarketCap) {

            liveTotalMarketCap.textContent =
                formatGlobalMarketCap(
                    totalMarketCap
                );

        }


        if (
            liveActiveCryptocurrencies &&
            typeof activeCryptocurrencies ===
                "number"
        ) {

            liveActiveCryptocurrencies
                .textContent =
                    activeCryptocurrencies
                        .toLocaleString(
                            "en-US"
                        );

        }


        if (
            liveMarketChange &&
            typeof marketChange === "number"
        ) {

            const prefix =
                marketChange > 0
                    ? "+"
                    : "";

            liveMarketChange.textContent =
                `${prefix}${marketChange.toFixed(2)}%`;


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


        if (liveOceanScore) {

            liveOceanScore.textContent =
                calculateOceanScore(
                    marketChange,
                    btcDominance
                );

        }

    } catch (error) {

        console.error(
            "Unable to load global market data:",
            error
        );


        [
            liveBtcDominance,
            liveTotalMarketCap,
            liveMarketChange,
            liveActiveCryptocurrencies
        ].forEach((element) => {

            if (element) {
                element.textContent =
                    "Unavailable";
            }

        });

    }

}


loadGlobalMarketData();


setInterval(
    loadGlobalMarketData,
    120000
);

/* =====================================================
   REAL MARKET DATA — COINGECKO
===================================================== */

const coinGeckoPriceUrl =
    "https://api.coingecko.com/api/v3/simple/price" +
    "?ids=bitcoin,ethereum,binancecoin" +
    "&vs_currencies=usd" +
    "&include_24hr_change=true" +
    "&include_last_updated_at=true";


const terminalMarketElements = {

    bitcoin: {
        price:
            document.getElementById(
                "btcTerminalPrice"
            ),

        change:
            document.getElementById(
                "btcTerminalChange"
            ),

        maximumDecimals: 0
    },

    ethereum: {
        price:
            document.getElementById(
                "ethTerminalPrice"
            ),

        change:
            document.getElementById(
                "ethTerminalChange"
            ),

        maximumDecimals: 0
    },

    binancecoin: {
        price:
            document.getElementById(
                "bnbTerminalPrice"
            ),

        change:
            document.getElementById(
                "bnbTerminalChange"
            ),

        maximumDecimals: 2
    }

};


/* Formata valores em dólar */

function formatTerminalUsd(
    value,
    maximumDecimals = 2
) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "--";
    }

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits:
                maximumDecimals
        }
    );

}


/* Atualiza cor e valor percentual */

function updateTerminalChange(
    element,
    value
) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "positive",
        "negative",
        "neutral"
    );

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        element.textContent = "--";
        element.classList.add("neutral");
        return;
    }

    const prefix =
        value > 0 ? "+" : "";

    element.textContent =
        `${prefix}${value.toFixed(2)}%`;

    if (value > 0) {
        element.classList.add("positive");
    } else if (value < 0) {
        element.classList.add("negative");
    } else {
        element.classList.add("neutral");
    }

}


/* Busca os dados da CoinGecko */

async function loadTerminalMarketData() {

    if (terminalRefreshButton) {
        terminalRefreshButton.disabled = true;
    }

    try {

        const response = await fetch(
            coinGeckoPriceUrl,
            {
                headers: {
                    accept: "application/json"
                },

                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error(
                `CoinGecko request failed: ${response.status}`
            );
        }


        const marketData =
            await response.json();


        Object.entries(
            terminalMarketElements
        ).forEach(
            ([coinId, elements]) => {

                const coinData =
                    marketData[coinId];

                if (!coinData) {
                    return;
                }


                if (elements.price) {

                    elements.price.textContent =
                        formatTerminalUsd(
                            coinData.usd,
                            elements.maximumDecimals
                        );

                }


                updateTerminalChange(
                    elements.change,
                    coinData.usd_24h_change
                );

            }
        );


        updateTerminalClock();

    } catch (error) {

        console.error(
            "Unable to load CoinGecko data:",
            error
        );


        Object.values(
            terminalMarketElements
        ).forEach((elements) => {

            if (elements.change) {
                elements.change.textContent =
                    "Unavailable";

                elements.change.classList.remove(
                    "positive",
                    "negative"
                );

                elements.change.classList.add(
                    "neutral"
                );
            }

        });

    } finally {

        if (terminalRefreshButton) {
            terminalRefreshButton.disabled = false;
        }

    }

}


/* Primeira atualização */

loadTerminalMarketData();


/* Atualização automática a cada 60 segundos */

const terminalMarketInterval =
    setInterval(
        loadTerminalMarketData,
        60000
    );

/* =====================================================
   FEAR & GREED INTELLIGENCE — REAL DATA
===================================================== */

const fearGreedApiUrl =
    "https://api.alternative.me/fng/?limit=1&format=json";


const fearGreedGauge =
    document.getElementById(
        "fearGreedGauge"
    );

const fearGreedValue =
    document.getElementById(
        "fearGreedValue"
    );

const fearGreedState =
    document.getElementById(
        "fearGreedState"
    );

const fearGreedTitle =
    document.getElementById(
        "fearGreedTitle"
    );

const fearGreedText =
    document.getElementById(
        "fearGreedText"
    );

const fearGreedRetail =
    document.getElementById(
        "fearGreedRetail"
    );

const fearGreedInstitutional =
    document.getElementById(
        "fearGreedInstitutional"
    );

const fearGreedVolatility =
    document.getElementById(
        "fearGreedVolatility"
    );

const fearGreedRegime =
    document.getElementById(
        "fearGreedRegime"
    );

const fearGreedLiveRefresh =
    document.getElementById(
        "fearGreedLiveRefresh"
    );


/* Define a análise exibida para cada faixa */

function getFearGreedAnalysis(value) {

    if (value <= 24) {

        return {
            title:
                "Market confidence is severely reduced.",

            text:
                "Investors are prioritizing capital protection. " +
                "Selling pressure and uncertainty dominate current behavior.",

            retail:
                "Fearful",

            institutional:
                "Selective",

            volatility:
                "High",

            regime:
                "Risk-Off"
        };

    }


    if (value <= 44) {

        return {
            title:
                "Fear continues to influence the market.",

            text:
                "Risk appetite remains limited. Investors are cautious, " +
                "while stronger participants may begin evaluating opportunities.",

            retail:
                "Cautious",

            institutional:
                "Observing",

            volatility:
                "Elevated",

            regime:
                "Defensive"
        };

    }


    if (value <= 55) {

        return {
            title:
                "Market sentiment is balanced.",

            text:
                "Neither fear nor greed currently dominates. " +
                "The market is waiting for stronger directional confirmation.",

            retail:
                "Neutral",

            institutional:
                "Balanced",

            volatility:
                "Medium",

            regime:
                "Neutral"
        };

    }


    if (value <= 74) {

        return {
            title:
                "Risk appetite is elevated.",

            text:
                "Investor confidence and demand for risk assets are growing. " +
                "Momentum is positive, although volatility may also increase.",

            retail:
                "Positive",

            institutional:
                "Accumulating",

            volatility:
                "Medium",

            regime:
                "Risk-On"
        };

    }


    return {
        title:
            "Market optimism is approaching extreme levels.",

        text:
            "Strong momentum and speculative demand dominate the market. " +
            "The trend remains positive, but correction risk is higher.",

        retail:
            "Euphoric",

        institutional:
            "Profit Taking",

        volatility:
            "Elevated",

        regime:
            "Overheated"
    };

}


/* Atualiza todos os elementos do painel */

function renderFearGreedData(
    value,
    classification
) {

latestOceanFearGreed =
    Number.isFinite(value)
        ? value
        : 50;

renderOceanScoreBreakdown();

renderLiquidityPressure();

renderWhaleConfidence();

    const analysis =
        getFearGreedAnalysis(value);


    if (fearGreedGauge) {

        fearGreedGauge.style.setProperty(
            "--fear-greed-position",
            `${value}%`
        );

    }


    if (fearGreedValue) {
        fearGreedValue.textContent =
            value;
    }


    if (fearGreedState) {
        fearGreedState.textContent =
            classification;
    }


    if (fearGreedText) {
        fearGreedText.style.opacity =
            "0";
    }


    setTimeout(() => {

        if (fearGreedTitle) {
            fearGreedTitle.textContent =
                analysis.title;
        }

        if (fearGreedText) {

            fearGreedText.textContent =
                analysis.text;

            fearGreedText.style.opacity =
                "1";
        }

        if (fearGreedRetail) {
            fearGreedRetail.textContent =
                analysis.retail;
        }

        if (fearGreedInstitutional) {
            fearGreedInstitutional.textContent =
                analysis.institutional;
        }

        if (fearGreedVolatility) {
            fearGreedVolatility.textContent =
                analysis.volatility;
        }

        if (fearGreedRegime) {
            fearGreedRegime.textContent =
                analysis.regime;
        }

    }, 180);

}


/* Busca o índice real */

async function loadFearGreedData() {

    if (fearGreedLiveRefresh) {

        fearGreedLiveRefresh.disabled =
            true;

        fearGreedLiveRefresh.textContent =
            "↻ Loading...";
    }


    try {

        const response =
            await fetch(
                fearGreedApiUrl,
                {
                    headers: {
                        accept:
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Fear and Greed request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        const latestData =
            result?.data?.[0];


        if (!latestData) {

            throw new Error(
                "Fear and Greed data was not returned."
            );

        }


        const currentValue =
            Number(latestData.value);


        if (!Number.isFinite(currentValue)) {

            throw new Error(
                "Invalid Fear and Greed value."
            );

        }


        renderFearGreedData(
            currentValue,
            latestData.value_classification
        );


        if (fearGreedLiveRefresh) {

            fearGreedLiveRefresh.textContent =
                "✓ Live Data Updated";

        }

    } catch (error) {

        console.error(
            "Unable to load Fear and Greed data:",
            error
        );


        if (fearGreedLiveRefresh) {

            fearGreedLiveRefresh.textContent =
                "Unable to Update";

        }

    } finally {

        setTimeout(() => {

            if (fearGreedLiveRefresh) {

                fearGreedLiveRefresh.textContent =
                    "↻ Refresh Live Index";

                fearGreedLiveRefresh.disabled =
                    false;
            }

        }, 1500);

    }

}


/* Atualização manual */

if (fearGreedLiveRefresh) {

    fearGreedLiveRefresh.addEventListener(
        "click",
        loadFearGreedData
    );

}


/* Primeira atualização */

loadFearGreedData();


/* Atualiza automaticamente a cada 5 minutos */

setInterval(
    loadFearGreedData,
    300000
);    

/* =====================================================
   SARDINE AI DEMONSTRATION
===================================================== */

const terminalAiText =
    document.getElementById("terminalAiText");

const terminalAiMessages = {

    market:
        "The market is moderately bullish. Liquidity is improving, " +
        "Bitcoin remains dominant and risk appetite is increasing " +
        "without reaching extreme levels.",

    whales:
        "Large-wallet activity is above the recent average. " +
        "The strongest movements are concentrated in Bitcoin, " +
        "Ethereum and major stablecoins.",

    risk:
        "Current market risk is moderate. Short-term volatility " +
        "may increase, but liquidity and sentiment remain controlled."

};

document
    .querySelectorAll("[data-ai-message]")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const messageType =
                    button.dataset.aiMessage;

                const message =
                    terminalAiMessages[
                        messageType
                    ];

                if (
                    !terminalAiText ||
                    !message
                ) {
                    return;
                }

                terminalAiText.style.opacity =
                    "0";

                setTimeout(() => {

                    terminalAiText.textContent =
                        message;

                    terminalAiText.style.opacity =
                        "1";

                }, 210);

            }
        );

    });

    /* =====================================================
   CHART TIME BUTTONS
===================================================== */

const terminalChartTimeButtons =
    document.querySelectorAll(
        ".chart-time-buttons button"
    );

terminalChartTimeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        terminalChartTimeButtons.forEach(
            (currentButton) => {
                currentButton.classList.remove("active");
            }
        );

        button.classList.add("active");

        const chartLine =
            document.querySelector(
                ".terminal-chart-main-line"
            );

        if (chartLine) {

            chartLine.style.animation = "none";

            void chartLine.offsetWidth;

            chartLine.style.animation =
                "terminalChartDraw 1.8s ease forwards";

        }

    });

});

/* =====================================================
   MOBILE SIDEBAR BACKDROP
===================================================== */

const terminalSidebarBackdrop =
    document.getElementById(
        "terminalSidebarBackdrop"
    );

function closeTerminalSidebar() {

    if (!terminalSidebar || !terminalMenuButton) {
        return;
    }

    terminalSidebar.classList.remove("open");

    terminalMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    if (terminalSidebarBackdrop) {
        terminalSidebarBackdrop.classList.remove(
            "active"
        );
    }

    document.body.classList.remove(
        "terminal-menu-open"
    );

}


if (
    terminalMenuButton &&
    terminalSidebar &&
    terminalSidebarBackdrop
) {

    terminalMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                terminalSidebar.classList.contains(
                    "open"
                );

            terminalSidebarBackdrop.classList.toggle(
                "active",
                isOpen
            );

            document.body.classList.toggle(
                "terminal-menu-open",
                isOpen
            );

        }
    );


    terminalSidebarBackdrop.addEventListener(
        "click",
        closeTerminalSidebar
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeTerminalSidebar();
            }

        }
    );

}

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

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    terminalNavigationLinks.forEach(
                        (link) => {

                            const isCurrentSection =
                                link.getAttribute("href") ===
                                `#${entry.target.id}`;

                            link.classList.toggle(
                                "active",
                                isCurrentSection
                            );

                        }
                    );

                });

            },
            {
                rootMargin:
                    "-25% 0px -65% 0px"
            }
        );

    terminalObservedSections.forEach(
        (section) => {
            terminalSectionObserver.observe(section);
        }
    );

}

/* =====================================================
   SEARCH INTELLIGENCE
===================================================== */

const terminalAssetSearch =
    document.getElementById("terminalAssetSearch");

const terminalAssetSearchButton =
    document.getElementById(
        "terminalAssetSearchButton"
    );

const terminalAssetButtons =
    document.querySelectorAll(
        "[data-terminal-asset]"
    );


const terminalAssetDatabase = {

    BTC: {
        coinGeckoId: "bitcoin",
        name: "Bitcoin",
        symbol: "₿",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "84",
        whales: "High",
        risk: "Medium",
        sentiment: "Positive",
        state: "Bullish",
        positive: true,
        summary:
            "Bitcoin shows strong institutional demand, elevated whale " +
            "activity and improving liquidity. Short-term volatility " +
            "remains possible, but the broader structure is positive."
    },

    ETH: {
        coinGeckoId: "ethereum",
        name: "Ethereum",
        symbol: "Ξ",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "78",
        whales: "Moderate",
        risk: "Medium",
        sentiment: "Positive",
        state: "Bullish",
        positive: true,
        summary:
            "Ethereum maintains positive sentiment with steady institutional " +
            "interest. Network activity is stable and whale accumulation " +
            "remains moderate."
    },

    SOL: {
        coinGeckoId: "solana",
        name: "Solana",
        symbol: "S",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "88",
        whales: "High",
        risk: "Elevated",
        sentiment: "Strong",
        state: "Strong Bullish",
        positive: true,
        summary:
            "Solana displays strong momentum, elevated trading volume and " +
            "high whale participation. Risk is higher due to recent rapid gains."
    },

    XRP: {
        coinGeckoId: "ripple",
        name: "XRP",
        symbol: "X",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "66",
        whales: "Moderate",
        risk: "Medium",
        sentiment: "Neutral",
        state: "Neutral",
        positive: true,
        summary:
            "XRP is trading with moderate activity and balanced sentiment. " +
            "Liquidity remains stable, but momentum is weaker than leading assets."
    },

    BNB: {
        coinGeckoId: "binancecoin",
        name: "BNB",
        symbol: "B",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "62",
        whales: "Low",
        risk: "Medium",
        sentiment: "Neutral",
        state: "Neutral",
        positive: true,
        summary:
            "BNB remains structurally stable while market momentum changes. " +
            "Whale activity and sentiment are being monitored."
    },

    DOGE: {
        coinGeckoId: "dogecoin",
        name: "Dogecoin",
        symbol: "D",
        price: "--",
        change: "--",
        marketCap: "--",
        volume: "--",
        aiScore: "54",
        whales: "Moderate",
        risk: "High",
        sentiment: "Weak",
        state: "Bearish",
        positive: false,
        summary:
            "Dogecoin carries elevated speculative risk. Whale participation " +
            "remains present, but momentum can change rapidly."
    }

};


const terminalAssetElements = {

    symbol:
        document.getElementById(
            "selectedAssetSymbol"
        ),

    name:
        document.getElementById(
            "selectedAssetName"
        ),

    ticker:
        document.getElementById(
            "selectedAssetTicker"
        ),

    state:
        document.getElementById(
            "selectedAssetState"
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
            "selectedAssetAiScore"
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

    summary:
        document.getElementById(
            "selectedAssetSummary"
        )

};

/* =====================================================
   SEARCH INTELLIGENCE — FORMATTERS
===================================================== */

function formatTerminalCompactUsd(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "--";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            notation: "compact",
            maximumFractionDigits: 2
        }
    ).format(value);

}


function formatTerminalAssetPrice(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "--";
    }

    let maximumFractionDigits = 2;

    if (value < 1) {
        maximumFractionDigits = 5;
    }

    if (value >= 1000) {
        maximumFractionDigits = 0;
    }

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits
        }
    );

}


function formatTerminalPercentage(value) {

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        return "--";
    }

    const prefix =
        value > 0 ? "+" : "";

    return `${prefix}${value.toFixed(2)}%`;

}

/* =====================================================
   SEARCH INTELLIGENCE — REAL MARKET DATA
===================================================== */

const terminalAssetMarketUrl =
    "https://api.coingecko.com/api/v3/coins/markets" +
    "?vs_currency=usd" +
    "&ids=bitcoin,ethereum,solana,ripple,binancecoin,dogecoin" +
    "&order=market_cap_desc" +
    "&per_page=6" +
    "&page=1" +
    "&sparkline=false" +
    "&price_change_percentage=24h";


let selectedTerminalAssetTicker = "BTC";


async function loadTerminalAssetMarketData() {

    try {

        const response = await fetch(
            terminalAssetMarketUrl,
            {
                headers: {
                    accept: "application/json"
                },

                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                `Market request failed: ${response.status}`
            );

        }


        const coins =
            await response.json();


        coins.forEach((coin) => {

            const matchingEntry =
                Object.entries(
                    terminalAssetDatabase
                ).find(
                    ([, asset]) =>
                        asset.coinGeckoId === coin.id
                );


            if (!matchingEntry) {
                return;
            }


            const [
                ticker,
                asset
            ] = matchingEntry;


            asset.price =
                formatTerminalAssetPrice(
                    coin.current_price
                );

            asset.change =
                formatTerminalPercentage(
                    coin.price_change_percentage_24h
                );

            asset.marketCap =
                formatTerminalCompactUsd(
                    coin.market_cap
                );

            asset.volume =
                formatTerminalCompactUsd(
                    coin.total_volume
                );


            const change =
                coin.price_change_percentage_24h;


            asset.positive =
                typeof change === "number"
                    ? change >= 0
                    : true;


            if (
                typeof change === "number"
            ) {

                if (change >= 3) {
                    asset.state =
                        "Strong Bullish";
                    asset.sentiment =
                        "Strong";
                } else if (change > 0) {
                    asset.state =
                        "Bullish";
                    asset.sentiment =
                        "Positive";
                } else if (change <= -3) {
                    asset.state =
                        "Bearish";
                    asset.sentiment =
                        "Weak";
                } else if (change < 0) {
                    asset.state =
                        "Under Pressure";
                    asset.sentiment =
                        "Negative";
                }

            }


            terminalAssetDatabase[ticker] =
                asset;

        });


        selectTerminalAsset(
            selectedTerminalAssetTicker
        );


        if (terminalAssetSearchButton) {

            terminalAssetSearchButton.textContent =
                "Analyze";

            terminalAssetSearchButton.disabled =
                false;

        }

    } catch (error) {

        console.error(
            "Unable to load asset market data:",
            error
        );


        if (terminalAssetSearchButton) {

            terminalAssetSearchButton.textContent =
                "Try Again";

            terminalAssetSearchButton.disabled =
                false;

        }

    }

}


function selectTerminalAsset(assetTicker) {

    const normalizedTicker =
        assetTicker.trim().toUpperCase();

    selectedTerminalAssetTicker =
    normalizedTicker;    

    const asset =
        terminalAssetDatabase[
            normalizedTicker
        ];

    if (!asset) {

        if (terminalAssetSearch) {
            terminalAssetSearch.value = "";
            terminalAssetSearch.placeholder =
                "Asset not available in demo";
        }

        return;
    }


    terminalAssetButtons.forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset.terminalAsset ===
                    normalizedTicker
            );

        }
    );


    if (terminalAssetElements.symbol) {
    terminalAssetElements.symbol.textContent =
        asset.symbol;
}

if (terminalAssetElements.name) {
    terminalAssetElements.name.textContent =
        asset.name;
}

if (terminalAssetElements.ticker) {
    terminalAssetElements.ticker.textContent =
        normalizedTicker;
}

if (terminalAssetElements.price) {
    terminalAssetElements.price.textContent =
        asset.price;
}

if (terminalAssetElements.marketCap) {
    terminalAssetElements.marketCap.textContent =
        asset.marketCap;
}

if (terminalAssetElements.volume) {
    terminalAssetElements.volume.textContent =
        asset.volume;
}

if (terminalAssetElements.aiScore) {
    terminalAssetElements.aiScore.textContent =
        asset.aiScore;
}

if (terminalAssetElements.whales) {
    terminalAssetElements.whales.textContent =
        asset.whales;
}

if (terminalAssetElements.risk) {
    terminalAssetElements.risk.textContent =
        asset.risk;
}

if (terminalAssetElements.sentiment) {
    terminalAssetElements.sentiment.textContent =
        asset.sentiment;
}


    terminalAssetElements.change.textContent =
        asset.change;

    terminalAssetElements.change.classList.toggle(
        "terminal-analysis-positive",
        asset.positive
    );

    terminalAssetElements.change.classList.toggle(
        "terminal-analysis-negative",
        !asset.positive
    );


    terminalAssetElements.state.textContent =
        asset.state;

    terminalAssetElements.state.classList.toggle(
        "negative",
        !asset.positive
    );


    terminalAssetElements.summary.style.opacity =
        "0";

    setTimeout(() => {

        terminalAssetElements.summary.textContent =
            asset.summary;

        terminalAssetElements.summary.style.opacity =
            "1";

    }, 180);


    if (terminalAssetSearch) {
        terminalAssetSearch.value =
            normalizedTicker;
    }

}


terminalAssetButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectTerminalAsset(
            button.dataset.terminalAsset
        );

    });

});


if (terminalAssetSearchButton) {

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


        setTimeout(() => {

            terminalAssetSearchButton.textContent =
                "Analyze";

            terminalAssetSearchButton.disabled =
                false;

        }, 1200);

    }
);

}


if (terminalAssetSearch) {

    terminalAssetSearch.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                selectTerminalAsset(
                    terminalAssetSearch.value
                );

            }

        }
    );

}

loadTerminalAssetMarketData();


setInterval(
    loadTerminalAssetMarketData,
    90000
);

/* =====================================================
   TRENDING NARRATIVES
===================================================== */

const narrativeDatabase = {

    ai: {
        title: "Artificial Intelligence",
        score: "95% Attention Score",
        momentum: "Strong",
        whales: "High",
        risk: "Medium",
        text:
            "Artificial intelligence remains the strongest market " +
            "narrative. Capital is concentrated in AI infrastructure, " +
            "autonomous agents and data-focused blockchain projects."
    },

    rwa: {
        title: "Real World Assets",
        score: "78% Attention Score",
        momentum: "Growing",
        whales: "High",
        risk: "Medium",
        text:
            "Real World Assets continue gaining institutional interest. " +
            "Tokenized credit, treasuries and financial infrastructure " +
            "remain the leading areas of growth."
    },

    defi: {
        title: "Decentralized Finance",
        score: "69% Attention Score",
        momentum: "Stable",
        whales: "Moderate",
        risk: "Medium",
        text:
            "DeFi activity remains stable, supported by lending, " +
            "liquidity and yield protocols. Capital rotation is gradual."
    },

    gaming: {
        title: "Web3 Gaming",
        score: "61% Attention Score",
        momentum: "Recovering",
        whales: "Moderate",
        risk: "High",
        text:
            "Gaming projects are recovering attention, particularly " +
            "those combining digital ownership, economies and AI systems."
    },

    memes: {
        title: "Memecoins",
        score: "54% Attention Score",
        momentum: "Volatile",
        whales: "High",
        risk: "Very High",
        text:
            "Memecoins show active speculative demand but carry elevated " +
            "volatility and liquidity risk. Momentum can reverse quickly."
    },

    layer2: {
        title: "Layer 2",
        score: "47% Attention Score",
        momentum: "Moderate",
        whales: "Low",
        risk: "Medium",
        text:
            "Layer 2 networks maintain long-term relevance, although " +
            "current market attention is lower than AI, RWA and DeFi."
    }

};


const narrativeItems =
    document.querySelectorAll(
        "[data-narrative]"
    );

const narrativeAnalysisTitle =
    document.getElementById(
        "narrativeAnalysisTitle"
    );

const narrativeAnalysisScore =
    document.getElementById(
        "narrativeAnalysisScore"
    );

const narrativeAnalysisText =
    document.getElementById(
        "narrativeAnalysisText"
    );

const narrativeMomentum =
    document.getElementById(
        "narrativeMomentum"
    );

const narrativeWhaleInterest =
    document.getElementById(
        "narrativeWhaleInterest"
    );

const narrativeRisk =
    document.getElementById(
        "narrativeRisk"
    );


function selectNarrative(narrativeId) {

    const narrative =
        narrativeDatabase[narrativeId];

    if (!narrative) {
        return;
    }


    narrativeItems.forEach((item) => {

        item.classList.toggle(
            "active",
            item.dataset.narrative ===
                narrativeId
        );

    });


    if (narrativeAnalysisText) {
        narrativeAnalysisText.style.opacity =
            "0";
    }


    setTimeout(() => {

        if (narrativeAnalysisTitle) {
            narrativeAnalysisTitle.textContent =
                narrative.title;
        }

        if (narrativeAnalysisScore) {
            narrativeAnalysisScore.textContent =
                narrative.score;
        }

        if (narrativeMomentum) {
            narrativeMomentum.textContent =
                narrative.momentum;
        }

        if (narrativeWhaleInterest) {
            narrativeWhaleInterest.textContent =
                narrative.whales;
        }

        if (narrativeRisk) {
            narrativeRisk.textContent =
                narrative.risk;
        }

        if (narrativeAnalysisText) {

            narrativeAnalysisText.textContent =
                narrative.text;

            narrativeAnalysisText.style.opacity =
                "1";
        }

    }, 180);

}


narrativeItems.forEach((item) => {

    item.addEventListener("click", () => {

        selectNarrative(
            item.dataset.narrative
        );

    });

});

/* =====================================================
   OCEAN FLOW MAP — DEMONSTRATION
===================================================== */

const flowAnalysisButton =
    document.getElementById(
        "flowAnalysisButton"
    );

const flowAmounts =
    document.querySelectorAll(
        ".flow-exchange b"
    );

const flowBaseValues = [
    184,
    96,
    -42,
    71,
    24
];


function updateFlowSimulation() {

    flowAmounts.forEach(
        (element, index) => {

            const baseValue =
                flowBaseValues[index];

            const variation =
                Math.floor(
                    Math.random() * 17
                ) - 8;

            const updatedValue =
                baseValue + variation;

            const prefix =
                updatedValue >= 0
                    ? "+"
                    : "-";

            element.textContent =
                `${prefix}$${Math.abs(updatedValue)}M`;

            element.classList.toggle(
                "flow-negative",
                updatedValue < 0
            );

        }
    );

}


if (flowAnalysisButton) {

    flowAnalysisButton.addEventListener(
        "click",
        () => {

            flowAnalysisButton.textContent =
                "Updating flow...";

            flowAnalysisButton.disabled =
                true;

            updateFlowSimulation();

            setTimeout(() => {

                flowAnalysisButton.textContent =
                    "Flow Analysis Updated";

            }, 550);

            setTimeout(() => {

                flowAnalysisButton.textContent =
                    "Refresh Flow Analysis";

                flowAnalysisButton.disabled =
                    false;

            }, 1500);

        }
    );

}


setInterval(
    updateFlowSimulation,
    9000
);

/* =====================================================
   WHALE INTELLIGENCE TABLE
===================================================== */

const whaleTableRefresh =
    document.getElementById(
        "whaleTableRefresh"
    );

const whaleTableSummaryTitle =
    document.getElementById(
        "whaleTableSummaryTitle"
    );

const whaleTableSummaryText =
    document.getElementById(
        "whaleTableSummaryText"
    );


const whaleSummaryScenarios = [

    {
        title:
            "Large wallets are showing net accumulation.",

        text:
            "Bitcoin and Solana currently show the strongest buying " +
            "concentration. Ethereum has moderate distribution pressure, " +
            "while stablecoin transfers indicate available market liquidity."
    },

    {
        title:
            "Institutional activity remains concentrated in Bitcoin.",

        text:
            "High-confidence wallets continue moving capital toward Bitcoin. " +
            "Altcoin activity remains selective, with Solana and Chainlink " +
            "showing the strongest secondary accumulation."
    },

    {
        title:
            "Stablecoin movement suggests increased buying capacity.",

        text:
            "Large USDT transfers are entering exchange-connected wallets. " +
            "Sardine AI classifies this behavior as possible preparation " +
            "for future market purchases."
    }

];


if (whaleTableRefresh) {

    whaleTableRefresh.addEventListener(
        "click",
        () => {

            whaleTableRefresh.disabled = true;

            whaleTableRefresh.textContent =
                "↻ Updating...";

            const selectedScenario =
                whaleSummaryScenarios[
                    Math.floor(
                        Math.random() *
                        whaleSummaryScenarios.length
                    )
                ];


            if (
                whaleTableSummaryTitle &&
                whaleTableSummaryText
            ) {

                whaleTableSummaryTitle.style.opacity =
                    "0";

                whaleTableSummaryText.style.opacity =
                    "0";


                setTimeout(() => {

                    whaleTableSummaryTitle.textContent =
                        selectedScenario.title;

                    whaleTableSummaryText.textContent =
                        selectedScenario.text;

                    whaleTableSummaryTitle.style.opacity =
                        "1";

                    whaleTableSummaryText.style.opacity =
                        "1";

                }, 220);

            }


            setTimeout(() => {

                whaleTableRefresh.textContent =
                    "✓ Updated";

            }, 600);


            setTimeout(() => {

                whaleTableRefresh.textContent =
                    "↻ Refresh";

                whaleTableRefresh.disabled =
                    false;

            }, 1500);

        }
    );

}

/* =====================================================
   WHALE CONFIDENCE INDEX
===================================================== */

const whaleConfidenceRing =
    document.getElementById(
        "whaleConfidenceRing"
    );

const whaleConfidenceValue =
    document.getElementById(
        "whaleConfidenceValue"
    );

const whaleConfidenceCondition =
    document.getElementById(
        "whaleConfidenceCondition"
    );

const whaleConfidenceDescription =
    document.getElementById(
        "whaleConfidenceDescription"
    );

const whaleAccumulationValue =
    document.getElementById(
        "whaleAccumulationValue"
    );

const whaleAccumulationProgress =
    document.getElementById(
        "whaleAccumulationProgress"
    );

const whaleTransactionQualityValue =
    document.getElementById(
        "whaleTransactionQualityValue"
    );

const whaleTransactionQualityProgress =
    document.getElementById(
        "whaleTransactionQualityProgress"
    );

const whaleExchangeBehaviorValue =
    document.getElementById(
        "whaleExchangeBehaviorValue"
    );

const whaleExchangeBehaviorProgress =
    document.getElementById(
        "whaleExchangeBehaviorProgress"
    );

const whaleMarketAlignmentValue =
    document.getElementById(
        "whaleMarketAlignmentValue"
    );

const whaleMarketAlignmentProgress =
    document.getElementById(
        "whaleMarketAlignmentProgress"
    );

const whaleConfidenceTitle =
    document.getElementById(
        "whaleConfidenceTitle"
    );

const whaleConfidenceText =
    document.getElementById(
        "whaleConfidenceText"
    );

const whaleDominantAction =
    document.getElementById(
        "whaleDominantAction"
    );

const whaleSignalConfidence =
    document.getElementById(
        "whaleSignalConfidence"
    );

const whaleMarketEffect =
    document.getElementById(
        "whaleMarketEffect"
    );

const whaleConfidenceRefresh =
    document.getElementById(
        "whaleConfidenceRefresh"
    );


function clampWhaleConfidence(value) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(value)
        )
    );

}


function updateWhaleConfidenceComponent(
    valueElement,
    progressElement,
    value
) {

    const safeValue =
        clampWhaleConfidence(value);


    if (valueElement) {
        valueElement.textContent =
            safeValue;
    }


    if (progressElement) {

        progressElement.style.setProperty(
            "--whale-component-value",
            `${safeValue}%`
        );

    }

}


function calculateWhaleConfidence() {

    const sentiment =
        typeof latestOceanFearGreed === "number"
            ? latestOceanFearGreed
            : 50;


    const marketChange =
        typeof latestOceanMarketChange === "number"
            ? latestOceanMarketChange
            : 0;


    const liquidity =
        calculateLiquidityPressure();


    const accumulation =
        clampWhaleConfidence(
            55 +
            sentiment * 0.25 +
            Math.max(
                marketChange,
                0
            ) * 5
        );


    const transactionQuality =
        clampWhaleConfidence(
            62 +
            sentiment * 0.18
        );


    const exchangeBehavior =
        clampWhaleConfidence(
            45 +
            liquidity.total * 0.4
        );


    const marketAlignment =
        clampWhaleConfidence(
            sentiment * 0.4 +
            liquidity.total * 0.4 +
            20
        );


    const total =
        clampWhaleConfidence(
            accumulation * 0.3 +
            transactionQuality * 0.2 +
            exchangeBehavior * 0.25 +
            marketAlignment * 0.25
        );


    return {
        accumulation,
        transactionQuality,
        exchangeBehavior,
        marketAlignment,
        total
    };

}


function getWhaleConfidenceInterpretation(score) {

    if (score >= 80) {

        return {
            condition:
                "High Confidence",

            title:
                "Large wallets show strong conviction.",

            text:
                "Accumulation behavior, transaction quality and market " +
                "alignment indicate elevated whale confidence.",

            action:
                "Accumulation",

            confidence:
                "High",

            effect:
                "Positive"
        };

    }


    if (score >= 60) {

        return {
            condition:
                "Moderate Confidence",

            title:
                "Large wallets remain selectively active.",

            text:
                "Whale participation remains constructive, although " +
                "positioning is not yet strongly directional.",

            action:
                "Selective Buying",

            confidence:
                "Moderate",

            effect:
                "Slight Positive"
        };

    }


    if (score >= 40) {

        return {
            condition:
                "Neutral Confidence",

            title:
                "Whale behavior lacks clear conviction.",

            text:
                "Large-wallet activity remains mixed, with no dominant " +
                "accumulation or distribution pattern.",

            action:
                "Mixed",

            confidence:
                "Neutral",

            effect:
                "Neutral"
        };

    }


    return {
        condition:
            "Low Confidence",

        title:
            "Large wallets are reducing market exposure.",

        text:
            "Distribution pressure and weaker market alignment indicate " +
            "lower whale conviction.",

        action:
            "Distribution",

        confidence:
            "Low",

        effect:
            "Negative"
    };

}


function renderWhaleConfidence() {

    const whaleData =
        calculateWhaleConfidence();


    const interpretation =
        getWhaleConfidenceInterpretation(
            whaleData.total
        );


    if (whaleConfidenceRing) {

        whaleConfidenceRing.style.setProperty(
            "--whale-confidence-value",
            `${whaleData.total}%`
        );

    }


    if (whaleConfidenceValue) {
        whaleConfidenceValue.textContent =
            whaleData.total;
    }


    updateWhaleConfidenceComponent(
        whaleAccumulationValue,
        whaleAccumulationProgress,
        whaleData.accumulation
    );


    updateWhaleConfidenceComponent(
        whaleTransactionQualityValue,
        whaleTransactionQualityProgress,
        whaleData.transactionQuality
    );


    updateWhaleConfidenceComponent(
        whaleExchangeBehaviorValue,
        whaleExchangeBehaviorProgress,
        whaleData.exchangeBehavior
    );


    updateWhaleConfidenceComponent(
        whaleMarketAlignmentValue,
        whaleMarketAlignmentProgress,
        whaleData.marketAlignment
    );


    if (whaleConfidenceCondition) {
        whaleConfidenceCondition.textContent =
            interpretation.condition;
    }


    if (whaleConfidenceDescription) {
        whaleConfidenceDescription.textContent =
            interpretation.text;
    }


    if (whaleConfidenceTitle) {
        whaleConfidenceTitle.textContent =
            interpretation.title;
    }


    if (whaleConfidenceText) {
        whaleConfidenceText.textContent =
            interpretation.text;
    }


    if (whaleDominantAction) {
        whaleDominantAction.textContent =
            interpretation.action;
    }


    if (whaleSignalConfidence) {
        whaleSignalConfidence.textContent =
            interpretation.confidence;
    }


    if (whaleMarketEffect) {
        whaleMarketEffect.textContent =
            interpretation.effect;
    }

}


if (whaleConfidenceRefresh) {

    whaleConfidenceRefresh.addEventListener(
        "click",
        () => {

            whaleConfidenceRefresh.disabled =
                true;

            whaleConfidenceRefresh.textContent =
                "↻ Calculating...";


            renderWhaleConfidence();


            setTimeout(() => {

                whaleConfidenceRefresh.textContent =
                    "✓ WCI Updated";

            }, 550);


            setTimeout(() => {

                whaleConfidenceRefresh.textContent =
                    "↻ Recalculate WCI";

                whaleConfidenceRefresh.disabled =
                    false;

            }, 1500);

        }
    );

}

/* =====================================================
   TOP MOVERS
===================================================== */

const topGainersList =
document.getElementById(
"topGainersList"
);

const topLosersList =
document.getElementById(
"topLosersList"
);


async function loadTopMovers(){

try{

const response=
await fetch(

"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"

);

const coins=
await response.json();


coins.sort(

(a,b)=>

b.price_change_percentage_24h-

a.price_change_percentage_24h

);


const gainers=
coins.slice(0,5);


const losers=
[...coins]

.sort(

(a,b)=>

a.price_change_percentage_24h-

b.price_change_percentage_24h

)

.slice(0,5);


topGainersList.innerHTML="";

topLosersList.innerHTML="";


gainers.forEach(

coin=>{

topGainersList.innerHTML+=`

<div class="market-mover">

<div>

<strong>${coin.symbol.toUpperCase()}</strong>

<span>${coin.name}</span>

</div>

<div class="market-positive">

+${coin.price_change_percentage_24h.toFixed(2)}%

</div>

</div>

`;

}

);


losers.forEach(

coin=>{

topLosersList.innerHTML+=`

<div class="market-mover">

<div>

<strong>${coin.symbol.toUpperCase()}</strong>

<span>${coin.name}</span>

</div>

<div class="market-negative">

${coin.price_change_percentage_24h.toFixed(2)}%

</div>

</div>

`;

}

);

}catch(error){

console.error(error);

}

}


loadTopMovers();

setInterval(

loadTopMovers,

120000

);

/* =====================================================
   SMART MONEY RADAR
===================================================== */

const smartMoneyRefresh =
document.getElementById(
"smartMoneyRefresh"
);

const smartMoneyValue =
document.getElementById(
"smartMoneyValue"
);

const smartMoneyTitle =
document.getElementById(
"smartMoneyTitle"
);

const smartMoneyText =
document.getElementById(
"smartMoneyText"
);


const smartMoneyScenarios=[

{

score:81,

title:
"Institutions remain active.",

text:
"Whale accumulation and exchange withdrawals continue supporting long-term positive market structure."

},

{

score:63,

title:
"Institutional activity is neutral.",

text:
"Large investors remain active but without aggressive positioning."

},

{

score:42,

title:
"Institutions are reducing exposure.",

text:
"Capital preservation behavior is increasing while liquidity slows."

}

];


if(smartMoneyRefresh){

smartMoneyRefresh.addEventListener(

"click",

()=>{

const scenario=

smartMoneyScenarios[

Math.floor(

Math.random()*

smartMoneyScenarios.length

)

];

smartMoneyValue.textContent=

scenario.score;

smartMoneyTitle.textContent=

scenario.title;

smartMoneyText.textContent=

scenario.text;

smartMoneyRefresh.disabled=true;

smartMoneyRefresh.textContent=

"Updating...";

setTimeout(()=>{

smartMoneyRefresh.disabled=false;

smartMoneyRefresh.textContent=

"Refresh Radar";

},1200);

}

);

}

/* =====================================================
   LIQUIDITY PRESSURE INDEX
===================================================== */

const liquidityPressureRing =
    document.getElementById(
        "liquidityPressureRing"
    );

const liquidityPressureValue =
    document.getElementById(
        "liquidityPressureValue"
    );

const liquidityPressureCondition =
    document.getElementById(
        "liquidityPressureCondition"
    );

const liquidityPressureDescription =
    document.getElementById(
        "liquidityPressureDescription"
    );

const liquidityGlobalValue =
    document.getElementById(
        "liquidityGlobalValue"
    );

const liquidityGlobalProgress =
    document.getElementById(
        "liquidityGlobalProgress"
    );

const liquidityStablecoinValue =
    document.getElementById(
        "liquidityStablecoinValue"
    );

const liquidityStablecoinProgress =
    document.getElementById(
        "liquidityStablecoinProgress"
    );

const liquidityExchangeValue =
    document.getElementById(
        "liquidityExchangeValue"
    );

const liquidityExchangeProgress =
    document.getElementById(
        "liquidityExchangeProgress"
    );

const liquidityParticipationValue =
    document.getElementById(
        "liquidityParticipationValue"
    );

const liquidityParticipationProgress =
    document.getElementById(
        "liquidityParticipationProgress"
    );

const liquidityPressureTitle =
    document.getElementById(
        "liquidityPressureTitle"
    );

const liquidityPressureText =
    document.getElementById(
        "liquidityPressureText"
    );

const liquidityPressureDirection =
    document.getElementById(
        "liquidityPressureDirection"
    );

const liquidityPressureStrength =
    document.getElementById(
        "liquidityPressureStrength"
    );

const liquidityPressureImpact =
    document.getElementById(
        "liquidityPressureImpact"
    );

const liquidityPressureRefresh =
    document.getElementById(
        "liquidityPressureRefresh"
    );


function clampLiquidityValue(value) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(value)
        )
    );

}


function updateLiquidityComponent(
    valueElement,
    progressElement,
    value
) {

    const safeValue =
        clampLiquidityValue(value);


    if (valueElement) {
        valueElement.textContent =
            safeValue;
    }


    if (progressElement) {

        progressElement.style.setProperty(
            "--liquidity-component-value",
            `${safeValue}%`
        );

    }

}


function calculateLiquidityPressure() {

    const marketChange =
        typeof latestOceanMarketChange === "number"
            ? latestOceanMarketChange
            : 0;


    const sentiment =
        typeof latestOceanFearGreed === "number"
            ? latestOceanFearGreed
            : 50;


    const globalFlow =
        clampLiquidityValue(
            50 +
            marketChange * 10
        );


    const stablecoinCapacity =
        clampLiquidityValue(
            42 +
            sentiment * 0.45
        );


    const exchangeFlow =
        clampLiquidityValue(
            55 +
            marketChange * 6 +
            sentiment * 0.12
        );


    const participation =
        clampLiquidityValue(
            45 +
            sentiment * 0.35 +
            Math.max(
                marketChange,
                0
            ) * 5
        );


    const total =
        clampLiquidityValue(
            globalFlow * 0.3 +
            stablecoinCapacity * 0.25 +
            exchangeFlow * 0.25 +
            participation * 0.2
        );


    return {
        globalFlow,
        stablecoinCapacity,
        exchangeFlow,
        participation,
        total
    };

}


function getLiquidityInterpretation(score) {

    if (score >= 80) {

        return {
            condition:
                "Strong Inflow",

            title:
                "Liquidity pressure is strongly positive.",

            text:
                "Capital availability, market participation and exchange " +
                "flow are aligned positively. Risk assets may benefit from " +
                "stronger purchasing capacity.",

            direction:
                "Inflow",

            strength:
                "Very High",

            impact:
                "Strong Positive"
        };

    }


    if (score >= 65) {

        return {
            condition:
                "Positive Inflow",

            title:
                "Liquidity conditions remain supportive.",

            text:
                "Capital availability and market participation remain positive. " +
                "Liquidity pressure supports the broader market structure.",

            direction:
                "Inflow",

            strength:
                "High",

            impact:
                "Positive"
        };

    }


    if (score >= 45) {

        return {
            condition:
                "Balanced",

            title:
                "Liquidity pressure is currently balanced.",

            text:
                "Capital inflows and outflows remain relatively neutral. " +
                "The market lacks a strong liquidity direction.",

            direction:
                "Neutral",

            strength:
                "Moderate",

            impact:
                "Neutral"
        };

    }


    if (score >= 25) {

        return {
            condition:
                "Negative Outflow",

            title:
                "Liquidity pressure is weakening.",

            text:
                "Capital availability and market participation are declining. " +
                "Risk assets may face increased selling sensitivity.",

            direction:
                "Outflow",

            strength:
                "High",

            impact:
                "Negative"
        };

    }


    return {
        condition:
            "Severe Outflow",

        title:
            "Liquidity conditions show severe contraction.",

        text:
            "Capital is leaving risk markets while purchasing capacity and " +
            "participation continue declining.",

        direction:
            "Outflow",

        strength:
            "Very High",

        impact:
            "Strong Negative"
    };

}


function renderLiquidityPressure() {

    const liquidity =
        calculateLiquidityPressure();


    const interpretation =
        getLiquidityInterpretation(
            liquidity.total
        );


    if (liquidityPressureRing) {

        liquidityPressureRing.style.setProperty(
            "--liquidity-pressure-value",
            `${liquidity.total}%`
        );

    }


    if (liquidityPressureValue) {
        liquidityPressureValue.textContent =
            liquidity.total;
    }


    updateLiquidityComponent(
        liquidityGlobalValue,
        liquidityGlobalProgress,
        liquidity.globalFlow
    );


    updateLiquidityComponent(
        liquidityStablecoinValue,
        liquidityStablecoinProgress,
        liquidity.stablecoinCapacity
    );


    updateLiquidityComponent(
        liquidityExchangeValue,
        liquidityExchangeProgress,
        liquidity.exchangeFlow
    );


    updateLiquidityComponent(
        liquidityParticipationValue,
        liquidityParticipationProgress,
        liquidity.participation
    );


    if (liquidityPressureCondition) {
        liquidityPressureCondition.textContent =
            interpretation.condition;
    }


    if (liquidityPressureDescription) {
        liquidityPressureDescription.textContent =
            interpretation.text;
    }


    if (liquidityPressureTitle) {
        liquidityPressureTitle.textContent =
            interpretation.title;
    }


    if (liquidityPressureText) {
        liquidityPressureText.textContent =
            interpretation.text;
    }


    if (liquidityPressureDirection) {
        liquidityPressureDirection.textContent =
            interpretation.direction;
    }


    if (liquidityPressureStrength) {
        liquidityPressureStrength.textContent =
            interpretation.strength;
    }


    if (liquidityPressureImpact) {
        liquidityPressureImpact.textContent =
            interpretation.impact;
    }

}


if (liquidityPressureRefresh) {

    liquidityPressureRefresh.addEventListener(
        "click",
        () => {

            liquidityPressureRefresh.disabled =
                true;

            liquidityPressureRefresh.textContent =
                "↻ Calculating...";


            renderLiquidityPressure();


            setTimeout(() => {

                liquidityPressureRefresh.textContent =
                    "✓ LPI Updated";

            }, 550);


            setTimeout(() => {

                liquidityPressureRefresh.textContent =
                    "↻ Recalculate LPI";

                liquidityPressureRefresh.disabled =
                    false;

            }, 1500);

        }
    );

}