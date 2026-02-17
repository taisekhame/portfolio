import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";

export function initPreloader(onComplete) {
    gsap.registerPlugin(SplitText, CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const textPaths = document.querySelectorAll(".preloader svg textPath");
    if (!textPaths.length) {
        if (onComplete) onComplete();
        return;
    }

    const startTextLengths = Array.from(textPaths).map((tp) =>
        parseFloat(tp.getAttribute("textLength"))
    );

    const startTextOffsets = Array.from(textPaths).map((tp) =>
        parseFloat(tp.getAttribute("startOffset"))
    );

    const targetTextLengths = [4000, 3500, 3250, 3000, 2500, 2000, 1500, 1250];
    const orbitRadii = [775, 700, 625, 550, 475, 400, 325, 250];

    const maxOrbitRadius = orbitRadii[0];
    const maxAnimDuration = 1.25;
    const minAnimDuration = 1;

    textPaths.forEach((textPath, index) => {
        const animationDelay = (textPaths.length - 1 - index) * 0.1;
        const currentOrbitRadius = orbitRadii[index];

        const currentDuration =
            minAnimDuration +
            (currentOrbitRadius / maxOrbitRadius) * (maxAnimDuration - minAnimDuration);

        const pathLength = 2 * Math.PI * currentOrbitRadius * 3;
        const textLengthIncrease = targetTextLengths[index] - startTextLengths[index];
        const offsetAdjustment = (textLengthIncrease / 2 / pathLength) * 100;
        const targetOffset = startTextOffsets[index] - offsetAdjustment;

        gsap.to(textPath, {
            attr: {
                textLength: targetTextLengths[index],
                startOffset: targetOffset + "%",
            },
            duration: currentDuration,
            delay: animationDelay,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            repeatDelay: 0,
        });
    });

    let loaderRotation = 0;

    function animateRotation() {
        const spinDirection = Math.random() < 0.5 ? 1 : -1;
        loaderRotation += 25 * spinDirection;

        gsap.to(".preloader svg", {
            rotation: loaderRotation,
            duration: 2,
            ease: "power2.inOut",
            onComplete: animateRotation,
        });
    }

    animateRotation();

    // Counter
    const counterText = document.querySelector(".preloader .counter p");
    const count = { value: 0 };

    gsap.to(count, {
        value: 100,
        duration: 3,
        delay: 0.5,
        ease: "power1.out",
        onUpdate: function () {
            counterText.textContent = Math.floor(count.value);
        },
        onComplete: function () {
            gsap.to(".preloader .counter", {
                opacity: 0,
                duration: 0.4,
                delay: 0.5,
            });

            const orbitTextElements = document.querySelectorAll(".preloader .orbit-text");
            gsap.set(orbitTextElements, { opacity: 0 });

            const orbitTextsReversed = Array.from(orbitTextElements).reverse();

            gsap.to(orbitTextsReversed, {
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "power1.out",
            });

            gsap.to(orbitTextsReversed, {
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                delay: 1.5,
                ease: "power1.out",
                onComplete: function () {
                    gsap.to(".preloader", {
                        opacity: 0,
                        duration: 0.8,
                        onComplete: () => {
                            const preloader = document.querySelector(".preloader");
                            if (preloader) preloader.style.display = "none";
                            document.body.classList.add("page-loaded");
                            if (onComplete) onComplete();
                        },
                    });
                },
            });
        },
    });
}
