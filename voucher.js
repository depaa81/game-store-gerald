const voucherList = [
  { code: "DISKON10", desc: "Diskon 10%", cut: 0.10 },
  { code: "MEGA50", desc: "Diskon 50% untuk produk di atas 50.000", cut: 0.50 }
];

function getAutoVoucher(price) {
  if (price >= 50000) return voucherList[1];
  return voucherList[0];
}

function applyVoucher(price, voucher) {
  const pot = price * voucher.cut;
  return {
    finalPrice: price - pot,
    discount: pot
  };
}
