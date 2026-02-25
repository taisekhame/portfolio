import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";

/**
 * Gathers every image src visible in the DOM plus any explicitly listed
 * critical assets, then pre-fetches them all in parallel.
 * Returns a Promise that resolves when every image has loaded (or failed).
 */
function preloadAllImages() {
    // All <img> elements currently in the DOM
    const domImages = Array.from(document.querySelectorAll("img[src]")).map(
        (img) => img.src
    );

    // Critical assets NOT in the initial DOM (hover images + dynamically-loaded project slides)
    const criticalAssets = [
        //Hero Image
        "./hero.webp",
        // Skills hover images
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838391/1_plpfne.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838392/2_zcn5im.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838392/3_dqwaiu.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838395/4_rmmvny.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838395/5_avnxo9.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838396/6_uvxoa9.png",
        // Project slides 2–7 (loaded dynamically by projects.js, not in initial DOM)
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838995/2_gozncr.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838987/3_riuohk.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838993/4_zyk2xv.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771839050/5_pxs63g.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771839045/6_vsx2cy.png",
        "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838985/7_dj8czu.png",
    ];

    // Deduplicate
    const allSrcs = [...new Set([...domImages, ...criticalAssets])];

    const promises = allSrcs.map((src) => {
        return new Promise((resolve) => {
            const img = new Image();
            // Resolve on both load and error — we never want to block forever
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
        });
    });

    return Promise.all(promises);
}

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

    // ─── Image preload gate ────────────────────────────────────────────────────
    // Start fetching all images immediately in parallel with the counter.
    // We track whether both the counter AND the images are ready.
    let imagesReady = false;
    let counterDone = false;

    const imagePromise = preloadAllImages().then(() => {
        imagesReady = true;
        // If the counter already finished waiting, dismiss now
        if (counterDone) dismissPreloader();
    });
    // ──────────────────────────────────────────────────────────────────────────

    function dismissPreloader() {
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
    }

    // Counter — minimum 3s visual animation, but waits for images too
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

            counterDone = true;

            if (imagesReady) {
                // Images already loaded — dismiss immediately
                dismissPreloader();
            }
            // Otherwise dismissPreloader() will be called from imagePromise.then()
        },
    });
}
