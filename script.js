// =====================================================
// SNAO.WORLD — SCRIPT V2
// =====================================================

"use strict";


// =====================================================
// ELEMENTS
// =====================================================

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("main section[id]");
const cursorGlow = document.querySelector(".cursor-glow");
const metricFills = document.querySelectorAll(".metric-fill");


// =====================================================
// MOBILE MENU
// =====================================================

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

    document.addEventListener("click", (event) => {

        const clickedInsideMenu =
            mainNav.contains(event.target) ||
            menuToggle.contains(event.target);

        if (!clickedInsideMenu) {

            mainNav.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


// =====================================================
// SCROLL REVEAL
// =====================================================

const revealElements = document.querySelectorAll(
    [
        ".section-heading",
        ".intelligence-module-card",
        ".ocean-terminal",
        ".ecosystem-network",
        ".roadmap-phase",
        ".product-card",
        ".token-quick-nav",
        ".snao-purchase-panel",
        ".snao-token-status-panel",
        ".tokenomics-layout",
        ".snao-faq-layout",
        ".final-cta .community-content",
        ".premium-footer"
    ].join(",")
);

revealElements.forEach((element) => {

    element.classList.add("reveal");

});

if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        });

    },
    {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
    }
);

revealElements.forEach((element) => {

    revealObserver.observe(element);

});

}


// =====================================================
// STAGGERED CARD DELAYS
// =====================================================

const staggerGroups = [
    ".intelligence-module-card",
    ".roadmap-phase",
    ".product-card"
];

staggerGroups.forEach((selector) => {

    document
        .querySelectorAll(selector)
        .forEach((element, index) => {

            element.style.transitionDelay =
                `${Math.min(index * 80, 480)}ms`;

        });

});


// =====================================================
// METRIC BAR ANIMATION
// =====================================================

const dashboardSection = document.querySelector(
    ".dashboard-section"
);

if (dashboardSection && metricFills.length) {

    const dashboardObserver = new IntersectionObserver(
        (entries, observer) => {

            const entry = entries[0];

            if (!entry.isIntersecting) {
                return;
            }

            metricFills.forEach((fill, index) => {

                const targetWidth = getComputedStyle(fill)
                    .getPropertyValue("--target-width")
                    .trim();

                window.setTimeout(() => {

                    fill.style.width = targetWidth;

                }, 180 + index * 160);

            });

            observer.unobserve(entry.target);

        },
        {
            threshold: 0.28
        }
    );

    dashboardObserver.observe(dashboardSection);

}


// =====================================================
// ACTIVE NAVIGATION
// =====================================================

function updateActiveNavigation() {

    const scrollPosition = window.scrollY + 150;

    let currentId = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;
        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {
            currentId = section.id;
        }

    });

    navLinks.forEach((link) => {

        const targetId = link
            .getAttribute("href")
            ?.replace("#", "");

        link.classList.toggle(
            "active",
            targetId === currentId
        );

    });

}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

window.addEventListener(
    "load",
    updateActiveNavigation
);


// =====================================================
// CURSOR GLOW
// =====================================================

if (cursorGlow) {

    let cursorX = 0;
    let cursorY = 0;

    let glowX = 0;
    let glowY = 0;

    document.addEventListener(
        "mousemove",
        (event) => {

            cursorX = event.clientX;
            cursorY = event.clientY;

        },
        { passive: true }
    );

    function animateCursorGlow() {

        glowX += (cursorX - glowX) * 0.12;
        glowY += (cursorY - glowY) * 0.12;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        window.requestAnimationFrame(
            animateCursorGlow
        );

    }

    animateCursorGlow();

}


// =====================================================
// ACCESSIBILITY: ESC CLOSES MOBILE MENU
// =====================================================

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }

    if (!mainNav || !menuToggle) {
        return;
    }

    mainNav.classList.remove("open");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

});


// =====================================================
// SAFETY FOR PLACEHOLDER LINKS
// =====================================================

document
    .querySelectorAll('a[href="#"]')
    .forEach((link) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

        });

    });


