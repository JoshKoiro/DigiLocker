//CHARACTER SETS

let std = "abcdefghijklmnopqrstuvwxyz"
let caps = (char) => char + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let nums = (char) => char + "0123456789"
let symbols = (char) => char + "`~!@#$%^&*()-_=+|<>,.?/:;"

let caps_S = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let nums_S = "0123456789"
let symbols_S = "`~!@#$%^&*()-_=+|<>,.?/:;"

var exports = module.exports;
exports.std = std;
exports.caps = caps;
exports.nums = nums;
exports.symbols = symbols;
exports.caps_S = caps_S;
exports.nums_S = nums_S;
exports.symbols_S = symbols_S;
