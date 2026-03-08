export function initHints() {
    // Only run on mobile/tablet or touch devices
    if (window.innerWidth > 1000) return;

    const hints = [
        { sectionId: "home", hintClass: ".hero-hint" },
        { sectionId: "skills", hintClass: ".skills-hint" },
        { sectionId: "projects", hintClass: ".projects-hint" },
        { sectionId: "footer-canvas", hintClass: ".footer-hint" }
    ];

    hints.forEach(hintData => {
        const section = document.getElementById(hintData.sectionId) || document.querySelector(".site-footer");
        const badge = section?.querySelector(hintData.hintClass);

        if (!section || !badge) return;

        let interactionTimer = null;
        const RESHOW_DELAY = 2500; // 2.5 seconds

        // 1. Scroll Visibility (Intersection Observer)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When section comes into view, show the badge
                    showBadge();
                } else {
                    // When it leaves view, hide the badge and reset timers
                    hideBadge();
                    clearTimeout(interactionTimer);
                }
            });
        }, {
            rootMargin: "-20% 0px -20% 0px",
            threshold: 0
        }); // Trigger when section is in the middle 60% of viewport

        observer.observe(section);

        // 2. Interaction Handling
        function hideBadge() {
            badge.classList.remove("is-visible");
        }

        function showBadge() {
            badge.classList.add("is-visible");
        }

        function handleInteraction() {
            // Hide immediately on interaction
            hideBadge();

            // Clear existing timeout
            clearTimeout(interactionTimer);

            // Set timeout to show badge again after inactivity
            const delay = hintData.sectionId === "skills" ? 1500 : RESHOW_DELAY;

            interactionTimer = setTimeout(() => {
                // Only show if the section is still somewhat in view
                const rect = section.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;

                if (inView) {
                    showBadge();
                }
            }, delay);
        }

        // Listen for interactions — unified for all sections
        section.addEventListener("touchstart", handleInteraction, { passive: true });
        section.addEventListener("touchmove", handleInteraction, { passive: true });

        if (hintData.sectionId === "projects") {
            const slider = section.querySelector(".project-slider");
            if (slider) {
                slider.addEventListener("wheel", handleInteraction, { passive: true });
            }
        }
    });
}
