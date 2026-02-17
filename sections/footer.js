import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function initFooter() {
    const footerContainer = document.querySelector(".site-footer .footer-container");
    if (!footerContainer) return;

    const mouse = { x: 0, y: 0 };
    window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const container = document.getElementById("footer-canvas");
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 0.75);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model;
    let modelBaseRotationX = 0.5;
    let modelBaseZ = -1;

    function setupScrollTrigger() {
        ScrollTrigger.create({
            trigger: ".site-footer",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const yValue = -35 * (1 - progress);
                gsap.set(footerContainer, { y: `${yValue}%` });

                modelBaseZ = -1 * (1 - progress);
                modelBaseRotationX = 0.5 * (1 - progress);
            },
        });
    }

    loader.load(
        "/model.glb",
        (gltf) => {
            model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.sub(center);
            model.position.y = 0;
            model.position.z = -1;
            model.rotation.x = 0.5;

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 1 / maxDim;
            model.scale.setScalar(scale);

            scene.add(model);
            setupScrollTrigger();
        },
        undefined,
        (error) => {
            console.warn(
                "Model not found. Creating fallback geometry."
            );

            // Fallback: create a torus knot
            const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0x6200b3,
                metalness: 0.5,
                roughness: 0.3,
            });
            model = new THREE.Mesh(geometry, material);
            model.rotation.x = 0.5;
            model.position.z = -1;
            scene.add(model);
            setupScrollTrigger();
        }
    );

    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            const targetRotationY = mouse.x * 0.3;
            const targetRotationX = -mouse.y * 0.2 + modelBaseRotationX;

            model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
            model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
            model.position.z += (modelBaseZ - model.position.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}
