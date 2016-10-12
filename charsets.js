let std = "abcdefghijklmnopqrstuvwxyz"
let caps = (char) => char + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let nums = (char) => char + "0123456789"
let symbols = (char) => char + "`~!@#$%^&*()-_=+|<>,.?/:;"

var exports = module.exports;
exports.std = std;
exports.caps = caps;
exports.nums = nums;
exports.symbols = symbols;
