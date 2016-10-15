//VORPAL.JS SCRIPT

//vorpal dependency
const vorpal = require('vorpal')();
//chalk for prettifying the interface
const chalk = vorpal.chalk;
//script to generate the random password
const generate = require('./generate.js');
//copy-paste npm package to allow for copying to the clipboard
const cp = require('copy-paste').global();
// NOTE Must change node package to call global.copy & global.paste instead of GLOBAL.copy & GLOBAL.paste line 112 & 113 of index.js in copy-paste package. not doing this will cause a crash after cloning code onto new machine.

//standard node file system dependency
const fs = require('fs');
//file to write saved passwords to

//TODO: make a condition that will automatically create this file if it is not found
const data = require('./data.js').data;

const df = require('./dataFunctions.js');
let database = df.database;

//runtime function (all vorpal commands are re-initialized by run())

let run = () => {

vorpal
    .command('create <account> []','Create a password\r\n')
    .alias('new')
    .option('-p, --password <password>','enter password')
    .action(function(args,callback){
      if(args.options.password !== undefined){
        df.memory(args.account,args.options.password)
        callback()
      } else {
        return this.prompt({
          type: 'input',
          name: 'continue',
          message: 'Enter your password (press enter to cancel): '
        },function(result){
          if(result.continue === undefined) {
            callback()
          } else {
          df.memory(args.account,result.continue)
          callback()
        }
        })
      }
    })

//random password generator
vorpal
  .command('generate <n> []', 'Generates a random password - use -c for capitals, -n for numbers, and -s for symbols\r\n')
  .alias('gen')
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
    .command('list []','Show all password assigments that are loaded into memory\r\n')
    .option('-s, --show','show passwords in list')
    .alias('ls')
    .alias('l')
    .action(function(args,callback){
      if(args.options.show){
        df.list(true)
      } else {
      df.list()
      }
      callback()
      return
    })

  //Writes database object to data.js
  vorpal
  .command('save', 'saves to data file\r\n')
  .action(function(args,callback){
    save(database)
    callback()
  })

  //load data.js into memory overwriting database object
  //TODO: add a confimation that you want to overwrite any existing passwords saved in memory, or run the save() function before running the load() function in this method

  vorpal
  .command('load','load external data file to memory\r\n')
  .action(function(args,callback){
    database = df.load(data)
    callback()
  })

  vorpal
  .command('edit <listItem> []','edit existing password in list\r\n')
  .option('-g, --generate <n> [options]','generate new random password')
  .action(function(args,callback){
    if(args.options.generate){
      this.log(args.options.generate.options)
      // generate(args.listItem,args.options.generate.options)
      callback()
      } else {
      return this.prompt({
        type: 'input',
        name: 'continue',
        message: 'Type your new password (press enter to cancel): '
      },function(result){
        if(result.continue === undefined){
          callback()
        } else {
          df.edit(args.listItem,result.continue)
          callback()
        }
      })
    }
    callback()
  })

  vorpal
  .command('remove <listItem>','remove existing entry in list\r\n')
  .action(function(args,callback){
    this.log(chalk.red.italic('\r\npassword for ' + "'" + database[args.listItem].name + "'" + ' has been removed...\r\n'))
    df.delete(args.listItem)
    callback()
  })

  //Copy a selected password into your computer clipboard
  vorpal
  .command('copy [number]', 'copy a password from your list into your clipboard\r\n')
  .action(function(args,callback){
    if(df.database.length === 0){
      this.log(chalk.red.italic('\r\nthere is no data to copy either load existing data from file or create some...\r\n'))
      callback()
    } else {
    if(args.number !== undefined){
      let title = database[args.number].name
      let selection = database[args.number].password
      copy(selection)
      console.log(chalk.green.italic('password for ' + title + ' has been copied to the clipboard...'))
      callback()
    } else {
    df.list()
    return this.prompt({
      type: 'input',
      name: 'continue',
      message: 'Type the number that corresponds to the password you would like to copy: '
    },function(result){
      let title = database[result.continue].name
      let selection = database[result.continue].password
      copy(selection)
      console.log(chalk.green.italic('\r\npassword for ' + title + ' has been copied to the clipboard...\r\n'))
      callback()
  })
}
}
})

//Show raw data in memory (database object)
vorpal
  .command('data', 'lists data stored in memory\r\n')
  .action(function(args,callback){
    this.log(database)
    callback()
  })

//running vorpal
vorpal
  .delimiter(chalk.green('DigiLock >>>'))
  .show();

}


//This function closes all the vorpal actions so that the run() function can re-create them
let refresh = () => {
  vorpal.find('generate').remove()
  vorpal.find('list').remove()
  vorpal.find('data').remove()
  vorpal.find('save').remove()
  vorpal.find('load').remove()
  vorpal.find('copy').remove()
  // vorpal.find('edit').remove()
  vorpal.find('remove').remove()
  vorpal.find('create').remove()
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
