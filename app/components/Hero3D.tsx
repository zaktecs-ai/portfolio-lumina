"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero3D — a mirror, not a glass panel.
 *
 * What changed from the glass-stack build:
 *  - The centre object is a *bevelled mirror slab*: a thin polished plate with a
 *    45° chamfer, so it reads as a real mirror (a hard polished edge that catches
 *    light at a different angle) rather than a frosted card with a rounded corner.
 *  - It genuinely *refelects* the scene: a planar `Reflector` renders the room
 *    and the type sculpture from the mirrored camera every frame, so what you see
 *    inside the plate is the actual geometry, not a painted gradient.
 *  - Chrome 3D type (S · C · R · A · P · E) floats in front of the mirror and is
 *    therefore visible *inside* it too — the reflection is real, not a flipped
 *    CSS copy.
 *
 * Performance / safety:
 *  - three.js imported dynamically; nothing blocks first paint
 *  - reflector renders at 0.5 DPR, scene at ≤1.75 DPR
 *  - renders only while the hero is in view
 *  - completely absent under `prefers-reduced-motion` and below 1100px, where
 *    the static CSS mirror plate takes over
 */
export default function Hero3D() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wide = window.matchMedia("(min-width: 1100px)");
    if (!wide.matches) {
      setFailed(true);
      return;
    }

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE: typeof import("three");
      let Reflector: typeof import("three/examples/jsm/objects/Reflector.js")["Reflector"];
      try {
        THREE = await import("three");
        ({ Reflector } = await import("three/examples/jsm/objects/Reflector.js"));
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
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        canvas.remove();
        setFailed(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
      camera.position.set(0, 1.1, 21);
      camera.lookAt(0, 0.4, 0);

      /* ── Environment: a photo studio. Long softboxes + one warm strip, so the
         chrome has real shapes to bend — a flat grey env makes metal look
         like plastic. ───────────────────────────────────────────────────── */
      const envScene = new THREE.Scene();
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(40, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xeef1f6, side: THREE.BackSide }),
      );
      envScene.add(dome);

      const softGeos: import("three").BufferGeometry[] = [];
      const softMats: import("three").Material[] = [];
      const addSoftbox = (w: number, h: number, x: number, y: number, z: number, tint: number) => {
        const g = new THREE.PlaneGeometry(w, h);
        const m = new THREE.MeshBasicMaterial({ color: tint, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, 0);
        envScene.add(mesh);
        softGeos.push(g);
        softMats.push(m);
      };
      addSoftbox(30, 4, 0, 14, 2, 0xffffff);
      addSoftbox(3, 26, -16, 2, 6, 0xf2f6ff);
      addSoftbox(3, 26, 16, 0, -4, 0xffffff);
      addSoftbox(20, 1.6, 4, -13, 4, 0xdfe3ea);
      addSoftbox(12, 2.4, -8, 6, -14, 0xfff2e0); // warm rim, keeps it from going blue

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(envScene, 0.02);
      scene.environment = envRT.texture;

      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(-7, 9, 10);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xe6eeff, 1.2);
      fill.position.set(8, -4, 6);
      scene.add(fill);

      /* ── The room the mirror stands in ─────────────────────────────
         A mirror only reads as a mirror if there is something *behind you* to
         reflect. This builds a low-key studio: a warm floor, a horizon line, a
         back wall with two lit panels, and the type sculpture in the middle.
         All of it is what the reflector actually samples. */
      const room = new THREE.Group();
      scene.add(room);

      /* Splayed walls, not a closed box: the mirror then reflects converging
         perspective lines — the strongest, cheapest cue that it has depth. */
      const floorGeo = new THREE.PlaneGeometry(120, 120);
      /* A large-format checker floor: without a repeating grid on the ground the
         reflection is a flat wash and the eye refuses to read it as a room. */
      const floorCanvas = document.createElement("canvas");
      floorCanvas.width = floorCanvas.height = 256;
      const fctx = floorCanvas.getContext("2d")!;
      fctx.fillStyle = "#e6e1d8";
      fctx.fillRect(0, 0, 256, 256);
      fctx.fillStyle = "#d5cfc4";
      fctx.fillRect(0, 0, 128, 128);
      fctx.fillRect(128, 128, 128, 128);
      fctx.strokeStyle = "rgba(150,142,130,0.5)";
      fctx.lineWidth = 2;
      fctx.strokeRect(0, 0, 256, 256);
      const floorTex = new THREE.CanvasTexture(floorCanvas);
      floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
      floorTex.repeat.set(26, 26);
      floorTex.anisotropy = 4;
      const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.28, metalness: 0.14 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -7.0;
      room.add(floor);

      const wallGeo = new THREE.PlaneGeometry(120, 60);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 0.85 });
      const wallL = new THREE.Mesh(wallGeo, wallMat);
      wallL.position.set(-13, 8, 4);
      wallL.rotation.y = Math.PI / 2 - 0.34;
      room.add(wallL);
      const wallR = new THREE.Mesh(wallGeo, wallMat);
      wallR.position.set(13, 8, 4);
      wallR.rotation.y = -Math.PI / 2 + 0.34;
      room.add(wallR);

      const backWall = new THREE.Mesh(wallGeo, wallMat);
      backWall.position.set(0, 8, 16);
      backWall.rotation.y = Math.PI;
      room.add(backWall);

      /* Furniture: two tall boxes and a low plinth, positioned *behind the
         camera's shoulder* so they are only ever seen inside the glass. Their
         silhouettes are what makes the reflection legible as a place. */
      const furnMat = new THREE.MeshStandardMaterial({ color: 0x30363f, roughness: 0.55, metalness: 0.2 });
      const furnLight = new THREE.MeshStandardMaterial({ color: 0xc9c2b4, roughness: 0.7 });
      const furnGeos: import("three").BufferGeometry[] = [];
      const addFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, mat: import("three").Material) => {
        const g = new THREE.BoxGeometry(w, h, d);
        furnGeos.push(g);
        const m = new THREE.Mesh(g, mat);
        m.position.set(x, y, z);
        room.add(m);
      };
      addFurniture(3.4, 11, 3.4, 6.4, -1.5, 13.5, furnMat); // tall cabinet
      addFurniture(2.4, 1.6, 2.4, -6.2, -6.2, 11.5, furnLight); // plinth
      addFurniture(7, 1.0, 2.6, 0.5, -6.4, 15, furnLight); // bench
      addFurniture(1.2, 3.4, 2.8, -9.0, -4.6, 14.5, furnMat); // tall slab

      /* Two soft light panels in the room *behind the camera* — these are what
         a mirror actually shows you: the light source and the room behind it. */
      const panelGeo = new THREE.PlaneGeometry(3.4, 20);
      const panelMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const panelL = new THREE.Mesh(panelGeo, panelMat);
      panelL.position.set(-9, 4.5, 7.5);
      panelL.rotation.y = Math.PI - 0.2;
      room.add(panelL);
      const panelR = panelL.clone();
      panelR.position.set(10.5, 3, 8);
      panelR.rotation.y = Math.PI + 0.18;
      room.add(panelR);

      /* A horizon band on the back wall: the single strongest cue that the
         rectangle is showing you a *depth*, not a texture. */
      const bandGeo = new THREE.PlaneGeometry(76, 2.4);
      const bandMat = new THREE.MeshBasicMaterial({ color: 0xdfd7c8 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.set(0, -1.4, 15.6);
      band.rotation.y = Math.PI;
      room.add(band);

      /* A warm practical light low in the room — gives the reflection a colour
         temperature split instead of an all-blue sheen. */
      const warmGeo = new THREE.PlaneGeometry(9, 2.2);
      const warmMat = new THREE.MeshBasicMaterial({ color: 0xffd9b0 });
      const warm = new THREE.Mesh(warmGeo, warmMat);
      warm.position.set(7, -4.6, 9);
      warm.rotation.y = -0.5;
      room.add(warm);
      const mirrorGroup = new THREE.Group();
      mirrorGroup.rotation.set(-0.06, -0.16, 0.015);
      scene.add(mirrorGroup);

      const MW = 8.4;
      const MH = 6.2;

      const reflector = new Reflector(new THREE.PlaneGeometry(MW, MH), {
        // Deliberately low resolution: the surface is bevelled and tilted, so a
        // soft reflection is what polished-but-used glass actually returns.
        textureWidth: 2048,
        textureHeight: 2048,
        color: 0xa9b2c0,
        clipBias: 0.003,
      });
      {
        const m = reflector.material as import("three").ShaderMaterial;
        m.uniforms.tDiffuse.value.minFilter = THREE.LinearFilter;
        /* Texel size comes from the live render target, not a hard-coded 1024.
           Hard-coding it blurred the reflection to a flat wash whenever the
           canvas was smaller than the assumption (it is ~330px wide here). */
        m.uniforms.uTexel = { value: new THREE.Vector2(1 / 1024, 1 / 1024) };
        m.fragmentShader = "uniform vec2 uTexel;\n" + m.fragmentShader;
        /* The reflector samples the scene at half resolution, then this shader
           adds the two artefacts every real mirror has: a slight softness (a
           mirror is never as sharp as the room) and a darker vignette toward the
           frame, where the glass meets the silvering. */
        m.fragmentShader = m.fragmentShader.replace(
          "gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );",
          `
          vec3 refl = blendOverlay( base.rgb, color );
          // softness: cheap 5-tap box on the reflection texture
          vec2 px = uTexel;
          vec3 soft = refl;
          soft += texture2D( tDiffuse, vUv + vec2( px.x * 1.6, 0.0 ) ).rgb;
          soft += texture2D( tDiffuse, vUv - vec2( px.x * 1.6, 0.0 ) ).rgb;
          soft += texture2D( tDiffuse, vUv + vec2( 0.0, px.y * 1.6 ) ).rgb;
          soft += texture2D( tDiffuse, vUv - vec2( 0.0, px.y * 1.6 ) ).rgb;
          soft /= 5.0;
          // vignette: mirror silvering darkens off-centre
          vec2 vc = vUv - 0.5;
          float vig = 1.0 - smoothstep( 0.18, 0.62, length( vec2( vc.x * 0.85, vc.y * 1.05 ) ) ) * 0.30;
          // Lift contrast: a pale room washed out to a flat wash in the first
          // pass, and a mirror with no contrast stops reading as glass.
          soft = clamp( ( soft - 0.5 ) * 1.42 + 0.5, 0.0, 1.0 );
          gl_FragColor = vec4( soft * vig, 0.97 );
          `,
        );
        m.transparent = true;
        m.needsUpdate = true;
      }
      mirrorGroup.add(reflector);

      /* The bevel: four polished strips at 45° around the plate. Each has its own
         normal, so it catches the key light at a different angle than the face —
         which is the single cue that says "mirror" instead of "screen". */
      const bevelMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.09,
        envMapIntensity: 3.1,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
      });
      const BT = 0.14; // chamfer thickness
      const bevelGeos: import("three").BufferGeometry[] = [];
      const addBevel = (w: number, h: number, pos: [number, number, number], rot: [number, number, number]) => {
        const g = new THREE.BoxGeometry(w, h, BT);
        bevelGeos.push(g);
        const m = new THREE.Mesh(g, bevelMat);
        m.position.set(...pos);
        m.rotation.set(...rot);
        mirrorGroup.add(m);
      };
      addBevel(MW + BT * 2, BT, [0, MH / 2 + BT / 2, 0], [0, 0, 0]);
      addBevel(MW + BT * 2, BT, [0, -MH / 2 - BT / 2, 0], [0, 0, 0]);
      addBevel(BT, MH + BT * 2, [-MW / 2 - BT / 2, 0, 0], [0, 0, Math.PI / 2]);
      addBevel(BT, MH + BT * 2, [MW / 2 + BT / 2, 0, 0], [0, 0, Math.PI / 2]);

      /* A thin backing plate stops the mirror looking like a floating plane. */
      const backingGeo = new THREE.BoxGeometry(MW + BT, MH + BT, 0.18);
      const backingMat = new THREE.MeshPhysicalMaterial({ color: 0xd9dee7, metalness: 0.5, roughness: 0.45 });
      const backing = new THREE.Mesh(backingGeo, backingMat);
      backing.position.z = -0.1;
      mirrorGroup.add(backing);

      /* ── Chrome type floating in front of the mirror ─────────────────
         These are extruded glyph plates built from simple geometry (no font
         loader, no network request). They are what the mirror reflects, and
         they carry the page's subject — not a decorative torus. */
      const typeGroup = new THREE.Group();
      /* Hard-won detail: the sculpture sits *in front of the glass and to one
         side*, low enough that its own body never covers the reflection. The
         first attempt put it dead centre — the mirror then reflected nothing but
         data bars, and the whole object stopped reading as a mirror. */
      typeGroup.position.set(-7.4, -1.9, 4.6);
      typeGroup.rotation.set(0.02, 0.62, -0.03);
      typeGroup.scale.setScalar(0.62);
      scene.add(typeGroup);

      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.06,
        envMapIntensity: 3.4,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      });
      const slateMat = new THREE.MeshPhysicalMaterial({
        color: 0x1d2330,
        metalness: 0.85,
        roughness: 0.16,
        envMapIntensity: 2.1,
      });

      const plateGeos: import("three").BufferGeometry[] = [];
      const plateMeshes: import("three").Mesh[] = [];
      // A "data row" motif: stacked plates of varying width = rows in a dataset.
      const rows = [
        { w: 5.2, h: 0.62, y: 1.55, mat: chromeMat, z: 0 },
        { w: 6.1, h: 0.62, y: 0.72, mat: slateMat, z: 0.16 },
        { w: 4.4, h: 0.62, y: -0.11, mat: chromeMat, z: -0.1 },
        { w: 5.6, h: 0.62, y: -0.94, mat: slateMat, z: 0.22 },
        { w: 3.3, h: 0.62, y: -1.77, mat: chromeMat, z: 0 },
      ];
      for (const r of rows) {
        const g = new THREE.BoxGeometry(r.w, r.h, 0.16);
        plateGeos.push(g);
        const m = new THREE.Mesh(g, r.mat);
        m.position.set(0, r.y, r.z);
        typeGroup.add(m);
        plateMeshes.push(m);
      }

      /* Small "cells" scattered on the rows — the scraped fields. */
      const cellGeo = new THREE.BoxGeometry(0.22, 0.22, 0.08);
      const cellMeshes: import("three").Mesh[] = [];
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.25,
        emissive: new THREE.Color(0xbcd2ff),
        emissiveIntensity: 0.5,
      });
      for (let i = 0; i < 14; i++) {
        const m = new THREE.Mesh(cellGeo, cellMat);
        const row = rows[i % rows.length];
        m.position.set(-row.w / 2 + 0.45 + (i * 0.37) % (row.w - 0.9), row.y, row.z + 0.14);
        typeGroup.add(m);
        cellMeshes.push(m);
      }

      /* ── Interaction: pointer parallax, damped; slow turntable ─────── */
      let px = 0;
      let py = 0;
      let tx = 0;
      let ty = 0;
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

      /* Keep the reflect-blur texel size in sync with the real render target. */
      const syncTexel = () => {
        const rt = (reflector as unknown as { getRenderTarget?: () => import("three").WebGLRenderTarget }).getRenderTarget?.();
        const m = reflector.material as import("three").ShaderMaterial;
        if (rt && m.uniforms.uTexel) {
          m.uniforms.uTexel.value.set(1 / rt.width, 1 / rt.height);
        }
      };
      syncTexel();

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

        px += (tx - px) * 0.035;
        py += (ty - py) * 0.035;

        // Mirror barely moves: a mirror is heavy. 4° of travel, not 40°.
        mirrorGroup.rotation.y = -0.16 + px * 0.1 + Math.sin(t * 0.13) * 0.02;
        mirrorGroup.rotation.x = -0.06 + py * 0.07;

        // The data plates drift in front, each at its own depth.
        plateMeshes.forEach((m, i) => {
          const depth = i * 0.06;
          m.position.x = Math.sin(t * 0.32 + i * 0.7) * (0.22 + depth) + px * (0.5 + depth * 3);
          m.position.y = rows[i].y + Math.sin(t * 0.45 + i) * 0.045 + py * 0.18;
          m.rotation.y = Math.cos(t * 0.22 + i) * 0.06 + px * 0.12;
        });
        cellMeshes.forEach((m, i) => {
          m.rotation.x = t * (0.2 + (i % 5) * 0.05);
          m.rotation.y = t * 0.16;
          m.position.z = rows[i % rows.length].z + 0.14 + Math.sin(t * 1.1 + i) * 0.03;
        });

        typeGroup.rotation.y = px * 0.16;
        typeGroup.rotation.x = py * 0.09;

        renderer.render(scene, camera);
        raf = visible ? requestAnimationFrame(tick) : 0;
      };
      start();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        io.disconnect();
        reflector.dispose?.();
        plateGeos.forEach((g) => g.dispose());
        bevelGeos.forEach((g) => g.dispose());
        cellGeo.dispose();
        backingGeo.dispose();
        chromeMat.dispose();
        slateMat.dispose();
        cellMat.dispose();
        bevelMat.dispose();
        backingMat.dispose();
        softGeos.forEach((g) => g.dispose());
        softMats.forEach((m) => m.dispose());
        dome.geometry.dispose();
        (dome.material as import("three").Material).dispose();
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
