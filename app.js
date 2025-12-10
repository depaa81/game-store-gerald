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

  // === Tambahkan ke keranjang ===
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
    showPopupNotif("Berhasil ditambahkan ke keranjang!");
  }

  // === Tombol keranjang di header ===
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

    // BUY → buka detail pesanan
    productListEl.onclick = (e) => {
      const btn = e.target.closest(".buy");
      if (!btn || btn.classList.contains("cartAdd")) return;

      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      selectProduct(product);
    };

    // +Keranjang → addToCart
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


  /* =======================================================
     —————— BAGIAN DI BAWAH TIDAK DIUBAH (FUNGSI LAMA) ——————
     ======================================================= */

  // Voucher system
  function applyVoucher() { ... }  // (← tetap sama seperti file asli)

  function previewProof(e) { ... } // tetap sama
  function saveToHistory() { ... } // tetap sama
  async function sendProofToTelegram() { ... } // tetap sama
  function showPopupNotif(text) { ... } // tetap sama
  function updateWaSellerLink() { ... } // tetap sama

  // Drawer, WA Popup, Modal pembayaran, dsb
  // (seluruh blok kode lama tetap tidak diubah)

  /* ===========================
     START
  =========================== */
  renderProducts();
});
