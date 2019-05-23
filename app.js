var mysql = require('mysql'); //imports mysql module
console.log("1");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MrProfessorQ#21"
});
console.log("2");

con.connect(function(err) {
    console.log("3");
    if (err) throw err;
  console.log("Connected!");
});