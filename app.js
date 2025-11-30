// ====== SETUP BOT TELEGRAM ======
const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const CHAT_ID = "5800113255";

// ====== DATA PRODUK ======
const products = [
  { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
  { id: 2, name: "ROBLOX AKUN FISH IT (SPEK LANGSUNG KE WHATSAPP CS)", price: 50000 },
  { id: 3, name: "ROBLOX FISH IT SC TUMBAL", price: 10000 },
  { id: 4, name: "ROBLOX FISH IT SC ACIENT LOCHNESS 290TON", price: 85000 },
  { id: 5, name: "ROBLOX FISH IT JOKI AFK 1H", price: 5000 }
];

// Format harga → 20.000, 1.250.000 dst
function formatRupiah(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Render Produk
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
      <button class="buy" data-id="...">Buy</button>
    `;

    el.querySelector(".buy").addEventListener("click", () => selectProduct(p));
    list.appendChild(el);
  });
}

// Order Data
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
      <button class="btn ghost" style="margin-top:10px;width:100%;">
        WhatsApp Penjual
      </button>
    </a>
  `;

  // Preview gambar
  document.getElementById("proof").addEventListener("change", previewProof);

  // Tombol kirim bukti
  document.getElementById("sendProof").addEventListener("click", sendProofToTelegram);

  // Auto WhatsApp Link
  document.getElementById("waMessage").href =
    `https://wa.me/62856935420220?text=` +
    encodeURIComponent(
      `Halo, saya sudah membuat pesanan:\n\nID: ${currentOrder.id}\nProduk: ${currentOrder.name}\nHarga: Rp ${formatRupiah(currentOrder.price)}\nTanggal: ${currentOrder.date}\n\nMohon diproses ya.`
    );
}

// Preview gambar
function previewProof(e) {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
}

// Kirim bukti ke Telegram TANPA BACKEND
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
    `🆔 ID Pesanan: ${currentOrder.id}\n` +
    `📌 Produk: ${currentOrder.name}\n` +
    `💰 Harga: Rp ${formatRupiah(currentOrder.price)}\n` +
    `📅 Tanggal: ${currentOrder.date}`
  );

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  await fetch(url, { method: "POST", body: form });

  alert("Bukti berhasil dikirim ke Telegram!");
}

renderProducts();

// ====== WA Customer Service Popup ======
const waBtn = document.getElementById("waFloatingBtn");
const popup = document.getElementById("waPopup");
const waCSLink = document.getElementById("waCSLink");

// Template pesan CS
const csText = encodeURIComponent(
  "Halo kak, saya ingin bertanya mengenai layanan Gerald Store.\n\n• Nama:\n• Pertanyaan:"
);

// Tekan tombol bulat → tampil popup
waBtn.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

// Tekan luar popup → tutup popup
popup.addEventListener("click", (e) => {
  if (e.target === popup) popup.classList.add("hidden");
});

// Tombol di popup → buka WhatsApp
waCSLink.href = "https://wa.me/62856935420228?text=" + csText;

// =====================
// MODAL PEMBAYARAN
// =====================
const paymentBtn = document.getElementById("openPaymentInfo");
const paymentModal = document.getElementById("paymentModal");

paymentBtn.addEventListener("click", () => {
  paymentModal.classList.remove("hidden");
});

// Klik luar modal → tutup
paymentModal.addEventListener("click", (e) => {
  if (e.target === paymentModal) {
    paymentModal.classList.add("hidden");
  }
});

// ===========================
// POPUP WA MUNCUL OTOMATIS
// ===========================

const waInfoPopup = document.getElementById("waInfoPopup");
const closeWaInfo = document.getElementById("closeWaInfo");

// Selalu muncul otomatis setiap buka halaman
setTimeout(() => {
  waInfoPopup.classList.remove("hidden");
}, 600);

// Klik tombol mengerti → hanya tutup popup tanpa menyimpan status
closeWaInfo.addEventListener("click", () => {
  waInfoPopup.classList.add("hidden");
});

// Klik area luar menutup popup
waInfoPopup.addEventListener("click", (e) => {
  const box = document.querySelector(".wa-info-box");
  if (!box.contains(e.target)) {
    waInfoPopup.classList.add("hidden");
  }
});


