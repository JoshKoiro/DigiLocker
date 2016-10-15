const vorpal = require('vorpal')();
const chalk = vorpal.chalk;
const generate = require('./generate.js');
const cp = require('copy-paste').global();
const fs = require('fs');
//Must change node package to call global.copy & global.paste instead of GLOBAL.copy & GLOBAL.paste line 112 & 113 of index.js in copy-paste package

//Memory variable to write to file on close
let database = []

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
      if(result.continue === ""){
        console.log(chalk.red.italic('\r\npassword not saved\r\n'));
        callback()
      } else {
      console.log(chalk.green.italic('\r\npassword saved for ' + result.continue+'\r\n'))
      memory(result.continue,password)
      callback()
    }
    })

  });

  vorpal
    .command('list','List all passwords')
    .action(function(args,callback){
      read()
      callback()
      return
    })

  vorpal
    .command('data', 'lists data stored in memory')
    .action(function(args,callback){
      this.log(database)
      callback()
    })

  vorpal
  .command('save', 'saves to data file')
  .action(function(args,callback){
    save(database)
    callback()
  })


vorpal
  .delimiter(chalk.green('Passworder >>>'))
  .show();

}

  //Read file function

  let read = () => { fs.readFile('./data.js','utf-8',function(err,data){
    if(err){
      return console.log(err);
    }
    //when file opens...
    console.log(chalk.dim(data))
    refresh()
    run()
    });
}

let refresh = () => {
  vorpal.find('gen').remove()
  vorpal.find('list').remove()
  vorpal.find('data').remove()
  vorpal.find('save').remove()
}

let memory = (name,password) => {
  return database.push({name: name, password: password})
}

let save = (data) => {
  let dataSave = 'var exports = module.exports;\r\nexports = ' + "[ {}"
  for(i = 0; i < data.length;i++){
    dataSave = dataSave + ",{" + 'name: ' + "'"+ data[i].name + "'," + "password: " + "'" + data[i].password + "'" + "}" + '\r\n'
  }
  dataSave = dataSave + ']'
  fs.writeFile("./data.js", dataSave, function(err) {
    if(err) {
        return console.log(err);
    }
    refresh()
    run()
})
}
  run()
