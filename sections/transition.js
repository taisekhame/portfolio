import gsap from "gsap";

// Section background classification
const darkSections = ["home", "skills", "projects", "contact"];
const lightSections = ["about"];

function getSectionBackground(sectionId) {
    // Determine if the current section has a dark or light background
    // About section is light at the top, but we check scroll position
    if (!sectionId) return "dark";

    const id = sectionId.replace("#", "");

    if (lightSections.includes(id)) {
        // About section: check if we're in the light or dark part
        const aboutSection = document.querySelector("#about");
        if (aboutSection) {
            const aboutOutro = aboutSection.querySelector(".about-outro");
            if (aboutOutro) {
                const outroRect = aboutOutro.getBoundingClientRect();
                // If the outro (dark part) is mostly visible, treat as dark
                if (outroRect.top < window.innerHeight / 2) {
                    return "dark";
                }
            }
        }
        return "light";
    }

    if (darkSections.includes(id)) return "dark";

    return "dark"; // default
}

function getTransitionColors(currentSectionId) {
    const bg = getSectionBackground(currentSectionId);

    if (bg === "dark") {
        // From dark section: dark color in, off-white accent out
        return { colorIn: "#0f0f0f", colorOut: "#edf1e8" };
    } else {
        // From light section: off-white accent in, dark color out
        return { colorIn: "#edf1e8", colorOut: "#0f0f0f" };
    }
}

/**
 * Plays a page transition animation.
 * Covers the screen with blocks, calls onMidpoint() when fully covered,
 * then reveals the content underneath.
 *
 * @param {string} currentSectionId - The ID of the section we're leaving (e.g. "#home")
 * @param {Function} onMidpoint - Called when screen is fully covered
 * @returns {Promise} Resolves when reveal animation completes
 */
export function animatePageTransition(currentSectionId, onMidpoint) {
    const ease = "power4.inOut";
    const blocks = document.querySelectorAll(".transition .block");

    if (!blocks.length) {
        if (onMidpoint) onMidpoint();
        return Promise.resolve();
    }

    const { colorIn, colorOut } = getTransitionColors(currentSectionId);

    return new Promise((resolve) => {
        // Phase 1: Cover the screen
        gsap.set(blocks, { visibility: "visible", scaleY: 0, backgroundColor: colorIn });

        gsap.to(blocks, {
            scaleY: 1,
            duration: 0.8,
            stagger: {
                each: 0.08,
                from: "start",
                grid: [2, 5],
                axis: "x",
            },
            ease: ease,
            onComplete: () => {
                // Midpoint: screen is fully covered
                if (onMidpoint) onMidpoint();

                // Phase 2: Change block color and reveal
                gsap.set(blocks, { backgroundColor: colorOut });

                gsap.to(blocks, {
                    scaleY: 0,
                    duration: 0.8,
                    stagger: {
                        each: 0.08,
                        from: "start",
                        grid: "auto",
                        axis: "x",
                    },
                    ease: ease,
                    onComplete: () => {
                        gsap.set(blocks, { visibility: "hidden" });
                        resolve();
                    },
                });
            },
        });
    });
}
