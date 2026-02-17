import * as THREE from "three";
import { heroVertexShader, heroFragmentShader } from "../shaders.js";

export function initHero() {
    const config = {
        lerpFactor: 0.1,
        parallaxStrength: 0.25,
        distortionMultiplier: 15,
        glassStrength: 2.0,
        glassSmoothness: 0.0001,
        stripesFrequency: 35,
        edgePadding: 0.1,
    };

    const container = document.querySelector(".hero-section");
    if (!container) return;

    const imageElement = document.getElementById("heroGlassTexture");
    if (!imageElement) return;

    const canvasContainer = container.querySelector(".hero-canvas");

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const textureSize = { x: 1, y: 1 };
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: null },
            uResolution: {
                value: new THREE.Vector2(canvasContainer.offsetWidth, canvasContainer.offsetHeight),
            },
            uTextureSize: {
                value: new THREE.Vector2(textureSize.x, textureSize.y),
            },
            uMouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
            uParallaxStrength: { value: config.parallaxStrength },
            uDistortionMultiplier: { value: config.distortionMultiplier },
            uGlassStrength: { value: config.glassStrength },
            uStripesFrequency: { value: config.stripesFrequency },
            uGlassSmoothness: { value: config.glassSmoothness },
            uEdgePadding: { value: config.edgePadding },
        },
        vertexShader: heroVertexShader,
        fragmentShader: heroFragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function loadImage() {
        if (!imageElement.complete) {
            imageElement.onload = loadImage;
            return;
        }

        const texture = new THREE.Texture(imageElement);
        textureSize.x = imageElement.naturalWidth || imageElement.width;
        textureSize.y = imageElement.naturalHeight || imageElement.height;

        texture.needsUpdate = true;
        material.uniforms.uTexture.value = texture;
        material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
    }

    if (imageElement.complete) {
        loadImage();
    } else {
        imageElement.onload = loadImage;
    }

    window.addEventListener("mousemove", (e) => {
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    });

    window.addEventListener("resize", () => {
        renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        material.uniforms.uResolution.value.set(
            canvasContainer.offsetWidth,
            canvasContainer.offsetHeight
        );
    });

    function animate() {
        requestAnimationFrame(animate);

        mouse.x = lerp(mouse.x, targetMouse.x, config.lerpFactor);
        mouse.y = lerp(mouse.y, targetMouse.y, config.lerpFactor);
        material.uniforms.uMouse.value.set(mouse.x, mouse.y);

        renderer.render(scene, camera);
    }

    animate();
}
