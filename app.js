/* ================================
        APP.JS FINAL (STABLE)
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
  const CHAT_ID = "5800113255";

  const products = [
    { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
    { id: 2, name: "ROBLOX AKUN FISH IT (SPEK LANGSUNG KE WHATSAPP CS)", price: 50000 },
    { id: 3, name: "ROBLOX FISH IT SC TUMBAL", price: 10000 },
    { id: 4, name: "ROBLOX FISH IT SC ACIENT LOCHNESS 290TON", price: 85000 },
    { id: 5, name: "ROBLOX FISH IT JOKI AFK 1H", price: 5000 }
  ];

  function formatRupiah(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const productListEl = document.getElementById("productList");
  const orderCardEl = document.getElementById("orderCard");
  const hamburger = document.getElementById("hamburgerBtn");
  const waBtn = document.getElementById("waFloatingBtn");
  const waPopup = document.getElementById("waPopup");
  const waCSLink = document.getElementById("waCSLink");
  const waInfo = document.getElementById("waInfoPopup");
  const closeWaInfo = document.getElementById("closeWaInfo");
  const openPay = document.getElementById("openPaymentInfo");
  const paymentModal = document.getElementById("paymentModal");

  let currentOrder = null;

  function renderProducts() {
    if (!productListEl) return;
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
        <button class="buy" data-id="${p.id}">Buy</button>
      `;
      productListEl.appendChild(box);
    });

    // delegate click for buy buttons
    productListEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".buy");
      if (!btn) return;
      const id = parseInt(btn.getAttribute("data-id"), 10);
      const prod = products.find(x => x.id === id);
      if (prod) selectProduct(prod);
    });
  }

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

    if (!orderCardEl) return;

    orderCardEl.classList.remove("empty");
    orderCardEl.innerHTML = `
      <h3>Detail Pesanan</h3>
      <p><b>ID:</b> ${currentOrder.id}</p>
      <p><b>Produk:</b> ${currentOrder.name}</p>
      <p><b>Harga:</b> Rp ${formatRupiah(currentOrder.price)}</p>

      <div class="field">
        <label>Masukkan Voucher</label>
        <input id="voucherInput" class="voucher-input" type="text" placeholder="contoh: geral10">

        <button class="btn" id="applyVoucherBtn" style="width:100%;margin-top:6px;">Terapkan Voucher</button>
      </div>

      <div id="voucherResult"></div>

      <div class="field" style="margin-top:15px;">
        <label>Upload Bukti Transfer</label>
        <input type="file" id="proof">
        <img id="preview" class="proof-preview" alt="preview"/>
      </div>

      <button class="btn success" id="sendProof" style="width:100%;margin-top:10px;">
        Kirim Bukti
      </button>

      <a id="waMessage" target="_blank" rel="noopener noreferrer">
        <button class="btn ghost" style="width:100%;margin-top:10px;">
          WhatsApp Penjual
        </button>
      </a>
    `;

    // wire up internal controls safely
    const proofInput = document.getElementById("proof");
    if (proofInput) proofInput.onchange = previewProof;

    const applyBtn = document.getElementById("applyVoucherBtn");
    if (applyBtn) applyBtn.onclick = applyVoucher;

    const sendBtn = document.getElementById("sendProof");
    if (sendBtn) sendBtn.onclick = sendProofToTelegram;

    updateWaSellerLink();
  }

  function applyVoucher() {
    const codeEl = document.getElementById("voucherInput");
    const resultEl = document.getElementById("voucherResult");
    if (!currentOrder || !codeEl || !resultEl) return;

    const code = codeEl.value.trim().toUpperCase();
    let voucher = null;
    if (code === "DISKON10") voucher = { cut: 0.10, code: "DISKON10" };
    if (code === "MEGA50" && currentOrder.price >= 50000) voucher = { cut: 0.50, code: "MEGA50" };

    if (!voucher) {
      showPopupNotif("Kode voucher tidak valid!");
      resultEl.innerHTML = "";
      currentOrder.finalPrice = currentOrder.price;
      currentOrder.discount = 0;
      currentOrder.voucher = null;
      updateWaSellerLink();
      return;
    }

    const pot = Math.round(currentOrder.price * voucher.cut);
    const total = currentOrder.price - pot;
    currentOrder.discount = pot;
    currentOrder.finalPrice = total;
    currentOrder.voucher = voucher;

    resultEl.innerHTML = `
      <p><b>Voucher:</b> ${voucher.code}</p>
      <p>Potongan: Rp ${formatRupiah(pot)}</p>
      <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
    `;
    updateWaSellerLink();
    showPopupNotif("Voucher berhasil diterapkan!");
  }

  function previewProof(e) {
    const file = e.target.files && e.target.files[0];
    const img = document.getElementById("preview");
    if (file && img) img.src = URL.createObjectURL(file);
  }

  async function sendProofToTelegram() {
    if (!currentOrder) { alert("Tidak ada pesanan."); return; }
    const fileEl = document.getElementById("proof");
    if (!fileEl || !fileEl.files[0]) { alert("Upload bukti dulu."); return; }

    try {
      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("photo", fileEl.files[0]);
      form.append("caption",
        `📦 *BUKTI TRANSFER*\n\n` +
        `🆔 ID: ${currentOrder.id}\n` +
        `📌 Produk: ${currentOrder.name}\n` +
        `💰 Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
        `🏷 Voucher: ${currentOrder.voucher ? currentOrder.voucher.code : "Tidak ada"}\n` +
        `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n\n` +
        `📅 ${currentOrder.date}`
      );

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", body: form });
      showPopupNotif("Bukti terkirim ke Telegram!");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim ke Telegram.");
    }
  }

  function showPopupNotif(text) {
    const box = document.createElement("div");
    box.className = "popup-notif";
    box.innerText = text;
    document.body.appendChild(box);
    setTimeout(() => box.classList.add("show"), 20);
    setTimeout(() => { box.classList.remove("show"); setTimeout(() => box.remove(), 300); }, 2500);
  }

  function updateWaSellerLink() {
    const wa = document.getElementById("waMessage");
    if (!wa || !currentOrder) return;
    wa.href =
      "https://wa.me/62856935420220?text=" +
      encodeURIComponent(
        `Halo kak, saya sudah melakukan pemesanan.\n\n` +
        `ID Pesanan: ${currentOrder.id}\n` +
        `Produk: ${currentOrder.name}\n` +
        `Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n\n` +
        `Saya menunggu verifikasi ya kak.`
      );
  }

  /* Drawer (menu) */
  const drawer = document.createElement("div");
  drawer.style.cssText = `
    position: fixed; top:0; left:0;
    width:250px; height:100vh;
    background:white; padding:20px;
    transform: translateX(-300px);
    transition: .25s;
    z-index:9999;
    box-shadow: 3px 0 20px rgba(0,0,0,0.25);
  `;
  drawer.innerHTML = `
    <h2 style="color:#6d28d9;margin-bottom:15px;">Menu</h2>
    <button class="drawer-item" onclick="location.href='voucher.html'">Daftar Voucher</button>
    <button class="drawer-item" onclick="location.href='informasi.html'">Informasi Toko</button>
    <button class="drawer-item" onclick="location.href='riwayat.html'">Riwayat Transaksi</button>
  `;
  document.body.appendChild(drawer);

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const shown = drawer.style.transform === "translateX(0px)";
      drawer.style.transform = shown ? "translateX(-300px)" : "translateX(0px)";
    });
  }

  document.addEventListener("click", (e) => {
    if (!drawer.contains(e.target) && e.target !== hamburger) {
      drawer.style.transform = "translateX(-300px)";
    }
  });

  /* WA Customer Service popup */
  if (waBtn && waPopup) {
    waBtn.addEventListener("click", () => {
      waPopup.classList.remove("hidden");
      waPopup.setAttribute("aria-hidden", "false");
    });
    waPopup.addEventListener("click", (e) => {
      if (!e.target.closest(".wa-popup-box")) {
        waPopup.classList.add("hidden");
        waPopup.setAttribute("aria-hidden", "true");
      }
    });
    if (waCSLink) {
      waCSLink.href = "https://wa.me/62856935420220?text=" + encodeURIComponent("Halo admin, saya butuh bantuan Customer Service.");
    }
  }

  /* WA Info popup (always show on load) */
  if (waInfo) {
    // always show per request
    waInfo.classList.remove("hidden");
    waInfo.setAttribute("aria-hidden", "false");
    if (closeWaInfo) {
      closeWaInfo.addEventListener("click", () => {
        waInfo.classList.add("hidden");
        waInfo.setAttribute("aria-hidden", "true");
      });
    }
    waInfo.addEventListener("click", (e) => {
      if (!e.target.closest(".wa-info-box")) {
        waInfo.classList.add("hidden");
        waInfo.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* Payment modal */
  if (openPay && paymentModal) {
    openPay.addEventListener("click", () => {
      paymentModal.classList.remove("hidden");
      paymentModal.setAttribute("aria-hidden", "false");
    });
    paymentModal.addEventListener("click", (e) => {
      if (!e.target.closest(".modal-box")) {
        paymentModal.classList.add("hidden");
        paymentModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* Start */
  renderProducts();
});
