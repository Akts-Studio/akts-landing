/* Demo: satın alma ve hesap yolları kapalı; yönetim panelindeki fiyat/stok değişikliği vitrine yansır. */
(function () {
  var t, el;
  function toast(msg) {
    if (!el) { el = document.createElement("div"); el.className = "demo-toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("on"); clearTimeout(t); t = setTimeout(function () { el.classList.remove("on"); }, 2600);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-blocked], button, input[type=submit]");
    if (!b) return;
    if (b.matches("[data-blocked]")) { e.preventDefault(); toast("Demo sürümü: bu bölüm kapalı."); return; }
    var txt = (b.textContent || b.value || "") + " " + (b.className || "");
    if (/sepete|satın|hemen al|ödeme|haber ver|pcard-add|sipariş/i.test(txt)) { e.preventDefault(); toast("Demo sürümü: satın alma kapalıdır."); }
  }, true);
  document.addEventListener("submit", function (e) { e.preventDefault(); toast("Demo sürümü: bu işlem kapalı."); }, true);

  // ürün galerisi: küçük resim -> ana görsel
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".pd-thumbs button"); if (!b) return;
    var main = document.querySelector(".pd-main img"), im = b.querySelector("img"); if (!main || !im) return;
    main.src = im.src; b.parentNode.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
  });

  // yönetim panelinden gelen fiyat/stok
  try {
    var d = JSON.parse(localStorage.getItem("ag-demo-v2") || "null");
    if (!d) return;
    var nf = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    d.products.forEach(function (p) {
      document.querySelectorAll('.pcard a[href$="/urun/' + p.slug + '/"]').forEach(function (a) {
        var card = a.closest(".pcard"); if (!card || card.dataset.agDone === p.slug) return; card.dataset.agDone = p.slug;
        var pr = card.querySelector(".price"); if (pr) pr.textContent = nf.format(p.price) + " ₺";
        if (p.stock <= 0) card.classList.add("out");
      });
    });
  } catch (e) {}
})();
