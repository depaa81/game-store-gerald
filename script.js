// ===============================
// KONFIGURASI TELEGRAM
// ===============================
const TELEGRAM_BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const TELEGRAM_CHAT_ID = "5800113255";


// ===============================
// DATA PRODUK
// ===============================
const games = [
    {
        name: "Item/Ikan fish it",
        price: 25000,
        stock: 12,
        img: "https://files.catbox.moe/1wuioo.jpg",
        spec: "https://i.imgur.com/eN5c5q4.jpeg"
    },
    {
        name: "Akun Roblox",
        price: 100000,
        stock: 1,
        img: "https://files.catbox.moe/xpjea7.jpg",
        spec: "https://i.imgur.com/iYg4y7x.jpeg"
    },
    {
        name: "Roblox Keren",
        price: 150000,
        stock: 1,
        img: "https://files.catbox.moe/xpjea7.jpg",
        spec: "https://i.imgur.com/VNkscQk.jpeg"
    }
];


// ===============================
// GENERATE PRODUK KE HTML
// ===============================
const gameList = document.getElementById("gameList");

games.forEach(g => {
    let card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
        <img src="${g.img}" class="game-img">
        <h2>${g.name}</h2>
        <p>Harga: Rp ${g.price.toLocaleString()}</p>
        <p>Stok: ${g.stock}</p>

        <a href="${g.spec}" target="_blank" class="spec-link">📄 Lihat Spek Akun</a>

        <button onclick="buy('${g.name}', ${g.price}, ${g.stock}, '${g.spec}', '${g.img}')" 
            class="buy-btn">Beli</button>
    `;

    gameList.appendChild(card);
});


// ===============================
// FUNGSI BUY
// ===============================
function buy(name, price, stock, spec, img) {

    document.getElementById("paymentSection").classList.remove("hidden");

    let id = "ORD" + Math.random().toString(36).substring(2, 12).toUpperCase();
    document.getElementById("orderId").innerText = id;

    document.getElementById("productDetails").style.display = "block";
    document.getElementById("pdName").innerText = name;
    document.getElementById("pdPrice").innerText = "Rp " + price.toLocaleString();
    document.getElementById("pdStock").innerText = stock;

    window.selectedProduct = { name, price, stock, spec, img, id };

    document.getElementById("paymentSection").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// COPY ID PESANAN
// ===============================
function copyOrderId() {
    let id = document.getElementById("orderId").innerText;
    navigator.clipboard.writeText(id);

    let alert = document.getElementById("copiedAlert");
    alert.style.display = "block";

    setTimeout(() => alert.style.display = "none", 1500);
}


// ===============================
// UPLOAD BUKTI → KIRIM KE TELEGRAM
// ===============================
async function sendToTelegram() {
    const fileInput = document.getElementById("bukti");
    const file = fileInput.files[0];

    if (!file) {
        alert("Silakan pilih file bukti transfer.");
        return;
    }

    if (!window.selectedProduct) {
        alert("Tidak ada data pesanan!");
        return;
    }

    let caption = 
        `📦 PESANAN BARU\n` +
        `--------------------\n` +
        `🛒 Produk: ${window.selectedProduct.name}\n` +
        `💰 Harga: Rp ${window.selectedProduct.price.toLocaleString()}\n` +
        `📦 Stok: ${window.selectedProduct.stock}\n` +
        `🆔 ID Pesanan: ${window.selectedProduct.id}\n` +
        `--------------------\n` +
        `Bukti transfer terlampir.`;

    let formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("caption", caption);
    formData.append("photo", file);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formData
    });

    alert("Bukti transfer berhasil dikirim ke Bot Telegram!");

    fileInput.value = "";
}


// ===============================
// WHATSAPP (setelah upload)
// ===============================
function openWhatsApp() {
    const phone = "628XXXXXXXXX"; // isi nomor admin
    const orderId = document.getElementById("orderId").innerText;

    const message = 
        `Halo admin, saya sudah mengirim bukti transfer ke bot Telegram.\n` +
        `ID Pesanan saya: ${orderId}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
                              }
        // ===============================
// KONFIGURASI TELEGRAM
// ===============================
const TELEGRAM_BOT_TOKEN = "ISI_TOKEN_BOT";
const TELEGRAM_CHAT_ID = "ISI_CHAT_ID";


// ===============================
// DATA PRODUK
// ===============================
const games = [
    {
        name: "Item/Ikan fish it",
        price: 25000,
        stock: 12,
        img: "https://files.catbox.moe/1wuioo.jpg",
        spec: "https://i.imgur.com/eN5c5q4.jpeg"
    },
    {
        name: "Akun Roblox",
        price: 100000,
        stock: 1,
        img: "https://files.catbox.moe/xpjea7.jpg",
        spec: "https://i.imgur.com/iYg4y7x.jpeg"
    },
    {
        name: "Roblox Keren",
        price: 150000,
        stock: 1,
        img: "https://files.catbox.moe/xpjea7.jpg",
        spec: "https://i.imgur.com/VNkscQk.jpeg"
    }
];


// ===============================
// GENERATE PRODUK KE HTML
// ===============================
const gameList = document.getElementById("gameList");

games.forEach(g => {
    let card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
        <img src="${g.img}" class="game-img">
        <h2>${g.name}</h2>
        <p>Harga: Rp ${g.price.toLocaleString()}</p>
        <p>Stok: ${g.stock}</p>

        <a href="${g.spec}" target="_blank" class="spec-link">📄 Lihat Spek Akun</a>

        <button onclick="buy('${g.name}', ${g.price}, ${g.stock}, '${g.spec}', '${g.img}')" 
            class="buy-btn">Beli</button>
    `;

    gameList.appendChild(card);
});


// ===============================
// FUNGSI BUY
// ===============================
function buy(name, price, stock, spec, img) {

    document.getElementById("paymentSection").classList.remove("hidden");

    let id = "ORD" + Math.random().toString(36).substring(2, 12).toUpperCase();
    document.getElementById("orderId").innerText = id;

    document.getElementById("productDetails").style.display = "block";
    document.getElementById("pdName").innerText = name;
    document.getElementById("pdPrice").innerText = "Rp " + price.toLocaleString();
    document.getElementById("pdStock").innerText = stock;

    window.selectedProduct = { name, price, stock, spec, img, id };

    document.getElementById("paymentSection").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// COPY ID PESANAN
// ===============================
function copyOrderId() {
    let id = document.getElementById("orderId").innerText;
    navigator.clipboard.writeText(id);

    let alert = document.getElementById("copiedAlert");
    alert.style.display = "block";

    setTimeout(() => alert.style.display = "none", 1500);
}


// ===============================
// UPLOAD BUKTI → KIRIM KE TELEGRAM
// ===============================
async function sendToTelegram() {
    const fileInput = document.getElementById("bukti");
    const file = fileInput.files[0];

    if (!file) {
        alert("Silakan pilih file bukti transfer.");
        return;
    }

    if (!window.selectedProduct) {
        alert("Tidak ada data pesanan!");
        return;
    }

    let caption = 
        `📦 PESANAN BARU\n` +
        `--------------------\n` +
        `🛒 Produk: ${window.selectedProduct.name}\n` +
        `💰 Harga: Rp ${window.selectedProduct.price.toLocaleString()}\n` +
        `📦 Stok: ${window.selectedProduct.stock}\n` +
        `🆔 ID Pesanan: ${window.selectedProduct.id}\n` +
        `--------------------\n` +
        `Bukti transfer terlampir.`;

    let formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("caption", caption);
    formData.append("photo", file);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formData
    });

    alert("Bukti transfer berhasil dikirim ke Bot Telegram!");

    fileInput.value = "";
}


// ===============================
// WHATSAPP (setelah upload)
// ===============================
function openWhatsApp() {
    const phone = "628XXXXXXXXX"; // isi nomor admin
    const orderId = document.getElementById("orderId").innerText;

    const message = 
        `Halo admin, saya sudah mengirim bukti transfer ke bot Telegram.\n` +
        `ID Pesanan saya: ${orderId}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}
