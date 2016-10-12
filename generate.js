const charset = require('./charsets.js');
const chars = charset.std;
const caps = charset.caps;
const numbers = charset.numbers;
const symbols = charset.symbols;

var options = []

let config = (selections) => {
  var char = chars
  for(i = 0;i<selections.length;i++){
    char = selections[i](char)
  }
  return char;
}

let generatePassword = (n,options) => {
  let char = config(options),
  retVal = ""
  for (var i = 0; i < n; ++i) {
    retVal += char.charAt(Math.floor(Math.random() * char.length));
  }
  return retVal;
}

module.exports = generatePassword;
// TEST CODE
var test = generatePassword(8,options);

console.log(test)
console.log(test.length);