/* =====================================================
   SNAO — OCEAN PARTICLES
===================================================== */

const oceanCanvas = document.getElementById("oceanParticleCanvas");

if (oceanCanvas) {
    const oceanContext = oceanCanvas.getContext("2d");

    let oceanParticles = [];
    let oceanAnimationFrame;

    function resizeOceanCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const bounds = oceanCanvas.getBoundingClientRect();

        oceanCanvas.width = bounds.width * pixelRatio;
        oceanCanvas.height = bounds.height * pixelRatio;

        oceanContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createOceanParticles(bounds.width, bounds.height);
    }

    function createOceanParticles(width, height) {
        const particleCount = Math.min(
            95,
            Math.max(40, Math.floor(width / 15))
        );

        oceanParticles = Array.from(
            { length: particleCount },
            () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.4,
                speedY: Math.random() * 0.25 + 0.08,
                speedX: Math.random() * 0.14 - 0.07,
                opacity: Math.random() * 0.42 + 0.08,
                pulse: Math.random() * Math.PI * 2
            })
        );
    }

    function animateOceanParticles() {
        const width = oceanCanvas.clientWidth;
        const height = oceanCanvas.clientHeight;

        oceanContext.clearRect(0, 0, width, height);

        oceanParticles.forEach((particle) => {
            particle.y -= particle.speedY;
            particle.x += particle.speedX;
            particle.pulse += 0.015;

            if (particle.y < -10) {
                particle.y = height + 10;
                particle.x = Math.random() * width;
            }

            if (particle.x < -10) {
                particle.x = width + 10;
            }

            if (particle.x > width + 10) {
                particle.x = -10;
            }

            const currentOpacity =
                particle.opacity +
                Math.sin(particle.pulse) * 0.08;

            oceanContext.beginPath();

            oceanContext.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            oceanContext.fillStyle =
                `rgba(60, 220, 255, ${Math.max(0.03, currentOpacity)})`;

            oceanContext.shadowBlur = 8;
            oceanContext.shadowColor = "rgba(0, 207, 255, 0.45)";

            oceanContext.fill();
        });

        oceanContext.shadowBlur = 0;

        oceanAnimationFrame =
            requestAnimationFrame(animateOceanParticles);
    }

    resizeOceanCanvas();
    animateOceanParticles();

    window.addEventListener("resize", resizeOceanCanvas);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(oceanAnimationFrame);
        } else {
            animateOceanParticles();
        }
    });
}

/* =====================================================
   HERO — INTERACTIVE DEPTH EFFECT
===================================================== */

const heroSection = document.querySelector(".hero-cinematic");
const heroVisual = document.querySelector(".hero-intelligence-visual");
const oceanScene = document.querySelector(".hero-ocean-scene");

if (heroSection && heroVisual && oceanScene) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    heroSection.addEventListener("mousemove", (event) => {

        const rect = heroSection.getBoundingClientRect();

        const mouseX =
            (event.clientX - rect.left) / rect.width - 0.5;

        const mouseY =
            (event.clientY - rect.top) / rect.height - 0.5;

        targetX = mouseX;
        targetY = mouseY;

    });

    heroSection.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
    });

    function animateHeroDepth() {

        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;

        heroVisual.style.setProperty(
            "--hero-depth-x",
            `${currentX * 16}px`
        );

        heroVisual.style.setProperty(
            "--hero-depth-y",
            `${currentY * 12}px`
        );

        oceanScene.style.setProperty(
            "--ocean-depth-x",
            `${currentX * -10}px`
        );

        oceanScene.style.setProperty(
            "--ocean-depth-y",
            `${currentY * -7}px`
        );

        requestAnimationFrame(animateHeroDepth);

    }

    animateHeroDepth();
}

/* =====================================================
   OCEAN TERMINAL — DEMONSTRATION INTERACTIONS
===================================================== */

const terminalAiSummary =
    document.getElementById("terminalAiSummary");

const terminalPromptButtons =
    document.querySelectorAll("[data-terminal-prompt]");

