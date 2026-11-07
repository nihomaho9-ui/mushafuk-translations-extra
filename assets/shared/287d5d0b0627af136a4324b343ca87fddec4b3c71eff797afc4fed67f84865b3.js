try{var d=sessionStorage.getItem("qm.turn");if(d){document.documentElement.classList.add("qm-turning");}}catch(e){}
document.addEventListener("DOMContentLoaded",function(){
  var art=document.getElementById("qtext");
  if(!art||art.dataset.ready) return;
  art.dataset.ready="1";
  var gate=document.getElementById("gate"); if(gate) gate.style.display="none";
  var page=document.getElementById("page"); if(page) page.style.display="none";
  var num=document.querySelector(".num"); if(num) num.style.display="none";
  art.removeAttribute("style");
  function verseOf(el){
    var b=el.querySelector&&el.querySelector("b");
    if(!b) return null;
    var m=b.textContent.match(/(\d+)\s*:\s*(\d+)/);
    return m?{s:m[1],a:m[2]}:null;
  }
  function makeAr(text){
    var p=document.createElement("p");
    p.className="ar"; p.lang="ar"; p.dir="rtl"; p.textContent=text.trim();
    return p;
  }
  function interleave(){
    var sec=art.querySelector("section");
    if(!sec) return false;
    var ars=[].filter.call(art.children,function(el){return el.tagName==="P";});
    var trs=[].slice.call(sec.querySelectorAll("p"));
    if(!ars.length||ars.length!==trs.length) return false;
    ars.forEach(function(ap,i){
      ap.classList.add("ar"); ap.dir="rtl"; ap.lang="ar";
      trs[i].classList.add("tr");
      ap.insertAdjacentElement("afterend", trs[i]);
    });
    return true;
  }
  function filter(){
    var h=(location.hash||"").replace("#","");
    var m=h.match(/^s?(\d+)(?:-\d+)?$/);
    if(!m) return;
    var want=m[1], any=false;
    art.querySelectorAll("p.tr, p:not(.ar)").forEach(function(p){
      var v=verseOf(p);
      if(!v) return;
      var show=v.s===want;
      p.style.display=show?"":"none";
      if(show) any=true;
      var prev=p.previousElementSibling;
      if(prev&&prev.classList.contains("ar")) prev.style.display=show?"":"none";
    });
    if(!any) art.querySelectorAll("p").forEach(function(p){p.style.display="";});
  }
  function nav(){
    if(document.querySelector(".pn")) return;
    var m=location.pathname.match(/^(.*)\/page\/(\d+)\/?$/);
    if(!m) return;
    var base=m[1], n=+m[2], max=604;
    if(!document.querySelector(".tr-bar")){
      var bar=document.createElement("header");
      bar.className="tr-bar";
      bar.innerHTML='<a class="x" href="'+base+'/" aria-label="surahs">↑</a><a href="'+base+'/">Mushafuk</a>';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    var box=document.createElement("nav");
    box.className="pn";
    function link(href,label){var a=document.createElement("a"); a.href=href; a.textContent=label; return a;}
    var hash=location.hash||"";
    box.appendChild(n>1?link(base+"/page/"+(n-1)+"/"+hash,"←"):document.createElement("span"));
    var mid=document.createElement("span"); mid.textContent=n+" / "+max; box.appendChild(mid);
    box.appendChild(n<max?link(base+"/page/"+(n+1)+"/"+hash,"→"):document.createElement("span"));
    art.insertAdjacentElement("afterend", box);
  }
  if(!interleave()){
    var m=location.pathname.match(/\/page\/(\d+)\/?$/);
    if(m){
      fetch("https://mushafuk.online/page/"+m[1]+"/index.html").then(function(r){return r.text();}).then(function(html){
        var doc=new DOMParser().parseFromString(html,"text/html");
        var ars=[].slice.call(doc.querySelectorAll("#qtext p"));
        var trs=[].filter.call(art.querySelectorAll("p"), function(p){return p.querySelector("b");});
        if(ars.length===trs.length){
          trs.forEach(function(p,i){
            if(p.previousElementSibling&&p.previousElementSibling.classList.contains("ar")) return;
            p.classList.add("tr");
            p.parentNode.insertBefore(makeAr(ars[i].textContent), p);
          });
        }
        filter();
      }).catch(function(){});
    }
  } else filter();
  nav();
  if(!document.getElementById("tr-amiri")){
    var l=document.createElement("link");
    l.id="tr-amiri"; l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Amiri&display=swap";
    document.head.appendChild(l);
  }
});
