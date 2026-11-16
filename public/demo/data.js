/* Avantaj Global demo — veri SAHTEDİR; tarayıcıda (localStorage) tutulur, vitrine fiyat/stok olarak yansır. */
(function () {
  var KEY = "ag-demo-v2", D = null;
  var orders = [
    { no: "DEMO-1042", name: "Ayşe K.", total: 2130, status: "Hazırlanıyor", date: "27.10.2026" },
    { no: "DEMO-1041", name: "Mehmet T.", total: 2930, status: "Kargoda", date: "26.10.2026" },
    { no: "DEMO-1040", name: "Zeynep A.", total: 3270, status: "Teslim edildi", date: "26.10.2026" },
    { no: "DEMO-1039", name: "Can D.", total: 2700, status: "Teslim edildi", date: "25.10.2026" },
    { no: "DEMO-1038", name: "Elif S.", total: 3770, status: "İptal", date: "24.10.2026" }
  ];
  window.AG = {
    ready: function (cb) {
      try { var r = localStorage.getItem(KEY); if (r) { D = JSON.parse(r); return cb(D); } } catch (e) {}
      fetch("../products.json").then(function (r) { return r.json(); }).then(function (p) { D = { products: p, orders: orders.slice() }; cb(D); });
    },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} },
    reset: function (cb) { try { localStorage.removeItem(KEY); } catch (e) {} D = null; this.ready(cb); },
    tl: function (v) { return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(v); },
    esc: function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  };
})();