const terminalSummaries = {
    market:
        "The market is showing moderately bullish conditions. " +
        "Liquidity has improved, Bitcoin remains dominant and " +
        "risk appetite is increasing without reaching extreme levels.",

    whales:
        "Large-wallet activity is above the recent average. " +
        "Most detected movements are concentrated in Bitcoin, " +
        "Ethereum and major stablecoins.",

    risk:
        "Current market risk is moderate. Short-term volatility " +
        "may increase, but liquidity and sentiment conditions " +
        "remain controlled."
};

terminalPromptButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const prompt =
            button.dataset.terminalPrompt;

        if (
            terminalAiSummary &&
            terminalSummaries[prompt]
        ) {
            terminalAiSummary.style.opacity = "0";

            setTimeout(() => {
                terminalAiSummary.textContent =
                    terminalSummaries[prompt];

                terminalAiSummary.style.opacity = "1";
            }, 220);
        }

    });

});


/* Pequena variação visual dos preços demonstrativos */

const terminalPriceElements = [
    document.getElementById("terminalBtcPrice"),
    document.getElementById("terminalEthPrice"),
    document.getElementById("terminalBnbPrice")
];

const terminalBasePrices = [
    68420,
    3780,
    612
];

function updateTerminalDemoPrices() {

    terminalPriceElements.forEach(
        (element, index) => {

            if (!element) {
                return;
            }

            const variation =
                (Math.random() - 0.5) *
                terminalBasePrices[index] *
                0.0012;

            const updatedPrice =
                terminalBasePrices[index] +
                variation;

            element.textContent =
                "$" +
                updatedPrice.toLocaleString(
                    "en-US",
                    {
                        maximumFractionDigits:
                            index === 2 ? 2 : 0
                    }
                );
        }
    );

}

setInterval(
    updateTerminalDemoPrices,
    4500
);

/* =====================================================
   SNAO FAQ ACCORDION
===================================================== */

const snaoFaqItems =
    document.querySelectorAll(".snao-faq-item");

