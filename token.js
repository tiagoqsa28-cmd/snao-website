/* =====================================================
   SNAO TOKEN PAGE
===================================================== */


/* =====================================================
   MOBILE MENU
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


/* =====================================================
   OFFICIAL SNAO TOKEN ALLOCATION
   TOTAL SUPPLY: 200,000,000 SNAO
===================================================== */

const tokenAllocationDatabase = {

    founder: {
        title:
            "Founder",

        percentage:
            "13% · 26,000,000 $SNAO",

        text:
            "Founder allocation subject to long-term vesting, " +
            "with no tokens unlocked at TGE.",

        unlock:
            "0% at TGE",

        vesting:
            "180-day cliff + 900-day linear",

        purpose:
            "Founder Alignment"
    },


    public: {
        title:
            "Public Sale",

        percentage:
            "22.5% · 45,000,000 $SNAO",

        text:
            "Allocated to the SNAO Public Sale through 1,800 progressive " +
            "lots of 25,000 SNAO, with buyer vesting determined by the " +
            "applicable sale phase.",

        unlock:
            "Phase Based",

        vesting:
            "Sale Phase Vesting",

        purpose:
            "Public Distribution"
    },


    liquidity: {
        title:
            "Liquidity & Market Making",

        percentage:
            "20% · 40,000,000 $SNAO",

        text:
            "10,000,000 SNAO reserved for initial liquidity and " +
            "30,000,000 SNAO reserved for long-term liquidity " +
            "and market-making operations.",

        unlock:
            "Controlled",

        vesting:
            "Reserve Controlled",

        purpose:
            "Market Liquidity"
    },


    treasury: {
        title:
            "Treasury",

        percentage:
            "20% · 40,000,000 $SNAO",

        text:
            "Reserved for project operations, infrastructure and " +
            "long-term ecosystem development through a controlled " +
            "release schedule.",

        unlock:
            "Controlled",

        vesting:
            "48-month linear",

        purpose:
            "Project Treasury"
    },


    team: {
        title:
            "Team & Development",

        percentage:
            "7.5% · 15,000,000 $SNAO",

        text:
            "Long-term team and development allocation with no " +
            "tokens unlocked at TGE.",

        unlock:
            "0% at TGE",

        vesting:
            "360-day cliff + 1,080-day linear",

        purpose:
            "Development"
    },


    partnerships: {
        title:
            "Partnerships & Ecosystem",

        percentage:
            "5% · 10,000,000 $SNAO",

        text:
            "Reserved for integrations, strategic collaborations " +
            "and long-term ecosystem development.",

        unlock:
            "6-month cliff",

        vesting:
            "30-month linear",

        purpose:
            "Ecosystem Growth"
    },


    community: {
        title:
            "Community & Rewards",

        percentage:
            "4% · 8,000,000 $SNAO",

        text:
            "Reserved for community participation, ecosystem rewards " +
            "and future community programs.",

        unlock:
            "Controlled",

        vesting:
            "36-month linear",

        purpose:
            "Community"
    },


    unsold: {
        title:
            "Unsold Sale Reserve",

        percentage:
            "2.5% · 5,000,000 $SNAO",

        text:
            "Reserved from the original sale allocation and locked " +
            "for 24 months. After the lock period, this allocation " +
            "is burn-only.",

        unlock:
            "24-month lock",

        vesting:
            "Burn-only after lock",

        purpose:
            "Supply Control"
    },


    strategic: {
        title:
            "Strategic Reserve",

        percentage:
            "5.5% · 11,000,000 $SNAO",

        text:
            "Long-term strategic reserve for future ecosystem " +
            "requirements and project development.",

        unlock:
            "12-month cliff",

        vesting:
            "36-month linear",

        purpose:
            "Strategic Reserve"
    }

};


/* =====================================================
   TOKEN ALLOCATION INTERACTION
===================================================== */

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


/* =====================================================
   FOUNDER VESTING
   0% TGE
   180-DAY CLIFF
   900-DAY LINEAR VESTING
===================================================== */

const tokenVestingDatabase = {

    launch: {
        title:
            "Founder Unlock at TGE",

        period:
            "TGE",

        text:
            "No founder tokens are unlocked at TGE. The full " +
            "26,000,000 SNAO founder allocation begins locked.",

        release:
            "0% Founder",

        impact:
            "No Founder Unlock",

        goal:
            "Long-Term Alignment",

        position:
            "0%"
    },


    cliff: {
        title:
            "Founder Cliff",

        period:
            "Day 0 → Day 180",

        text:
            "The entire founder allocation remains locked during " +
            "the 180-day cliff following TGE.",

        release:
            "Locked",

        impact:
            "0 Founder Release",

        goal:
            "Founder Alignment",

        position:
            "17%"
    },


    unlock: {
        title:
            "Founder Linear Vesting",

        period:
            "Day 180 → Day 1,080",

        text:
            "After the 180-day cliff, the founder allocation enters " +
            "900 days of linear vesting.",

        release:
            "Linear",

        impact:
            "Gradual",

        goal:
            "Controlled Release",

        position:
            "60%"
    },


    maturity: {
        title:
            "Founder Vesting Complete",

        period:
            "Day 1,080",

        text:
            "The founder vesting schedule reaches completion " +
            "1,080 days after TGE.",

        release:
            "Complete",

        impact:
            "Fully Vested",

        goal:
            "Schedule Completion",

        position:
            "100%"
    }

};


/* =====================================================
   VESTING INTERACTION
===================================================== */

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
