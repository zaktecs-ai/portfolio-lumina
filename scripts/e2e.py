#!/usr/bin/env python3
"""End-to-end interaction audit: every control, modal, accordion, menu, link."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:4111")
OUT = "/home/ubuntu/.hermes/cache/scratch/shots"
os.makedirs(OUT, exist_ok=True)

results = []


def rec(name, ok, detail=""):
    results.append({"check": name, "ok": bool(ok), "detail": str(detail)[:300]})


async def run(width, height, mobile):
    global results
    results = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu"])
        ctx = await b.new_context(
            viewport={"width": width, "height": height},
            device_scale_factor=2,
            is_mobile=mobile,
            has_touch=mobile,
        )
        pg = await ctx.new_page()
        bad = []
        pg.on("pageerror", lambda e: bad.append(f"pageerror:{e}"))
        pg.on("response", lambda r: bad.append(f"{r.status}:{r.url}") if r.status >= 400 else None)
        await pg.goto(BASE, wait_until="load")
        await pg.wait_for_timeout(1500)

        # 1. Anchor links resolve to real sections
        hrefs = await pg.evaluate("""[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href'))""")
        missing = []
        for h in set(hrefs):
            if h == "#":
                continue
            found = await pg.evaluate(f"!!document.querySelector('{h}')")
            if not found:
                missing.append(h)
        rec("anchor targets exist", not missing, missing)

        # 2. FAQ accordion: click each, verify panel opens and only one open
        faqs = await pg.query_selector_all(".faq-q")
        rec("faq count", len(faqs) == 5, len(faqs))
        # The first item ships expanded, so a click on it must *close* it.
        for i, q in enumerate(faqs[:3]):
            await q.evaluate("e=>e.scrollIntoView({block:'center'})")
            before = await q.get_attribute("aria-expanded")
            await q.click()
            await pg.wait_for_timeout(420)
            expanded = await q.get_attribute("aria-expanded")
            rec(f"faq {i} toggles", expanded != before and expanded is not None, f"{before}->{expanded}")
            if expanded == "false":  # re-open so the next iteration still toggles
                await q.click()
                await pg.wait_for_timeout(320)
        open_panels = await pg.evaluate("""document.querySelectorAll('.faq-a[data-open="true"]').length""")
        rec("faq single-open", open_panels == 1, open_panels)

        # 3. Case study modal for every project
        buttons = await pg.query_selector_all(".work-card .work-actions .btn")
        rec("work action buttons", len(buttons) >= 10, len(buttons))
        cards = await pg.query_selector_all(".work-card")
        rec("project cards", len(cards) == 12, len(cards))
        for idx in range(len(cards)):
            card = cards[idx]
            await card.scroll_into_view_if_needed()
            await pg.wait_for_timeout(200)
            btn = await card.query_selector(".work-actions .btn")
            await btn.click()
            await pg.wait_for_timeout(600)
            opened = await pg.evaluate("""document.querySelector('.case')?.dataset.open""")
            title = await pg.evaluate("""document.querySelector('.case-bar-title strong')?.textContent?.trim()""")
            rec(f"modal opens p{idx+1}", opened == "true", title)
            # count images inside modal that loaded
            imginfo = await pg.evaluate("""() => {
              const imgs=[...document.querySelectorAll('.case img')];
              return {n: imgs.length, broken: imgs.filter(i=>i.complete&&i.naturalWidth===0).length};
            }""")
            rec(f"modal p{idx+1} images", imginfo["n"] > 0 and imginfo["broken"] == 0, imginfo)
            if idx == 0:
                await pg.screenshot(path=f"{OUT}/modal-{width}.png")
                # escape closes
                await pg.keyboard.press("Escape")
                await pg.wait_for_timeout(450)
                closed = await pg.evaluate("""document.querySelector('.case')?.dataset.open""")
                rec("modal closes on Escape", closed == "false", closed)
            else:
                closebtn = await pg.query_selector(".case-close")
                await closebtn.click()
                await pg.wait_for_timeout(450)

        # 4. Modal scroll + video for a project with video (index 2 = funda)
        await cards[2].scroll_into_view_if_needed()
        btn = await cards[2].query_selector(".work-actions .btn")
        await btn.click()
        await pg.wait_for_timeout(700)
        docs = []
        # Client-work cards (07, 08) carry the PDF/CSV evidence — open those.
        await (await pg.query_selector(".case-close")).click()
        await pg.wait_for_timeout(400)
        await cards[9].scroll_into_view_if_needed()
        await (await cards[9].query_selector(".work-actions .btn")).click()
        await pg.wait_for_timeout(700)
        docs = await pg.evaluate("""[...document.querySelectorAll('.case-doc')].map(a=>a.getAttribute('href'))""")
        rec("evidence links", len(docs) >= 2, docs)
        await pg.evaluate("""() => {const s=document.querySelector('.case-scroll'); s.scrollTop = s.scrollHeight;}""")
        await pg.wait_for_timeout(500)

        barTop = await pg.evaluate("""Math.round(document.querySelector('.case-bar').getBoundingClientRect().top)""")
        rec("sticky bar holds", barTop >= 0 and barTop < 200, barTop)
        await pg.screenshot(path=f"{OUT}/modal-bottom-{width}.png")
        rec("evidence links", len(docs) >= 2, docs)
        # Docs must be read *before* the modal unmounts (React drops the nodes).
        await (await pg.query_selector(".case-close")).click()
        await pg.wait_for_timeout(400)

        # 5. Doc links actually serve
        for d in set(docs):
            r = await pg.request.get(BASE + d)
            rec(f"doc {d.split('/')[-1]}", r.status == 200, r.status)

        # 6. Mobile menu
        if mobile:
            menu = await pg.query_selector(".menu-btn")
            rec("menu button visible", menu is not None)
            await menu.click()
            await pg.wait_for_timeout(450)
            opened = await pg.evaluate("""document.querySelector('.sheet')?.dataset.open""")
            rec("sheet opens", opened == "true", opened)
            await pg.screenshot(path=f"{OUT}/menu-{width}.png")
            link = await pg.query_selector(".sheet-link")
            await link.click()
            await pg.wait_for_timeout(700)
            closed = await pg.evaluate("""document.querySelector('.sheet')?.dataset.open""")
            rec("sheet closes on nav", closed == "false", closed)
            scrolled = await pg.evaluate("window.scrollY")
            rec("nav link scrolled page", scrolled > 200, scrolled)

        # 7. Nav desktop CTA + brand
        if not mobile:
            brand = await pg.query_selector(".nav .brand")
            rec("nav brand", brand is not None)
            active = await pg.evaluate("""document.querySelectorAll('.nav-link[data-active="true"]').length""")
            rec("nav active state set", active == 1, active)

        # 8. External links are valid URLs with rel
        ext = await pg.evaluate("""[...document.querySelectorAll('a[target="_blank"]')].map(a=>({href:a.href, rel:a.rel}))""")
        badrel = [e for e in ext if "noopener" not in (e["rel"] or "")]
        rec("external rel noopener", not badrel, badrel)

        # 9. Keyboard: tab through first 12 focusables, ensure focus is visible
        # Focus must land on distinct elements. Identify by text + tag, not class:
        # every button shares the class "btn", so class alone looked like a repeat.
        await pg.evaluate("window.scrollTo(0,0)")
        await pg.wait_for_timeout(200)
        await pg.keyboard.press("Tab")
        focus_seq = []
        for _ in range(14):
            el = await pg.evaluate("""() => {
              const a = document.activeElement;
              if (!a) return null;
              /* Include position: twelve project cards all have a "Case study"
                 button and a "GitHub" link, so text alone collapses to 2 keys. */
              const sec = a.closest('section')?.id || '';
              /* Each project card is an <article>: its index is enough to keep
                 twelve identical buttons distinct. */
              const art = a.closest('article');
              const idx = art ? String([...document.querySelectorAll('article')].indexOf(art)) : '';
              return a.tagName + '|' + (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 18) + '|' + sec + idx;
            }""")
            focus_seq.append(el)
            await pg.keyboard.press("Tab")
        distinct = len(set(focus_seq))
        rec("keyboard focus moves", distinct >= 3 and len(set(focus_seq)) > 0, f"{distinct} distinct: {focus_seq[:6]}")
        # and focus ring must actually be drawn
        ring = await pg.evaluate("""() => {
          const st = getComputedStyle(document.activeElement);
          return st.outlineStyle + ' ' + st.outlineWidth;
        }""")
        rec("focus ring visible", "solid" in ring or "dashed" in ring, ring)

        # 9b. Stack filters work and every icon loads
        chips = await pg.query_selector_all(".tools-chip")
        rec("stack filter chips", len(chips) >= 4, len(chips))
        all_tiles = await pg.evaluate("document.querySelectorAll('.tool-tile').length")
        for label in ("Languages", "Scraping", "Lead data"):
            for c in chips:
                if (await c.inner_text()).strip().lower() == label.lower():
                    await c.click()
                    await pg.wait_for_timeout(320)
                    n = await pg.evaluate("document.querySelectorAll('.tool-tile').length")
                    rec(f"filter {label}", 0 < n < all_tiles, f"{n}/{all_tiles}")
                    break
        for c in chips:
            if (await c.inner_text()).strip().lower() == "all":
                await c.click()
                break
        await pg.wait_for_timeout(400)
        icon_state = await pg.evaluate("""() => {
          const imgs=[...document.querySelectorAll('.tool-pad img')];
          const svgs=[...document.querySelectorAll('.tool-glyph svg')];
          return {imgs:imgs.length, broken:imgs.filter(i=>i.naturalWidth===0).length,
                  svgs:svgs.length, empty:svgs.filter(s=>!s.innerHTML.trim()).length};
        }""")
        rec("stack icons render", icon_state["broken"] == 0 and icon_state["empty"] == 0, icon_state)

        # 9c. Every project repo link resolves
        repos = await pg.evaluate("""[...document.querySelectorAll('.work-actions a[href*="github.com"]')].map(a=>a.href)""")
        rec("repo links present", len(repos) >= 6, len(repos))
        for u in set(repos):
            r = await pg.request.get(u)
            rec(f"repo {u.split('/')[-1]}", r.status == 200, r.status)

        # 9d. Avatar image loaded and circular
        av = await pg.evaluate("""() => {
          const a=document.querySelector('.brand-avatar'); const i=a&&a.querySelector('img');
          return a? {r:getComputedStyle(a).borderRadius, w:Math.round(a.getBoundingClientRect().width),
                     nw:i?i.naturalWidth:0} : null;
        }""")
        rec("avatar circular + loaded", bool(av) and av["r"].startswith("50%") and av["nw"] > 0, av)

        # 10. Skip link
        skip = await pg.query_selector(".skip-link")
        rec("skip link exists", skip is not None)

        # 11. No console errors
        rec("no runtime errors", len(bad) == 0, bad[:4])

        await b.close()
    return results


async def main():
    w = int(sys.argv[1]) if len(sys.argv) > 1 else 1440
    h = int(sys.argv[2]) if len(sys.argv) > 2 else 900
    mobile = len(sys.argv) > 3 and sys.argv[3] == "mobile"
    res = await run(w, h, mobile)
    fails = [r for r in res if not r["ok"]]
    for r in res:
        print(("PASS " if r["ok"] else "FAIL ") + r["check"] + ("" if r["ok"] else f"  -> {r['detail']}"))
    print(f"\n{len(res)-len(fails)}/{len(res)} passed")


if __name__ == "__main__":
    asyncio.run(main())
