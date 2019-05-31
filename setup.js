/*  SETUP */
var mysql = require('mysql'); //imports mysql node module
const readline = require('readline'); //imports readline node module
const fs = require('fs');
const rl = readline.createInterface({ //defines interface for readline functions (don't think about it too much)
    input: process.stdin,
    output: process.stdout
});

var loginInfo = new Object(); //Creates an empty object for login info (note: objects in JavaScript are more like dictionaries)
var configFile; //file read in by fs
var config; //object representation of config

// var questions = [ //list of questions to ask
//     "host (default localhost): ",
//     "user (default root): ",
//     "password: ",
//     "database: "
// ];
// var answers = [];

// getInput = (callback) => {
//     rl.question(questions[0], function (ans) {
//         answers.push(ans);
//         rl.setPrompt(questions[1]);
//         rl.prompt();
//         rl.on('line', function (ans) {
//             if (answers.length < questions.length - 1) {
//                 answers.push(ans.trim());
//                 rl.setPrompt(questions[answers.length]);
//                 rl.prompt();
//             } else if (answers.length = questions.length - 1) {
//                 answers.push(ans.trim());
//                 rl.close();
//                 callback();
//             }
//         });
//     });
// }
function initialize(callback = null) {
    configFile = fs.readFileSync("config.json");
    config = JSON.parse(configFile);
    // getInput(() => {
    //     if (callback != null) {
    //         callback();
    //     }
    // });
    callback();
}



function connect() {
    loginInfo.host = config.host;
    loginInfo.user = config.user;
    loginInfo.password = config.password;
    loginInfo.database = config.database;
    connection = mysql.createConnection(loginInfo);
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        if (results[0].solution === 2) {
            console.log('Test query successful');
        }
        console.log("Connection state: " + connection.state);
        setup();
    });
}
var connection;
initialize(connect);



//run after initialize has completed
function setup() {
    var queryString;
    var fileString = 'DB Setup/setup.sql';
    if(config.newSQL == "true") {
        fileString = 'DB Setup/setup_new.sql';
    }
    fs.readFile(fileString, (err, data) => {
        if (err) throw err;
        queryString = data.toString();
        connection.query(queryString, function (error) {
            if (error) throw error;
            console.log("Database established");
        });
    });
}