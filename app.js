/* ================================
        APP.JS FINAL FIXED
================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* GLOBAL EXPOSURE */
  window.changeQtyItem = changeQtyItem;

  /* KONFIGURASI */
  const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
  const CHAT_ID = "5800113255";

  /* DATA PRODUK */
  const products = [
    { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
    { id: 2, name: "ROBLOX AKUN FISH IT ELEMENT ROD POLOSAN (SPEK KE WA CS)", price: 100000 },
    { id: 3, name: "ROBLOX AKUN FISH IT GHOSTFIN ROD (SPEK KE WA CS)", price: 65000 },
    { id: 4, name: "ROBLOX FISH IT SC TUMBAL", price: 10000 },
    { id: 5, name: "ROBLOX FISH IT SC ACIENT LOCHNESS 290TON", price: 85000 },
    { id: 6, name: "ROBLOX FISH IT JOKI AFK 1D", price: 7000 },
    { id: 7, name: "ROBLOX FISH IT JOKI GHOSTFIN ROD (WAJIB PUNYA HAZMAT ROD/ARES ROD)", price: 80000 },
    { id: 8, name: "ROBLOX FISH IT JOKI ELEMENT ROD (WAJIB PUNYA GHOSTFIN)", price: 100000 },
    { id: 9, name: "ROBLOX FISH IT JOKI ARES ROD", price: 35000 },
    { id: 10, name: "ROBLOX FISH IT JOKI HAZMAT ROD", price: 15000 },
    { id: 11, name: "ROBLOX FISH IT JOKI ANGLER ROD", price: 50000 },
    { id: 12, name: "ROBLOX FISH IT JOKI ROYAL BAIT", price: 10000 },
    { id: 13, name: "ROBLOX FISH IT JOKI CORRUPT BAIT", price: 15000 },
    { id: 14, name: "ROBLOX FISH IT JOKI AETHER BAIT", price: 23000 },
    { id: 15, name: "ROBLOX FISH IT JOKI SINGULARITY BAIT", price: 50000 },
    { id: 16, name: "ROBLOX FISH IT JOKI BOART MINI YATCH", price: 10000 },
    { id: 17, name: "ROBLOX FISH IT JOKI MAP SECRED TEMPLE", price: 8000 },
    { id: 18, name: "ROBLOX FISH IT JOKI FLORAL BAIT", price: 45000 },
    { id: 19, name: "ROBLOX FISH IT IKAN LABA-LABA", price: 15000 },
  ];

  /* ELEMEN */
  const productListEl = document.getElementById("productList");
  const orderCardEl = document.getElementById("orderCard");

  /* STATE */
  let currentOrder = null;

  /* FORMAT Rp */
  function formatRupiah(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /* ==========================================
     PERBAIKAN TERBESAR: FUNGSI DIPISAH GLOBAL
  =========================================== */
  function changeQtyItem(id, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(p => p.id === id);

    if (!item && change === -1) return;

    if (!item) {
      const p = products.find(a => a.id === id);
      item = { ...p, qty: 1 };
      cart.push(item);
    } else {
      item.qty += change;
      if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== id);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const show = document.getElementById(`qty-${id}`);
    show.innerText = item ? item.qty : 0;

    showPopupNotif("Keranjang diperbarui");
  }

  /* ===============================
     ADD TO CART
  =============================== */
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let find = cart.findIndex(p => p.id === product.id);

    if (find >= 0) cart[find].qty++;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    showPopupNotif("Masuk ke keranjang!");
  }

  /* ===============================
     PANEL KERANJANG
  =============================== */
  function openCartPanel() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      showPopupNotif("Keranjang kosong");
      return;
    }

    let totalBefore = cart.reduce((a, b) => a + (b.price * b.qty), 0);

    currentOrder = {
      id: "CART" + Date.now(),
      items: cart,
      totalBefore,
      finalPrice: totalBefore,
      discount: 0,
      voucher: null,
      date: new Date().toLocaleString("id-ID")
    };

    orderCardEl.classList.remove("empty");
    orderCardEl.innerHTML = `
      <h3>Checkout Keranjang</h3>

      <div style="max-height:180px;overflow-y:auto;border:1px solid #ddd;padding:10px;border-radius:10px;">
        ${cart
          .map(i => `• ${i.name} x${i.qty} — Rp ${(i.qty * i.price).toLocaleString()}`)
          .join("<br>")}
      </div>

      <p style="margin-top:10px;">
        <b>Total:</b> Rp ${formatRupiah(totalBefore)}
      </p>

      <div class="field">
        <label>Masukkan Voucher</label>
        <input id="voucherInput" class="voucher-input" type="text" placeholder="Masukkan kode voucher...">
        <button class="btn" id="applyVoucherBtn" style="width:100%;margin-top:6px;">Terapkan Voucher</button>
      </div>

      <div id="voucherResult"></div>

      <div class="field" style="margin-top:15px;">
        <label>Upload Bukti Transfer</label>
        <input type="file" id="proof">
        <img id="preview" class="proof-preview" alt="preview"/>
      </div>

      <button class="btn success" id="sendProofCart" style="width:100%;margin-top:10px;">
        Kirim Bukti
      </button>

      <a id="waMessage" target="_blank">
        <button class="btn ghost" style="width:100%;margin-top:10px;">WhatsApp Penjual</button>
      </a>
    `;

    document.getElementById("applyVoucherBtn").onclick = applyVoucherCart;
    document.getElementById("proof").onchange = previewProof;
    document.getElementById("sendProofCart").onclick = sendProofToTelegramCart;

    updateWaCartLink();
  }

  /* ===============================
     APPLY VOUCHER CART
  =============================== */
  function applyVoucherCart() {
    const code = document.getElementById("voucherInput").value.trim().toUpperCase();
    const voucher = VOUCHERS.find(v => v.code === code);

    const resultEl = document.getElementById("voucherResult");

    if (!voucher) {
      resultEl.innerHTML = "<p style='color:red;'>Voucher tidak valid.</p>";
      currentOrder.finalPrice = currentOrder.totalBefore;
      currentOrder.discount = 0;
      updateWaCartLink();
      return;
    }

    let pot = Math.round(currentOrder.totalBefore * voucher.cut);
    let total = currentOrder.totalBefore - pot;

    currentOrder.voucher = voucher;
    currentOrder.discount = pot;
    currentOrder.finalPrice = total;

    resultEl.innerHTML = `
      <p><b>Voucher:</b> ${voucher.code}</p>
      <p>Potongan: Rp ${formatRupiah(pot)}</p>
      <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
    `;

    updateWaCartLink();
  }

  /* ===============================
     KIRIM TELEGRAM CART
  =============================== */
  async function sendProofToTelegramCart() {
    const fileEl = document.getElementById("proof");
    if (!fileEl.files.length) return alert("Upload bukti dulu.");

    let txt = `🛒 *CHECKOUT KERANJANG*\n\n`;

    currentOrder.items.forEach(i => {
      txt += `• ${i.name} x${i.qty} = Rp ${(i.qty * i.price).toLocaleString()}\n`;
    });

    txt +=
      `\n💰 Total Sebelum: Rp ${formatRupiah(currentOrder.totalBefore)}` +
      `\n🏷 Potongan: Rp ${formatRupiah(currentOrder.discount)}` +
      `\n💳 Total Akhir: Rp ${formatRupiah(currentOrder.finalPrice)}` +
      `\n📅 ${currentOrder.date}`;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", fileEl.files[0]);
    form.append("caption", txt);
    form.append("parse_mode", "Markdown");

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", body: form });

    alert("Checkout berhasil!");
    localStorage.removeItem("cart");
  }

  /* ===============================
     WHATSAPP CART
  =============================== */
  function updateWaCartLink() {
    const wa = document.getElementById("waMessage");

    let text = "Halo kak, saya ingin checkout keranjang.\n\n";

    currentOrder.items.forEach(i => {
      text += `• ${i.name} x${i.qty}\n`;
    });

    text += `\nTotal Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}`;

    wa.href = "https://wa.me/62856935420220?text=" + encodeURIComponent(text);
  }

  /* ===============================
     BUY SINGLE PRODUCT
  =============================== */
  function selectProduct(product) {
    currentOrder = {
      id: "ORD" + Date.now(),
      name: product.name,
      price: product.price,
      finalPrice: product.price,
      discount: 0,
      voucher: null,
      date: new Date().toLocaleString("id-ID")
    };

    orderCardEl.classList.remove("empty");
    orderCardEl.innerHTML = `
      <h3>Detail Pesanan</h3>
      <p><b>ID:</b> ${currentOrder.id}</p>
      <p><b>Produk:</b> ${currentOrder.name}</p>
      <p><b>Harga:</b> Rp ${formatRupiah(product.price)}</p>

      <div class="field">
        <label>Masukkan Voucher</label>
        <input id="voucherInput" class="voucher-input" type="text">
        <button class="btn" id="applyVoucherBtn" style="width:100%;margin-top:6px;">
          Terapkan Voucher
        </button>
      </div>

      <div id="voucherResult"></div>

      <div class="field" style="margin-top:15px;">
        <label>Upload Bukti Transfer</label>
        <input type="file" id="proof">
        <img id="preview" class="proof-preview"/>
      </div>

      <button class="btn success" id="sendProof" style="width:100%;margin-top:10px;">
        Kirim Bukti
      </button>

      <a id="waMessage" target="_blank">
        <button class="btn ghost" style="width:100%;margin-top:10px;">
          WhatsApp Penjual
        </button>
      </a>
    `;

    document.getElementById("applyVoucherBtn").onclick = applyVoucherSingle;
    document.getElementById("proof").onchange = previewProof;
    document.getElementById("sendProof").onclick = sendProofToTelegramSingle;

    updateWaLinkSingle();
  }

  /* ===============================
     VOUCHER SINGLE
  =============================== */
  function applyVoucherSingle() {
    const code = document.getElementById("voucherInput").value.trim().toUpperCase();
    const v = VOUCHERS.find(x => x.code === code);

    const result = document.getElementById("voucherResult");

    if (!v) {
      result.innerHTML = `<p style="color:red;">Voucher tidak valid</p>`;
      currentOrder.finalPrice = currentOrder.price;
      currentOrder.discount = 0;
      return;
    }

    if (currentOrder.price < v.min) {
      showPopupNotif(`Minimal belanja Rp ${formatRupiah(v.min)}`);
      return;
    }

    let pot = Math.round(currentOrder.price * v.cut);
    let total = currentOrder.price - pot;

    currentOrder.voucher = v;
    currentOrder.discount = pot;
    currentOrder.finalPrice = total;

    result.innerHTML = `
      <p><b>Voucher:</b> ${v.code}</p>
      <p>Potongan: Rp ${formatRupiah(pot)}</p>
      <p><b>Total Akhir: Rp ${formatRupiah(total)}</b></p>
    `;

    updateWaLinkSingle();
  }

  /* ===============================
     PREVIEW FOTO
  =============================== */
  function previewProof(e) {
    document.getElementById("preview").src = URL.createObjectURL(e.target.files[0]);
  }

  /* ===============================
     KIRIM TELEGRAM SINGLE
  =============================== */
  async function sendProofToTelegramSingle() {
    const fileEl = document.getElementById("proof");
    if (!fileEl.files.length) return alert("Upload bukti dulu.");

    let text =
      `📦 *BUKTI TRANSFER*\n\n` +
      `🆔 ID: ${currentOrder.id}\n` +
      `📌 Produk: ${currentOrder.name}\n` +
      `💰 Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
      `🏷 Voucher: ${currentOrder.voucher ? currentOrder.voucher.code : "Tidak ada"}\n` +
      `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n` +
      `📅 ${currentOrder.date}`;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", fileEl.files[0]);
    form.append("caption", text);
    form.append("parse_mode", "Markdown");

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form
    });

    showPopupNotif("Bukti terkirim!");
  }

  /* ===============================
     W A  –  SINGLE
  =============================== */
  function updateWaLinkSingle() {
    document.getElementById("waMessage").href =
      "https://wa.me/62856935420220?text=" +
      encodeURIComponent(
        `Halo kak, saya ingin membeli:\n${currentOrder.name}\nTotal: Rp ${formatRupiah(currentOrder.finalPrice)}`
      );
  }

  /* ===============================
     POPUP NOTIF
  =============================== */
  function showPopupNotif(text) {
    const box = document.createElement("div");
    box.className = "popup-notif";
    box.innerText = text;
    document.body.appendChild(box);

    setTimeout(() => box.classList.add("show"), 20);
    setTimeout(() => {
      box.classList.remove("show");
      setTimeout(() => box.remove(), 250);
    }, 2500);
  }

  /* ===============================
     RENDER PRODUK
  =============================== */
  function renderProducts() {
    productListEl.innerHTML = "";

    products.forEach(p => {
      const box = document.createElement("div");
      box.className = "product";
      box.innerHTML = `
        <div class="thumb">${p.name.split(" ")[0]}</div>
        <div class="pmeta">
          <h3>${p.name}</h3>
          <p>Rp ${formatRupiah(p.price)}</p>
        </div>

        <div style="display:flex;align-items:center;gap:8px;">
          <button class="qty-btn" onclick="changeQtyItem(${p.id}, -1)">−</button>
          <span id="qty-${p.id}" class="qty-display">0</span>
          <button class="qty-btn" onclick="changeQtyItem(${p.id}, 1)">+</button>

          <button class="buy" data-id="${p.id}" style="margin-left:auto;">Buy</button>
        </div>
      `;

      productListEl.appendChild(box);
    });

    productListEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const id = parseInt(btn.dataset.id);
      const prod = products.find(p => p.id === id);

      if (btn.classList.contains("cartAdd")) addToCart(prod);
      else if (btn.classList.contains("buy")) selectProduct(prod);
    });
  }

  /* ===============================
     T O M B O L   K E R A N J A N G
  =============================== */
  const cartBtn = document.createElement("button");
  cartBtn.innerText = "Keranjang";
  cartBtn.className = "btn";
  cartBtn.style = "position:fixed;bottom:90px;right:15px;z-index:9999;";
  cartBtn.onclick = openCartPanel;
  document.body.appendChild(cartBtn);

          /* ===========================
     DRAWER MENU + SOSMED
  =========================== */
  const drawer = document.createElement("div");

  drawer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background: white;
    padding: 20px;
    transform: translateX(-300px);
    transition: .25s;
    z-index: 9999;
    box-shadow: 3px 0 20px rgba(0,0,0,0.25);
    overflow-y: auto;
  `;

  drawer.innerHTML = `
    <h2 style="color:#0d6efd;margin-bottom:15px;">Menu</h2>

    <button class="drawer-item" onclick="location.href='voucher.html'">Daftar Voucher</button>
    <button class="drawer-item" onclick="location.href='informasi.html'">Informasi Toko</button>
    <button class="drawer-item" onclick="location.href='riwayat.html'">Riwayat Transaksi</button>

    <h3 class="dropdown-header" id="toggleSosmed">Sosial Media â–¼</h3>
    <div class="dropdown-sosmed">
      <button class="drawer-item" onclick="window.open('https://instagram.com/','_blank')">Instagram</button>
      <button class="drawer-item" onclick="window.open('https://tiktok.com/','_blank')">TikTok</button>
      <button class="drawer-item" onclick="window.open('https://youtube.com/','_blank')">YouTube</button>
      <button class="drawer-item" onclick="window.open('https://facebook.com/','_blank')">Facebook</button>
    </div>
  `;

  document.body.appendChild(drawer);

  hamburger.onclick = () => {
    const isOpen = drawer.style.transform === "translateX(0px)";
    drawer.style.transform = isOpen ? "translateX(-300px)" : "translateX(0px)";
  };

  const sosmedToggle = drawer.querySelector("#toggleSosmed");
  const sosmedContent = drawer.querySelector(".dropdown-sosmed");

  sosmedContent.style.maxHeight = "0px";
  sosmedContent.style.overflow = "hidden";
  sosmedContent.style.transition = "max-height .4s ease";

  let sosmedOpen = false;

  sosmedToggle.onclick = () => {
    sosmedOpen = !sosmedOpen;
    sosmedContent.style.maxHeight = sosmedOpen ? sosmedContent.scrollHeight + "px" : "0px";
    sosmedToggle.innerHTML = sosmedOpen ? "Sosial Media â–²" : "Sosial Media â–¼";
  };

  document.addEventListener("click", (e) => {
    if (!drawer.contains(e.target) && e.target !== hamburger) {
      drawer.style.transform = "translateX(-300px)";
    }
  });
        

  /* ===============================
     START
  =============================== */
  renderProducts();

});
