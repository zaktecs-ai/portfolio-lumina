#!/usr/bin/env python3
"""Multi-width layout audit: overflow, overlap, clipping and broken assets at
every breakpoint that matters, including the 1100px grid switch."""
import asyncio, json
from playwright.async_api import async_playwright

EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"
URL = "http://127.0.0.1:4111"
WIDTHS = [(360, 780), (390, 844), (430, 900), (540, 900), (768, 900), (900, 950),
          (1024, 800), (1099, 800), (1100, 800), (1180, 820), (1280, 860), (1440, 900), (1920, 1080)]


async def check(pg):
    return await pg.evaluate("""() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const bad = [];
      // horizontal overflow that actually scrolls
      const overflowX = de.scrollWidth > vw + 1;

      // text nodes clipped by an ancestor with hidden overflow
      const clipped = [];
      document.querySelectorAll('h1,h2,h3,p,li,span,a,button').forEach(el => {
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.05) return;
        if (!el.textContent || !el.textContent.trim()) return;
        if (el.scrollWidth > Math.ceil(el.getBoundingClientRect().width) + 2 && st.overflow !== 'visible') {
          clipped.push({cls: (el.className||'').toString().slice(0,30), text: el.textContent.trim().slice(0,28)});
        }
      });

      // real text-overlap (ignore collapsed accordions / hidden nodes)
      const leaf = [...document.querySelectorAll('body *')].filter(el => {
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.05) return false;
        if (el.closest('[data-open="false"]') || el.closest('[aria-hidden="true"]')) return false;
        const t = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
        return t.length > 2;
      });
      const boxes = leaf.map(el => ({el, r: el.getBoundingClientRect()})).filter(o => o.r.width > 5 && o.r.height > 5);
      const overlaps = [];
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], b = boxes[j];
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
          const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
          if (ox > 4 && oy > 4) overlaps.push({a: (a.el.className||'').toString().slice(0,26), b: (b.el.className||'').toString().slice(0,26), ox: Math.round(ox), oy: Math.round(oy)});
        }
      }

      const imgs = [...document.images];
      return {
        vw, overflowX,
        broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc.split('/').pop()),
        clipped: clipped.slice(0, 6),
        overlaps: overlaps.slice(0, 6),
        toolTiles: document.querySelectorAll('.tool-tile').length,
        mirrorFlip: !!document.querySelector('.mirror-text-flip'),
        canvas: !!document.querySelector('.hero3d canvas'),
      };
    }""")


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"])
        fails = 0
        for w, h in WIDTHS:
            pg = await b.new_page(viewport={"width": w, "height": h})
            await pg.goto(URL, wait_until="networkidle")
            await pg.wait_for_timeout(900)
            # scroll through so lazy images and reveals resolve
            total = await pg.evaluate("document.documentElement.scrollHeight")
            y = 0
            while y < total:
                await pg.evaluate(f"window.scrollTo(0,{y})")
                await pg.wait_for_timeout(60)
                y += 500
            await pg.evaluate("window.scrollTo(0,0)")
            await pg.wait_for_timeout(500)
            res = await check(pg)
            ok = (not res["overflowX"]) and not res["clipped"] and not res["overlaps"] and not res["broken"]
            if not ok:
                fails += 1
            print(f"{'PASS' if ok else 'FAIL'} {w:>4}x{h:<4} overflowX={res['overflowX']} clipped={len(res['clipped'])} overlaps={len(res['overlaps'])} broken={len(res['broken'])} tiles={res['toolTiles']} flip={res['mirrorFlip']} canvas={res['canvas']}")
            if not ok:
                print("   ", json.dumps({k: res[k] for k in ("clipped", "overlaps", "broken")})[:400])
            await pg.close()
        await b.close()
        print(f"\n{len(WIDTHS)-fails}/{len(WIDTHS)} widths clean")


asyncio.run(main())
