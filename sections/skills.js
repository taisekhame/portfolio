import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function initSkills() {
    const cardContainers = document.querySelectorAll(
        ".skills-section .skills-card-container"
    );
    if (!cardContainers.length) return;

    cardContainers.forEach((cardContainer) => {
        const cardPaths = cardContainer.querySelectorAll(".svg-stroke path");
        const cardTitle = cardContainer.querySelector(".skills-card-title h3");
        const hoverImg = cardContainer.querySelector(".card-hover-img");

        const split = SplitText.create(cardTitle, {
            type: "words",
            mask: "words",
        });

        gsap.set(split.words, { yPercent: 100 });

        cardPaths.forEach((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.setAttribute("stroke-width", "100");
        });

        let tl;

        cardContainer.addEventListener("mouseenter", () => {
            if (tl) tl.kill();
            tl = gsap.timeline();

            cardPaths.forEach((path) => {
                tl.to(
                    path,
                    {
                        strokeDashoffset: 0,
                        attr: { "stroke-width": 1200 },
                        duration: 1.5,
                        ease: "power2.out",
                    },
                    0
                );
            });

            // Hover image fades in at t=0.35, in sync with the text reveal
            if (hoverImg) {
                tl.to(
                    hoverImg,
                    {
                        opacity: 1,
                        duration: 0.7,
                        ease: "power2.out",
                    },
                    0.35
                );
            }

            tl.to(
                split.words,
                {
                    yPercent: 0,
                    duration: 0.75,
                    ease: "power3.out",
                    stagger: 0.075,
                },
                0.35
            );
        });

        cardContainer.addEventListener("mouseleave", () => {
            if (tl) tl.kill();
            tl = gsap.timeline();

            cardPaths.forEach((path) => {
                const length = path.getTotalLength();
                tl.to(
                    path,
                    {
                        strokeDashoffset: length,
                        attr: { "stroke-width": 100 },
                        duration: 1,
                        ease: "power2.out",
                    },
                    0
                );
            });

            // Hover image fades out immediately on mouse leave with the text
            if (hoverImg) {
                tl.to(
                    hoverImg,
                    {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.out",
                    },
                    0
                );
            }

            tl.to(
                split.words,
                {
                    yPercent: 100,
                    duration: 0.5,
                    ease: "power3.out",
                    stagger: { each: 0.05, from: "end" },
                },
                0
            );
        });
    });
}
