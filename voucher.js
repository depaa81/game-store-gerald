// VOUCHERS.JS FINAL
const VOUCHERS = [
  {
    code: "DISKON02",
    cut: 0.02,        // 2%
    min: 0,
    allowedProducts: "ALL" 
    //berlaku semua produk 
  },
  {
    code: "MEGA04",
    cut: 0.04,        // 4%
    min: 35000,
    allowedProducts: [2]
    // berlaku dengan produk id 2
  },
  {
    code: "SUPER06",
    cut: 0.06,        // 6%
    min: 0,
    allowedProducts: [4]
    // belaku dengan produk id 4
  }
];
