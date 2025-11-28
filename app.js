// ==========================================
// KONFIGURASI BOT TELEGRAM
// ==========================================
const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const CHAT_ID = "5800113255";


// ==========================================
// FORMAT RUPIAH
// ==========================================
function formatRupiah(angka) {
  if (!angka) return "Rp 0";
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


// ==========================================
// DATA PRODUK – CONTOH
// ==========================================
const products = [
  { id: 1, name: "Roblox", price: 10000 },
  { id: 2, name: "Akun Roblox", price: 40000 },
  { id: 3, name: "Joki Fishit", price: 60000 }
];


// ==========================================
// RENDER PRODUK KE UI
// ==========================================
function renderProducts() {
  const container = document.getElementById("gameList");
  container.innerHTML = "";

  products.forEach(p => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <h3>${p.name}</h3>
      <p class="price">${formatRupiah(p.price)}</p>
      <button onclick="buyProduct(${p.id})">Buy</button>
    `;
    container.appendChild(item);
  });
}


// ==========================================
// PROSES BUY PRODUCT
// ==========================================
let currentOrder = null;

function buyProduct(id) {
  const p = products.find(x => x.id === id);

  const orderId = "ORD-" + Math.floor(Math.random() * 999999);

  currentOrder = {
    id: orderId,
    name: p.name,
    price: p.price,
    date: new Date().toLocaleString("id-ID")
  };

  document.getElementById("orderId").innerText = currentOrder.id;
  document.getElementById("orderName").innerText = currentOrder.name;
  document.getElementById("orderPrice").innerText = formatRupiah(currentOrder.price);
  document.getElementById("orderDate").innerText = currentOrder.date;

  document.getElementById("orderBox").style.display = "block";
}



// ==========================================
// AUTO KIRIM BUKTI KE TELEGRAM
// ==========================================
async function sendProof(order, file) {
  const fd = new FormData();
  fd.append("file", file);

  const caption = `
🧾 *Bukti Pembayaran*
━━━━━━━━━━━━━━
📌 *ID Pesanan:* ${order.id}
🎮 *Nama Produk:* ${order.name}
💰 *Harga:* ${formatRupiah(order.price)}
⏰ *Tanggal:* ${order.date}
━━━━━━━━━━━━━━
  `;

  fd.append("caption", caption);

  // Jika backend berjalan di vercel
  const r = await fetch("/api/upload", {
    method: "POST",
    body: fd
  });

  const j = await r.json();
  console.log(j);
  alert("Bukti berhasil dikirim ke Telegram!");
}


// ==========================================
// EVENT PILIH FILE OTOMATIS KIRIM
// ==========================================
document.getElementById("proofFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById("proofPreview").src = URL.createObjectURL(file);
  document.getElementById("proofPreview").style.display = "block";

  if (currentOrder) {
    await sendProof(currentOrder, file);
  }
});


// ==========================================
// JALANKAN SAAT PAGE TERBUKA
// ==========================================
renderProducts();
