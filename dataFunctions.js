//vorpal dependency
const vorpal = require('vorpal')();
//chalk for prettifying the interface
const chalk = vorpal.chalk;

var exports = module.exports;

//Memory variable to write to file on close
exports.database = []

//Saves newly created name and password to the database
exports.memory = (name,password) => {
  return exports.database.push({name: name, password: password})
}

//load file function
exports.load = (data) => {
  if(data === undefined){
    console.log(chalk.red.italic('there is no data to load from the save-file'))
    exports.database = []
    return exports.database
  } else {
  exports.database = []
  for(i =0;i < data.length;i++){
    exports.database.push(data[i])
  }
  console.log(chalk.green.italic('\r\nLoad complete!\r\n'))
  return exports.database;
}
}

//List database object entries function
exports.list = (show) => {
  if(exports.database[0] === undefined){
    console.log(chalk.red.italic('there is no data to return'))
    return
  } else {
  let startingPoint = () => {
    if(exports.database[0].name === undefined){
      return 1
    } else {
      return 0
    }
  }
  if(show){
    for(i =startingPoint();i<exports.database.length;i++){
      console.log(chalk.dim("("+ i + ") " + exports.database[i].name + " : " + exports.database[i].password))
    }
  } else {
    for(i =startingPoint();i<exports.database.length;i++){
      console.log(chalk.dim("("+ i + ") " + exports.database[i].name))
    }
  }

}
}

exports.delete = (index) => {
  exports.database.splice(index,1)
  return exports.database;
}

exports.edit = (listItem,password) => {
  exports.database[listItem].password = password;
  return password;
}
