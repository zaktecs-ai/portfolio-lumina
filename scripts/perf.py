#!/usr/bin/env python3
"""Performance budget audit under emulated network + CPU conditions.

Uses CDP to throttle like a mid-range phone on 4G, then reports Core Web Vitals
(LCP, CLS, TBT-proxy via long tasks) and total transferred bytes.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:4111")

THROTTLE = {
    "offline": False,
    "latency": 70,           # ms RTT — decent 4G
    "downloadThroughput": int(1.6 * 1024 * 1024 / 8),  # 1.6 Mbps
    "uploadThroughput": int(750 * 1024 / 8),
}

VITALS = """() => new Promise(resolve => {
  const out = { lcp: 0, cls: 0, longTasks: 0 };
  try {
    new PerformanceObserver(l => { for (const e of l.getEntries()) out.lcp = Math.round(e.startTime); })
      .observe({type: 'largest-contentful-paint', buffered: true});
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; })
      .observe({type: 'layout-shift', buffered: true});
    new PerformanceObserver(l => { for (const e of l.getEntries()) out.longTasks += (e.duration || 0); })
      .observe({type: 'longtask', buffered: true});
  } catch (e) {}
  setTimeout(() => {
    const res = performance.getEntriesByType('resource');
    let bytes = 0; const by = {};
    for (const r of res) {
      bytes += r.transferSize || 0;
      const k = r.initiatorType || 'other';
      by[k] = (by[k] || 0) + (r.transferSize || 0);
    }
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const paints = Object.fromEntries(performance.getEntriesByType('paint').map(p => [p.name, Math.round(p.startTime)]));
    resolve({
      lcp: out.lcp,
      cls: Math.round(out.cls * 1000) / 1000,
      longTaskMs: Math.round(out.longTasks),
      transferKB: Math.round(bytes / 1024),
      byType: Object.fromEntries(Object.entries(by).map(([k,v]) => [k, Math.round(v/1024)])),
      requests: res.length,
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
      load: Math.round(nav.loadEventEnd || 0),
      paints,
    });
  }, 500);
})"""


async def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "throttled"
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu"])
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True,
                                  device_scale_factor=3)
        pg = await ctx.new_page()
        cdp = await ctx.new_cdp_session(pg)
        if mode == "throttled":
            await cdp.send("Network.enable")
            await cdp.send("Network.emulateNetworkConditions", THROTTLE)
            await cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})  # ~mid-range phone
        await pg.goto(BASE, wait_until="load")
        await pg.wait_for_timeout(6000)  # let LCP settle + lazy work finish
        vitals = await pg.evaluate(VITALS)
        print(json.dumps({"mode": mode, **vitals}, indent=1))
        await b.close()


asyncio.run(main())
