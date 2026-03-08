# Taiye Aisekhame — Creative Developer Portfolio

A lightweight, modern frontend portfolio website designed to showcase interactive web experiences, animation, and visual storytelling. 

Currently, this project serves as a foundational template and interactive canvas. It houses a curated selection of project concepts and demonstrates advanced frontend layout and animation techniques—rather than serving as a heavy, multi-page web application.

## Technologies & Methodologies Used

This portfolio is built with a focus on high-performance animations and premium aesthetics, relying purely on native web technologies and specialized interaction libraries.

### Core Stack
*   **Vite**: Fast and lean frontend build tool.
*   **Vanilla JS**: No heavy frontend frameworks (React/Vue/Angular) are used; all DOM manipulation and state management is handled natively to ensure the fastest possible load times and execution.
*   **HTML5 / CSS3**: Semantic structure paired with modern CSS layout techniques (Flexbox, CSS Variables, `calc()`, and `svh` for viewport accuracy).

### Animation & Interaction
*   **GSAP (GreenSock Animation Platform)**: The core engine driving all animations across the site. Used for element reveals, the custom SVG loading preloader, and the complex pinning mechanisms.
*   **ScrollTrigger (GSAP Plugin)**: Powers the scroll-bound animations, most notably the custom horizontal scroll pinning used in the "Projects" section and the horizontal sliding in the "About" section.
*   **HTML5 `<canvas>` (via WebGL / `ogl` library)**: Used to render performant, interactive fluid gradient backgrounds (like those seen in the Hero and Contact sections).

### Key Design Techniques
*   **Apple-style Glassmorphism**: Achieved using CSS `backdrop-filter: blur() saturate()`, customized box-shadows, and semi-transparent RGBA backgrounds to create premium, "frosted glass" UI elements.
*   **Dynamic Theming Engine**: A custom `requestAnimationFrame` loop continuously monitors the scroll position of the page. It detects when overlapping elements enter "dark" or "light" defined sections (via `data-menu-theme` attributes) and smoothly transitions UI colors (like the logo and navigation menu) to ensure perfect contrast at all times.
*   **Eager vs. Lazy Loading**: Critical first-paint assets (like the large Hero image and the very first project slide image) are preloaded in the `<head>` and tagged with `loading="eager"`. All off-screen, scroll-dependent images are set to `loading="lazy"` to preserve bandwidth and eliminate preloader bottlenecks.
*   **Responsive Fluid Layouts**: CSS `aspect-ratio` combined with percentage-based scaling and `object-fit: cover` ensures that all complex layouts (like the absolute-positioned, perfectly overlapping project cards) scale flawlessly from 4K desktop monitors down to mobile viewports.

## Running Locally

To run this project locally, simply install the dev dependencies and start the Vite server.

```bash
npm install
npm run dev
```
