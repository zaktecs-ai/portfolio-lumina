#!/usr/bin/env python3
"""Visual + functional audit harness for the Lumina portfolio.

Usage: python3 shoot.py [--width W --height H --tag name]
Writes PNGs to ./shots and prints console errors, failed requests and metrics.
"""
import asyncio, json, os, sys, argparse, time
from playwright.async_api import async_playwright

EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:4111")
OUT = "/home/ubuntu/.hermes/cache/scratch/shots"
os.makedirs(OUT, exist_ok=True)


async def audit(width, height, tag, full=True, mobile=False):
    report = {"tag": tag, "width": width, "height": height, "console": [], "errors": [], "failed": [], "requests": 0}
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu", "--use-gl=swiftshader"])
        ctx = await browser.new_context(
            viewport={"width": width, "height": height},
            device_scale_factor=2,
            is_mobile=mobile,
            has_touch=mobile,
            user_agent=("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" if mobile else None),
        )
        page = await ctx.new_page()
        page.on("console", lambda m: report["console"].append({"type": m.type, "text": m.text[:300]}) if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: report["errors"].append(str(e)[:400]))
        page.on("requestfailed", lambda r: report["failed"].append({"url": r.url, "err": r.failure}))
        page.on("response", lambda r: report["failed"].append({"url": r.url, "status": r.status}) if r.status >= 400 else None)

        t0 = time.time()
        await page.goto(BASE, wait_until="networkidle", timeout=60000)
        report["load_ms"] = int((time.time() - t0) * 1000)

        # settle animations
        await page.wait_for_timeout(1800)
        await page.screenshot(path=f"{OUT}/{tag}-hero.png")

        if full:
            # scroll through so reveal observers fire
            h = await page.evaluate("document.documentElement.scrollHeight")
            step = max(400, height // 2)
            y = 0
            while y < h:
                await page.evaluate(f"window.scrollTo(0,{y})")
                await page.wait_for_timeout(120)
                y += step
            await page.evaluate("window.scrollTo(0,0)")
            await page.wait_for_timeout(900)
            await page.screenshot(path=f"{OUT}/{tag}-full.png", full_page=True)

        metrics = await page.evaluate("""() => {
          const de = document.documentElement;
          const perf = performance.getEntriesByType('navigation')[0] || {};
          const paints = performance.getEntriesByType('paint').map(p => [p.name, Math.round(p.startTime)]);
          const res = performance.getEntriesByType('resource');
          const byType = {};
          let total = 0;
          for (const r of res) {
            const k = r.initiatorType;
            byType[k] = byType[k] || {count:0, bytes:0, ms:0};
            byType[k].count++;
            byType[k].bytes += r.transferSize || 0;
            byType[k].ms += r.duration || 0;
            total += r.transferSize || 0;
          }
          return {
            scrollW: de.scrollWidth, clientW: de.clientWidth, scrollH: de.scrollHeight,
            overflowX: de.scrollWidth > de.clientWidth + 1,
            domNodes: document.querySelectorAll('*').length,
            paints, transferKB: Math.round(total/1024),
            byType,
            domContentLoaded: Math.round(perf.domContentLoadedEventEnd || 0),
            loadEvent: Math.round(perf.loadEventEnd || 0),
            imgCount: document.images.length,
            brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src),
            fonts: [...new Set([...document.fonts].map(f => f.family + ' ' + f.status))],
            canvases: document.querySelectorAll('canvas').length,
          };
        }""")
        report["metrics"] = metrics

        # horizontal overflow check across widths (same page)
        overflowers = await page.evaluate("""() => {
          const vw = document.documentElement.clientWidth;
          const bad = [];
          document.querySelectorAll('body *').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            if (r.right > vw + 2 || r.left < -2) {
              const st = getComputedStyle(el);
              if (st.position === 'fixed' || st.visibility === 'hidden') return;
              bad.push({tag: el.tagName, cls: (el.className||'').toString().slice(0,60), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width)});
            }
          });
          return bad.slice(0, 25);
        }""")
        report["overflow"] = overflowers

        # text overlap detection: sibling leaf text boxes intersecting
        overlaps = await page.evaluate("""() => {
          // A text node is only "visible" if it is actually painted: not inside a
          // zero-height clipped container (collapsed accordions), not transparent.
          const isClipDead = el => {
            let p = el;
            while (p && p !== document.body) {
              const st = getComputedStyle(p);
              if (st.overflow === 'hidden' || p.classList.contains('faq-a')) {
                const pr = p.getBoundingClientRect();
                const er = el.getBoundingClientRect();
                if (pr.height < 4) return true;
                if (er.top > pr.bottom - 1 || er.bottom < pr.top + 1) return true;
              }
              p = p.parentElement;
            }
            return false;
          };
          const isLeafText = el => {
            if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return false;
            const st = getComputedStyle(el);
            if (st.visibility === 'hidden' || st.display === 'none' || parseFloat(st.opacity) < 0.05) return false;
            if (el.closest('[aria-hidden="true"]') || el.closest('[data-open="false"]')) return false;
            const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
            if (txt.length < 2) return false;
            if (isClipDead(el)) return false;
            return true;
          };
          const nodes = [...document.querySelectorAll('body *')].filter(isLeafText);
          const boxes = nodes.map(n => ({el: n, r: n.getBoundingClientRect()})).filter(o => o.r.width > 4 && o.r.height > 4);
          const hits = [];
          for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
              const a = boxes[i], b = boxes[j];
              if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
              const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
              const oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
              if (ox > 3 && oy > 3) {
                hits.push({
                  a: (a.el.className||'').toString().slice(0,40) + '|' + a.el.textContent.trim().slice(0,32),
                  b: (b.el.className||'').toString().slice(0,40) + '|' + b.el.textContent.trim().slice(0,32),
                  ox: Math.round(ox), oy: Math.round(oy)
                });
              }
            }
          }
          return hits.slice(0, 20);
        }""")
        report["textOverlap"] = overlaps

        await browser.close()
    return report


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--tag", default="desktop")
    ap.add_argument("--mobile", action="store_true")
    ap.add_argument("--nofull", action="store_true")
    a = ap.parse_args()
    rep = await audit(a.width, a.height, a.tag, full=not a.nofull, mobile=a.mobile)
    print(json.dumps(rep, indent=1))


if __name__ == "__main__":
    asyncio.run(main())
