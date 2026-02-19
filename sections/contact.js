import * as THREE from "three";
import { gradientVertexShader, fluidShader, displayShader } from "../shaders.js";

export function initContact() {
    const config = {
        brushSize: 25.0,
        brushStrength: 0.5,
        distortionAmount: 2.5,
        fluidDecay: 0.98,
        trailLength: 0.8,
        stopDecay: 0.85,
        color1: "#b8fff7",
        color2: "#6e3466",
        color3: "#0133ff",
        color4: "#66d1fe",
        colorIntensity: 1.0,
        softness: 1.0,
    };

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    }

    const gradientCanvas = document.querySelector(
        ".contact-section .contact-gradient-canvas"
    );
    if (!gradientCanvas) return;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const rect = gradientCanvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    gradientCanvas.appendChild(renderer.domElement);

    const fluidTarget1 = new THREE.WebGLRenderTarget(rect.width, rect.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    });

    const fluidTarget2 = new THREE.WebGLRenderTarget(rect.width, rect.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
    });

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(rect.width, rect.height) },
            iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
            iFrame: { value: 0 },
            iPreviousFrame: { value: null },
            uBrushSize: { value: config.brushSize },
            uBrushStrength: { value: config.brushStrength },
            uFluidDecay: { value: config.fluidDecay },
            uTrailLength: { value: config.trailLength },
            uStopDecay: { value: config.stopDecay },
        },
        vertexShader: gradientVertexShader,
        fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(rect.width, rect.height) },
            iFluid: { value: null },
            uDistortionAmount: { value: config.distortionAmount },
            uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
            uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
            uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
            uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
            uColorIntensity: { value: config.colorIntensity },
            uSoftness: { value: config.softness },
        },
        vertexShader: gradientVertexShader,
        fragmentShader: displayShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    let mouseX = 0,
        mouseY = 0;
    let prevMouseX = 0,
        prevMouseY = 0;
    let lastMoveTime = 0;

    document.addEventListener("mousemove", (e) => {
        const canvasRect = gradientCanvas.getBoundingClientRect();
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX - canvasRect.left;
        mouseY = canvasRect.height - (e.clientY - canvasRect.top);
        lastMoveTime = performance.now();
        fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
    });

    function animate() {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;
        fluidMaterial.uniforms.iTime.value = time;
        displayMaterial.uniforms.iTime.value = time;
        fluidMaterial.uniforms.iFrame.value = frameCount;

        if (performance.now() - lastMoveTime > 100) {
            fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
        }

        fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
        renderer.setRenderTarget(currentFluidTarget);
        renderer.render(fluidPlane, camera);

        displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
        renderer.setRenderTarget(null);
        renderer.render(displayPlane, camera);

        const temp = currentFluidTarget;
        currentFluidTarget = previousFluidTarget;
        previousFluidTarget = temp;

        frameCount++;
    }

    window.addEventListener("resize", () => {
        const newRect = gradientCanvas.getBoundingClientRect();
        renderer.setSize(newRect.width, newRect.height);
        fluidMaterial.uniforms.iResolution.value.set(newRect.width, newRect.height);
        displayMaterial.uniforms.iResolution.value.set(newRect.width, newRect.height);
        fluidTarget1.setSize(newRect.width, newRect.height);
        fluidTarget2.setSize(newRect.width, newRect.height);
        frameCount = 0;
    });

    animate();

    // ========================================================================
    // Contact form submission (Resend via Vercel serverless function)
    // ========================================================================

    const contactForm = document.getElementById("contact-form");
    const contactFeedback = document.getElementById("contact-feedback");
    const contactSubmit = document.getElementById("contact-submit");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("contact-name").value.trim();
            const email = document.getElementById("contact-email").value.trim();
            const message = document.getElementById("contact-message").value.trim();

            if (!name || !email || !message) {
                showFeedback("Please fill in all fields.", "error");
                return;
            }

            // Loading state
            contactSubmit.disabled = true;
            contactSubmit.textContent = "Sending...";
            contactFeedback.textContent = "";
            contactFeedback.className = "contact-form-feedback";

            // Timeout for slow mobile connections
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch("/api/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                const data = await response.json();

                if (response.ok) {
                    showFeedback("Message sent successfully! I'll get back to you soon.", "success");
                    contactForm.reset();
                } else {
                    showFeedback(data.error || "Something went wrong. Please try again.", "error");
                }
            } catch (err) {
                clearTimeout(timeoutId);
                if (err.name === "AbortError") {
                    showFeedback("Request timed out. Please try again.", "error");
                } else {
                    showFeedback("Network error. Please check your connection and try again.", "error");
                }
            } finally {
                contactSubmit.disabled = false;
                contactSubmit.textContent = "SEND MESSAGE";
            }
        });
    }

    function showFeedback(msg, type) {
        if (!contactFeedback) return;
        contactFeedback.textContent = msg;
        contactFeedback.className = `contact-form-feedback ${type}`;
    }
}