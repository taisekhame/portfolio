import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip, Draggable, CustomEase } from "gsap/all";
import Lenis from "lenis";

// Register all GSAP plugins once
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, CustomEase);

// Import section initializers
import { initPreloader } from "./sections/preloader.js";
import { initHero } from "./sections/hero.js";
import { initAbout } from "./sections/about.js";
import { initSkills } from "./sections/skills.js";
import { initProjects } from "./sections/projects.js";
import { initContact } from "./sections/contact.js";
import { initFooter } from "./sections/footer.js";
import { initMenu } from "./sections/menu.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lenis smooth scroll (shared instance)
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Stop scrolling during preloader
    lenis.stop();

    // Initialize the preloader first
    initPreloader(() => {
        // Preloader complete — start scrolling and init all sections
        lenis.start();
        initHero();
        initAbout();
        initSkills();
        initProjects();
        initContact();
        initFooter();
        initMenu(lenis);
    });
});
