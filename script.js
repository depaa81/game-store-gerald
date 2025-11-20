const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const TELEGRAM_CHAT_ID = "5800113255";

const games = [
    {
        name: "Item/Ikan Fish it",
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

const gameList = document.getElementById("gameList");

games.forEach(g=>{
    let card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
        <img src="${g.img}">
        <div class="info">
            <h3>${g.name}</h3>
            <p>Harga: Rp ${g.price.toLocaleString()}</p>
            <p>Stok: ${g.stock}</p>
            <a href="${g.spec}" target="_blank" class="spec-btn">📄 Lihat Spek Akun</a>
            <button class="buy-btn" onclick="buy('${g.name}')">Beli Sekarang</button>
        </div>
    `;
    gameList.appendChild(card);
});

/* BUY FUNCTION */
function buy(game){
    document.getElementById("paymentSection").classList.remove("hidden");

    let id = "ORD" + Math.random().toString(36).substring(2,10).toUpperCase();
    document.getElementById("orderId").innerText = id;
}

/* COPY */
function copyOrderId(){
    let id = document.getElementById("orderId").innerText;
    navigator.clipboard.writeText(id);
    let alertBox = document.getElementById("copiedAlert");
    alertBox.style.display = "block";
    setTimeout(()=> alertBox.style.display="none", 1400);
}

/* SET PAYMENT */
let selectedWallet = "";
function setWallet(w){
    selectedWallet = w;
    alert("Metode dipilih: " + w);
}

/* SEND TO TELEGRAM */
async function sendToTelegram(){
    let file = document.getElementById("fileInput").files[0];
    let id = document.getElementById("orderId").innerText;

    if(!file){ alert("Pilih file dulu"); return; }
    if(file.size > 10*1024*1024){ alert("File lebih dari 10MB!"); return; }

    const form = new FormData();
    form.append("chat_id", TELEGRAM_CHAT_ID);
    form.append("caption", `Bukti Transfer\nID Pesanan: ${id}\nMetode: ${selectedWallet}`);
    form.append("photo", file);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method:"POST",
        body: form
    });

    alert("Bukti berhasil dikirim ke Telegram!");
}

/* CHAT ADMIN WA */
function chatWA(){
    let id = document.getElementById("orderId").innerText;
    window.open(`https://wa.me/6285693542022?text=Halo admin, saya sudah kirim bukti transfer. Ini ID pesanan saya: ${id}`);
}
