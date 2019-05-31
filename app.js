/*  SETUP */
var mysql = require('mysql'); //imports mysql node module
const readline = require('readline'); //imports readline node module
const fs = require('fs');
const rl = readline.createInterface({ //defines interface for readline functions (don't think about it too much)
    input: process.stdin,
    output: process.stdout
});

/* Forward Declaration */
var loginInfo = new Object(); //Creates an empty object for login info (note: objects in JavaScript are more like dictionaries)
var configFile; //file read in by fs
var config; //object representation of config
var connection; //the connection to the MySQL server
var bad_db_flag = false;

/* Functions */
function initialize(callback = null) {
    configFile = fs.readFileSync("config.json");
    config = JSON.parse(configFile);
    loginInfo.host = config.host;
    loginInfo.user = config.user;
    loginInfo.password = config.password;
    loginInfo.database = config.database;
    if(callback != null) {
        callback();
    }
}

function connect() {
    //Moves loginInfo from config into loginInfo object
    console.log(loginInfo);
    connection = mysql.createConnection(loginInfo);
    connection.connect();
    console.log("Connected")
    console.log("In try block");
    testQuery();
}

function testQuery() {
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) {
            console.log(error.message.substring(0,15));
            if(error.message.substring(0,15) == "ER_BAD_DB_ERROR") {
                bad_db_flag = true;
                setup();
            } else {
                throw error;
            }
        }
        if(!bad_db_flag) {
            if (results[0].solution === 2) {
                console.log('Test query successful');
                console.log("Connection state: " + connection.state);
            }
        }
    });
}

function setup() { //to be run if the database does not exist
    var dbName = loginInfo.database;
    delete loginInfo.database;
    connection = mysql.createConnection(loginInfo);
    connection.query(`CREATE DATABASE ${dbName}`, function() {
        connection.query(`USE DATABASE ${dbName}`, function(){
            loginInfo.database = dbName;
            bad_db_flag = false;
            testQuery();
        });
    });
}

//Main
initialize(connect);