const vorpal = require('vorpal')();
const generate = require('./generate.js');
const cp = require('copy-paste').global();
//Must change node package to call global.copy & global.paste instead of GLOBAL.copy & GLOBAL.paste line 112 & 113 of index.js in copy-paste package


vorpal
  .command('gen <n> []', 'Generates a random password\r\nuse -c for capitals, -n for numbers, and -s for symbols')
  .option('-c,--caps','Include capital letters')
  .option('-n,--nums','Include numbers')
  .option('-s,--symbols','Include symbols')
  .action(function(args, callback) {
    let result = generate(args.n,args.options)
    this.log(result)
    this.log('password is copied to the clipboard...')
    copy(result)
   callback()
  });

vorpal
  .delimiter('|PasswordGen|>>')
  .show();
