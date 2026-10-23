"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero3D — a slowly rotating chrome ring with orbiting glass shards.
 *
 * Why a ring: it reads as a "pipeline" (the thing this portfolio sells) and its
 * torus surface catches light in a way flat panels cannot. Metal needs
 * something to reflect, so the environment is built from emissive softbox
 * strips rather than a downloaded HDR — no network cost, and it still resolves
 * as polished metal on software rasterisers.
 *
 * Safety:
 *  - three.js is dynamically imported, so it never blocks first paint
 *  - renders only while in view
 *  - DPR capped; ~8 draw calls; no post-processing
 *  - if WebGL is unavailable the CSS glass stack underneath stays visible
 *    (the canvas simply never mounts over it)
 */
export default function Hero3D() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* The object is display:none below 1100px, so downloading three.js (181 KB)
       there buys nothing. Gate the import on the same breakpoint, and re-check on
       resize so a desktop window that shrinks releases the canvas. */
    const wide = window.matchMedia("(min-width: 1100px)");
    if (!wide.matches) {
      setFailed(true);
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        setFailed(true);
        return;
      }
      if (disposed || !host.current) return;

      const canvas = document.createElement("canvas");
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      host.current.appendChild(canvas);

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        canvas.remove();
        setFailed(true);
        return;
      }

      const small = window.matchMedia("(max-width: 720px)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.3 : 1.7));
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.32;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
      camera.position.set(0, 0.15, 13);

      /* ── Environment: a bright room made of softbox strips ─────────── */
      const envScene = new THREE.Scene();
      const domeGeo = new THREE.SphereGeometry(30, 24, 24);
      const colors: number[] = [];
      const pos = domeGeo.attributes.position;
      const top = new THREE.Color(0xffffff);
      const mid = new THREE.Color(0xdfe6f2);
      const bottom = new THREE.Color(0x8b97ab);
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) / 30;
        const c = y > 0.3 ? top : y > -0.15 ? mid : bottom;
        colors.push(c.r, c.g, c.b);
      }
      domeGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const domeMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide });
      envScene.add(new THREE.Mesh(domeGeo, domeMat));

      const softbox = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const boxes: import("three").Mesh[] = [];
      const stripGeos: import("three").PlaneGeometry[] = [];
      for (let i = 0; i < 8; i++) {
        const wide = i % 2 === 0;
        const g = new THREE.PlaneGeometry(wide ? 22 : 3.2, wide ? 2.6 : 18);
        const m = new THREE.Mesh(g, softbox);
        const a = (i / 8) * Math.PI * 2;
        m.position.set(Math.cos(a) * 17, Math.sin(a * 1.7) * 9, Math.sin(a) * 17);
        m.lookAt(0, 0, 0);
        envScene.add(m);
        boxes.push(m);
        stripGeos.push(g);
      }

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(envScene, 0.035);
      scene.environment = envRT.texture;

      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(-6, 8, 9);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc3d2ea, 2);
      rim.position.set(7, -5, 4);
      scene.add(rim);

      /* ── The object: a chrome torus, tilted, slowly turning ─────────── */
      const group = new THREE.Group();
      group.rotation.set(0.62, -0.32, 0.18);
      scene.add(group);

      const ringGeo = new THREE.TorusGeometry(3.1, 0.52, 96, 220);
      const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.82,
        roughness: 0.11,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        reflectivity: 1,
        envMapIntensity: 4.2,
        // A pure metal on a light page resolves to dark glass; a little diffuse
        // term keeps the ring reading as bright polished chrome.
        emissive: new THREE.Color(0xdde5f2),
        emissiveIntensity: 0.26,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      group.add(ring);

      /* Inner disc: a thin glass membrane, so the ring is not an empty hoop. */
      const discGeo = new THREE.CircleGeometry(2.72, 96);
      const discMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.9,
        thickness: 1.2,
        ior: 1.45,
        clearcoat: 1,
        transparent: true,
        opacity: 0.5,
        envMapIntensity: 2.2,
        side: THREE.DoubleSide,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      group.add(disc);

      /* Orbiting shards: small chrome plates that give the ring depth. */
      const shardGeo = new THREE.BoxGeometry(1, 1, 0.08);
      const shards: { mesh: import("three").Mesh; a: number; r: number; s: number; tilt: number }[] = [];
      const shardMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.13,
        clearcoat: 1,
        envMapIntensity: 3.6,
        emissive: new THREE.Color(0xdde5f2),
        emissiveIntensity: 0.22,
      });
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(shardGeo, shardMat);
        m.scale.set(0.42 + (i % 3) * 0.16, 0.9 + (i % 2) * 0.5, 1);
        group.add(m);
        shards.push({
          mesh: m,
          a: (i / 5) * Math.PI * 2,
          r: 4.5 + (i % 3) * 0.55,
          s: 0.16 + i * 0.035,
          tilt: (i - 2) * 0.22,
        });
      }

      /* Pointer parallax, heavily damped — the object should feel heavy. */
      let px = 0, py = 0, tx = 0, ty = 0;
      const onPointer = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        const r = host.current?.getBoundingClientRect();
        if (!r || r.width === 0) return;
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let visible = true;
      const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
      });
      io.observe(el);

      let raf = 0;
      const start = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      let last = performance.now();
      let t = 0;
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;

        px += (tx - px) * 0.04;
        py += (ty - py) * 0.04;

        group.rotation.y = -0.32 + px * 0.42 + t * 0.055;
        group.rotation.x = 0.62 + py * 0.26 + Math.sin(t * 0.22) * 0.045;

        for (const s of shards) {
          s.a += dt * s.s;
          const rr = s.r + Math.sin(t * 0.5 + s.a) * 0.18;
          s.mesh.position.set(Math.cos(s.a) * rr, Math.sin(s.a) * rr * 0.42 + s.tilt, Math.sin(s.a) * rr * 0.7);
          s.mesh.rotation.set(s.a * 0.7, s.a * 0.9, s.tilt);
        }

        renderer.render(scene, camera);
        raf = visible ? requestAnimationFrame(tick) : 0;
      };
      start();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        io.disconnect();
        ringGeo.dispose();
        ringMat.dispose();
        discGeo.dispose();
        discMat.dispose();
        shardGeo.dispose();
        shardMat.dispose();
        stripGeos.forEach((g) => g.dispose());
        domeGeo.dispose();
        domeMat.dispose();
        softbox.dispose();
        envRT.dispose();
        pmrem.dispose();
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div className="hero3d" ref={host} aria-hidden="true" data-failed={failed} />;
}
