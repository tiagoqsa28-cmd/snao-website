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
        () => {

            terminalRefreshButton.textContent =
                "↻ Updating...";

            updateTerminalClock();

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
   DEMONSTRATION PRICES
===================================================== */

const terminalPriceConfiguration = [

    {
        element:
            document.getElementById(
                "btcTerminalPrice"
            ),

        basePrice: 68420,

        decimals: 0
    },

    {
        element:
            document.getElementById(
                "ethTerminalPrice"
            ),

        basePrice: 3780,

        decimals: 0
    },

    {
        element:
            document.getElementById(
                "bnbTerminalPrice"
            ),

        basePrice: 612,

        decimals: 2
    }

];


function updateTerminalPrices() {

    terminalPriceConfiguration.forEach(
        (configuration) => {

            if (!configuration.element) {
                return;
            }

            const variation =
                (
                    Math.random() -
                    0.5
                ) *
                configuration.basePrice *
                0.0014;

            const updatedPrice =
                configuration.basePrice +
                variation;

            configuration.element.textContent =
                "$" +
                updatedPrice.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits:
                            configuration.decimals,

                        maximumFractionDigits:
                            configuration.decimals
                    }
                );

        }
    );

}

updateTerminalPrices();

setInterval(
    updateTerminalPrices,
    4200
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