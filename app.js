// ===============================
//   SETUP BOT TELEGRAM
// ===============================
const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const CHAT_ID = "5800113255";

// ===============================
//   DATA PRODUK
// ===============================
const products = [
  { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
  { id: 2, name: "ROBLOX AKUN FISH IT (SPEK LANGSUNG KE WHATSAPP CS)", price: 50000 },
  { id: 3, name: "ROBLOX FISH IT SC TUMBAL", price: 10000 },
  { id: 4, name: "ROBLOX FISH IT SC ACIENT LOCHNESS 290TON", price: 85000 },
  { id: 5, name: "ROBLOX FISH IT JOKI AFK 1H", price: 5000 }
];

// ===============================
//   FORMAT RUPIAH
// ===============================
function formatRupiah(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ===============================
//   RENDER PRODUK
// ===============================
function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";

    el.innerHTML = `
      <div class="thumb">${p.name.split(" ")[0]}</div>
      <div class="pmeta">
        <h3>${p.name}</h3>
        <p>Rp ${formatRupiah(p.price)}</p>
      </div>
      <button class="buy">Buy</button>
    `;

    el.querySelector(".buy").addEventListener("click", () => selectProduct(p));
    list.appendChild(el);
  });
}

// ===============================
//   ORDER DATA
// ===============================
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

    <p><strong>ID Pesanan:</strong> ${currentOrder.id}</p>
    <p><strong>Produk:</strong> ${currentOrder.name}</p>
    <p><strong>Harga:</strong> Rp ${formatRupiah(currentOrder.price)}</p>

    <div class="field">
      <label>Masukkan Kode Voucher</label>
      <input type="text" id="voucherInput" placeholder="contoh: DISKON10">
      <button class="btn" id="applyVoucherBtn" style="margin-top:6px;width:100%;">Terapkan Voucher</button>
    </div>

    <div id="voucherResult"></div>

    <div class="field" style="margin-top:15px;">
      <label>Upload Bukti Transfer</label>
      <input type="file" id="proof">
      <img id="preview" class="proof-preview"/>
    </div>

    <button class="btn success" id="sendProof" style="width:100%;margin-top:10px;">Kirim Bukti</button>

    <a id="waMessage" target="_blank">
      <button class="btn ghost" style="margin-top:10px;width:100%;">WhatsApp Penjual</button>
    </a>
  `;

  document.getElementById("proof").addEventListener("change", previewProof);

  document.getElementById("sendProof").addEventListener("click", sendProofToTelegram);

  document.getElementById("waMessage").href =
    `https://wa.me/62856935420220?text=` +
    encodeURIComponent(
      `Halo, saya membuat pesanan:\nID: ${currentOrder.id}\nProduk: ${currentOrder.name}\nHarga: Rp ${formatRupiah(currentOrder.finalPrice)}\nTanggal: ${currentOrder.date}`
    );

  // ===============================
  //   LOGIKA VOUCHER MANUAL
  // ===============================
  document.getElementById("applyVoucherBtn").onclick = () => {
    const code = document.getElementById("voucherInput").value.trim().toUpperCase();
    let voucher = null;

    if (code === "DISKON10") voucher = { cut: 0.1, code: "DISKON10", desc: "Diskon 10%" };
    if (code === "MEGA50" && currentOrder.price >= 50000)
        voucher = { cut: 0.5, code: "MEGA50", desc: "Diskon 50% (>= 50rb)" };

    if (!voucher) {
      showToast("Kode voucher tidak valid!");
      document.getElementById("voucherResult").innerHTML = "";
      currentOrder.finalPrice = currentOrder.price;
      return;
    }

    const pot = currentOrder.price * voucher.cut;
    const total = currentOrder.price - pot;

    currentOrder.voucher = voucher;
    currentOrder.discount = pot;
    currentOrder.finalPrice = total;

    document.getElementById("voucherResult").innerHTML = `
        <p><strong>Voucher diterapkan:</strong> ${voucher.code}</p>
        <p>Potongan: Rp ${formatRupiah(pot)}</p>
        <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
    `;

    showToast("Voucher berhasil diterapkan!");
  };
}

