/* =====================================================
   ABOUT SNAO — INTERACTIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        `
        .about-section-heading,
        .about-mission-main,
        .about-mission-principles article,
        .about-vision-core,
        .about-vision-node,
        .about-vision-principles article,
        .about-why-problems article,
        .about-why-solution,
        .about-why-statement,
        .about-intelligence-grid article,
        .about-timeline article,
        .about-founder-quote,
        .about-community-grid article,
        .about-community-banner,
        .about-future-card,
        .about-future-cta,
        .about-footer
        `
    );

    animatedElements.forEach((element) => {
    element.classList.add("about-reveal");
});

if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((element) => {
        element.classList.add("about-visible");
    });

    return;
}

const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("about-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );


    animatedElements.forEach((element) => {
        revealObserver.observe(element);
    });

});