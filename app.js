/* ================================
        APP.JS FINAL (STABLE)
================================ */

document.addEventListener("DOMContentLoaded", () => {

  const BOT_TOKEN = "xxx";
  const CHAT_ID = "xxx";

  const products = [
    { id: 1, name: "ROBLOX FISH IT COIN VIA MITOS PER 1M", price: 12000 },
    { id: 2, name: "ROBLOX AKUN FISH IT ELEMENT ROD", price: 100000 },
    { id: 3, name: "ROBLOX AKUN FISH IT GHOSTFIN", price: 65000 },
  ];

  const productListEl = document.getElementById("productList");
  const orderCardEl = document.getElementById("orderCard");
  const hamburger = document.getElementById("hamburgerBtn");

  function formatRupiah(x){
    return x.toLocaleString("id-ID");
  }

  function renderProducts(){
    productListEl.innerHTML = "";
    products.forEach(p=>{
      const el = document.createElement("div");
      el.className="product";
      el.innerHTML = `
        <div class="thumb">${p.name.split(" ")[1]}</div>
        <div class="meta">
          <h3>${p.name}</h3>
          <p>Rp ${formatRupiah(p.price)}</p>
        </div>
        <button class="buy" data-id="${p.id}">Buy</button>
      `;
      productListEl.appendChild(el);
    });

    productListEl.addEventListener("click", e=>{
      const btn = e.target.closest(".buy");
      if(!btn) return;
      alert("Buy Clicked: ID " + btn.dataset.id);
    });
  }

  renderProducts();

  /* Drawer */
  const drawer = document.createElement("div");
  drawer.style.cssText = `
    position:fixed; top:0; left:0; width:250px; height:100vh;
    background:white; padding:20px;
    transform:translateX(-300px);
    transition:.25s; z-index:10000;
    box-shadow:3px 0 20px rgba(0,0,0,.25);
  `;

  drawer.innerHTML = `
    <h2 style="color:#6d28d9;margin-bottom:15px;">Menu</h2>

    <button class="drawer-item" onclick="location.href='voucher.html'">Daftar Voucher</button>
    <button class="drawer-item" onclick="location.href='informasi.html'">Informasi Toko</button>
    <button class="drawer-item" onclick="location.href='riwayat.html'">Riwayat Transaksi</button>

    <h3 class="dropdown-header" id="toggleSosmed">Sosial Media ▼</h3>
    <div class="dropdown-sosmed">
      <button class="drawer-item" onclick="window.open('https://instagram.com/','_blank')">Instagram</button>
      <button class="drawer-item" onclick="window.open('https://tiktok.com/','_blank')">TikTok</button>
      <button class="drawer-item" onclick="window.open('https://youtube.com/','_blank')">YouTube</button>
      <button class="drawer-item" onclick="window.open('https://facebook.com/','_blank')">Facebook</button>
    </div>
  `;

  document.body.appendChild(drawer);

  hamburger.onclick = () => {
    const open = drawer.style.transform === "translateX(0px)";
    drawer.style.transform = open ? "translateX(-300px)" : "translateX(0px)";
  };

  /* Dropdown Sosmed Action */
  const sosToggle = drawer.querySelector("#toggleSosmed");
  const sosBox = drawer.querySelector(".dropdown-sosmed");
  let sosOpen = false;

  sosToggle.onclick = () => {
    sosOpen = !sosOpen;
    sosBox.style.maxHeight = sosOpen ? sosBox.scrollHeight + "px" : "0px";
    sosToggle.innerHTML = sosOpen ?
      "Sosial Media ▲" : "Sosial Media ▼";
  };

});

    document.getElementById("proof").onchange = previewProof;
    document.getElementById("sendProof").onclick = sendProofToTelegram;

    updateWaSellerLink();
  }

  /* ===========================
     VOUCHER SYSTEM (voucher.js)
  =========================== */
  function applyVoucher() {
    const codeEl = document.getElementById("voucherInput");
    const resultEl = document.getElementById("voucherResult");

    const code = codeEl.value.trim().toUpperCase();
    const voucher = VOUCHERS.find(v => v.code === code);

    if (!voucher) {
      resultEl.innerHTML = "";
      currentOrder.finalPrice = currentOrder.price;
      currentOrder.discount = 0;
      currentOrder.voucher = null;
      showPopupNotif("Kode voucher tidak ditemukan!");
      updateWaSellerLink();
      return;
    }

    if (currentOrder.price < voucher.min) {
      showPopupNotif(
        `Minimal pembelian Rp ${formatRupiah(voucher.min)} untuk voucher ini`
      );
      return;
    }

    const pot = Math.round(currentOrder.price * voucher.cut);
    const total = currentOrder.price - pot;

    currentOrder.discount = pot;
    currentOrder.finalPrice = total;
    currentOrder.voucher = voucher;

    resultEl.innerHTML = `
      <p><b>Voucher:</b> ${voucher.code}</p>
      <p>Potongan: Rp ${formatRupiah(pot)}</p>
      <p><b>Total Bayar: Rp ${formatRupiah(total)}</b></p>
    `;

    showPopupNotif("Voucher berhasil diterapkan!");
    updateWaSellerLink();
  }

  /* ===========================
     PREVIEW GAMBAR
  =========================== */
  function previewProof(e) {
    const file = e.target.files[0];
    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
  }

  /* ===========================
     KIRIM KE TELEGRAM
  =========================== */
  async function sendProofToTelegram() {
    if (!currentOrder) return alert("Tidak ada pesanan.");

    const fileEl = document.getElementById("proof");
    if (!fileEl.files.length) return alert("Upload bukti dulu.");

    try {
      const form = new FormData();
      form.append("chat_id", CHAT_ID);
      form.append("photo", fileEl.files[0]);
      form.append("caption",
        `📦 *BUKTI TRANSFER*\n\n` +
        `🆔 ID: ${currentOrder.id}\n` +
        `📌 Produk: ${currentOrder.name}\n` +
        `💰 Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}\n` +
        `🏷 Voucher: ${currentOrder.voucher ? currentOrder.voucher.code : "Tidak ada"}\n` +
        `➖ Potongan: Rp ${formatRupiah(currentOrder.discount)}\n\n` +
        `📅 ${currentOrder.date}`
      );

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST", body: form
      });

      showPopupNotif("Bukti terkirim ke Telegram!");
    } catch (err) {
      alert("Gagal mengirim ke Telegram.");
      console.error(err);
    }
  }

  /* ===========================
     POPUP NOTIF
  =========================== */
  function showPopupNotif(text) {
    const box = document.createElement("div");
    box.className = "popup-notif";
    box.innerText = text;
    document.body.appendChild(box);

    setTimeout(() => box.classList.add("show"), 20);
    setTimeout(() => {
      box.classList.remove("show");
      setTimeout(() => box.remove(), 250);
    }, 2500);
  }

  /* ===========================
     WA SELLER LINK
  =========================== */
  function updateWaSellerLink() {
    const wa = document.getElementById("waMessage");
    if (!wa) return;

    wa.href =
      "https://wa.me/62856935420220?text=" +
      encodeURIComponent(
        `Halo kak, saya sudah melakukan pemesanan.\n\n` +
        `ID Pesanan: ${currentOrder.id}\n` +
        `Produk: ${currentOrder.name}\n` +
        `Total Bayar: Rp ${formatRupiah(currentOrder.finalPrice)}`
      );
  }

