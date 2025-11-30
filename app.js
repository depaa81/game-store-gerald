/* ================================
        SETTING BOT TELEGRAM
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
          VAR PESANAN
================================ */
let currentOrder = null;

/* ================================
     SAAT PRODUK DITEKAN BUY
================================ */
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

  // preview gambar
  document.getElementById("proof").onchange = previewProof;

  // WA seller link (harga setelah voucher)
  document.getElementById("waMessage").href =
    `https://wa.me/62856935420220?text=` +
    encodeURIComponent(
      `Halo, saya melakukan pesanan:\n` +
      `ID: ${currentOrder.id}\n` +
      `Produk: ${currentOrder.name}\n` +
      `Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
      `Tanggal: ${currentOrder.date}`
    );

  // apply voucher
  document.getElementById("applyVoucherBtn").onclick = applyVoucher;

  // kirim telegram
  document.getElementById("sendProof").onclick = sendProofToTelegram;
}

/* ================================
         LOGIKA VOUCHER
================================ */
function applyVoucher() {
  const code = document.getElementById("voucherInput").value.trim().toUpperCase();
  const result = document.getElementById("voucherResult");

  let voucher = null;

  if (code === "DISKON10")
    voucher = { cut: 0.10, code: "DISKON10", desc: "Diskon 10%" };

  if (code === "MEGA50" && currentOrder.price >= 50000)
    voucher = { cut: 0.50, code: "MEGA50", desc: "Diskon 50% (>=50rb)" };

  // jika voucher salah
  if (!voucher) {
    showToast("Kode voucher tidak valid!");
    result.innerHTML = "";
    currentOrder.finalPrice = currentOrder.price;
    currentOrder.discount = 0;
    currentOrder.voucher = null;
    return;
  }

  // hitung voucher
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

  showToast("Voucher berhasil diterapkan!");
}

/* ================================
           PREVIEW GAMBAR
================================ */
function previewProof(e) {
  const file = e.target.files[0];
  if (!file) return;
  document.getElementById("preview").src = URL.createObjectURL(file);
}

/* ================================
      KIRIM BUKTI KE TELEGRAM
================================ */
async function sendProofToTelegram() {
  if (!currentOrder) return alert("Tidak ada pesanan.");

  const input = document.getElementById("proof");
  if (!input.files[0]) return alert("Upload bukti dulu.");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", input.files[0]);

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

/* ================================
          TOAST NOTIFIKASI
================================ */
function showToast(text) {
  const t = document.createElement("div");
  t.className = "toastNotif";
  t.innerText = text;
  document.body.appendChild(t);

  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

const toastCSS = document.createElement("style");
toastCSS.innerHTML = `
.toastNotif {
  position: fixed;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: #6d28d9;
  color: white;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 10px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.25);
  opacity: 0;
  transition: .3s;
  z-index: 999999;
}
.toastNotif.show { bottom: 30px; opacity: 1; }
`;
document.head.appendChild(toastCSS);

/* ================================
       DRAWER MENU GARIS TIGA
================================ */
const hamburger = document.getElementById("hamburgerBtn");

// buat drawer
const drawer = document.createElement("div");
drawer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: white;
  padding: 20px;
  box-shadow: 3px 0 20px rgba(0,0,0,0.25);
  transform: translateX(-300px);
  transition: .25s;
  z-index: 9999;
`;

drawer.innerHTML = `
  <h2 style="color:#6d28d9;margin-bottom:15px;">Menu</h2>

  <button class="drawer-item" onclick="location.href='voucher.html'">Daftar Voucher</button>
  <button class="drawer-item" onclick="location.href='informasi.html'">Informasi Toko</button>
  <button class="drawer-item" onclick="location.href='riwayat.html'">Riwayat Transaksi</button>
`;
document.body.appendChild(drawer);

// drawer CSS
const drawerCSS = document.createElement("style");
drawerCSS.innerHTML = `
.drawer-item {
  width: 100%;
  padding: 12px;
  background: #f4eaff;
  border: none;
  border-radius: 8px;
  margin-bottom: 12px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
}
.drawer-item:hover {
  background: #e7d7ff;
}
`;
document.head.appendChild(drawerCSS);

// toggle menu
let open = false;
hamburger.onclick = () => {
  open = !open;
  drawer.style.transform = open ? "translateX(0)" : "translateX(-300px)";
};

// close jika klik di luar
document.addEventListener("click", e => {
  if (open && e.target !== hamburger && !drawer.contains(e.target)) {
    drawer.style.transform = "translateX(-300px)";
    open = false;
  }
});

/* ================================
             INIT
================================ */
renderProducts();
