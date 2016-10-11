const vorpal = require('vorpal')();
const generate = require('./generate.js');

vorpal
  .command('foo', 'Outputs "bar".')
  .action(function(args, callback) {
    this.log('bar');
    this.log(generate)
    callback();
  });

vorpal
  .delimiter('|PasswordGen|>>')
  .show();
