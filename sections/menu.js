import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/all";
import { animatePageTransition } from "./transition.js";

export function initMenu(lenis) {
    gsap.registerPlugin(Draggable, ScrollTrigger);

    const menuDropZone = document.querySelector(".site-menu .menu-drop-zone");
    const menuDrawer = document.querySelector(".site-menu .menu-drawer");
    const menuLogo = document.querySelector(".site-menu .menu-logo");
    const menuItems = document.querySelector(".site-menu .menu-items");
    const menuItemElements = document.querySelectorAll(".site-menu .menu-item");
    const menuToggler = document.querySelector(".site-menu .menu-toggler");

    if (!menuDrawer || !menuToggler) return;

    let isMenuOpen = false;
    let isTransitioning = false; // Lock to prevent actions during page transition

    gsap.set(menuItems, { width: "auto" });
    gsap.set(menuItemElements, { opacity: 1 });

    let menuItemsFullWidth = menuItems.offsetWidth;
    const drawerGap = 0.35 * 16;

    // Read live element sizes (these change across breakpoints via CSS)
    function getLiveLogoWidth() { return menuLogo.offsetWidth; }
    function getLiveTogglerWidth() { return menuToggler.offsetWidth; }
    function getLiveDrawerPadding() {
        // CSS: 0.35rem on desktop, 0.25rem on <=768px
        if (window.innerWidth <= 768) return 0.25 * 16;
        return 0.35 * 16;
    }
    function getLiveMenuLeft() {
        // CSS: 2rem desktop, 1rem <=768px, 0.75rem <=480px
        if (window.innerWidth <= 480) return 0.75 * 16;
        if (window.innerWidth <= 768) return 1 * 16;
        return 2 * 16;
    }

    const logoWidth = getLiveLogoWidth();
    const togglerWidth = getLiveTogglerWidth();
    const drawerPadding = getLiveDrawerPadding();

    const closedMenuWidth =
        drawerPadding + logoWidth + drawerGap + togglerWidth + drawerPadding;
    const openMenuWidth =
        drawerPadding +
        logoWidth +
        drawerGap +
        menuItemsFullWidth +
        drawerGap +
        togglerWidth +
        drawerPadding;

    gsap.set(menuItems, { width: 0, marginRight: 0 });
    gsap.set(menuItemElements, { opacity: 0, scale: 0.85 });
    gsap.set(menuDropZone, { width: closedMenuWidth });

    const isMobile = () => window.innerWidth <= 768;

    // Recalculate the full width of menu items (handles late font loading)
    function recalcMenuItemsWidth() {
        gsap.set(menuItems, { width: "auto" });
        gsap.set(menuItemElements, { opacity: 1, scale: 1 });
        menuItemsFullWidth = menuItems.offsetWidth;
        // Restore hidden state (will be animated in openMenu)
        if (!isMenuOpen) {
            gsap.set(menuItems, { width: 0, marginRight: 0 });
            gsap.set(menuItemElements, { opacity: 0, scale: 0.85 });
        }
    }

    function getMaxMenuItemsWidth() {
        // Always cap to viewport on smaller screens
        const viewportWidth = window.innerWidth;
        const menuLeft = getLiveMenuLeft();
        const rightMargin = menuLeft; // Symmetric margin
        const pad = getLiveDrawerPadding();
        const lw = getLiveLogoWidth();
        const tw = getLiveTogglerWidth();
        const availableWidth = viewportWidth - menuLeft - rightMargin;
        const maxItemsWidth = availableWidth - pad - lw - drawerGap - tw - pad;
        return Math.min(menuItemsFullWidth, Math.max(0, maxItemsWidth));
    }

    function openMenu() {
        if (isMenuOpen || isTransitioning) return;
        isMenuOpen = true;
        menuToggler.classList.add("close");

        // Kill any ongoing menu animations to prevent conflicts
        gsap.killTweensOf(menuItems);
        gsap.killTweensOf(menuItemElements);

        // Recalculate width in case fonts loaded after init
        recalcMenuItemsWidth();
        const targetWidth = getMaxMenuItemsWidth();

        gsap.to(menuItems, {
            width: targetWidth,
            marginRight: drawerGap,
            duration: 0.5,
            ease: "power3.inOut",
            onStart: () => {
                gsap.to(menuItemElements, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    delay: 0.2,
                    ease: "power3.out",
                });
            },
        });
    }

    function closeMenu() {
        if (!isMenuOpen || isTransitioning) return;
        isMenuOpen = false;
        menuToggler.classList.remove("close");

        // Kill any ongoing menu animations to prevent conflicts
        gsap.killTweensOf(menuItems);
        gsap.killTweensOf(menuItemElements);

        gsap.to(menuItems, {
            width: 0,
            marginRight: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onStart: () => {
                gsap.to(menuItemElements, {
                    opacity: 0,
                    scale: 0.85,
                    duration: 0.3,
                    ease: "power3.out",
                    stagger: {
                        each: 0.05,
                        from: "end",
                    },
                });
            },
        });
    }

    function toggleMenu() {
        if (isTransitioning) return;
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggler.addEventListener("click", toggleMenu);

    // Determine which section the user is currently viewing
    function getCurrentSectionId() {
        const sections = ["#home", "#about", "#skills", "#projects", "#contact"];
        let currentId = "#home";

        for (const id of sections) {
            const el = document.querySelector(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) {
                    currentId = id;
                }
            }
        }
        return currentId;
    }

    // Handle menu item clicks — page transition
    menuItemElements.forEach((item) => {
        const link = item.querySelector("a");
        if (link) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                if (isTransitioning) return;

                const targetId = link.getAttribute("href");
                const targetSection = document.querySelector(targetId);
                if (!targetSection) return;

                isTransitioning = true;

                // Close menu first
                if (isMenuOpen) {
                    closeMenu();
                }

                const currentSection = getCurrentSectionId();

                // Play page transition
                animatePageTransition(currentSection, () => {
                    // Midpoint: screen is covered — instant scroll
                    if (lenis) {
                        lenis.scrollTo(targetSection, {
                            immediate: true,
                            force: true,
                        });
                    } else {
                        targetSection.scrollIntoView();
                    }
                    // Refresh ScrollTrigger after instant scroll
                    ScrollTrigger.refresh();
                }).then(() => {
                    isTransitioning = false;
                    // Re-sync Draggable bounds after page transition
                    if (draggableInstance && draggableInstance[0]) {
                        draggableInstance[0].update(true);
                    }
                });
            });
        }
    });

    // ========================================================================
    // Draggable menu
    // ========================================================================

    const snapThreshold = 200;
    let draggableInstance = null;

    // Only enable draggable on non-mobile
    // On mobile, dragging a fixed menu is problematic with touch events
    if (!isMobile()) {
        draggableInstance = Draggable.create(menuDrawer, {
            type: "x,y",
            bounds: {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            },
            cursor: "grab",
            activeCursor: "grabbing",
            allowEventDefault: true,       // Don't prevent default on clicks inside
            minimumMovement: 3,            // Require at least 3px movement to start drag

            onPress: function () {
                // Ensure the menu drawer stays visible and in the right stacking context
                gsap.set(menuDrawer, { visibility: "visible", opacity: 1 });
            },

            onDragStart: function () {
                const activeMenuWidth = isMenuOpen ? openMenuWidth : closedMenuWidth;
                gsap.set(menuDropZone, { width: activeMenuWidth });
            },

            onDrag: function () {
                const isMenuWithinSnapZone =
                    Math.abs(this.x) < snapThreshold && Math.abs(this.y) < snapThreshold;

                if (isMenuWithinSnapZone) {
                    gsap.to(menuDropZone, { opacity: 1, duration: 0.1 });
                } else {
                    gsap.to(menuDropZone, { opacity: 0, duration: 0.1 });
                }
            },

            onDragEnd: function () {
                gsap.to(menuDropZone, { opacity: 0, duration: 0.1 });

                const isMenuWithinSnapZone =
                    Math.abs(this.x) < snapThreshold && Math.abs(this.y) < snapThreshold;

                if (isMenuWithinSnapZone) {
                    gsap.to(menuDrawer, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out",
                    });
                }
            },
        });

        // Update Draggable bounds on resize
        window.addEventListener("resize", () => {
            if (draggableInstance && draggableInstance[0]) {
                draggableInstance[0].applyBounds({
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        });
    }

    // ========================================================================
    // Scroll-based menu color adaptation
    // Uses data-menu-theme attributes on sections/elements to determine
    // whether the menu should be "light" (white) or "dark" (black).
    // A real-time detector checks which themed element the menu overlaps.
    // ========================================================================

    const menuLogoImg = document.querySelector(".site-menu .menu-logo img");
    const togglerSpans = document.querySelectorAll(".site-menu .menu-toggler span");
    const menuLinks = document.querySelectorAll(".site-menu .menu-item a");

    let currentMenuTheme = null; // Track to avoid redundant animations

    function setMenuColor(color, duration = 0.4) {
        // Animate hamburger span colors
        gsap.to(togglerSpans, {
            backgroundColor: color,
            duration: duration,
            ease: "power2.inOut",
        });

        // Animate nav link colors
        gsap.to(menuLinks, {
            color: color,
            duration: duration,
            ease: "power2.inOut",
        });

        // Animate logo — use CSS filter to invert between white and black
        if (menuLogoImg) {
            const invertValue = color === "#000" || color === "#000000" ? 0 : 1;
            gsap.to(menuLogoImg, {
                filter: `invert(${invertValue})`,
                duration: duration,
                ease: "power2.inOut",
            });
        }
    }

    // Apply data-menu-theme attributes to all relevant elements
    // "dark" background → menu should be white (light theme)
    // "light" background → menu should be black (dark theme)
    function applyMenuThemeAttributes() {
        // Hero — dark menu (black)
        const hero = document.querySelector("#home");
        if (hero) hero.setAttribute("data-menu-theme", "dark");

        // About container (hero + marquee + horizontal scroll spacer) — light bg → dark (black) menu
        const aboutContainer = document.querySelector(".about-section .about-container");
        if (aboutContainer) aboutContainer.setAttribute("data-menu-theme", "dark");

        // About horizontal scroll dark slides — dark bg → light (white) menu
        const aboutDarkSlides = document.querySelectorAll(".about-horizontal-slide:not(.about-horizontal-spacer)");
        aboutDarkSlides.forEach(slide => slide.setAttribute("data-menu-theme", "light"));

        // About outro — dark bg → light (white) menu
        const aboutOutro = document.querySelector(".about-section .about-outro");
        if (aboutOutro) aboutOutro.setAttribute("data-menu-theme", "light");

        // Skills — dark bg → light (white) menu
        const skills = document.querySelector("#skills");
        if (skills) skills.setAttribute("data-menu-theme", "light");

        // Projects — dark bg → light (white) menu
        const projects = document.querySelector("#projects");
        if (projects) projects.setAttribute("data-menu-theme", "light");

        // Contact — dark bg → light (white) menu
        const contact = document.querySelector("#contact");
        if (contact) contact.setAttribute("data-menu-theme", "light");

        // Footer — dark bg → light (white) menu
        const footer = document.querySelector(".site-footer");
        if (footer) footer.setAttribute("data-menu-theme", "light");
    }

    applyMenuThemeAttributes();

    // Collect all themed elements for detection
    function getThemedElements() {
        return document.querySelectorAll("[data-menu-theme]");
    }

    // Determine which themed element the menu is currently overlapping
    function detectMenuTheme() {
        // Get the menu drawer's current position (accounts for dragging)
        const drawerRect = menuDrawer.getBoundingClientRect();
        // Sample point: center-left of the menu drawer
        const sampleY = drawerRect.top + drawerRect.height / 2;
        const sampleX = drawerRect.left + 20;

        const themedElements = getThemedElements();
        let detectedTheme = "light"; // Default: white menu on dark bg

        // Check from last to first (later elements are more specific/nested)
        // Find the most specific (deepest nested) element that contains the sample point
        let bestElement = null;
        let bestDepth = -1;

        themedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (
                sampleY >= rect.top &&
                sampleY <= rect.bottom &&
                sampleX >= rect.left - 50 && // Small tolerance for edge cases
                sampleX <= rect.right + 50
            ) {
                // Calculate depth (nesting level)
                let depth = 0;
                let parent = el.parentElement;
                while (parent) {
                    depth++;
                    parent = parent.parentElement;
                }

                if (depth > bestDepth) {
                    bestDepth = depth;
                    bestElement = el;
                }
            }
        });

        if (bestElement) {
            detectedTheme = bestElement.getAttribute("data-menu-theme");
        }

        return detectedTheme;
    }

    // Continuously check and update menu color based on scroll position
    let rafId = null;

    function updateMenuColorOnScroll() {
        const theme = detectMenuTheme();

        if (theme !== currentMenuTheme) {
            currentMenuTheme = theme;
            const color = theme === "dark" ? "#000" : "#fff";
            setMenuColor(color);
        }

        rafId = requestAnimationFrame(updateMenuColorOnScroll);
    }

    // Start detection
    updateMenuColorOnScroll();

    // Set initial color immediately
    const initialTheme = detectMenuTheme();
    currentMenuTheme = initialTheme;
    setMenuColor(initialTheme === "dark" ? "#000" : "#fff", 0);
}
