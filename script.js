const TELEGRAM_BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
const TELEGRAM_CHAT_ID = "5800113255";

const games = [
    { 
        name: "Item/Ikan fish it", 
        price: 25.000, 
        stock: 12, 
        img:"https://deposit.pictures/p/ddd39fc63ba94e248c7b080398c1b803",
        spec:"https://i.imgur.com/eN5c5q4.jpeg"
    },
    { 
        name: "Akun Roblox", 
        price: 100.000, 
        stock: 1, 
        img:"https://deposit.pictures/p/ea6d88457ca245c3a4722faf66875c90",
        spec:"https://i.imgur.com/iYg4y7x.jpeg"
    },
    { 
        name: "Roblox Keren", 
        price: 150.000, 
        stock: 1, 
        img:"https://deposit.pictures/p/ea6d88457ca245c3a4722faf66875c90",
        spec:"https://i.imgur.com/VNkscQk.jpeg"
    }
];

const gameList = document.getElementById("gameList");

games.forEach(g=>{
    let card = document.createElement("div");
    card.className="game-card";
    card.innerHTML = `
        <img src="${g.img}" class="game-img">
        <h2>${g.name}</h2>
        <p>Harga: Rp ${g.price.toLocaleString()}</p>
        <p>Stok: ${g.stock}</p>
        <a href="${g.spec}" target="_blank" class="spec-link">📄 Lihat Spek Akun</a>
        <button onclick="buy('${g.name}')" class="buy-btn">Beli</button>
    `;
    gameList.appendChild(card);
});

function buy(game){
    document.getElementById("paymentSection").classList.remove("hidden");
    let id = "ORD" + Math.random().toString(36).substring(2,12).toUpperCase();
    document.getElementById("orderId").innerText = id;
}

function copyOrderId(){
    let id = document.getElementById("orderId").innerText;
    navigator.clipboard.writeText(id);
    const alert = document.getElementById("copiedAlert");
    alert.style.display="block";
    setTimeout(()=>alert.style.display="none",1500);
}

function buy(gameName) {
    const game = games.find(g => g.name === gameName);

    if (!game) return;

    // Menampilkan box pembayaran
    document.getElementById("paymentSection").classList.remove("hidden");

    // Mengisi deskripsi pesanan
    document.getElementById("pName").innerText = game.name;
    document.getElementById("pPrice").innerText = "Rp " + game.price.toLocaleString();
    document.getElementById("pTotal").innerText = "Rp " + game.price.toLocaleString();

    // Generate ID
    let id = "ORD" + Math.random().toString(36).substring(2, 12).toUpperCase();
    document.getElementById("orderId").innerText = id;
}
document.getElementById("sendProofBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("proofFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Silakan upload bukti transfer terlebih dahulu.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) { 
        alert("Ukuran file maksimal 10MB.");
        return;
    }

    const orderId = document.getElementById("orderId").innerText;
    const productName = document.getElementById("pName").innerText;

    let formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("caption", `📦 Bukti Transfer\nProduk: ${productName}\nID Pesanan: ${orderId}`);
    formData.append("photo", file);

    try {
        const send = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
        });

        if (send.ok) {
            alert("Bukti transfer berhasil dikirim ke bot Telegram!");

            // Tampilkan tombol WhatsApp
            document.getElementById("whatsappBtn").classList.remove("hidden");

            // Atur link WhatsApp
            document.getElementById("whatsappBtn").onclick = () => {
                const msg = `Halo Admin, saya sudah upload bukti transfer.\nID Pesanan: ${orderId}`;
                window.open(`https://wa.me/62895420181353?text=${encodeURIComponent(msg)}`);
            };

        } else {
            alert("Gagal mengirim bukti. Coba lagi.");
        }

    } catch (error) {
        alert("Error: Tidak dapat mengirim bukti.");
    }
});
        
