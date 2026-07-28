/* =====================================================
   SNAO TOKEN PAGE
===================================================== */

const tokenMenuButton =
    document.getElementById(
        "tokenMenuButton"
    );

const tokenMobileMenu =
    document.getElementById(
        "tokenMobileMenu"
    );


if (
    tokenMenuButton &&
    tokenMobileMenu
) {

    tokenMenuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                tokenMobileMenu.classList.toggle(
                    "open"
                );

            tokenMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    tokenMobileMenu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    tokenMobileMenu.classList.remove(
                        "open"
                    );

                    tokenMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}

/* =====================================================
   TOKEN ALLOCATION
===================================================== */

const tokenAllocationItems =
    document.querySelectorAll(
        "[data-token-allocation]"
    );

const allocationDetailTitle =
    document.getElementById(
        "allocationDetailTitle"
    );

const allocationDetailPercentage =
    document.getElementById(
        "allocationDetailPercentage"
    );

const allocationDetailText =
    document.getElementById(
        "allocationDetailText"
    );

const allocationInitialUnlock =
    document.getElementById(
        "allocationInitialUnlock"
    );

const allocationVesting =
    document.getElementById(
        "allocationVesting"
    );

const allocationPurpose =
    document.getElementById(
        "allocationPurpose"
    );


const tokenAllocationDatabase = {

    founder: {
        title:
            "Founder & Core Development",

        percentage:
            "25% · 50,000,000 $SNAO",

        text:
            "Reserved for the founder and the continuous development " +
            "of the SNAO ecosystem. Most of this allocation will follow " +
            "long-term locking and gradual vesting rules.",

        unlock:
            "Limited",

        vesting:
            "Long Term",

        purpose:
            "Development"
    },

    treasury: {
        title:
            "Ecosystem Treasury",

        percentage:
            "20% · 40,000,000 $SNAO",

        text:
            "Reserved for future ecosystem operations, platform expansion, " +
            "new products, infrastructure and strategic opportunities.",

        unlock:
            "Controlled",

        vesting:
            "Progressive",

        purpose:
            "Ecosystem Growth"
    },

    public: {
        title:
            "Public Sale",

        percentage:
            "20% · 40,000,000 $SNAO",

        text:
            "Allocated for public access through initial and future sales. " +
            "Distribution may occur in controlled phases to protect liquidity.",

        unlock:
            "Phased",

        vesting:
            "Sale Based",

        purpose:
            "Public Distribution"
    },

    liquidity: {
        title:
            "Liquidity",

        percentage:
            "15% · 30,000,000 $SNAO",

        text:
            "Dedicated to decentralized exchange liquidity, future listings " +
            "and maintaining healthier trading conditions.",

        unlock:
            "Launch Based",

        vesting:
            "Operational",

        purpose:
            "Market Liquidity"
    },

    marketing: {
        title:
            "Marketing & Community Growth",

        percentage:
            "10% · 20,000,000 $SNAO",

        text:
            "Used for global promotion, campaigns, community expansion, " +
            "content production and user acquisition.",

        unlock:
            "Controlled",

        vesting:
            "Campaign Based",

        purpose:
            "Growth"
    },

    partnerships: {
        title:
            "Partnerships",

        percentage:
            "5% · 10,000,000 $SNAO",

        text:
            "Reserved for integrations, exchanges, strategic collaborations " +
            "and future ecosystem partnerships.",

        unlock:
            "Milestone Based",

        vesting:
            "Agreement Based",

        purpose:
            "Partnerships"
    },

    advisors: {
        title:
            "Advisors & Specialists",

        percentage:
            "5% · 10,000,000 $SNAO",

        text:
            "Reserved for technical, legal, financial and strategic specialists " +
            "who support the long-term development of the project.",

        unlock:
            "Limited",

        vesting:
            "Milestone Based",

        purpose:
            "Specialist Support"
    }

};


function selectTokenAllocation(allocationId) {

    const allocation =
        tokenAllocationDatabase[
            allocationId
        ];

    if (!allocation) {
        return;
    }


    tokenAllocationItems.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset
                    .tokenAllocation ===
                    allocationId
            );

        }
    );


    if (allocationDetailText) {
        allocationDetailText.style.opacity =
            "0";
    }


    setTimeout(() => {

        if (allocationDetailTitle) {
            allocationDetailTitle.textContent =
                allocation.title;
        }

        if (allocationDetailPercentage) {
            allocationDetailPercentage.textContent =
                allocation.percentage;
        }

        if (allocationDetailText) {

            allocationDetailText.textContent =
                allocation.text;

            allocationDetailText.style.opacity =
                "1";
        }

        if (allocationInitialUnlock) {
            allocationInitialUnlock.textContent =
                allocation.unlock;
        }

        if (allocationVesting) {
            allocationVesting.textContent =
                allocation.vesting;
        }

        if (allocationPurpose) {
            allocationPurpose.textContent =
                allocation.purpose;
        }

    }, 180);

}


tokenAllocationItems.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            selectTokenAllocation(
                item.dataset
                    .tokenAllocation
            );

        }
    );

});

/* =====================================================
   VESTING & UNLOCK SCHEDULE
===================================================== */

