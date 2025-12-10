// LOAD KERANJANG
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// GLOBAL DISCOUNT
let appliedVoucher = null;

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
            <p>Harga: Rp ${item.price.toLocaleString()}</p>

            <div class="qty-box">
                <button onclick="changeQty(${i}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
            </div>

            <p>Subtotal: Rp ${(item.price * item.qty).toLocaleString()}</p>

            <button class="delete-btn" onclick="removeItem(${i})">Hapus</button>
        </div>
    `).join("");

    updateTotal();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart[index].qty = 1;
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// MENGHITUNG TOTAL
function updateTotal() {
    let totalBefore = cart.reduce((a, b) => a + (b.qty * b.price), 0);

    let cut = 0;

    if (appliedVoucher) {
        cut = Math.round(totalBefore * appliedVoucher.cut);
    }

    document.getElementById("total-before").textContent = totalBefore.toLocaleString();
    document.getElementById("voucher-cut").textContent = cut.toLocaleString();
    document.getElementById("total-final").textContent = (totalBefore - cut).toLocaleString();
}

// APPLY VOUCHER
document.getElementById("applyVoucherBtn").onclick = () => {
    const code = document.getElementById("voucherInput").value.trim().toUpperCase();
    const voucher = VOUCHERS.find(v => v.code === code);

    const result = document.getElementById("voucherResult");

    if (!voucher) {
        appliedVoucher = null;
        result.innerHTML = "<p style='color:red;'>Voucher tidak valid.</p>";
        updateTotal();
        return;
    }

    appliedVoucher = voucher;
    result.innerHTML = `
        <p><b>Voucher:</b> ${voucher.code}</p>
        <p>Potongan: ${voucher.cut * 100}%</p>
    `;

    updateTotal();
};

// CHECKOUT TELEGRAM
document.getElementById("checkout-btn").onclick = () => {
    if (cart.length === 0) {
        alert("Keranjang kosong");
        return;
    }

    const BOT_TOKEN = "6950291703:AAHKeH8t8XlYoIjHR8XL_33oUOejTQyHkDs";
    const CHAT_ID = "5800113255";

    let text = "🛒 *PESANAN BARU (KERANJANG)*\n\n";

    cart.forEach(item => {
        text += `- ${item.name} x${item.qty} = Rp ${(item.qty * item.price).toLocaleString()}\n`;
    });

    let totalBefore = cart.reduce((a, b) => a + (b.qty * b.price), 0);
    let cut = appliedVoucher ? Math.round(totalBefore * appliedVoucher.cut) : 0;
    let final = totalBefore - cut;

    text += `\nTotal: Rp ${totalBefore.toLocaleString()}`;
    text += `\nPotongan: Rp ${cut.toLocaleString()}`;
    text += `\n*Total Akhir: Rp ${final.toLocaleString()}*\n`;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: text,
            parse_mode: "Markdown"
        }),
    }).then(() => {
        alert("Checkout berhasil!");
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    });
};

renderCart();
