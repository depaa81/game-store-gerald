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