const tokenVestingSteps =
    document.querySelectorAll(
        "[data-vesting-step]"
    );

const vestingDetailTitle =
    document.getElementById(
        "vestingDetailTitle"
    );

const vestingDetailPeriod =
    document.getElementById(
        "vestingDetailPeriod"
    );

const vestingDetailText =
    document.getElementById(
        "vestingDetailText"
    );

const vestingReleaseType =
    document.getElementById(
        "vestingReleaseType"
    );

const vestingSupplyImpact =
    document.getElementById(
        "vestingSupplyImpact"
    );

const vestingPrimaryGoal =
    document.getElementById(
        "vestingPrimaryGoal"
    );

const vestingVisualLine =
    document.querySelector(
        ".vesting-visual-line span"
    );


const tokenVestingDatabase = {

    launch: {
        title:
            "Controlled Initial Circulation",

        period:
            "Launch Phase",

        text:
            "Initial circulation remains limited to support liquidity, " +
            "public access and essential market operations without releasing " +
            "the majority of long-term allocations.",

        release:
            "Controlled",

        impact:
            "Limited",

        goal:
            "Market Stability",

        position:
            "8%"
    },

    cliff: {
        title:
            "Founder Allocation Cliff",

        period:
            "Initial Locking Period",

        text:
            "Most founder tokens remain locked during the initial project " +
            "development and market-building phase to reduce sudden supply pressure.",

        release:
            "Locked",

        impact:
            "Minimal",

        goal:
            "Long-Term Alignment",

        position:
            "34%"
    },

    unlock: {
        title:
            "Monthly Vesting",

        period:
            "Progressive Unlock Phase",

        text:
            "Eligible allocations may be released gradually through monthly " +
            "vesting schedules, milestone conditions and transparent unlock events.",

        release:
            "Gradual",

        impact:
            "Controlled",

        goal:
            "Predictable Supply",

        position:
            "67%"
    },

    maturity: {
        title:
            "Full Ecosystem Maturity",

        period:
            "Long-Term Completion",

        text:
            "The token supply becomes progressively available as the ecosystem, " +
            "liquidity, products, partnerships and revenue infrastructure mature.",

        release:
            "Complete",

        impact:
            "Market Dependent",

        goal:
            "Ecosystem Expansion",

        position:
            "100%"
    }

};


function selectTokenVestingStep(stepId) {

    const step =
        tokenVestingDatabase[
            stepId
        ];

    if (!step) {
        return;
    }


    tokenVestingSteps.forEach(
        (item) => {

            item.classList.toggle(
                "active",
                item.dataset.vestingStep ===
                    stepId
            );

        }
    );


    if (vestingDetailText) {
        vestingDetailText.style.opacity =
            "0";
    }


    if (vestingVisualLine) {

        vestingVisualLine.style.setProperty(
            "--vesting-position",
            step.position
        );

    }


    setTimeout(() => {

        if (vestingDetailTitle) {
            vestingDetailTitle.textContent =
                step.title;
        }

        if (vestingDetailPeriod) {
            vestingDetailPeriod.textContent =
                step.period;
        }

        if (vestingDetailText) {

            vestingDetailText.textContent =
                step.text;

            vestingDetailText.style.opacity =
                "1";
        }

        if (vestingReleaseType) {
            vestingReleaseType.textContent =
                step.release;
        }

        if (vestingSupplyImpact) {
            vestingSupplyImpact.textContent =
                step.impact;
        }

        if (vestingPrimaryGoal) {
            vestingPrimaryGoal.textContent =
                step.goal;
        }

    }, 180);

}


tokenVestingSteps.forEach((item) => {

    item.addEventListener(
        "click",
        () => {

            selectTokenVestingStep(
                item.dataset.vestingStep
            );

        }
    );

});

/* =====================================================
   TOKEN FAQ
===================================================== */

const tokenFaqItems =
    document.querySelectorAll(
        ".token-faq-item"
    );


tokenFaqItems.forEach((item) => {

    const question =
        item.querySelector(
            ".token-faq-question"
        );

    const answer =
        item.querySelector(
            ".token-faq-answer"
        );


    if (
        !question ||
        !answer
    ) {
        return;
    }


    question.addEventListener(
        "click",
        () => {

            const isOpen =
                item.classList.contains(
                    "open"
                );


            tokenFaqItems.forEach(
                (currentItem) => {

                    currentItem.classList.remove(
                        "open"
                    );

                    const currentQuestion =
                        currentItem.querySelector(
                            ".token-faq-question"
                        );

                    const currentAnswer =
                        currentItem.querySelector(
                            ".token-faq-answer"
                        );


                    if (currentQuestion) {

                        currentQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }


                    if (currentAnswer) {

                        currentAnswer.style.maxHeight =
                            null;

                    }

                }
            );


            if (!isOpen) {

                item.classList.add(
                    "open"
                );

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

                answer.style.maxHeight =
                    `${answer.scrollHeight}px`;

            }

        }
    );

});


/* =====================================================
   CURRENT YEAR
===================================================== */

const tokenCurrentYear =
    document.getElementById(
        "tokenCurrentYear"
    );


if (tokenCurrentYear) {

    tokenCurrentYear.textContent =
        new Date().getFullYear();

}