const vorpal = require('vorpal')();
const generate = require('./generate.js');
const cp = require('copy-paste').global();
const fs = require('fs');
//Must change node package to call global.copy & global.paste instead of GLOBAL.copy & GLOBAL.paste line 112 & 113 of index.js in copy-paste package

let run = () => {

vorpal
  .command('gen <n> []', 'Generates a random password\r\nuse -c for capitals, -n for numbers, and -s for symbols')
  .option('-c,--caps','Include capital letters')
  .option('-n,--nums','Include numbers')
  .option('-s,--symbols','Include symbols')
  .action(function(args, callback) {
    let password = generate(args.n,args.options)
    this.log(password)
    this.log('password is copied to the clipboard...')
    copy(password)
    return this.prompt({
      type: 'input',
      name: 'continue',
      message: 'Name what this is a password for: '
    },function(result){
      console.log('password saved for ' + result.continue)
      save(result.continue,password)
    })

  });



vorpal
  .delimiter('|PasswordGen|>>')
  .show();

}

//Save file function

  let save = (name,password) => {
    let passwordLog = name + ' - ' + password + '\r\n'
    fs.appendFile("./data.js", passwordLog, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
      vorpal.find('gen').remove()
      run()
  })
  };

  run()
