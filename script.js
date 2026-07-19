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
        ".feature-card",
        ".terminal",
        ".network-map",
        ".roadmap-card",
        ".product-card",
        ".final-cta .cta-content"
    ].join(",")
);

revealElements.forEach((element) => {

    element.classList.add("reveal");

});

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


// =====================================================
// STAGGERED CARD DELAYS
// =====================================================

const staggerGroups = [
    ".feature-card",
    ".roadmap-card",
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
// SUBTLE HERO PARALLAX
// =====================================================

const heroVisual = document.querySelector(
    ".hero-visual"
);

if (heroVisual) {

    window.addEventListener(
        "mousemove",
        (event) => {

            if (window.innerWidth <= 1080) {
                heroVisual.style.transform = "";
                return;
            }

            const x =
                (event.clientX / window.innerWidth - 0.5) * 12;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 12;

            heroVisual.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;

        },
        { passive: true }
    );

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