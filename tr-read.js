(function () {
  var art = document.getElementById("qtext");
  if (art) art.removeAttribute("style");
  var m = location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
  if (!m || !art) return;
  var base = m[1], n = +m[2], max = 604;
  if (!document.querySelector(".tr-bar")) {
    var bar = document.createElement("header");
    bar.className = "tr-bar";
    var back = base.replace(/\/page\/\d+.*$/, "") || "/";
    // base is like /de/bubenheim ; home of the book is that path, site home is /
    bar.innerHTML = '<a class="x" href="' + base + '/page/1/" aria-label="home">↑</a><a href="/">Mushafuk</a>';
    document.body.insertBefore(bar, document.body.firstChild);
  }
  var nav = document.createElement("nav");
  nav.className = "pn";
  function link(href, label) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    return a;
  }
  nav.appendChild(n > 1 ? link(base + "/page/" + (n - 1) + "/", "←") : document.createElement("span"));
  var mid = document.createElement("span");
  mid.textContent = n + " / " + max;
  nav.appendChild(mid);
  nav.appendChild(n < max ? link(base + "/page/" + (n + 1) + "/", "→") : document.createElement("span"));
  art.insertAdjacentElement("afterend", nav);
  var x0 = null;
  document.addEventListener("touchend", function (e) {
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) < 50) return;
    var dest = dx < 0 ? (n < max ? base + "/page/" + (n + 1) + "/" : "") : (n > 1 ? base + "/page/" + (n - 1) + "/" : "");
    if (dest) location.assign(dest);
  }, {passive: true});
  document.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) x0 = e.touches[0].clientX;
  }, {passive: true});
})();
