/* ================================
        TELEGRAM BOT
================================ */
const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const CHAT_ID = "5800113255";

/* ================================
        DATA PRODUK
================================ */
const products = [
  { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
  { id: 2, name: "ROBLOX AKUN FISH IT (SPEK LANGSUNG KE WHATSAPP CS)", price: 50000 },
  { id: 3, name: "ROBLOX FISH IT SC TUMBAL", price: 10000 },
  { id: 4, name: "ROBLOX FISH IT SC ACIENT LOCHNESS 290TON", price: 85000 },
  { id: 5, name: "ROBLOX FISH IT JOKI AFK 1H", price: 5000 }
];

/* ================================
      FORMAT RUPIAH
================================ */
function formatRupiah(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* ================================
      RENDER PRODUK
================================ */
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    const box = document.createElement("div");
    box.className = "product";

    box.innerHTML = `
      <div class="thumb">${p.name.split(" ")[0]}</div>
      <div class="pmeta">
        <h3>${p.name}</h3>
        <p>Rp ${formatRupiah(p.price)}</p>
      </div>
      <button class="buy">Buy</button>
    `;

    box.querySelector(".buy").onclick = () => selectProduct(p);
    list.appendChild(box);
  });
}

/* ================================
      PILIH PRODUK
================================ */
let currentOrder = null;

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

  const card = document.getElementById("orderCard");
  card.classList.remove("empty");

  card.innerHTML = `
    <h3>Detail Pesanan</h3>
    <p><b>ID:</b> ${currentOrder.id}</p>
    <p><b>Produk:</b> ${currentOrder.name}</p>
    <p><b>Harga:</b> Rp ${formatRupiah(currentOrder.price)}</p>

    <div class="field">
      <label>Masukkan Voucher</label>
      <input id="voucherInput" type="text" placeholder="contoh: DISKON10">
      <button class="btn" id="applyVoucherBtn" style="width:100%;margin-top:6px;">Terapkan Voucher</button>
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

  document.getElementById("proof").onchange = previewProof;
  document.getElementById("applyVoucherBtn").onclick = applyVoucher;
  document.getElementById("sendProof").onclick = sendProofToTelegram;

  updateWaSellerLink();
}

/* ================================
      APPLY VOUCHER
================================ */
function applyVoucher() {
  const code = document.getElementById("voucherInput").value.trim().toUpperCase();
  const result = document.getElementById("voucherResult");

  let voucher = null;

  if (code === "DISKON10") voucher = { cut: 0.10, code: "DISKON10" };
  if (code === "MEGA50" && currentOrder.price >= 50000)
    voucher = { cut: 0.50, code: "MEGA50" };

  if (!voucher) {
    showPopupNotif("Kode voucher tidak valid!");
    result.innerHTML = "";
    currentOrder.finalPrice = currentOrder.price;
    return;
  }

  const pot = currentOrder.price * voucher.cut;
  const total = currentOrder.price - pot;

  currentOrder.discount = pot;
  currentOrder.finalPrice = total;
  currentOrder.voucher = voucher;

  result.innerHTML = `
    <p><b>Voucher:</b> ${voucher.code}</p>
    <p>Potongan: Rp ${formatRupiah(pot)}</p>
    <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
  `;

  updateWaSellerLink();
  showPopupNotif("Voucher berhasil diterapkan!");
}

/* ================================
      PREVIEW FOTO TF
================================ */
function previewProof(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById("preview").src = URL.createObjectURL(file);
  }
}

/* ================================
      KIRIM FOTO TF KE TELEGRAM
================================ */
async function sendProofToTelegram() {
  if (!currentOrder) return alert("Tidak ada pesanan.");
  const file = document.getElementById("proof").files[0];
  if (!file) return alert("Upload bukti dulu.");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", file);

  form.append(
    "caption",
    `📦 *BUKTI TRANSFER*\n\n` +
    `🆔 ID: ${currentOrder.id}\n` +
    `📌 Produk: ${currentOrder.name}\n` +
    `💰 Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
    `🏷 Voucher: ${currentOrder.voucher ? currentOrder.voucher.code : "Tidak ada"}\n` +
    `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n\n` +
    `📅 ${currentOrder.date}`
  );

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: form
  });

  showPopupNotif("Bukti terkirim ke Telegram!");
}

/* ================================
      NOTIFIKASI POPUP
================================ */
function showPopupNotif(text) {
  const box = document.createElement("div");
  box.className = "popup-notif";
  box.innerText = text;
  document.body.appendChild(box);

  setTimeout(() => box.classList.add("show"), 20);
  setTimeout(() => {
    box.classList.remove("show");
    setTimeout(() => box.remove(), 300);
  }, 2500);
}

/* ================================
      LINK WA PENJUAL OTOMATIS
================================ */
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

/* ================================
      DRAWER MENU
================================ */
const hamburger = document.getElementById("hamburgerBtn");
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

hamburger.onclick = () => {
  drawer.style.transform =
    drawer.style.transform === "translateX(0px)"
      ? "translateX(-300px)"
      : "translateX(0px)";
};

document.addEventListener("click", e => {
  if (e.target !== hamburger && !drawer.contains(e.target)) {
    drawer.style.transform = "translateX(-300px)";
  }
});

