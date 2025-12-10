// --- LOAD KERANJANG ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// RENDER KERANJANG
function renderCart() {
    const box = document.getElementById("cart-container");

    if (cart.length === 0) {
        box.innerHTML = "<p>Keranjang kosong.</p>";
        updateTotal();
        return;
    }

    box.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <p><strong>${item.name}</strong></p>
            <p>Harga: ${item.price}</p>
            <div class="qty-box">
                <button onclick="changeQty(${i}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
            </div>
            <p>Subtotal: ${item.price * item.qty}</p>
            <button class="delete-btn" onclick="removeItem(${i})">Hapus</button>
        </div>
    `).join("");

    updateTotal();
}

// UBAH QTY
function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart[index].qty = 1;
    saveCart();
}

// HAPUS ITEM
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

// SIMPAN KERANJANG
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// HITUNG TOTAL + VOUCHER
function updateTotal() {
    let totalBefore = cart.reduce((a, b) => a + b.price * b.qty, 0);

    const voucher = JSON.parse(localStorage.getItem("activeVoucher"));
    let potongan = 0;
    let voucherName = "-";

    if (voucher) {
        voucherName = voucher.code;

        if (voucher.type === "percent") {
            potongan = Math.floor(totalBefore * voucher.value / 100);
        } else if (voucher.type === "fixed") {
            potongan = voucher.value;
        }
    }

    document.getElementById("total-before").textContent = totalBefore;
    document.getElementById("voucher-name").textContent = voucherName;
    document.getElementById("voucher-cut").textContent = potongan;
    document.getElementById("total-final").textContent = totalBefore - potongan;
}

// --- CHECKOUT TELEGRAM ---
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Keranjang kosong");
        return;
    }

    const BOT_TOKEN = "TOKEN_BOTMU";
    const CHAT_ID = "CHAT_IDMU";

    let text = `🛒 *Pesanan Baru*\n\n`;

    text += `*Produk Dibeli:*\n`;
    cart.forEach(item => {
        text += `- ${item.name} x${item.qty} = ${item.price * item.qty}\n`;
    });

    const totalBefore = document.getElementById("total-before").textContent;
    const voucherName = document.getElementById("voucher-name").textContent;
    const potongan = document.getElementById("voucher-cut").textContent;
    const totalFinal = document.getElementById("total-final").textContent;

    text += `\nTotal Sebelum Voucher: ${totalBefore}\n`;
    text += `Voucher: ${voucherName}\n`;
    text += `Potongan: ${potongan}\n`;
    text += `*Total Akhir: ${totalFinal}*\n`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: "Markdown"
        }),
    }).then(() => {
        alert("Checkout berhasil! Pesanan terkirim.");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    });
});

// MULAI
renderCart();
                                  
