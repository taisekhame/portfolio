import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function initProjects() {
    const section = document.querySelector(".projects-section");
    if (!section) return;

    const slides = [
        {
            title:
                "E-Commerce Platform — A modern shopping experience built with React and Node.js, featuring real-time inventory and seamless checkout.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838985/1_g1vzqc.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Portfolio Dashboard — An analytics dashboard with interactive data visualizations, custom charts, and responsive design.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838995/2_gozncr.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Social Media App — A real-time social platform with live messaging, content feeds, and AI-powered recommendations.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838987/3_riuohk.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Restaurant Booking System — An elegant reservation system with table management, menu browsing, and customer reviews.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838993/4_zyk2xv.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Fitness Tracker — A health and wellness app with workout tracking, nutrition logging, and progress visualization.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771839050/5_pxs63g.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Music Streaming Service — A sleek audio platform with playlist curation, artist discovery, and cross-device sync.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771839045/6_vsx2cy.png",
            link: "#",
            linkText: "View Project",
        },
        {
            title:
                "Travel Planner — An intelligent travel companion with itinerary building, budget tracking, and local recommendations.",
            image:
                "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1771838985/7_dj8czu.png",
            link: "#",
            linkText: "View Project",
        },
    ];

    const pinDistance = window.innerHeight * slides.length;
    const progressBar = section.querySelector(".project-slider-progress");
    const sliderImages = section.querySelector(".project-slider-images");
    const sliderTitle = section.querySelector(".project-slider-title");
    const sliderIndices = section.querySelector(".project-slider-indices");

    let activeSlide = 0;
    let currentSplit = null;

    function createIndices() {
        sliderIndices.innerHTML = "";

        slides.forEach((_, index) => {
            const indexNum = (index + 1).toString().padStart(2, "0");
            const indicatorElement = document.createElement("p");
            indicatorElement.dataset.index = index;
            indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
            sliderIndices.appendChild(indicatorElement);

            if (index === 0) {
                gsap.set(indicatorElement.querySelector(".index"), { opacity: 1 });
                gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 1 });
            } else {
                gsap.set(indicatorElement.querySelector(".index"), { opacity: 0.35 });
                gsap.set(indicatorElement.querySelector(".marker"), { scaleX: 0 });
            }
        });
    }

    function animateNewSlide(index) {
        const newSliderImage = document.createElement("img");
        newSliderImage.src = slides[index].image;
        newSliderImage.alt = `Project ${index + 1}`;

        gsap.set(newSliderImage, { opacity: 0, scale: 1.1 });

        sliderImages.appendChild(newSliderImage);

        gsap.to(newSliderImage, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
        });

        gsap.to(newSliderImage, {
            scale: 1,
            duration: 1,
            ease: "power2.out",
        });

        const allImages = sliderImages.querySelectorAll("img");
        if (allImages.length > 3) {
            const removeCount = allImages.length - 3;
            for (let i = 0; i < removeCount; i++) {
                sliderImages.removeChild(allImages[i]);
            }
        }

        animateNewTitle(index);
        animateIndicators(index);
    }

    function animateIndicators(index) {
        const indicators = sliderIndices.querySelectorAll("p");

        indicators.forEach((indicator, i) => {
            const markerElement = indicator.querySelector(".marker");
            const indexElement = indicator.querySelector(".index");

            if (i === index) {
                gsap.to(indexElement, { opacity: 1, duration: 0.3, ease: "power2.out" });
                gsap.to(markerElement, { scaleX: 1, duration: 0.3, ease: "power2.out" });
            } else {
                gsap.to(indexElement, { opacity: 0.35, duration: 0.3, ease: "power2.out" });
                gsap.to(markerElement, { scaleX: 0, duration: 0.3, ease: "power2.out" });
            }
        });
    }

    function animateNewTitle(index) {
        if (currentSplit) {
            currentSplit.revert();
        }

        const slide = slides[index];
        const linkHtml = slide.link && slide.link !== "#"
            ? `<a href="${slide.link}" target="_blank" rel="noopener" class="project-link">${slide.linkText || "View Project"} →</a>`
            : `<span class="project-link placeholder">${slide.linkText || "View Project"} →</span>`;

        sliderTitle.innerHTML = `<h1>${slide.title}</h1>${linkHtml}`;

        currentSplit = new SplitText(sliderTitle.querySelector("h1"), {
            type: "lines",
            linesClass: "line",
            mask: "lines",
        });

        gsap.set(currentSplit.lines, { yPercent: 100, opacity: 0 });

        gsap.to(currentSplit.lines, {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
        });

        // Animate the link in
        const linkEl = sliderTitle.querySelector(".project-link");
        if (linkEl) {
            gsap.fromTo(linkEl,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.4, ease: "power3.out" }
            );
        }
    }

    createIndices();

    ScrollTrigger.create({
        trigger: ".projects-section .project-slider",
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
            gsap.set(progressBar, { scaleY: self.progress });

            const currentSlide = Math.floor(self.progress * slides.length);

            if (activeSlide !== currentSlide && currentSlide < slides.length) {
                activeSlide = currentSlide;
                animateNewSlide(activeSlide);
            }
        },
    });
}
