(function() {

  // Asynchronous fs call

  var fs = require("fs");
  /* Variante A
  function callBack(err, data) {
    if(err) throw err;
    console.log(data.split("\n").length - 1);
  }
  fs.readFile(process.argv[2], "utf8", callBack);
  */
  ///* Variante B
  fs.readFile(process.argv[2], "utf8", function(err, data) {
    console.log(data.split("\n").length - 1);
  });
  //*/
})();
