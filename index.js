const vorpal = require('vorpal')();
const generate = require('./generate.js');



vorpal
  .command('gen <n> []', 'Generates a random password\r\nuse -c for capitals, -n for numbers, and -s for symbols')
  .option('-c,--caps','Include capital letters')
  .option('-n,--nums','Include numbers')
  .option('-s,--symbols','Include symbols')
  .action(function(args, callback) {
    this.log(generate(args.n,args.options))
   callback()
  });

vorpal
  .delimiter('|PasswordGen|>>')
  .show();
