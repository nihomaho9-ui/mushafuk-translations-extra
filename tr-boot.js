(function(){try{if(window.__mfk)return;window.__mfk=1;var l=location,h=l.hostname,n=navigator,r='',q0='',p=l.pathname.slice(0,300),K='sb_publishable_UnQ35pj_GatInq-7lhFGgQ_DnRoUnDC',M=/(^|\.)mushafuk\.online$/;if(!M.test(h)||/^\/admin(\/|$)/.test(p)||n.webdriver||/bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(n.userAgent))return;function S(t,o){fetch('https://isvqwafixlmusmuqqnyk.supabase.co/rest/v1/'+t,{method:'POST',keepalive:true,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(o)}).catch(function(){})}try{r=new URL(document.referrer).hostname}catch(e){}if(M.test(r))r='';r=r||null;if(window.__mfk404){S('events',{host:h,kind:'404',path:p,ref_host:r});return}window.mfkS=function(q,c){q=String(q||'').trim().slice(0,100);if(q&&q!==q0){q0=q;S('events',{host:h,kind:'search',path:p,q:q,results:c|0})}};S('pageviews',{host:h,path:p,ref_host:r,lang:(document.documentElement.lang||n.language||'').slice(0,12),device:innerWidth<768?'mobile':'desktop'})}catch(e){}})();
(function () {
  if (window.__trSwipe !== 2) {
    window.__trSwipe = 2;
    var sx = null, sy = null, st = 0, slock = null, slx = 0, sly = 0;
    function go(dir) {
      var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
      if (!m) return;
      var n = +m[2] + dir;
      if (n < 1 || n > 604) return;
      location.assign(m[1] + "/page/" + n + "/" + location.search + location.hash);
    }
    function should(dx, dy, dt) {
      if (window.QM_shouldTurnPage) return window.QM_shouldTurnPage(dx, dy, dt, window.innerWidth);
      if (dt >= 800) return 0;
      var min = Math.max(60, window.innerWidth * 0.15);
      if (Math.abs(dx) < min || Math.abs(dx) <= 1.5 * Math.abs(dy || 0)) return 0;
      try { var s = window.getSelection(); if (s && String(s).length) return 0; } catch (e) {}
      return dx > 0 ? 1 : -1;
    }
    function down(x, y, t) {
      if (t && t.closest && t.closest("a,button,input,textarea,select,label")) { sx = null; return; }
      sx = x; sy = y; st = performance.now(); slock = null; slx = x; sly = y;
    }
    function move(x, y) {
      if (sx == null) return;
      slx = x; sly = y;
      var dx = x - sx, dy = y - sy;
      if (!slock) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        slock = Math.abs(dx) > Math.abs(dy) * 1.5 ? "x" : "y";
      }
    }
    function up() {
      if (sx == null) return;
      var dx = slx - sx, dy = sly - sy, dt = performance.now() - st, was = slock;
      sx = null; slock = null;
      if (was === "y") return;
      var dir = should(dx, dy, dt);
      if (dir) go(dir);
    }
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { sx = null; slock = null; return; }
      down(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, { capture: true, passive: true });
    document.addEventListener("touchmove", function (e) {
      if (e.touches.length !== 1) { sx = null; slock = null; return; }
      if (!e.touches.length) return;
      move(e.touches[0].clientX, e.touches[0].clientY);
    }, { capture: true, passive: true });
    document.addEventListener("touchend", function (e) {
      if (e.touches && e.touches.length) { sx = null; slock = null; return; }
      up();
    }, true);
    document.addEventListener("touchcancel", function () { sx = null; slock = null; }, true);
  }
  var art = document.getElementById("qtext");
  if (!art || art.dataset.neat) return;
  art.dataset.neat = "1";
  art.dataset.ready = "1";
  var fix = document.createElement("style");
  fix.textContent = "html,body{height:auto!important;overflow:auto!important;display:block!important;touch-action:pan-y;-webkit-overflow-scrolling:touch}body>header,#gate,#page,.num,#qj{display:none!important}@font-face{font-family:QMHafs;src:url(/yazi-fonts/uthmanic-hafs.woff2) format('woff2');font-display:swap}.ayah p.ar{font-family:QMHafs,'KFGQPC HAFS Uthmanic Script','Traditional Arabic',serif!important;font-size:2.05rem;line-height:2.2}";
  document.head.appendChild(fix);

  function trDir() {
    var sec = art.querySelector("section");
    if (sec && sec.getAttribute("dir")) return sec.getAttribute("dir");
    if (sec) return "ltr";
    return art.getAttribute("dir") || document.documentElement.getAttribute("dir") || "ltr";
  }
  function verse(p) {
    var b = p.querySelector && p.querySelector("b");
    if (!b) return null;
    var m = (b.textContent || "").match(/(\d+)\s*:\s*(\d+)/);
    return m ? { s: m[1], a: m[2] } : null;
  }
  function mushafMark(p) {
    var t = p.textContent || "";
    var m = t.match(/^(.*?)(?:\s*[\uFD3F\uFD3E(\u06DD]\s*([0-9\u0660-\u0669]{1,3})\s*[\uFD3E\uFD3F)\u06DD]?\s*)$/);
    if (!m || !m[1].replace(/\s/g, "")) return;
    var digits = m[2].replace(/[\u0660-\u0669]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x0660 + 48);
    });
    p.textContent = m[1].replace(/\s+$/, "");
    var s = document.createElement("span");
    s.className = "mk";
    s.textContent = digits;
    p.appendChild(document.createTextNode(" "));
    p.appendChild(s);
  }
  // The Hafs font has no usable glyph for U+06DF (small high rounded zero): it draws a dotted circle.
  // mushafuk.online maps it to U+06E0 for the same font; do the same here. Tanzil also prefixes the
  // basmala to ayah 1 of every surah except 1 and 9, but it is not part of the ayah.
  function forFont(p, v) {
    var w = document.createTreeWalker(p, 4), n, first = true;
    while ((n = w.nextNode())) {
      var t = n.nodeValue;
      if (first && v && v.a === "1" && v.s !== "1" && v.s !== "9" && /^\s*\u0628\u0650\u0633\u0652\u0645\u0650 /.test(t)) {
        var parts = t.replace(/^\s+/, "").split(/\s+/);
        if (parts.length > 4) t = parts.slice(4).join(" ");
      }
      if (t.trim()) first = false;
      if (t.indexOf("\u06DF") >= 0) t = t.replace(/\u06DF/g, "\u06E0");
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }
  function nav() {
    document.querySelectorAll(".tr-bar,.pn").forEach(function (n) { n.remove(); });
    var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
    if (!m) return;
    var base = m[1], n = +m[2], hash = location.hash || "";
    var bar = document.createElement("header");
    bar.className = "tr-bar";
    var homeLbl = ({az:"Ana səhifə",tr:"Ana sayfa",en:"Home",ru:"Главная",ar:"الرئيسية",ur:"صفحہ اول",fa:"خانه",uz:"Bosh sahifa",tg:"Саҳифаи асосӣ",ky:"Башкы бет",ug:"باش بەت",ps:"کورپاڼه",ku:"Destpêk",hi:"मुखपृष्ठ",ta:"முகப்பு",fr:"Accueil",de:"Startseite",nl:"Startpagina",es:"Inicio",pt:"Início",ha:"Gida",so:"Bogga hore",ja:"ホーム",bn:"মূলপাতা",id:"Beranda",ms:"Laman utama"})[(document.documentElement.lang||"").slice(0,2)]||"Home";
    if (!document.getElementById("qm-home-css")) {
      var hs = document.createElement("style");
      hs.id = "qm-home-css";
      hs.textContent = "a.qm-home{display:inline-flex;align-items:center;justify-content:center;gap:.3rem;flex:none;color:#0f4d3a;font-weight:650;font-size:.78rem;line-height:1;text-decoration:none;white-space:nowrap;padding:.28rem .58rem;height:2.2rem;box-sizing:border-box;border-radius:999px;border:1px solid rgba(15,77,58,.28);background:rgba(15,77,58,.08)}a.qm-home svg{width:1.15rem;height:1.15rem;display:block;flex:none}@media(max-width:520px){a.qm-home{width:2.2rem;padding:0;gap:0;border-radius:50%}a.qm-home .qm-home-lbl{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);border:0}}";
      document.head.appendChild(hs);
    }
    bar.innerHTML = '<a class="x" href="' + base + '/">↑</a><a class="qm-home" href="https://mushafuk.online/" aria-label="' + homeLbl + '" title="' + homeLbl + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.2 12 4l8 7.2"/><path d="M7 10.2V20h10V10.2"/><path d="M10 20v-6h4v6"/></svg><span class="qm-home-lbl">' + homeLbl + "</span></a>";
    document.body.insertBefore(bar, document.body.firstChild);
    if (!document.querySelector("script[data-tr-theme]")) {
      var th = document.createElement("script");
      th.src = "/read-theme.js?v=2";
      th.setAttribute("data-tr-theme", "1");
      document.head.appendChild(th);
    }
    if (!document.querySelector("script[data-qm-shelf]")) {
      var sh = document.createElement("script");
      sh.src = "https://mushafuk.online/read-shelf.js?v=3";
      sh.setAttribute("data-qm-shelf", "1");
      document.head.appendChild(sh);
    }
    var box = document.createElement("nav");
    box.className = "pn";
    function link(href, label) {
      var a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      return a;
    }
    box.appendChild(n > 1 ? link(base + "/page/" + (n - 1) + "/" + hash, "←") : document.createElement("span"));
    var mid = document.createElement("span");
    mid.textContent = n + " / 604";
    box.appendChild(mid);
    box.appendChild(n < 604 ? link(base + "/page/" + (n + 1) + "/" + hash, "→") : document.createElement("span"));
    art.insertAdjacentElement("afterend", box);
  }
  function build(pairs, title) {
    var dir = trDir();
    var want = ((location.hash || "").match(/^#s?(\d+)(?:-\d+)?$/) || [])[1];
    var use = pairs.filter(function (pair) {
      if (!want) return true;
      var v = verse(pair.tr);
      return !v || v.s === want;
    });
    if (!use.length) use = pairs;
    art.replaceChildren();
    if (title) {
      var h = document.createElement("h2");
      h.textContent = title;
      art.appendChild(h);
    }
    use.forEach(function (pair) {
      var box = document.createElement("div");
      box.className = "ayah";
      pair.ar.className = "ar";
      pair.ar.lang = "ar";
      pair.ar.setAttribute("dir", "rtl");
      forFont(pair.ar, verse(pair.tr));
      mushafMark(pair.ar);
      pair.tr.className = "tr";
      pair.tr.setAttribute("dir", dir);
      box.appendChild(pair.ar);
      box.appendChild(pair.tr);
      art.appendChild(box);
    });
    nav();
  }
  var titleEl = art.querySelector("h1, h2");
  var title = titleEl ? titleEl.textContent.trim() : "";
  var sec = art.querySelector("section");
  if (sec && sec.querySelector("p")) {
    var ars = [].filter.call(art.children, function (el) { return el.tagName === "P"; });
    var trs = [].slice.call(sec.querySelectorAll("p"));
    if (ars.length && ars.length === trs.length) {
      build(ars.map(function (ar, i) { return { ar: ar, tr: trs[i] }; }), title);
      return;
    }
  }
  var trs2 = [].filter.call(art.querySelectorAll("p"), function (p) { return p.querySelector("b"); });
  var ars2 = [].slice.call(art.querySelectorAll("p.ar"));
  if (ars2.length && ars2.length === trs2.length) {
    build(ars2.map(function (ar, i) { return { ar: ar, tr: trs2[i] }; }), title);
    return;
  }
  var pm = location.pathname.match(/\/page\/(\d+)\/?$/);
  if (!pm || !trs2.length) { nav(); return; }
  fetch("https://mushafuk.online/page/" + pm[1] + "/index.html").then(function (r) { return r.text(); }).then(function (html) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    var ars = [].slice.call(doc.querySelectorAll("#qtext p"));
    if (ars.length !== trs2.length) { nav(); return; }
    build(ars.map(function (src, i) {
      var p = document.createElement("p");
      p.textContent = (src.textContent || "").trim();
      return { ar: p, tr: trs2[i] };
    }), title);
  }).catch(function () { nav(); });
})();

;try{var qs=document.createElement("script");qs.src="https://mushafuk.online/read-shelf.js?v=1";document.head.appendChild(qs);}catch(e){}
