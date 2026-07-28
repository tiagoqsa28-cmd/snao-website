/* =====================================================
   SNAO WHITEPAPER
===================================================== */

const whitepaperSections =
    document.querySelectorAll(
        ".whitepaper-content section[id]"
    );

const whitepaperSidebarLinks =
    document.querySelectorAll(
        ".whitepaper-sidebar a[href^='#']"
    );


if (
    whitepaperSections.length &&
    whitepaperSidebarLinks.length
) {

    const whitepaperObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    whitepaperSidebarLinks.forEach(
                        (link) => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute(
                                    "href"
                                ) ===
                                `#${entry.target.id}`
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


    whitepaperSections.forEach(
        (section) => {

            whitepaperObserver.observe(
                section
            );

        }
    );

}

/* =====================================================
   CURRENT YEAR
===================================================== */

const whitepaperCurrentYear =
    document.getElementById(
        "whitepaperCurrentYear"
    );


if (whitepaperCurrentYear) {

    whitepaperCurrentYear.textContent =
        new Date().getFullYear();

}