/* ===========================
    DRAWER MENU (FIXED)
=========================== */

const drawer = document.createElement("div");

drawer.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: white;
  padding: 20px;
  transform: translateX(-300px);
  transition: .25s;
  z-index: 9999;
  box-shadow: 3px 0 20px rgba(0,0,0,0.25);
  overflow-y: auto;
`;

drawer.innerHTML = `
  <h2 style="color:#6d28d9;margin-bottom:15px;">Menu</h2>

  <button class="drawer-item" onclick="location.href='voucher.html'">Daftar Voucher</button>
  <button class="drawer-item" onclick="location.href='informasi.html'">Informasi Toko</button>
  <button class="drawer-item" onclick="location.href='riwayat.html'">Riwayat Transaksi</button>

  <h3 class="dropdown-header" id="toggleSosmed">Sosial Media ▼</h3>
<div class="dropdown-sosmed">
  <button class="drawer-item" onclick="window.open('https://instagram.com/USERNAME','_blank')">
    Instagram
  </button>
  <button class="drawer-item" onclick="window.open('https://tiktok.com/@USERNAME','_blank')">
    TikTok
  </button>
  <button class="drawer-item" onclick="window.open('https://youtube.com/@USERNAME','_blank')">
    YouTube
  </button>
  <button class="drawer-item" onclick="window.open('https://facebook.com/USERNAME','_blank')">
    Facebook
  </button>
</div>
`;

document.body.appendChild(drawer);

hamburger.onclick = () => {
        const sosmedToggle = drawer.querySelector("#toggleSosmed");
const sosmedContent = drawer.querySelector(".dropdown-sosmed");

sosmedContent.style.maxHeight = "0px";
sosmedContent.style.overflow = "hidden";
sosmedContent.style.transition = "max-height .4s ease";

let sosmedOpen = false;

sosmedToggle.onclick = () => {
  sosmedOpen = !sosmedOpen;
  sosmedContent.style.maxHeight = sosmedOpen ? sosmedContent.scrollHeight + "px" : "0px";
  sosmedToggle.innerHTML = sosmedOpen ? "Sosial Media ▲" : "Sosial Media ▼";
  const isOpen = drawer.style.transform === "translateX(0px)";
  drawer.style.transform = isOpen ? "translateX(-300px)" : "translateX(0px)";
};

document.addEventListener("click", (e) => {
  if (!drawer.contains(e.target) && e.target !== hamburger) {
    drawer.style.transform = "translateX(-300px)";
  }
});

  /* ===========================
     WA CUSTOMER SERVICE
  =========================== */
  waBtn.onclick = () => {
    waPopup.classList.remove("hidden");
  };

  waPopup.onclick = (e) => {
    if (!e.target.closest(".wa-popup-box")) {
      waPopup.classList.add("hidden");
    }
  };

  waCSLink.href =
    "https://wa.me/62856935420220?text=" +
    encodeURIComponent("Halo admin, saya butuh bantuan Customer Service.");

  /* ===========================
     WA INFO POPUP (selalu muncul)
  =========================== */
  waInfo.classList.remove("hidden");

  closeWaInfo.onclick = () => {
    waInfo.classList.add("hidden");
  };

  waInfo.onclick = (e) => {
    if (!e.target.closest(".wa-info-box")) {
      waInfo.classList.add("hidden");
    }
  };

  /* ===========================
     PAYMENT MODAL
  =========================== */
  openPay.onclick = () => {
    paymentModal.classList.remove("hidden");
  };

  paymentModal.onclick = (e) => {
    if (!e.target.closest(".modal-box")) {
      paymentModal.classList.add("hidden");
    }
  };

  /* ===========================
     START RENDER
  =========================== */
  renderProducts();
});
