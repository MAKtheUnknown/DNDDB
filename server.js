/*  SETUP */
var mysql = require('mysql'); //imports mysql node module
const fs = require('fs');
const http = require('http');

var server = http.createServer(function (req, res) {
    requestString = req.url.replace(/%20/g, ' ').slice(1);
    console.log("requestString: ", requestString);
    console.log("Request was made: " + req.url.replace('%20', ' ').slice(1) + ", " + req.method);
    if (requestString.toLowerCase().startsWith("update")) { //update an entity
        connection.query(requestString, function (error) {
            if (error) throw error;
            res.writeHead(200, { "Content-Type": 'text/plain' });
            res.end();
        });
    } else if (requestString.toLowerCase().startsWith("insert")) { //add a new entity
        connection.query(requestString, function (error) {
            if (error) throw error;
            res.writeHead(200, { "Content-Type": 'text/plain' });
            res.end();
        });
    } else if (requestString.toLowerCase().startsWith("select")) { //display data
        connection.query(requestString, function (error, results) {
            if (error) throw error;
            var returnString = results[0].solution;
            console.log("Result: ", returnString);
            res.writeHead(200, { "Content-Type": 'text/plain' });
            res.end(JSON.stringify(results));
        });

    } else if (req.url == "/site.html") {
        console.log("Site request");
        res.writeHead(200, { "Content-Type": 'text/html' });
        var myReadStream = fs.createReadStream('site.html', 'utf8');
        myReadStream.pipe(res);
    } else {
        console.log("Bad query");
        res.writeHead(200, { "Content-Type": 'text/plain' });
        res.end();
    }
});

server.listen(3000, 'localhost');
console.log("Server listening on port 3000");

/* Forward Declaration */
var loginInfo = new Object(); //Creates an empty object for login info (note: objects in JavaScript are more like dictionaries)
var configFile; //file read in by fs
var config; //object representation of config
var connection; //the connection to the MySQL server
var bad_db_flag = false; //flagged to true if database does not exist

/* Functions */
function initialize(callback = null) { //initial config setup
    createConfigIfNoConfig(function () {
        configFile = fs.readFileSync("config.json");
        config = JSON.parse(configFile);
        loginInfo.host = config.host;
        loginInfo.user = config.user;
        loginInfo.password = config.password;
        loginInfo.database = config.database;
        if (callback != null) {
            callback();
        }
    });

}

function createConfigIfNoConfig(callback = null) {
    file = "config.json";
    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            console.log("Config file not detected - generating default config file. If your MySQL is not set up in the default way, you will likely soon be getting an access denied error :)");
            var defaultConfig = {
                host: "localhost",
                user: "root",
                password: "",
                database: "dnd"
            }
            var configString = JSON.stringify(defaultConfig);
            fs.writeFile("config.json", configString, function () {
                callback();
            });
        } else {
            callback();
        }
    });
}

function connect() { //connects to server
    //Moves loginInfo from config into loginInfo object
    connection = mysql.createConnection(loginInfo);
    connection.connect();
    console.log("Connected")
    testQuery();
}

function testQuery() { //validates database setup
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) {
            if (error.message.substring(0, 15) == "ER_BAD_DB_ERROR") {
                bad_db_flag = true;
                setup();
            } else {
                throw error;
            }
        }
        if (!bad_db_flag) {
            if (results[0].solution === 2) {
                console.log('Test query successful');
                console.log("Connection state: " + connection.state);
                fillDB();
            }
        }
    });
}

function setup() { //to be run if the database does not exist
    var dbName = loginInfo.database;
    delete loginInfo.database;
    connection = mysql.createConnection(loginInfo);
    connection.query(`CREATE DATABASE ${dbName}`, function () {
        connection.query(`USE DATABASE ${dbName}`, function () {
            loginInfo.database = dbName;
            bad_db_flag = false;
            testQuery();
        });
    });
}

function fillDB() { //populates database with data
    var input = fs.createReadStream('DB Setup/setup_new.sql');
    var rl = require('readline').createInterface({
        input: input,
        terminal: false
    });
    rl.on('line', function (line) {
        connection.query(line);
    })
    rl.on('close', function () {
        console.log("Database successfully populated.")
    })
}

/* Main */
initialize(connect);