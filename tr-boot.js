(function(){try{if(window.__mfk)return;window.__mfk=1;var l=location,h=l.hostname,n=navigator,r='';if(!/(^|\.)mushafuk\.online$/.test(h)||/^\/admin(\/|$)/.test(l.pathname)||n.webdriver||/bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(n.userAgent))return;try{r=new URL(document.referrer).hostname}catch(e){}if(/(^|\.)mushafuk\.online$/.test(r))r='';var K='sb_publishable_UnQ35pj_GatInq-7lhFGgQ_DnRoUnDC';fetch('https://isvqwafixlmusmuqqnyk.supabase.co/rest/v1/pageviews',{method:'POST',keepalive:true,headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({host:h,path:l.pathname.slice(0,300),ref_host:r||null,lang:(document.documentElement.lang||n.language||'').slice(0,12),device:innerWidth<768?'mobile':'desktop'})}).catch(function(){})}catch(e){}})();
(function () {
  if (window.__trSwipe !== 2) {
    window.__trSwipe = 2;
    var sx = null, sy = null, slock = null, sdx = 0;
    function go(dir) {
      var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
      if (!m) return;
      var n = +m[2] + dir;
      if (n < 1 || n > 604) return;
      location.assign(m[1] + "/page/" + n + "/" + location.search + location.hash);
    }
    function down(x, y, t) {
      if (t && t.closest && t.closest("a,button,input,textarea,select")) { sx = null; return; }
      sx = x; sy = y; slock = null; sdx = 0;
    }
    function move(x, y) {
      if (sx == null) return;
      var dx = x - sx, dy = y - sy;
      sdx = dx;
      if (!slock) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        slock = Math.abs(dx) > Math.abs(dy) * 1.4 ? "x" : "y";
      }
    }
    function up() {
      if (sx == null) return;
      var dx = sdx, was = slock;
      sx = null; slock = null;
      if (was === "x" && Math.abs(dx) > 42) go(dx > 0 ? 1 : -1);
    }
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      down(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, { capture: true, passive: true });
    document.addEventListener("touchmove", function (e) {
      if (!e.touches.length) return;
      move(e.touches[0].clientX, e.touches[0].clientY);
    }, { capture: true, passive: true });
    document.addEventListener("touchend", function () { up(); }, true);
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
  function nav() {
    document.querySelectorAll(".tr-bar,.pn").forEach(function (n) { n.remove(); });
    var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
    if (!m) return;
    var base = m[1], n = +m[2], hash = location.hash || "";
    var bar = document.createElement("header");
    bar.className = "tr-bar";
    bar.innerHTML = '<a class="x" href="' + base + '/">↑</a><a href="' + base + '/">Mushafuk</a>';
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
