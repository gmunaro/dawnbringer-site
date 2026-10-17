// Dawnbringer site script: suggests the visitor's language (never redirects), closes the language
// menu on an outside click or Escape, and plays the gameplay clip only while it is on screen.
// tools/build.ts fills in LANGS (every locale's suggestion strings) and BASE.
(() => {
  const LANGS = [{"code":"en","dir":"","text":"This page is also available in English.","go":"Read in English","dismiss":"Close"},{"code":"pt-BR","dir":"pt-br/","text":"Esta página também está disponível em português.","go":"Ler em português","dismiss":"Fechar"},{"code":"es","dir":"es/","text":"Esta página también está disponible en español.","go":"Leer en español","dismiss":"Cerrar"},{"code":"fr","dir":"fr/","text":"Cette page est aussi disponible en français.","go":"Lire en français","dismiss":"Fermer"},{"code":"de","dir":"de/","text":"Diese Seite gibt es auch auf Deutsch.","go":"Auf Deutsch lesen","dismiss":"Schließen"},{"code":"it","dir":"it/","text":"Questa pagina è disponibile anche in italiano.","go":"Leggi in italiano","dismiss":"Chiudi"},{"code":"ru","dir":"ru/","text":"Эта страница есть и на русском.","go":"Читать на русском","dismiss":"Закрыть"},{"code":"uk","dir":"uk/","text":"Ця сторінка є й українською.","go":"Читати українською","dismiss":"Закрити"},{"code":"pl","dir":"pl/","text":"Ta strona jest dostępna także po polsku.","go":"Czytaj po polsku","dismiss":"Zamknij"},{"code":"tr","dir":"tr/","text":"Bu sayfa Türkçe olarak da mevcut.","go":"Türkçe oku","dismiss":"Kapat"},{"code":"ja","dir":"ja/","text":"このページは日本語でも読めます。","go":"日本語で読む","dismiss":"閉じる"},{"code":"ko","dir":"ko/","text":"이 페이지는 한국어로도 볼 수 있습니다.","go":"한국어로 보기","dismiss":"닫기"},{"code":"zh-CN","dir":"zh-cn/","text":"本页面也提供简体中文版。","go":"阅读简体中文版","dismiss":"关闭"},{"code":"zh-TW","dir":"zh-tw/","text":"本頁面也提供繁體中文版。","go":"閱讀繁體中文版","dismiss":"關閉"}];
  const BASE = "/dawnbringer-site/";
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
  if (bar && (page === "" || page === "presskit/" || page === "changelog/") && want && want.code !== here && !stored()) {
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