// Klik area luar menutup popup
waInfoPopup.addEventListener("click", (e) => {
  if (e.target === waInfoPopup) {
    waInfoPopup.classList.add("hidden");
    localStorage.setItem("waInfoSeen", "true");
  }
});

// ============ TOAST NOTIFICATION ============ //
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

// Inject CSS toast
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
  font-size: 14px;
  opacity: 0;
  transition: all .3s ease;
  z-index: 999999;
}
.toastNotif.show {
  bottom: 30px;
  opacity: 1;
}
`;
document.head.appendChild(toastStyle);
// ============================================
// OVERRIDE selectProduct → Tambah voucher otomatis
// ============================================
const oldSelectProductFn = selectProduct;

selectProduct = function(product) {

  // Jalankan fungsi lama
  oldSelectProductFn(product);

  // Ambil voucher dari voucher.js
  const voucher = getAutoVoucher(product.price);
  currentOrder.voucher = voucher;

  // Hitung diskon final
  const calc = applyVoucher(product.price, voucher);
  currentOrder.finalPrice = calc.finalPrice;
  currentOrder.discount = calc.discount;

  // Tambah info voucher di checkout box
  const card = document.getElementById("orderCard");

  card.innerHTML += `
    <p><strong>Voucher:</strong> ${voucher.code}</p>
    <p><strong>Deskripsi Voucher:</strong> ${voucher.desc}</p>
    <p><strong>Potongan:</strong> - Rp ${formatRupiah(calc.discount)}</p>
    <p><strong>Total Bayar:</strong> Rp ${formatRupiah(calc.finalPrice)}</p>
  `;

  showToast("Voucher diterapkan: " + voucher.code);
};
// ============================================
// Override SEND TELEGRAM → total harga final
// ============================================
const oldSendProofFn = sendProofToTelegram;

sendProofToTelegram = async function() {

  showToast("Mengirim bukti ke Telegram...");

  const fileInput = document.getElementById("proof");
  if (!fileInput.files[0]) return alert("Upload bukti dulu.");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", fileInput.files[0]);

  form.append(
    "caption",
    `📦 *BUKTI TRANSFER*\n\n` +
    `🆔 ID Pesanan: ${currentOrder.id}\n` +
    `📌 Produk: ${currentOrder.name}\n` +
    `💰 Harga Asli: Rp ${formatRupiah(currentOrder.price)}\n` +
    `🏷 Voucher: ${currentOrder.voucher.code}\n` +
    `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n` +
    `💳 Total Dibayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
    `📅 Tanggal: ${currentOrder.date}`
  );

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  await fetch(url, { method: "POST", body: form });

  showToast("Bukti terkirim ke Telegram!");
};
// =======================
// MENU GARIS TIGA
// =======================

// Buat tombol
const menuBtn = document.createElement("div");
menuBtn.innerHTML = "☰";
menuBtn.style.cssText = `
  position: fixed; top: 14px; right: 14px;
  font-size: 28px; cursor: pointer;
  z-index: 9999; font-weight: 700;
`;
document.body.appendChild(menuBtn);

// Buat panel
const menuPanel = document.createElement("div");
menuPanel.className = "menuPanel";
menuPanel.innerHTML = `
  <div class="menuBox">
    <h3>Menu</h3>

    <h4>Daftar Voucher</h4>
    <ul id="voucherListMenu"></ul>

    <h4>Fitur Lain</h4>
    <ul>
      <li>Informasi Toko</li>
      <li>Riwayat Transaksi</li>
    </ul>
  </div>
`;
document.body.appendChild(menuPanel);

// CSS menu
const css = document.createElement("style");
css.innerHTML = `
.menuPanel {
  position: fixed;
  right: 0; top: 0;
  width: 260px; height: 100vh;
  background: white;
  box-shadow: -6px 0 20px rgba(0,0,0,0.2);
  padding: 20px; z-index: 9998;
  transform: translateX(100%);
  transition: 0.25s ease;
}
.menuPanel.show { transform: translateX(0); }
.menuBox ul { padding-left: 18px; }
.menuBox li { margin: 6px 0; }
`;
document.head.appendChild(css);

// Toggle
menuBtn.addEventListener("click", () => {
  menuPanel.classList.toggle("show");
});

// Isi voucher ke menu
const ul = menuPanel.querySelector("#voucherListMenu");
voucherList.forEach(v => {
  ul.innerHTML += `<li><b>${v.code}</b> — ${v.desc}</li>`;
});
            
