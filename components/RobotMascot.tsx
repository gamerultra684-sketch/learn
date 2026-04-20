'use client';

import { useEffect, useRef } from 'react';
import type * as THREE from 'three';

/**
 * RobotMascot — React port of assets/js/robot-mascot.js
 *
 * Pixel-identical visual output:
 * - Helmet-style sphere head
 * - Visor face plate (dark)
 * - Glowing capsule eyes (sky-blue emissive) with blink animation
 * - Cylindrical ears / side detail
 * - Capsule torso + chest plate
 * - Pulsing power core (indigo emissive)
 * - Segmented arms (shoulder → upper arm → elbow → forearm → hand)
 * - Smooth floating + cursor tracking
 *
 * Performance optimizations vs original:
 * - Cleans up renderer + geometries on unmount
 * - devicePixelRatio capped at 1.5 (was 2)
 * - Uses shared geometry instances where possible
 */
export default function RobotMascot({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId = 0;
    let disposed = false;

    async function init() {
      const THREE = await import('three');
      if (disposed || !container) return;

      // ── SCENE ──────────────────────────────────────────────────
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        28,
        container.clientWidth / container.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, 3.8);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      // Perf: cap pixel ratio at 1.5 instead of 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
      container.appendChild(renderer.domElement);

      // ── LIGHTS ──────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(5, 5, 5);
      keyLight.castShadow = true;
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x4f46e5, 1, 10);
      rimLight.position.set(-2, 2, -2);
      scene.add(rimLight);

      // ── MATERIALS ───────────────────────────────────────────────
      const whiteShell  = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 });
      const metalJoint  = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.2,  metalness: 0.8 });
      const visorMat    = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1,  metalness: 0.5 });
      const eyeGlowMat  = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 3 });
      const accentMat   = new THREE.MeshStandardMaterial({ color: 0x4f46e5, emissive: 0x4f46e5, emissiveIntensity: 1 });

      // ── GROUPS ──────────────────────────────────────────────────
      const robotRoot = new THREE.Group();
      const bodyGroup = new THREE.Group();
      const headGroup = new THREE.Group();

      // ── HEAD ────────────────────────────────────────────────────
      const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), whiteShell);
      headBase.scale.y = 0.95;
      headGroup.add(headBase);

      const visor = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32, 0, Math.PI * 0.8, 0, Math.PI * 0.5),
        visorMat,
      );
      visor.rotation.x = Math.PI / 2;
      visor.rotation.y = -Math.PI * 0.4;
      visor.position.set(0, 0, 0.05);
      headGroup.add(visor);

      const eyeGeo = new THREE.CapsuleGeometry(0.015, 0.04, 4, 8);
      const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMat);
      leftEye.rotation.z = Math.PI / 2;
      leftEye.position.set(-0.07, 0, 0.22);
      headGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo.clone(), eyeGlowMat);
      rightEye.rotation.z = Math.PI / 2;
      rightEye.position.set(0.07, 0, 0.22);
      headGroup.add(rightEye);

      const earGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16);
      const leftEar = new THREE.Mesh(earGeo, metalJoint);
      leftEar.rotation.z = Math.PI / 2;
      leftEar.position.set(-0.21, 0, 0);
      headGroup.add(leftEar);
      const rightEar = leftEar.clone();
      rightEar.position.set(0.21, 0, 0);
      headGroup.add(rightEar);

      // ── BODY ────────────────────────────────────────────────────
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.3, 8, 16), whiteShell);
      torso.position.set(0, -0.35, 0);
      bodyGroup.add(torso);

      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.15, 0.1), whiteShell);
      chest.position.set(0, -0.28, 0.12);
      bodyGroup.add(chest);

      const core = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), accentMat);
      core.position.set(0, -0.28, 0.175);
      bodyGroup.add(core);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1), metalJoint);
      neck.position.set(0, -0.15, 0);
      bodyGroup.add(neck);

      // ── ARMS ────────────────────────────────────────────────────
      function createArm(isLeft: boolean): THREE.Group {
        const side = isLeft ? -1 : 1;
        const arm = new THREE.Group();
        arm.add(new THREE.Mesh(new THREE.SphereGeometry(0.07), whiteShell));                                      // shoulder
        const ua = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.15), whiteShell); ua.position.y = -0.1;  arm.add(ua);  // upper arm
        const elb = new THREE.Mesh(new THREE.SphereGeometry(0.045), metalJoint); elb.position.y = -0.18; arm.add(elb); // elbow
        const fa = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.15), whiteShell); fa.position.y = -0.26; arm.add(fa);   // forearm
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05), whiteShell); hand.position.y = -0.34; arm.add(hand);             // hand
        arm.position.set(side * 0.28, -0.25, 0);
        return arm;
      }

      const leftArm  = createArm(true);
      const rightArm = createArm(false);
      bodyGroup.add(leftArm, rightArm);

      // ── ASSEMBLE ────────────────────────────────────────────────
      robotRoot.add(headGroup, bodyGroup);
      robotRoot.position.y = -0.1;
      scene.add(robotRoot);

      // ── MOUSE TRACKING ──────────────────────────────────────────
      const mouse = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      document.addEventListener('mousemove', onMouseMove);

      // ── ANIMATION LOOP ──────────────────────────────────────────
      let time = 0;
      let blinkTimer = 0;
      const clock = new THREE.Clock();

      function animate() {
        animFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        time += delta;
        blinkTimer += delta;

        // Head tracking
        headGroup.rotation.x += (-mouse.y * 0.4 - headGroup.rotation.x) * 0.1;
        headGroup.rotation.y += ( mouse.x * 0.6 - headGroup.rotation.y) * 0.1;

        // Body subtle follow
        bodyGroup.rotation.y += (mouse.x * 0.2 - bodyGroup.rotation.y) * 0.05;

        // Arm idle sway
        leftArm.rotation.z  = -0.2 + Math.sin(time * 1.5) * 0.05;
        leftArm.rotation.x  = Math.sin(time * 1.2) * 0.1;
        rightArm.rotation.z =  0.2 - Math.sin(time * 1.5) * 0.05;
        rightArm.rotation.x = Math.sin(time * 1.2 + 0.5) * 0.1;

        // Blink
        if (blinkTimer > 3) {
          const s = Math.abs(Math.sin((blinkTimer - 3) * 15));
          if (blinkTimer < 3.2) {
            leftEye.scale.y  = 1 - s;
            rightEye.scale.y = 1 - s;
          } else {
            leftEye.scale.y  = 1;
            rightEye.scale.y = 1;
            blinkTimer = Math.random();
          }
        }

        // Float
        robotRoot.position.y = -0.1 + Math.sin(time * 2) * 0.05;

        // Core pulse
        accentMat.emissiveIntensity = 1 + Math.sin(time * 4) * 0.5;

        renderer.render(scene, camera);
      }

      animate();

      // ── RESIZE ──────────────────────────────────────────────────
      const onResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // ── CLEANUP (returned from useEffect) ───────────────────────
      return () => {
        disposed = true;
        cancelAnimationFrame(animFrameId);
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        // Dispose all geometries and materials
        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            (obj as THREE.Mesh).geometry?.dispose();
            const mat = (obj as THREE.Mesh).material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          }
        });
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    const cleanupPromise = init();

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrameId);
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
