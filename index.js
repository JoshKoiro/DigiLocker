//vorpal dependency
const vorpal = require('vorpal')();
//chalk for prettifying the interface
const chalk = vorpal.chalk;
//script to generate the random password
const generate = require('./generate.js');
//copy-paste npm package to allow for copying to the clipboard
const cp = require('copy-paste').global();
// NOTE Must change node package to call global.copy & global.paste instead of GLOBAL.copy & GLOBAL.paste line 112 & 113 of index.js in copy-paste package

//standard node file system dependency
const fs = require('fs');
//file to write saved passwords to

//TODO: make a condition that will automatically create this file if it is not found
const data = require('./data.js').data;


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
    this.log(chalk.green.italic('\r\n'+ "password generated: ") + chalk.underline(password + "\r\n"))
    // copy(password)
    return this.prompt({
      type: 'input',
      name: 'continue',
      message: 'What is this password for? (leave blank to cancel): '
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
      list()
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
  .command('copy', 'copy a password from your list into your clipboard')
  .action(function(args,callback){
    list()
    return this.prompt({
      type: 'input',
      name: 'continue',
      message: 'Type the number that corresponds to the password you would like to copy: '
    },function(result){
      let title = database[result.continue].name
      let selection = database[result.continue].password
      copy(selection)
      console.log(chalk.green.italic('password for ' + title + ' has been copied to the clipboard...'))
      callback()
  })
})

vorpal
  .delimiter(chalk.green('Passworder >>>'))
  .show();

}

  //Read file function

  let list = () => {
    if(database[0] === undefined){
      console.log(chalk.red.italic('there is no data to return'))
      return
    } else {
    let startingPoint = () => {
      if(database[0].name === undefined){
        return 1
      } else {
        return 0
      }
    }
  for(i =startingPoint();i<database.length;i++){
    console.log(chalk.dim("("+ i + ") " + database[i].name + " : " + database[i].password))
  }
}
}

let refresh = () => {
  vorpal.find('gen').remove()
  vorpal.find('list').remove()
  vorpal.find('data').remove()
  vorpal.find('save').remove()
  vorpal.find('load').remove()
  vorpal.find('copy').remove()
}

let memory = (name,password) => {
  return database.push({name: name, password: password})
}

//load file function

let load = (data) => {
  if(data === undefined){
    console.log(chalk.red.italic('there is no data to load from the save-file'))
    database = []
    return database
  } else {
  database = []
  for(i =0;i < data.length;i++){
    database.push(data[i])
  }
  console.log(chalk.green.italic('\r\nLoad complete!\r\n'))
  return database;
}
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

let initialize = () => {
  console.log('\r\n\r\n\r\n');
  console.log(chalk.green('--------------------------------------------------------------------------------'));
  console.log(chalk.green('----------------------------------- DigiLock -----------------------------------'));
  console.log('\r\n\r\n')
}

  initialize()
  run()
