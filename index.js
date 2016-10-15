const vorpal = require('vorpal')();
const chalk = vorpal.chalk;
const generate = require('./generate.js');
const cp = require('copy-paste').global();
const fs = require('fs');
const dataFile = require('./data.js');
const data = dataFile.data;
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
  .command('load','load external data file to memory')
  .action(function(args,callback){
    database = load(data)
    callback()
  })


vorpal
  .delimiter(chalk.green('Passworder >>>'))
  .show();

}

  //Read file function

  let read = () => {
  for(i =1;i<database.length;i++){
    console.log(chalk.dim("("+ i + ") " + database[i].name + " : " + database[i].password))
  }
}

let refresh = () => {
  vorpal.find('gen').remove()
  vorpal.find('list').remove()
  vorpal.find('data').remove()
  vorpal.find('save').remove()
  vorpal.find('load').remove()
}

let memory = (name,password) => {
  return database.push({name: name, password: password})
}

//load file function

let load = (data) => {
  for(i =0;i < data.length;i++){
    database.push(data[i])
    console.log(data[i])
  }
  return database;
}

//save to data file function

let save = (data) => {
  let dataSave = 'var exports = module.exports;\r\nexports.data = ' + "[ {}"
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
