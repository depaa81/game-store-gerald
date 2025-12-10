/* ================================
        APP.JS FINAL (STABLE)
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
  const CHAT_ID = "5800113255";

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

  /* ==========================================================
     ============  K E R A N J A N G   S Y S T E M  ============
     ========================================================== */

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let find = cart.findIndex(p => p.id === product.id);

    if (find >= 0) {
      cart[find].qty++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showPopupNotif("Berhasil masuk keranjang!");
  }

  const cartBtn = document.createElement("button");
  cartBtn.innerText = "Keranjang";
  cartBtn.className = "btn";
  cartBtn.style = "position:fixed;bottom:90px;right:15px;z-index:9999;";
  cartBtn.onclick = () => window.location.href = "keranjang.html";
  document.body.appendChild(cartBtn);

  /* ===========================
     RENDER PRODUK
  =========================== */
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

        <div style="display:flex;gap:6px;">
          <button class="buy" data-id="${p.id}">Buy</button>
          <button class="buy cartAdd" data-id="${p.id}">+Keranjang</button>
        </div>
      `;
      productListEl.appendChild(box);
    });

    productListEl.onclick = (e) => {
      const btn = e.target.closest(".buy");
      if (!btn || btn.classList.contains("cartAdd")) return;
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      selectProduct(product);
    };

    productListEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".cartAdd");
      if (!btn) return;
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      addToCart(product);
    });
  }

  /* ===========================
     PILIH PRODUK (BUY)
  =========================== */
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
      <p><b>Harga:</b> Rp ${formatRupiah(currentOrder.price)}</p>

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

      <button class="btn success" id="sendProof" style="width:100%;margin-top:10px;">
        Kirim Bukti
      </button>

      <a id="waMessage" target="_blank" rel="noopener noreferrer">
        <button class="btn ghost" style="width:100%;margin-top:10px;">
          WhatsApp Penjual
        </button>
      </a>
    `;

    document.getElementById("applyVoucherBtn").onclick = applyVoucher;
    document.getElementById("proof").onchange = previewProof;
    document.getElementById("sendProof").onclick = sendProofToTelegram;

    updateWaSellerLink();
  }

  /* ===========================
     VOUCHER SYSTEM
  =========================== */
  function applyVoucher() {
    const codeEl = document.getElementById("voucherInput");
    const resultEl = document.getElementById("voucherResult");

    const code = codeEl.value.trim().toUpperCase();
    const voucher = VOUCHERS.find(v => v.code === code);

    if (!voucher) {
      resultEl.innerHTML = "";
      currentOrder.finalPrice = currentOrder.price;
      currentOrder.discount = 0;
      currentOrder.voucher = null;
      showPopupNotif("Kode voucher tidak ditemukan!");
      updateWaSellerLink();
      return;
    }

    if (currentOrder.price < voucher.min) {
      showPopupNotif(`Minimal pembelian Rp ${formatRupiah(voucher.min)} untuk voucher ini`);
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

    showPopupNotif("Voucher berhasil diterapkan!");
    updateWaSellerLink();
  }

  /* ===========================
     PREVIEW GAMBAR
  =========================== */
  function previewProof(e) {
    const file = e.target.files[0];
    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
  }

  /* ===========================
     SIMPAN RIWAYAT
  =========================== */
  function saveToHistory() {
    let history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    history.push(currentOrder);
    localStorage.setItem("orderHistory", JSON.stringify(history));
  }

  /* ===========================
     KIRIM BUKTI KE TELEGRAM
  =========================== */
  async function sendProofToTelegram() {
    if (!currentOrder) return alert("Tidak ada pesanan.");

    const fileEl = document.getElementById("proof");
    if (!fileEl.files.length) return alert("Upload bukti dulu.");

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

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST", body: form
      });

      saveToHistory();

      showPopupNotif("Bukti terkirim ke Telegram!");

    } catch (err) {
      alert("Gagal mengirim ke Telegram.");
      console.error(err);
    }
  }

  /* ===========================
     POPUP NOTIF
  =========================== */
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

  /* ===========================
     WHATSAPP
  =========================== */
  function updateWaSellerLink() {
    const wa = document.getElementById("waMessage");
    if (!wa) return;

    wa.href =
      "https://wa.me/62856935420220?text=" +
      encodeURIComponent(
        `Halo kak, saya sudah melakukan pemesanan.\n\n` +
        `ID Pesanan: ${currentOrder.id}\n` +
        `Produk: ${currentOrder.name}\n` +
        `Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}`
      );
  }

  /* ===========================
     DRAWER MENU
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

    <h3 class="dropdown-header" id="toggleSosmed">Sosial Media ▼</h3>
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
    sosmedToggle.innerHTML = sosmedOpen ? "Sosial Media ▲" : "Sosial Media ▼";
  };

  document.addEventListener("click", (e) => {
    if (!drawer.contains(e.target) && e.target !== hamburger) {
      drawer.style.transform = "translateX(-300px)";
    }
  });

  /* ===========================
     WA CUSTOMER SERVICE
  =========================== */
  waBtn.onclick = () => {
    waPopup.classList.remove("hidden");
  };

  waPopup.onclick = (e) => {
    if (!e.target.closest(".wa-popup-box")) {
      waPopup.classList.add("hidden");
    }
  };

  waCSLink.href =
    "https://wa.me/62856935420220?text=" +
    encodeURIComponent("Halo admin, saya butuh bantuan Customer Service.");

  /* ===========================
     WA INFO POPUP
  =========================== */
  waInfo.classList.remove("hidden");

  closeWaInfo.onclick = () => {
    waInfo.classList.add("hidden");
  };

  waInfo.onclick = (e) => {
    if (!e.target.closest(".wa-info-box")) {
      waInfo.classList.add("hidden");
    }
  };

  /* ===========================
     PAYMENT MODAL
  =========================== */
  openPay.onclick = () => {
    paymentModal.classList.remove("hidden");
  };

  paymentModal.onclick = (e) => {
    if (!e.target.closest(".modal-box")) {
      paymentModal.classList.add("hidden");
    }
  };

  /* ===========================
     START
  =========================== */
  renderProducts();
});
