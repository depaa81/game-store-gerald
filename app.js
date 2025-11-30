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
    date: new Date().toLocaleString("id-ID")
  };

  const card = document.getElementById("orderCard");
  card.classList.remove("empty");

  card.innerHTML = `
    <h3>Detail Pesanan</h3>
    <p><strong>ID Pesanan:</strong> ${currentOrder.id}</p>
    <p><strong>Produk:</strong> ${currentOrder.name}</p>
    <p><strong>Harga:</strong> Rp ${formatRupiah(currentOrder.price)}</p>
    <p><strong>Tanggal:</strong> ${currentOrder.date}</p>

    <div class="field">
      <label>Upload Bukti Transfer</label>
      <input type="file" id="proof">
      <img id="preview" class="proof-preview"/>
    </div>

    <div class="actions">
      <button class="btn success" id="sendProof">Kirim Bukti</button>
    </div>

    <a id="waMessage" target="_blank">
      <button class="btn ghost" style="margin-top:10px;width:100%;">WhatsApp Penjual</button>
    </a>
  `;

  document.getElementById("proof").addEventListener("change", previewProof);

  document.getElementById("sendProof")
    .addEventListener("click", sendProofToTelegram);

  document.getElementById("waMessage").href =
    `https://wa.me/62856935420220?text=` +
    encodeURIComponent(
      `Halo, saya sudah membuat pesanan:\n\nID: ${currentOrder.id}\nProduk: ${currentOrder.name}\nHarga: Rp ${formatRupiah(currentOrder.price)}\nTanggal: ${currentOrder.date}`
    );
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
    `💰 Harga Asli: Rp ${formatRupiah(currentOrder.price)}\n` +
    `🏷 Voucher: ${currentOrder.voucher.code}\n` +
    `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n` +
    `💳 Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
    `📅 ${currentOrder.date}`
  );

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
  await fetch(url, { method: "POST", body: form });

  showToast("Bukti terkirim ke Telegram!");
}

// ===============================
//   POPUP WHATSAPP CS
// ===============================
const waBtn = document.getElementById("waFloatingBtn");
const popup = document.getElementById("waPopup");
const waCSLink = document.getElementById("waCSLink");

const csText = encodeURIComponent(
  "Halo kak, saya ingin bertanya mengenai layanan Gerald Store.\n• Nama:\n• Pertanyaan:"
);

waBtn.addEventListener("click", () => popup.classList.remove("hidden"));
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

// CSS toast
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
//   VOUCHER SYSTEM (OVERRIDE)
// ===============================
const _oldSelect = selectProduct;

selectProduct = function (product) {
  _oldSelect(product);

  const voucher = getAutoVoucher(product.price);
  currentOrder.voucher = voucher;

  const hasil = applyVoucher(product.price, voucher);
  currentOrder.finalPrice = hasil.finalPrice;
  currentOrder.discount = hasil.discount;

  const card = document.getElementById("orderCard");
  card.innerHTML += `
    <p><strong>Voucher:</strong> ${voucher.code}</p>
    <p><strong>Deskripsi Voucher:</strong> ${voucher.desc}</p>
    <p><strong>Potongan:</strong> - Rp ${formatRupiah(hasil.discount)}</p>
    <p><strong>Total Bayar:</strong> Rp ${formatRupiah(hasil.finalPrice)}</p>
  `;

  showToast("Voucher diterapkan: " + voucher.code);
};

// ===============================
//   MENU HAMBURGER (ATAS KIRI)
// ===============================

// Tombol menu
const hamburger = document.createElement("button");
hamburger.innerHTML = "☰";
hamburger.style.cssText = `
  position: absolute;
  left: 12px;
  top: 10px;
  font-size: 22px;
  padding: 6px 10px;
  border-radius: 6px;
  background:#6d28d9;
  border:none;
  color:white;
  cursor:pointer;
  z-index:9999;
`;
document.body.appendChild(hamburger);

// Dropdown menu
const dropdown = document.createElement("div");
dropdown.style.cssText = `
  position: absolute;
  left: 12px;
  top: 50px;
  background:white;
  width:180px;
  border-radius:10px;
  box-shadow:0 8px 20px rgba(0,0,0,.15);
  padding:8px 0;
  display:none;
  z-index:9998;
`;
dropdown.innerHTML = `
  <button class="menu-item" onclick="alert('Daftar Voucher')">Daftar Voucher</button>
  <button class="menu-item" onclick="alert('Informasi Toko')">Informasi Toko</button>
  <button class="menu-item" onclick="alert('Riwayat Transaksi')">Riwayat Transaksi</button>
`;
document.body.appendChild(dropdown);

// CSS menu
const menuCSS = document.createElement("style");
menuCSS.innerHTML = `
.menu-item {
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
}
.menu-item:hover {
  background:#f3f0ff;
}
`;
document.head.appendChild(menuCSS);

// Toggle menu
hamburger.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
});

// Klik luar menutup menu
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && e.target !== hamburger) {
    dropdown.style.display = "none";
  }
});

// ===============================
//   INITIAL RENDER
// ===============================
renderProducts();
