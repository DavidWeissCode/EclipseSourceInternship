(function() {

  /// Synchronous fs call

  var fs = require('fs');// load file system module, available in variable fs

  var pathToFile = process.argv[2];// get parameter

  var input = fs.readFileSync(pathToFile).toString();// read file, convert to string

  var splitInput = input.split("\n");// split lines

  console.log(splitInput.length-1);// last line no line break

})();
