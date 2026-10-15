// Dawnbringer site script: suggests the visitor's language (never redirects), closes the language
// menu on an outside click or Escape, and plays the gameplay clip only while it is on screen.
// tools/build.ts fills in LANGS (every locale's suggestion strings) and BASE.
(() => {
  const LANGS = /*LANGS*/[];
  const BASE = /*BASE*/"/";
  const KEY = "db-lang";
  const page = document.body.dataset.page;
  const here = document.documentElement.lang;

  const store = (code) => { try { localStorage.setItem(KEY, code); } catch { /* storage off */ } };
  const stored = () => { try { return localStorage.getItem(KEY); } catch { return null; } };

  // A language picked in the switcher (or a dismissed suggestion) is remembered, so we stop asking.
  for (const a of document.querySelectorAll("[data-lang]")) a.addEventListener("click", () => store(a.dataset.lang));

  // The site language closest to the browser's: exact match, then Chinese script, then base language.
  function best() {
    for (const raw of navigator.languages || [navigator.language || ""]) {
      const n = raw.toLowerCase();
      const exact = LANGS.find((l) => l.code.toLowerCase() === n);
      if (exact) return exact;
      if (n.startsWith("zh")) return LANGS.find((l) => l.code === (/hant|^zh-(tw|hk|mo)$/.test(n) ? "zh-TW" : "zh-CN"));
      const base = LANGS.find((l) => l.code.toLowerCase().split("-")[0] === n.split("-")[0]);
      if (base) return base;
    }
    return null;
  }

  const bar = document.getElementById("suggest");
  const want = best();
  if (bar && (page === "" || page === "presskit/") && want && want.code !== here && !stored()) {
    const p = document.createElement("p");
    p.lang = want.code;
    p.textContent = want.text + " ";
    const go = document.createElement("a");
    go.href = BASE + want.dir + page;
    go.hreflang = want.code;
    go.textContent = want.go;
    go.addEventListener("click", () => store(want.code));
    const close = document.createElement("button");
    close.type = "button";
    close.lang = want.code;
    close.textContent = want.dismiss;
    close.addEventListener("click", () => { store(here); bar.hidden = true; });
    p.append(go);
    bar.append(p, close);
    bar.hidden = false;
  }

  const menu = document.querySelector("details.lang");
  if (menu) {
    document.addEventListener("click", (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
    });
  }

  // The clip plays muted while at least 40% visible, unless the visitor asked for less motion or
  // paused it; the controls stay, so it can always be paused or played by hand.
  const video = document.querySelector(".clip video");
  if (video && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let auto = false;
    let userPaused = false;
    video.addEventListener("pause", () => { if (!auto) userPaused = true; auto = false; });
    video.addEventListener("play", () => { userPaused = false; });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!userPaused) video.play().catch(() => {}); }
      else if (!video.paused) { auto = true; video.pause(); }
    }, { threshold: 0.4 }).observe(video);
  }
})();
