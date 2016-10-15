//VORPAL.JS SCRIPT

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

const df = require('./dataFunctions.js');
let database = df.database;

//runtime function (all vorpal commands are re-initialized by run())

let run = () => {

//random password generator

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
      df.memory(result.continue,password)
      callback()
    }
    })

  });

  //List passwords that are loaded into memory

  vorpal
    .command('list','Show all password assigments that are loaded into memory')
    .action(function(args,callback){
      df.list()
      callback()
      return
    })

  //Show raw data in memory (database object)

  vorpal
    .command('data', 'lists data stored in memory')
    .action(function(args,callback){
      this.log(database)
      callback()
    })

  //Writes database object to data.js

  vorpal
  .command('save', 'saves to data file')
  .action(function(args,callback){
    save(database)
    callback()
  })

  //load data.js into memory overwriting database object
  //TODO: add a confimation that you want to overwrite any existing passwords saved in memory, or run the save() function before running the load() function in this method

  vorpal
  .command('load','load external data file to memory')
  .action(function(args,callback){
    database = df.load(data)
    callback()
  })

  //Copy a selected password into your computer clipboard

  vorpal
  .command('copy', 'copy a password from your list into your clipboard')
  .action(function(args,callback){
    df.list()
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

//running vorpal

vorpal
  .delimiter(chalk.green('Passworder >>>'))
  .show();

}


//This function closes all the vorpal actions so that the run() function can re-create them
let refresh = () => {
  vorpal.find('gen').remove()
  vorpal.find('list').remove()
  vorpal.find('data').remove()
  vorpal.find('save').remove()
  vorpal.find('load').remove()
  vorpal.find('copy').remove()
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