/* ================================
      POPUP CUSTOMER SERVICE
================================ */
const waBtn = document.getElementById("waFloatingBtn");
const waPopup = document.getElementById("waPopup");
const waCSLink = document.getElementById("waCSLink");

waBtn.onclick = () => waPopup.classList.remove("hidden");
waPopup.onclick = e => {
  if (!e.target.closest(".wa-popup-box")) waPopup.classList.add("hidden");
};

waCSLink.href =
  "https://wa.me/62856935420220?text=" +
  encodeURIComponent("Halo admin, saya butuh bantuan Customer Service.");

/* ================================
      POPUP INFO (SELALU MUNCUL)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const waInfo = document.getElementById("waInfoPopup");
  const closeWaInfo = document.getElementById("closeWaInfo");

  // Selalu tampil setiap refresh
  waInfo.classList.remove("hidden");

  const closePopup = () => {
    waInfo.classList.add("hidden");
  };

  closeWaInfo.onclick = closePopup;

  waInfo.onclick = e => {
    if (!e.target.closest(".wa-info-box")) closePopup();
  };
});

/* ================================
      POPUP PAYMENT FIX
================================ */
const openPay = document.getElementById("openPaymentInfo");
const paymentModal = document.getElementById("paymentModal");

if (openPay && paymentModal) {
  openPay.onclick = () => {
    paymentModal.classList.remove("hidden");
  };

  paymentModal.onclick = (e) => {
    if (!e.target.closest(".modal-box")) {
      paymentModal.classList.add("hidden");
    }
  };
}

/* ================================
             START
================================ */
renderProducts();
  let voucher = null;

  if (code === "DISKON10") voucher = { cut: 0.10, code: "DISKON10" };
  if (code === "MEGA50" && currentOrder.price >= 50000)
    voucher = { cut: 0.50, code: "MEGA50" };

  if (!voucher) {
    showPopupNotif("Kode voucher tidak valid!");
    result.innerHTML = "";
    currentOrder.finalPrice = currentOrder.price;
    return;
  }

  const pot = currentOrder.price * voucher.cut;
  const total = currentOrder.price - pot;

  currentOrder.discount = pot;
  currentOrder.finalPrice = total;
  currentOrder.voucher = voucher;

  result.innerHTML = `
    <p><b>Voucher:</b> ${voucher.code}</p>
    <p>Potongan: Rp ${formatRupiah(pot)}</p>
    <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
  `;

  showPopupNotif("Voucher berhasil diterapkan!");
}

/* ================================
      PREVIEW BUKTI TF
================================ */
function previewProof(e) {
  const file = e.target.files[0];
  if (file) {
    document.getElementById("preview").src = URL.createObjectURL(file);
  }
}

/* ================================
   KIRIM FOTO TF KE TELEGRAM
================================ */
async function sendProofToTelegram() {
  if (!currentOrder) return alert("Tidak ada pesanan.");
  const file = document.getElementById("proof").files[0];
  if (!file) return alert("Upload bukti dulu.");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", file);

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
    method: "POST",
    body: form
  });

  showPopupNotif("Bukti terkirim ke Telegram!");
}

/* ================================
      POPUP NOTIFIKASI
================================ */
function showPopupNotif(text) {
  const box = document.createElement("div");
  box.className = "popup-notif";
  box.innerText = text;
  document.body.appendChild(box);

  setTimeout(() => box.classList.add("show"), 20);
  setTimeout(() => {
    box.classList.remove("show");
    setTimeout(() => box.remove(), 300);
  }, 2500);
}

/* ================================
      DRAWER MENU
================================ */
const hamburger = document.getElementById("hamburgerBtn");
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

hamburger.onclick = () => {
  drawer.style.transform =
    drawer.style.transform === "translateX(0px)"
      ? "translateX(-300px)"
      : "translateX(0px)";
};

document.addEventListener("click", e => {
  if (e.target !== hamburger && !drawer.contains(e.target)) {
    drawer.style.transform = "translateX(-300px)";
  }
});

/* ================================
   POPUP CUSTOMER SERVICE
================================ */
const waBtn = document.getElementById("waFloatingBtn");
const waPopup = document.getElementById("waPopup");
const waCSLink = document.getElementById("waCSLink");

waBtn.onclick = () => waPopup.classList.remove("hidden");
waPopup.onclick = e => {
  if (!e.target.closest(".wa-popup-box")) waPopup.classList.add("hidden");
};

waCSLink.href =
  "https://wa.me/62856935420220?text=" +
  encodeURIComponent("Halo admin, saya butuh bantuan Customer Service.");

/* ================================
   POPUP INFO — SELALU MUNCUL
================================ */
document.addEventListener("DOMContentLoaded", () => {

  const waInfo = document.getElementById("waInfoPopup");
  const closeWaInfo = document.getElementById("closeWaInfo");

  // Popup selalu muncul
  waInfo.classList.remove("hidden");

  const closePopup = () => {
    waInfo.classList.add("hidden");
  };

  closeWaInfo.onclick = closePopup;

  waInfo.onclick = (e) => {
    if (!e.target.closest(".wa-info-box")) closePopup();
  };

});

/* ================================
             START
================================ */
renderProducts();
