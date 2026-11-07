try{var d=sessionStorage.getItem("qm.turn");if(d){document.documentElement.classList.add("qm-turning");}}catch(e){}
(function () {
  if (!window.__trSwipe) {
    window.__trSwipe = 1;
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
    function move(x, y, ev) {
      if (sx == null) return;
      var dx = x - sx, dy = y - sy;
      sdx = dx;
      if (!slock) {
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
        slock = Math.abs(dx) > Math.abs(dy) * 1.15 ? "x" : "y";
      }
      if (slock === "x" && ev && ev.cancelable) ev.preventDefault();
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
      move(e.touches[0].clientX, e.touches[0].clientY, e);
    }, { capture: true, passive: false });
    document.addEventListener("touchend", function () { up(); }, true);
    document.addEventListener("touchcancel", function () { sx = null; slock = null; }, true);
  }
  var art = document.getElementById("qtext");
  if (!art || art.dataset.neat) return;
  art.dataset.neat = "1";
  art.dataset.ready = "1";
  var fix = document.createElement("style");
  fix.textContent = "body>header,#gate,#page,.num,#qj{display:none!important}";
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
  function nav() {
    document.querySelectorAll(".tr-bar,.pn").forEach(function (n) { n.remove(); });
    var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
    if (!m) return;
    var base = m[1], n = +m[2], hash = location.hash || "";
    var bar = document.createElement("header");
    bar.className = "tr-bar";
    bar.innerHTML = '<a class="x" href="' + base + '/">↑</a><a href="' + base + '/">Mushafuk</a>';
    document.body.insertBefore(bar, document.body.firstChild);
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
