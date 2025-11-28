// ====== SETUP BOT TELEGRAM ======
const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const CHAT_ID = "5800113255";

// ====== DATA PRODUK ======
const products = [
  { id: 1, name: "Diamond Mobile Legends 86", price: 20000 },
  { id: 2, name: "Diamond Mobile Legends 172", price: 40000 },
  { id: 3, name: "PUBG UC 50", price: 12000 },
  { id: 4, name: "PUBG UC 125", price: 28000 },
  { id: 5, name: "Genshin Genesis 300", price: 75000 }
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
      <button class="buy">Buy</button>
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
