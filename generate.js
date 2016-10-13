const charset = require('./charsets.js');
const chars = charset.std;
const caps = charset.caps_S;
const nums = charset.nums_S;
const symbols = charset.symbols_S;

// options = [caps,nums]

// args.options = {caps: true, nums: true}
//Object.keys(args.options) = ['caps', 'nums']

let config = (options) => {
  let array = Object.keys(options)
  var char = chars;
  array.forEach((element,i) => {
    if(element === "caps"){
      char = char + caps
    } else if(element === "nums"){
      char = char + nums
    } else if(element === "symbols"){
      char = char + symbols
    } else{

    }
    return char;
  })
  return char
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