// ===============================
//   PREVIEW GAMBAR
// ===============================
function previewProof(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
}

// ===============================
//   KIRIM FOTO KE TELEGRAM
// ===============================
async function sendProofToTelegram() {
  if (!currentOrder) return alert("Tidak ada pesanan.");

  const fileInput = document.getElementById("proof");
  if (!fileInput.files[0]) return alert("Upload bukti dulu.");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", fileInput.files[0]);

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

  showToast("Bukti terkirim ke Telegram!");
}

// ===============================
//   TOAST NOTIFICATION
// ===============================
function showToast(text) {
  let t = document.createElement("div");
  t.className = "toastNotif";
  t.innerText = text;
  document.body.appendChild(t);

  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

const toastStyle = document.createElement("style");
toastStyle.innerHTML = `
.toastNotif {
  position: fixed;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #6d28d9;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.25);
  opacity: 0;
  transition: .3s;
  z-index: 999999;
}
.toastNotif.show { bottom: 30px; opacity: 1; }
`;
document.head.appendChild(toastStyle);

// ===============================
//   MENU GARIS TIGA (DI BAWAH STORE NAME)
// ===============================
const topbar = document.querySelector(".topbar");

const hamburger = document.createElement("button");
hamburger.innerHTML = "☰";
hamburger.style.cssText = `
  margin-top: 6px;
  padding: 6px 12px;
  background: white;
  color: #6d28d9;
  border: none;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
`;
topbar.appendChild(hamburger);

const drawer = document.createElement("div");
drawer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #ffffff;
  padding: 20px;
  box-shadow: 3px 0 20px rgba(0,0,0,0.25);
  transform: translateX(-300px);
  transition: transform .25s ease-out;
  z-index: 9999;
`;

drawer.innerHTML = `
  <h2 style="color:#6d28d9;">Menu</h2>
  <button class="drawer-btn" onclick="window.location.href='voucher.html'">Daftar Voucher</button>
  <button class="drawer-btn" onclick="window.location.href='informasi.html'">Informasi Toko</button>
  <button class="drawer-btn" onclick="window.location.href='riwayat.html'">Riwayat Transaksi</button>
`;

document.body.appendChild(drawer);

const drawerCSS = document.createElement("style");
drawerCSS.innerHTML = `
.drawer-btn {
  width: 100%;
  padding: 12px;
  background: #f3eaff;
  border: none;
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
}
.drawer-btn:hover { background: #e5d6ff; }
`;
document.head.appendChild(drawerCSS);

let drawerOpen = false;

hamburger.onclick = () => {
  drawerOpen = !drawerOpen;
  drawer.style.transform = drawerOpen ? "translateX(0)" : "translateX(-300px)";
};

document.addEventListener("click", e => {
  if (drawerOpen && !drawer.contains(e.target) && e.target !== hamburger) {
    drawer.style.transform = "translateX(-300px)";
    drawerOpen = false;
  }
});

// ===============================
//   START
// ===============================
renderProducts();
popup.addEventListener("click", (e) => {
  if (e.target === popup) popup.classList.add("hidden");
});
waCSLink.href = "https://wa.me/62856935420228?text=" + csText;

// ===============================
//   MODAL PEMBAYARAN
// ===============================
const paymentBtn = document.getElementById("openPaymentInfo");
const paymentModal = document.getElementById("paymentModal");

paymentBtn.addEventListener("click", () => {
  paymentModal.classList.remove("hidden");
});

paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) paymentModal.classList.add("hidden");
});

// ===============================
//   POPUP INFO WA
// ===============================
const waInfoPopup = document.getElementById("waInfoPopup");
const closeWaInfo = document.getElementById("closeWaInfo");

setTimeout(() => waInfoPopup.classList.remove("hidden"), 600);
closeWaInfo.addEventListener("click", () => waInfoPopup.classList.add("hidden"));
waInfoPopup.addEventListener("click", (e) => {
  const box = document.querySelector(".wa-info-box");
  if (!box.contains(e.target)) waInfoPopup.classList.add("hidden");
});

// ===============================
//   TOAST NOTIFICATION
// ===============================
function showToast(text) {
  let t = document.createElement("div");
  t.className = "toastNotif";
  t.innerText = text;
  document.body.appendChild(t);

  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

const toastStyle = document.createElement("style");
toastStyle.innerHTML = `
.toastNotif {
  position: fixed;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #6d28d9;
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.25);
  opacity: 0;
  transition: .3s;
  z-index: 999999;
}
.toastNotif.show { bottom: 30px; opacity: 1; }
`;
document.head.appendChild(toastStyle);

// ===============================
//   FIXED HAMBURGER + DRAWER MENU
// ===============================



// Drawer menu
const drawer = document.createElement("div");
drawer.style.cssText = `
  position: fixed;
  top: 60px; /* agar tidak menabrak header */
  left: 0;
  width: 260px;
  height: calc(100vh - 60px);
  background: #ffffff;
  box-shadow: 3px 0 20px rgba(0,0,0,0.2);
  padding: 20px;
  transform: translateX(-300px);
  transition: transform .25s ease-out;
  z-index: 9998;
`;

drawer.innerHTML = `
  <h2 style="color:#6d28d9; margin-top:0; margin-bottom:20px;">Menu</h2>
  <button class="drawer-btn" onclick="window.location.href='voucher.html'">Daftar Voucher</button>
  <button class="drawer-btn" onclick="window.location.href='informasi.html'">Informasi Toko</button>
  <button class="drawer-btn" onclick="window.location.href='riwayat.h// ===============================
//   HAMBURGER DI BAWAH NAMA STORE
// ===============================
const topbar = document.querySelector(".topbar");

const hamburger = document.createElement("button");
hamburger.innerHTML = "☰";
hamburger.style.cssText = `
  margin-top: 6px;
  padding: 6px 12px;
  background: white;
  color: #6d28d9;
  border: none;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
`;

topbar.appendChild(hamburger);
tml'">Riwayat Transaksi</button>
`;
document.body.appendChild(drawer);

// Drawer CSS
const drawer = document.createElement("div");
drawer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #ffffff;
  padding: 20px;
  box-shadow: 3px 0 20px rgba(0,0,0,0.25);
  transform: translateX(-300px);
  transition: transform .25s ease-out;
  z-index: 9999;
`;

drawer.innerHTML = `
  <h2 style="color:#6d28d9;">Menu</h2>
  <button class="drawer-btn" onclick="window.location.href='voucher.html'">Daftar Voucher</button>
  <button class="drawer-btn" onclick="window.location.href='informasi.html'">Informasi Toko</button>
  <button class="drawer-btn" onclick="window.location.href='riwayat.html'">Riwayat Transaksi</button>
`;

document.body.appendChild(drawer);

const css = document.createElement("style");
css.innerHTML = `
.drawer-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #f3eaff;
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: left;
  font-size: 16px;
}
.drawer-btn:hover { background: #e5d6ff; }
`;
document.head.appendChild(css);

let drawerOpen = false;
hamburger.onclick = () => {
  drawerOpen = !drawerOpen;
  drawer.style.transform = drawerOpen ? "translateX(0)" : "translateX(-300px)";
};

document.addEventListener("click", e => {
  if (drawerOpen && !drawer.contains(e.target) && e.target !== hamburger) {
    drawer.style.transform = "translateX(-300px)";
    drawerOpen = false;
  }
});



// ===============================
//   START RENDER
// ===============================
renderProducts();
