import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initProjects() {
    const section = document.querySelector(".projects-section");
    if (!section) return;

    const slides = [
        {
            title: "Lash & Brow Aesthetic Studio",
            description: "A high-end beauty brand website featuring elegant booking flows, treatment showcases, and a premium visual identity.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848288/1_desktop_mm6rp9.png",
            link: "https://www.lashbrowsaestheticstudio.uk/",
            githubLink: "https://github.com/taisekhame/LashBrow",
        },
        {
            title: "Kairo Docs",
            description: "A modern documentation platform built for developer teams, with clean navigation, search, and dark/light theme support.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848289/2_desktop_gbqa9v.png",
            link: "https://kairo-docs.vercel.app/",
            githubLink: "https://github.com/taisekhame/kairo",
        },
        {
            title: "Wavv Music",
            description: "A music streaming web app with playlist curation, artist discovery, and an immersive audio-visual interface.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848261/3_desktop_csqq3y.png",
            link: "https://v0-wavv-music.vercel.app/",
            githubLink: "https://github.com/taisekhame/Wavv",
        },
        {
            title: "Floww Build",
            description: "A project management and workflow builder designed for creative agencies, featuring drag-and-drop boards and team collaboration.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848241/4_desktop_zke08z.png",
            link: "https://v0-floww-build.vercel.app/",
            githubLink: "https://github.com/taisekhame/Floww",
        },
        {
            title: "Luxe E-Commerce",
            description: "A premium online shopping experience with curated product displays, smooth cart interactions, and a luxurious brand feel.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848299/5_desktop_wie6dg.png",
            link: "https://v0-luxe-e-commerce.vercel.app/",
            githubLink: "https://github.com/taisekhame/Luxe-E-commerce",
        },
        {
            title: "Roamly Travel",
            description: "An intelligent travel companion app with itinerary building, destination discovery, and personalised trip recommendations.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848286/6_desktop_jjosof.png",
            link: "https://v0-roamly-travel-app.vercel.app/",
            githubLink: "https://github.com/taisekhame/Roamly",
        },
        {
            title: "Aurum",
            description: "A luxury hotel and venue booking platform featuring elegantly designed rooms, availability calendars, and instant reservations.",
            image: "https://res.cloudinary.com/deph6wiku/image/upload/f_auto,q_auto/v1772848294/7_desktop_xqgolq.png",
            link: "https://v0-lumiere-bookings.vercel.app/",
            githubLink: "https://github.com/taisekhame/Aurum",
        },
    ];

    const pinDistance = window.innerHeight * slides.length;
    const progressBar = section.querySelector(".project-slider-progress");
    const slideContainer = section.querySelector(".project-slide-container");
    const sliderIndices = section.querySelector(".project-slider-indices");

    let activeSlide = 0;

    // ─── Build indices ────────────────────────────────────────────────────────
    function createIndices() {
        if (!sliderIndices) return;
        sliderIndices.innerHTML = "";

        slides.forEach((_, index) => {
            const indexNum = (index + 1).toString().padStart(2, "0");
            const indicatorElement = document.createElement("p");
            indicatorElement.dataset.index = index;
            indicatorElement.innerHTML = `<span class="marker"></span><span class="index">${indexNum}</span>`;
            sliderIndices.appendChild(indicatorElement);

            gsap.set(indicatorElement.querySelector(".index"), { opacity: index === 0 ? 1 : 0.35 });
            gsap.set(indicatorElement.querySelector(".marker"), { scaleX: index === 0 ? 1 : 0 });
        });
    }

    function animateIndicators(index) {
        const indicators = sliderIndices?.querySelectorAll("p");
        if (!indicators) return;

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

    // ─── Build a single slide card ────────────────────────────────────────────
    function buildSlideCard(slide, index) {
        const slideEl = document.createElement("div");
        slideEl.className = "project-slide";

        // --- Image card ---
        const imgCard = document.createElement("div");
        imgCard.className = "project-img-card";

        const img = document.createElement("img");
        img.src = slide.image;
        img.alt = slide.title;
        img.loading = index === 0 ? "eager" : "lazy";
        imgCard.appendChild(img);

        // --- Glass detail card ---
        const glassCard = document.createElement("div");
        glassCard.className = "project-glass-card";

        const titleEl = document.createElement("h2");
        titleEl.className = "project-card-title";
        titleEl.textContent = slide.title;

        const descEl = document.createElement("p");
        descEl.className = "project-card-desc";
        descEl.textContent = slide.description;

        const actionsEl = document.createElement("div");
        actionsEl.className = "project-card-actions";

        // Live link
        const liveLink = document.createElement("a");
        liveLink.href = slide.link;
        liveLink.target = "_blank";
        liveLink.rel = "noopener";
        liveLink.className = "project-card-btn project-card-btn--live";
        liveLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            View Live
        `;

        // GitHub link
        const githubLink = document.createElement("a");
        githubLink.href = slide.githubLink;
        githubLink.target = "_blank";
        githubLink.rel = "noopener";
        githubLink.className = "project-card-btn project-card-btn--github";
        githubLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
        `;

        actionsEl.appendChild(liveLink);
        actionsEl.appendChild(githubLink);

        glassCard.appendChild(titleEl);
        glassCard.appendChild(descEl);
        glassCard.appendChild(actionsEl);

        slideEl.appendChild(imgCard);
        slideEl.appendChild(glassCard);

        return slideEl;
    }

    // ─── Animate in a new slide ───────────────────────────────────────────────
    function animateNewSlide(index) {
        // Clear old slide(s)
        const existingSlides = slideContainer.querySelectorAll(".project-slide");
        existingSlides.forEach(el => {
            gsap.to(el, {
                opacity: 0,
                scale: 0.98,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => el.remove(),
            });
        });

        // Build and animate in new slide
        const slideEl = buildSlideCard(slides[index], index);
        gsap.set(slideEl, { opacity: 0, scale: 1.02 });
        slideContainer.appendChild(slideEl);

        gsap.to(slideEl, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut",
        });

        animateIndicators(index);
    }

    // ─── Initialise ───────────────────────────────────────────────────────────
    createIndices();

    // Render first slide immediately
    const firstSlide = buildSlideCard(slides[0], 0);
    slideContainer.appendChild(firstSlide);

    // ─── Scroll trigger ───────────────────────────────────────────────────────
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

            const currentSlide = Math.min(
                Math.floor(self.progress * slides.length),
                slides.length - 1
            );

            if (activeSlide !== currentSlide) {
                activeSlide = currentSlide;
                animateNewSlide(activeSlide);
            }
        },
    });
}