function openSnaoFaqItem(item) {

    const question =
        item.querySelector(".snao-faq-question");

    const answer =
        item.querySelector(".snao-faq-answer");

    item.classList.add("active");

    if (question) {
        question.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    if (answer) {
        answer.style.maxHeight =
            answer.scrollHeight + "px";
    }

}

function closeSnaoFaqItem(item) {

    const question =
        item.querySelector(".snao-faq-question");

    const answer =
        item.querySelector(".snao-faq-answer");

    item.classList.remove("active");

    if (question) {
        question.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (answer) {
        answer.style.maxHeight = "0px";
    }

}

snaoFaqItems.forEach((item) => {

    const question =
        item.querySelector(".snao-faq-question");

    if (!question) {
        return;
    }

    question.addEventListener("click", () => {

        const isActive =
            item.classList.contains("active");

        snaoFaqItems.forEach(
            closeSnaoFaqItem
        );

        if (!isActive) {
            openSnaoFaqItem(item);
        }

    });

});


const initialOpenFaq =
    document.querySelector(
        ".snao-faq-item.active"
    );

if (initialOpenFaq) {
    openSnaoFaqItem(initialOpenFaq);
}


window.addEventListener("resize", () => {

    const activeFaq =
        document.querySelector(
            ".snao-faq-item.active"
        );

    if (activeFaq) {
        openSnaoFaqItem(activeFaq);
    }

});

/* =====================================================
   FOOTER LEGAL MODAL
===================================================== */

const footerLegalModal =
    document.getElementById("footerLegalModal");

const footerLegalTitle =
    document.getElementById("footerLegalTitle");

const footerLegalContent =
    document.getElementById("footerLegalContent");

const footerLegalButtons =
    document.querySelectorAll("[data-footer-modal]");

const footerLegalClose =
    document.querySelector(".footer-legal-close");

const footerLegalBackdrop =
    document.querySelector(".footer-legal-backdrop");


const footerLegalInformation = {

    risk: {
        title: "Risk Disclaimer",

        content: `
            <p>
                Cryptocurrency assets involve substantial risk, including
                price volatility, liquidity risk and possible loss of capital.
                Information presented on SNAO.world is educational and
                informational and should not be interpreted as financial advice.
            </p>

            <p>
                Demonstration dashboards, simulated metrics and future product
                descriptions do not guarantee market performance, token value
                or investment returns.
            </p>

            <p>
                Always conduct independent research and consult qualified
                professionals before making financial decisions.
            </p>
        `
    },


    privacy: {
        title: "Privacy",

        content: `
            <p>
                SNAO.world currently operates primarily as an informational
                website. The project may collect limited technical information
                required for website security, performance and functionality.
            </p>

            <p>
                Future platform services, accounts, wallet connections and
                subscriptions will be accompanied by a complete privacy policy
                describing how information is collected, stored and used.
            </p>
        `
    },


    terms: {
        title: "Terms of Use",

        content: `
            <p>
                By using SNAO.world, users acknowledge that the ecosystem is
                under active development and that planned features, tokenomics,
                launch dates and utilities may change before official release.
            </p>

            <p>
                No unofficial contract, purchase offer or private message should
                be considered authorized unless confirmed through SNAO.world
                and the official SNAO communication channels.
            </p>
        `
    }

};


function openFooterLegalModal(type) {

    const information =
        footerLegalInformation[type];

    if (
        !footerLegalModal ||
        !footerLegalTitle ||
        !footerLegalContent ||
        !information
    ) {
        return;
    }

    footerLegalTitle.textContent =
        information.title;

    footerLegalContent.innerHTML =
        information.content;

    footerLegalModal.classList.add("active");

    footerLegalModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closeFooterLegalModal() {

    if (!footerLegalModal) {
        return;
    }

    footerLegalModal.classList.remove("active");

    footerLegalModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


footerLegalButtons.forEach((button) => {

    button.addEventListener("click", () => {

        openFooterLegalModal(
            button.dataset.footerModal
        );

    });

});


if (footerLegalClose) {
    footerLegalClose.addEventListener(
        "click",
        closeFooterLegalModal
    );
}


if (footerLegalBackdrop) {
    footerLegalBackdrop.addEventListener(
        "click",
        closeFooterLegalModal
    );
}


document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        footerLegalModal &&
        footerLegalModal.classList.contains("active")
    ) {
        closeFooterLegalModal();
    }

});

/* =====================================================
   LIVE OCEAN ACTIVITY
===================================================== */

const oceanTotalVisitors =
    document.getElementById("oceanTotalVisitors");

const oceanOnlineNow =
    document.getElementById("oceanOnlineNow");

const oceanActivityStatus =
    document.getElementById("oceanActivityStatus");


function getOceanVisitorId() {

    const storageKey = "snao_ocean_visitor_id";

    let visitorId =
        localStorage.getItem(storageKey);

    if (!visitorId) {

        visitorId =
            crypto.randomUUID
                ? crypto.randomUUID()
                : `visitor-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}`;

        localStorage.setItem(
            storageKey,
            visitorId
        );

    }

    return visitorId;

}


async function updateOceanActivity() {

    if (
        !oceanTotalVisitors ||
        !oceanOnlineNow
    ) {
        return;
    }

    try {

        const response = await fetch(
            "/api/ocean-activity",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    visitorId:
                        getOceanVisitorId()
                }),
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `Ocean activity request failed: ${response.status}`
            );
        }

        const data =
            await response.json();

        oceanTotalVisitors.textContent =
            Number(
                data.totalVisitors || 0
            ).toLocaleString("en-US");

        oceanOnlineNow.textContent =
            Number(
                data.onlineNow || 0
            ).toLocaleString("en-US");

        if (oceanActivityStatus) {
            oceanActivityStatus.textContent =
                "Ocean activity connected";
        }

    } catch (error) {

        console.error(
            "Unable to update Ocean activity:",
            error
        );

        if (oceanActivityStatus) {
            oceanActivityStatus.textContent =
                "Activity temporarily unavailable";
        }

    }

}


updateOceanActivity();

setInterval(
    updateOceanActivity,
    60 * 1000
);